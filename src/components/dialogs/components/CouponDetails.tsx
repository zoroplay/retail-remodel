import React, { useEffect, useState } from "react";
// import { IoCheckmarkCircle, IoCloseCircle } from "react-icons/io5";
import SideOverlay from "../SideOverlay";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import { AppHelper } from "../../../lib/helper";
import { setUserRerender } from "../../../store/features/slice/user.slice";
import environmentConfig, {
  getEnvironmentVariable,
  ENVIRONMENT_VARIABLES,
} from "../../../store/services/configs/environment.config";
import { usePayoutCommissionMutation } from "../../../store/services/user.service";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useFindBetMutation } from "@/store/services/bets.service";
import Modal from "../Modal";
import { getClientTheme } from "@/config/theme.config";
import { useBetting } from "@/hooks/useBetting";
import { showToast } from "@/components/tools/toast";
import { OVERVIEW } from "@/data/routes/routes";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";

type Props = {
  onClose: () => void;
};

const CouponDetails: React.FC<Props> = ({ onClose }) => {
  const { user } = useAppSelector((state) => state.user);
  const { betslip } = useAppSelector((state) => state.betting);
  const [payoutCommission, { isLoading }] = usePayoutCommissionMutation();

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const betslip_id = searchParams.get("ref");
  const [findBet, { isLoading: isFindingBet, data }] = useFindBetMutation();
  const theme = getClientTheme();
  const classes = theme.classes.coupon_details;
  const modalClasses = theme.classes.modal;
  const { clearBets, addBet } = useBetting();

  const dispatch = useAppDispatch();

  // useEffect(() => {
  //   if (betslip_id) {
  //     findBet({
  //       betslipId: betslip_id,
  //       clientId: environmentConfig.CLIENT_ID,
  //     });
  //   }
  // }, [betslip_id, findBet]);

  // Status modal state
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [statusData, setStatusData] = useState({
    isSuccess: false,
    title: "",
    message: "",
  });

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return AppHelper.convertToTimeString(date);
    } catch {
      return dateString;
    }
  };

  const getOutcomeColor = (status?: number) => {
    if (status === undefined) return "text-yellow-500";
    if (status === 1) return "text-green-500";
    if (status === 2) return "text-red-500";
    return "text-yellow-500";
  };

  const getOutcomeText = (status?: number) => {
    if (status === undefined) return "Pending";
    if (status === 1) return "Won";
    if (status === 2) return "Lost";
    return "Pending";
  };

  const handlePayoutCommission = async () => {
    try {
      if (isLoading) return;
      // const result = await payoutCommission({
      //   clientId: getEnvironmentVariable(
      //     ENVIRONMENT_VARIABLES.CLIENT_ID
      //   ) as unknown as number,
      //   userId: Number(user?.id),
      //   amount: Number(betslip?.possibleWin || 0),
      //   // betId: betslip?.betslipId,
      // }).unwrap();

      // Handle success
      // if (result?.success) {
      //   setStatusData({
      //     isSuccess: true,
      //     title: "Payout Successful",
      //     message:
      //       result?.message || "Commission payout completed successfully!",
      //   });
      // } else {
      //   setStatusData({
      //     isSuccess: false,
      //     title: "Payout Failed",
      //     message:
      //       result?.message ||
      //       result?.errors ||
      //       "Payout failed. Please try again.",
      //   });
      // }
      setShowStatusModal(true);
    } catch (error: any) {
      // Handle error
      const errorMessage =
        error?.data?.message ||
        error?.data?.errors ||
        error?.message ||
        "An unexpected error occurred";

      setStatusData({
        isSuccess: false,
        title: "Payout Error",
        message: errorMessage,
      });
      setShowStatusModal(true);
    } finally {
      dispatch(setUserRerender());
    }
  };
  const formatNumber = (num: number) => {
    return new Intl.NumberFormat().format(num);
  };

  const handleReprint = () => {
    if (!betslip) return;

    try {
      AppHelper.printTicket({
        ticket_data: {
          betslipId: betslip.betslipId,
          terminal: user?.code || "",
          cashier: user?.username || "",
          time: AppHelper.formatReceiptTimestamp(),
          stake: betslip.stake,
          totalOdds: betslip.totalOdd,
          possibleWin: betslip.possibleWin,
          currency: user?.currency || "NGN",
          selections: betslip.selections.map((sel) => ({
            eventName: sel.eventName,
            marketName: sel.marketName,
            outcomeName: sel.outcomeName,
            odds: sel.odds,
          })),
        },
        type: "bet",
      });
    } catch (error) {
      console.error("Failed to print ticket:", error);
      setStatusData({
        isSuccess: false,
        title: "Print Error",
        message: "Failed to print ticket. Please try again.",
      });
      setShowStatusModal(true);
    }
  };

  const handleRebet = async () => {
    if (!betslip) return;

    try {
      clearBets();

      betslip.selections.forEach((selection) => {
        addBet({
          fixture_data: {
            gameID: selection.eventId,
            matchID: selection.matchId,
            name: selection.eventName,
            date: selection.eventDate,
            tournament: selection.tournament,
            categoryID: selection.category,
            categoryName: selection.category,
            sportID: selection?.sportId || 0,
            sportName: selection.sport,
            tournamentID: 0,
            eventTime: selection.eventDate,
            homeScore: "",
            matchStatus: "",
            awayScore: "",
            homeTeam: "",
            awayTeam: "",
            outcomes: [],
            event_type: "pre",
            status: 0,
            competitor1: "",
            competitor2: "",
            activeMarkets: 0,
          },
          outcome_data: {
            displayName: selection.outcomeName,
            marketName: selection.marketName,
            odds: parseFloat(selection.odds),
            outcomeID: selection?.outcomeId,
            outcomeName: selection.outcomeName,
            specifier: selection.specifier,
            oddID: 0,
            status: 0,
            active: 1,
            producerID: selection?.producerId || 0,
            marketID: selection?.marketId || 0,
            producerStatus: 0,
            marketId: selection?.marketId || 0,
          },
          element_id: selection.eventId,
          bet_type: "pre",
          global_vars: {},
          bonus_list: [],
        });
      });

      // showToast({
      //   type: "success",
      //   title: "Rebet Loaded!",
      //   description: `${betslip.selections.length} bets loaded successfully`,
      // });

      // Close modal and navigate to cashdesk
      onClose();
      navigate(OVERVIEW.CASHDESK);
    } catch (error) {
      console.error("Error loading rebet:", error);
      showToast({
        type: "error",
        title: "Error",
        description: "Failed to load rebet",
      });
    }
  };

  const handleCashout = () => {
    // TODO: Implement cashout functionality
    console.log("Cashout clicked for:", betslip?.betslipId);
    setStatusData({
      isSuccess: false,
      title: "Not Implemented",
      message: "Cashout functionality coming soon.",
    });
    setShowStatusModal(true);
  };
  const renderSkeleton = () => (
    <div className="space-y-4">
      {/* Betslip Info Skeleton */}
      <div
        className={`${classes["section-bg"]} rounded-lg p-2 space-y-2 animate-pulse`}
      >
        <div
          className={`h-5 ${classes["skeleton-bg"]} rounded w-1/3 mb-2`}
        ></div>
        <div className="grid grid-cols-2 gap-2">
          <div className="space-y-1">
            <div
              className={`h-4 ${classes["skeleton-pulse"]} rounded w-3/4`}
            ></div>
            <div
              className={`h-4 ${classes["skeleton-bg"]} rounded w-2/3`}
            ></div>
          </div>
          <div className="space-y-1">
            <div
              className={`h-4 ${classes["skeleton-pulse"]} rounded w-1/4`}
            ></div>
            <div
              className={`h-4 ${classes["skeleton-bg"]} rounded w-5/6`}
            ></div>
          </div>
          <div className="col-span-2 space-y-2">
            <div
              className={`h-4 ${classes["skeleton-pulse"]} rounded w-1/3`}
            ></div>
            <div
              className={`h-4 ${classes["skeleton-bg"]} rounded w-1/2`}
            ></div>
          </div>
        </div>
      </div>

      {/* Bet Details Skeleton */}
      <div
        className={`${classes["section-bg"]} rounded-lg p-2 space-y-2 animate-pulse`}
      >
        <div
          className={`h-5 ${classes["skeleton-bg"]} rounded w-1/4 mb-2`}
        ></div>
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <div
              className={`h-4 ${classes["skeleton-pulse"]} rounded w-1/4`}
            ></div>
            <div
              className={`h-4 ${classes["skeleton-bg"]} rounded w-1/3`}
            ></div>
          </div>
          <div className="flex justify-between items-center">
            <div
              className={`h-4 ${classes["skeleton-pulse"]} rounded w-1/3`}
            ></div>
            <div
              className={`h-4 ${classes["skeleton-bg"]} rounded w-1/4`}
            ></div>
          </div>
          <div
            className={`border-t ${classes["divider"]} pt-3 mt-3 flex justify-between items-center`}
          >
            <div
              className={`h-5 ${classes["skeleton-pulse"]} rounded w-2/5`}
            ></div>
            <div
              className={`h-6 ${classes["skeleton-pulse"]} rounded w-2/5`}
            ></div>
          </div>
        </div>
      </div>

      {/* Selections Skeleton */}
      <div
        className={`${classes["section-bg"]} rounded-lg p-2 space-y-2 animate-pulse`}
      >
        <div
          className={`h-5 ${classes["skeleton-bg"]} rounded w-2/5 mb-2`}
        ></div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className={`${classes["item-bg"]} rounded-lg p-2 space-y-2`}
            >
              <div className="space-y-2">
                <div
                  className={`h-4 ${classes["skeleton-bg"]} rounded w-3/4`}
                ></div>
                <div
                  className={`h-3 ${classes["skeleton-pulse"]} rounded w-1/2`}
                ></div>
                <div
                  className={`h-3 ${classes["skeleton-pulse"]} rounded w-2/5`}
                ></div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div
                  className={`h-3 ${classes["skeleton-pulse"]} rounded`}
                ></div>
                <div
                  className={`h-3 ${classes["skeleton-pulse"]} rounded`}
                ></div>
                <div
                  className={`col-span-2 h-3 ${classes["skeleton-pulse"]} rounded w-4/5`}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
  return (
    <Modal
      open={true}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
      className="max-w-2xl"
      header={
        <div className="flex items-center justify-between">
          <h2 className={`text-lg font-bold ${modalClasses["header-text"]}`}>
            {isFindingBet ? "Loading Bet Details..." : "Bet Details"}
          </h2>
        </div>
      }
      footer={
        isFindingBet || !betslip ? (
          <div className="flex flex-wrap gap-4 pt-2 animate-pulse">
            <div className="flex-1 min-w-[120px] h-10 bg-gray-700/30 rounded-lg"></div>
            <div className="flex-1 min-w-[120px] h-10 bg-gray-700/30 rounded-lg"></div>
            <div className="flex-1 min-w-[120px] h-10 bg-gray-700/30 rounded-lg"></div>
            <div className="flex-1 min-w-[120px] h-10 bg-gray-700/30 rounded-lg"></div>
          </div>
        ) : (
          <div className="flex flex-wrap gap-4 pt-2">
            {/* Rebet Button - Always show */}
            <button
              onClick={handleRebet}
              className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg font-medium text-xs ${classes["action-button"]} ${classes["action-button-hover"]} text-white transition-all duration-200 shadow-sm`}
            >
              Rebet
            </button>

            {/* Cashout Button - Always show, disabled if paid out */}
            {
              <button
                onClick={handleCashout}
                disabled={betslip?.cashOutAmount > 0}
                className={`flex-1  min-w-[120px] px-4 py-2 rounded-lg font-medium text-xs  ${
                  classes["action-button-hover"]
                } text-white transition-all duration-200 shadow-sm ${
                  betslip?.cashOutAmount > 0
                    ? `${classes["action-button"]}`
                    : "pointer-events-none bg-opacity-50 bg-gray-600/40 cursor-not-allowed"
                }`}
              >
                {betslip?.cashOutAmount > 0 ? (
                  <>
                    Cash Out{" "}
                    <CurrencyFormatter
                      amount={betslip?.cashOutAmount || 0}
                      className={""}
                      spanClassName={""}
                    />
                  </>
                ) : (
                  "Cash Out unavailable"
                )}
              </button>
            }

            {/* Payout Button - Show if not paid out */}
            {betslip.paid_out === 0 && (
              <button
                onClick={handlePayoutCommission}
                disabled={isLoading}
                className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg font-medium text-xs ${classes["action-button"]} ${classes["action-button-hover"]} text-white disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-sm`}
              >
                {isLoading ? "Processing..." : "Pay Out"}
              </button>
            )}

            {/* Reprint Button - Always show */}
            <button
              onClick={handleReprint}
              className={`flex-1 min-w-[120px] px-4 py-2 rounded-lg font-medium text-xs ${classes["secondary-button"]} ${classes["secondary-button-hover"]} text-white transition-all duration-200 shadow-sm`}
            >
              Print Ticket
            </button>
          </div>
        )
      }
    >
      {isFindingBet || !betslip ? (
        renderSkeleton()
      ) : (
        <div className="space-y-2">
          {/* Betslip Info Section */}
          <div
            className={`${classes["section-bg"]} rounded-lg p-2 space-y-2 border ${classes["section-border"]} shadow-sm`}
          >
            <h3
              className={`font-semibold text-sm mb-2 ${classes["section-title"]}`}
            >
              Betslip Information
            </h3>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex justify-start gap-4">
                <span className={classes["label-text"]}>Betslip ID:</span>
                <span className={`font-mono ${classes["value-text"]}`}>
                  {betslip.betslipId}
                </span>
              </div>
              <div className="flex justify-start gap-4">
                <span className={classes["label-text"]}>Date:</span>
                <span className={classes["value-text"]}>
                  {AppHelper.formatDate(betslip.created)}
                </span>
              </div>
              <div className="flex justify-start gap-4 col-span-2">
                <span className={classes["label-text"]}>Bet Type:</span>
                <span className={classes["value-text"]}>
                  {betslip.bet_category}
                </span>
              </div>
            </div>
          </div>

          {/* Bet Details Section */}
          <div
            className={`${classes["section-bg"]} rounded-lg p-2 flex flex-col gap-2 border ${classes["section-border"]} shadow-sm`}
          >
            <h3 className={`font-semibold text-sm ${classes["section-title"]}`}>
              Bet Details
            </h3>
            <div className="flex flex-col text-xs gap-2">
              <div className="flex justify-between">
                <span className={classes["label-text"]}>Stake:</span>
                <span className={`font-semibold ${classes["value-text"]}`}>
                  <CurrencyFormatter
                    amount={Number(betslip.stake)}
                    className={""}
                    spanClassName={""}
                  />
                </span>
              </div>

              <div className="flex justify-between">
                <span className={classes["label-text"]}>Total Odds:</span>
                <span className={`font-semibold ${classes["value-text"]}`}>
                  {formatNumber(Number(betslip.totalOdd))}
                </span>
              </div>
              <div
                className={`${theme.classes["light-divider"]} w-full h-0.5`}
              />

              <div className={`flex justify-between  px-1`}>
                <span className={`font-semibold ${classes["label-text"]}`}>
                  {betslip?.paid_out === 0 ? "Possible Win:" : "Paid Amount:"}
                </span>
                <span className={`font-bold ${classes["win-text"]}`}>
                  <CurrencyFormatter
                    amount={Number(betslip.possibleWin)}
                    className={""}
                    spanClassName={""}
                  />
                </span>
              </div>
            </div>
          </div>

          {/* Selections Section */}
          <div
            className={`${classes["section-bg"]} rounded-lg p-2 border ${classes["section-border"]} shadow-sm`}
          >
            <h3
              className={`font-semibold text-sm mb-2 ${classes["section-title"]}`}
            >
              Event List ({betslip.selections.length})
            </h3>
            <div className="flex flex-col gap-2">
              {betslip.selections.map((selection, index) => (
                <div
                  key={index}
                  className={`${classes["item-bg"]} rounded-md p-2 flex flex-col gap-2 border ${classes["item-border"]} shadow-sm`}
                >
                  <div className="flex-1 gap-1  flex flex-col">
                    <p
                      className={`font-medium text-xs ${classes["event-name"]}`}
                    >
                      {selection.eventName}
                    </p>
                    <div className="flex justify-start gap-4 items-start">
                      <p className={`text-xs ${classes["subtitle-text"]}`}>
                        {selection.category} - {selection.tournament}
                      </p>
                      <div
                        className={`${theme.classes["light-divider"]} w-0.5 h-4`}
                      />
                      <p className={`text-xs ${classes["subtitle-text"]}`}>
                        {formatDate(selection.eventDate)}
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className={classes["label-text"]}>Market: </span>
                      <span className={classes["value-text"]}>
                        {selection.marketName}
                      </span>
                    </div>
                    <div>
                      <span className={classes["label-text"]}>Odds: </span>
                      <span
                        className={`font-semibold ${classes["value-text"]}`}
                      >
                        {Number(selection.odds).toFixed(2)}
                      </span>
                    </div>
                    <div className="col-span-2">
                      <span className={classes["label-text"]}>Pick: </span>
                      <span className={classes["value-text"]}>
                        {selection.outcomeName}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
        </div>
      )}

      {/* Status Modal */}
      {showStatusModal && (
        <Modal
          open={showStatusModal}
          onOpenChange={setShowStatusModal}
          className="max-w-md"
          header={
            <h2 className={`text-lg font-bold ${modalClasses["header-text"]}`}>
              {statusData.title}
            </h2>
          }
        >
          <div className="space-y-4">
            <div
              className={`text-center ${
                statusData.isSuccess ? "text-green-500" : "text-red-500"
              }`}
            >
              <p className="text-sm">{statusData.message}</p>
            </div>
            <button
              onClick={() => {
                setShowStatusModal(false);
                if (statusData.isSuccess) {
                  onClose();
                }
              }}
              className={`w-full px-4 py-2 rounded-lg font-medium text-sm ${classes["action-button"]} ${classes["action-button-hover"]}`}
            >
              Close
            </button>
          </div>
        </Modal>
      )}
    </Modal>
  );
};

export default CouponDetails;
