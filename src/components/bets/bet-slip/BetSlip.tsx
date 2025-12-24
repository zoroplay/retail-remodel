import React, { useCallback, useState } from "react";
import SingleSearchInput from "../../inputs/SingleSearchInput";
import {
  useFindBetMutation,
  useFindCouponMutation,
} from "@/store/services/bets.service";
import environmentConfig from "@/store/services/configs/environment.config";
import { showToast } from "../../tools/toast";
import SwitchInput from "../../inputs/SwitchInput";
import { BET_TYPES_ENUM } from "@/data/enums/enum";
import { FindBetResponse } from "@/store/services/data/betting.types";
import { X, Check, Book } from "lucide-react";
import Spinner from "../../layouts/Spinner";
import Combined from "../Combined";
import Multiple from "../Multiple";
import { useBetting } from "@/hooks/useBetting";
import { usePlaceBet } from "@/hooks/usePlaceBet";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import { getClientTheme } from "@/config/theme.config";

type Props = {};

const BetSlip = (props: Props) => {
  const [bookingNumber, setBookingNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const { classes } = getClientTheme();
  const betslipClasses = classes.betslip;

  const [findBet, { isLoading: isFindingBet }] = useFindBetMutation();
  const [findCoupon, { isLoading: isFindingCoupon }] = useFindCouponMutation();
  const dispatch = useAppDispatch();
  const { bet_type, handleBetTypeChange } = useBetting();
  const {
    clearBets,
    addBet,
    selected_bets,
    stake,
    total_odds,
    potential_winnings,
    updateStake,
  } = useBetting();
  const {
    isConfirming,
    isPlacingBet,
    is_booking,
    placeBet,
    confirmBet,
    bookBet,
    cancelBet,
    canPlaceBet,
  } = usePlaceBet();

  const [activeTab, setActiveTab] = useState<0 | 1>(0);

  const handleBookingNumberChange = useCallback(
    async (text: string) => {
      setBookingNumber(text);

      if (text.length === 7) {
        try {
          const result = (await findBet({
            betslipId: text,
            clientId: String(environmentConfig.CLIENT_ID),
          })) as unknown as { data: FindBetResponse };

          if (result.data && result.data.success) {
            clearBets();

            result.data.data.selections.forEach((selection) => {
              addBet({
                fixture_data: {
                  gameID: selection.eventId,
                  matchID: selection.matchId,
                  name: selection.eventName,
                  date: selection.eventDate,
                  tournament: selection.tournament,
                  categoryID: selection.category,
                  categoryName: selection.category,
                  sportID: selection.sportId,
                  sportName: selection.sport,
                  tournamentID: 0, // Default value
                  eventTime: selection.eventDate,
                  homeScore: "",
                  matchStatus: "",
                  awayScore: "",
                  homeTeam: "",
                  awayTeam: "",
                  outcomes: [],
                  event_type: "pre", // Add missing property
                  status: 0, // Add missing property
                  competitor1: "",
                  competitor2: "",
                  activeMarkets: 0,
                },
                outcome_data: {
                  displayName: selection.outcomeName,
                  marketName: selection.marketName,
                  odds: parseFloat(selection.odds),
                  outcomeID: selection.outcomeId,
                  outcomeName: selection.outcomeName,
                  specifier: selection.specifier,
                  oddID: 0,
                  status: 0,
                  active: 1,
                  producerID: selection.producerId,
                  marketID: selection.marketId,
                  producerStatus: 0,
                  marketId: selection.marketId,
                },
                element_id: selection.eventId,
                bet_type: "pre",
                global_vars: {},
                bonus_list: [],
              });
            });
            updateStake({ stake: Number(result.data.data.stake) });

            showToast({
              type: "success",
              title: "Booking Found!",
              description: `${result.data.data.selections.length} bets loaded successfully`,
            });
          }
        } catch (error) {
          console.error("Error loading booking:", error);
          showToast({
            type: "error",
            title: "Error",
            description: "Failed to load booking number",
          });
        }
      }
    },
    [findBet, clearBets, addBet]
  );
  const handleCouponCodeChange = useCallback(
    async (text: string) => {
      setCouponCode(text);

      if (text.length === 7) {
        try {
          const result = await findCoupon({
            betslipId: text,
            clientId: String(environmentConfig.CLIENT_ID),
          });

          // if (result?.data?.data) {
          //   dispatch(setCouponData(result.data.data));
          //   openModal({
          //     modal_name: MODAL_COMPONENTS.COUPON_DETAILS,
          //     title: `Betslip ${result.data.data.betslipId}`,
          //   });
          //   showToast({
          //     type: "success",
          //     title: "Coupon Found!",
          //     description: "Coupon details displayed",
          //   });
          // }
          // setTimeout(() => setCouponCode(""), 10);
        } catch (error) {
          showToast({
            type: "error",
            title: "Error",
            description: "Failed to validate coupon code",
          });
        }
      }
    },
    [findCoupon, dispatch]
  );
  return (
    <section className="sticky top-[100px]">
      <aside
        className={`lg:w-[22rem] w-full ${betslipClasses["main-bg"]} border ${betslipClasses["main-border"]} rounded-b-md overflow-hidden shadow-2xl`}
      >
        {/* Header */}
        <div className="">
          {/* <h3 className="text-white font-bold tracking-wide text-sm">
            Bet Slip
          </h3> */}
          <div className="flex gap-2 p-0.5">
            <SwitchInput
              options={[
                { title: "Booking Code" },
                { title: "Coupon Code" },
                // { title: "Split" },
              ]}
              selected={activeTab}
              onChange={(i) => setActiveTab(i)}
              rounded="rounded-md"
              background={`${betslipClasses["tab-bg"]} ${betslipClasses["tab-border"]} !p-[2px] border shadow-sm`}
              thumb_background={`${betslipClasses["tab-bg"]}`}
              thumb_color={`${betslipClasses["tab-active-bg"]} ${betslipClasses["tab-active-text"]} transition-all duration-300 !rounded-[4px]`}
              text_color={`${betslipClasses["tab-inactive-text"]} !text-[11px] font-medium`}
              selected_text_color={`${betslipClasses["tab-active-text"]} !text-[11px] font-medium`}
            />
          </div>
        </div>
        <div className="flex-1 items-center justify-center gap-2 p-1">
          {activeTab === 0 ? (
            <SingleSearchInput
              placeholder={"Insert Booking Number"}
              value={bookingNumber}
              onChange={(e) => handleBookingNumberChange(e.target.value)}
              // onClear={() => setBookingNumber("")}
              // isLoading={isFindingBet}
              // height="h-[36px]"
              onSearch={() => {}}
              searchState={{
                isValid: false,
                isNotFound: false,
                isLoading: isFindingBet,
                message: "",
              }}
              text_color={`${classes["input-text"]} text-xs`}
              bg_color={classes["input-bg"]}
              border_color={classes["input-border"]}
              height={"h-[32px]"}
            />
          ) : (
            <SingleSearchInput
              placeholder={"Insert Coupon Code"}
              value={couponCode}
              onChange={(e) => handleCouponCodeChange(e.target.value)}
              // onClear={() => setCouponCode("")}
              // isLoading={isFindingBet}
              // height="h-[36px]"
              onSearch={() => {}}
              searchState={{
                isValid: false,
                isNotFound: false,
                isLoading: isFindingCoupon,
                message: "",
              }}
              text_color={`${classes["input-text"]} text-xs`}
              bg_color={classes["input-bg"]}
              border_color={classes["input-border"]}
              height={"h-[32px]"}
            />
          )}
        </div>
        <div className={`w-full h-0.5 ${betslipClasses["divider"]}`} />
        <div className="p-1 space-y-2">
          {/* Summary Stats */}
          {/* <div className="grid grid-cols-2 gap-4">
                <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                      Selections
                    </p>
                    <p className="text-white font-bold text-xl">
                      {selected_bets.length}
                    </p>
                  </div>
                </div>
                <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-4">
                  <div className="text-center">
                    <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                      Total Odds
                    </p>
                    <p className="text-yellow-300 font-bold text-xl">
                      {total_odds.toFixed(2)}
                    </p>
                  </div>
                </div>
              </div> */}

          {/* Bonus & Win Amounts */}
          {/* <div className="space-y-3">
                <div className="bg-gradient-to-r from-amber-600/20 to-orange-500/20 border border-amber-500/30 rounded-lg p-4">
                  <div className="flex justify-between items-center">
                    <span className="text-amber-300 text-sm font-medium">
                      Max Bonus
                    </span>
                    <span className="text-amber-100 font-bold">₦0.00</span>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gradient-to-br from-slate-800 to-slate-700 border border-slate-600 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">
                        Min Win
                      </p>
                      <p className="text-slate-300 font-semibold">₦0.00</p>
                    </div>
                  </div>
                  <div className="bg-gradient-to-br from-green-600/20 to-emerald-500/20 border border-green-500/30 rounded-lg p-4">
                    <div className="text-center">
                      <p className="text-green-400 text-xs uppercase tracking-wider mb-1">
                        Max Win
                      </p>
                      <p className="text-green-300 font-bold">
                        ₦{potential_winnings.toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              </div> */}

          {/* Stake Input */}

          <div className="">
            <div className="flex gap-2">
              <SwitchInput
                options={[
                  { title: "Multiple" },
                  { title: "Combined" },
                  // { title: "Split" },
                ]}
                selected={
                  bet_type === BET_TYPES_ENUM.MULTIPLE
                    ? 0
                    : bet_type === BET_TYPES_ENUM.COMBINED
                    ? 1
                    : 2
                }
                onChange={(i) =>
                  handleBetTypeChange(
                    i === 0
                      ? BET_TYPES_ENUM.MULTIPLE
                      : i === 1
                      ? BET_TYPES_ENUM.COMBINED
                      : BET_TYPES_ENUM.SPLIT
                  )
                }
                rounded="rounded-md"
                background={`${betslipClasses["tab-bg"]} ${betslipClasses["tab-border"]} !p-[2px] border shadow-sm`}
                thumb_background={`${betslipClasses["tab-bg"]}`}
                thumb_color={`${betslipClasses["tab-active-bg"]} ${betslipClasses["tab-active-text"]} transition-all duration-300 !rounded-[4px]`}
                text_color={`${betslipClasses["tab-inactive-text"]} !text-[11px] font-medium`}
                selected_text_color={`${betslipClasses["tab-active-text"]} !text-[11px] font-medium`}
              />
            </div>
            <div className="mt-1">
              {bet_type === BET_TYPES_ENUM.MULTIPLE && (
                <Multiple globalVar={{}} />
              )}
              {bet_type === BET_TYPES_ENUM.COMBINED && (
                <Combined globalVar={{}} bonusList={[]} />
              )}
              {/* {betType === BET_TYPES_ENUM.SPLIT && (
                <Split
                  couponData={{ selected_bets, stake, total_odds }}
                  dispatch={updateStake}
                  globalVar={{}}
                  bonusList={[]}
                />
              )} */}
            </div>
          </div>

          {/* {stake > 0 && selected_bets.length > 0 && (
            <div className="bg-gradient-to-r from-blue-600/10 to-purple-600/10 border border-blue-500/20 rounded-lg p-2 mt-2">
              <h4 className="text-blue-300 font-semibold text-sm mb-3">
                Potential Return
              </h4>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Stake:</span>
                  <span className="text-white">₦{stake.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">Potential Win:</span>
                  <span className="text-green-400 font-semibold">
                    ₦{potential_winnings.toFixed(2)}
                  </span>
                </div>
                <div className="border-t border-slate-600 pt-2 flex justify-between">
                  <span className="text-blue-300 font-semibold">
                    Total Return:
                  </span>
                  <span className="text-blue-300 font-bold text-lg">
                    ₦{(stake + potential_winnings).toFixed(2)}
                  </span>
                </div>
              </div>
            </div>
          )} */}
          {/* Action Buttons */}
          <div className="space-y-2">
            {isConfirming ? (
              <div className="grid grid-cols-[1fr_2fr] gap-0.5">
                <button
                  onClick={cancelBet}
                  disabled={isPlacingBet}
                  className={`${betslipClasses["button-cancel-bg"]} ${betslipClasses["button-cancel-hover"]} border border-red-500 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs rounded-r-none h-9`}
                >
                  <X size={16} />
                  CANCEL
                </button>

                <button
                  onClick={placeBet}
                  disabled={isPlacingBet}
                  className={`${classes["button-proceed-bg"]} ${classes["button-proceed-hover"]} border ${classes["button-proceed-border"]} ${classes["button-proceed-text"]} font-semibold py-2 px-4 rounded-lg transition-all duration-200 text-xs disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 rounded-l-none h-9`}
                >
                  {isPlacingBet ? (
                    <>
                      <Spinner />
                      PLACING...
                    </>
                  ) : (
                    <>
                      <Check size={16} />
                      CONFIRM BET
                    </>
                  )}
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-[1fr_2fr] gap-0.5">
                <button
                  onClick={bookBet}
                  disabled={!canPlaceBet}
                  className={`w-full h-9 rounded-r-none font-semibold py-2 px-4 rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs duration-300 ${
                    canPlaceBet
                      ? `${classes["button-tertiary-bg"]} ${classes["button-tertiary-hover"]} border ${classes["button-tertiary-border"]} ${classes["button-tertiary-text"]} shadow-md `
                      : "bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-600 text-slate-400"
                  }`}
                >
                  {is_booking ? (
                    <>
                      <Spinner />
                      BOOKING...
                    </>
                  ) : (
                    <>
                      <Book size={16} />
                      <span>BOOK BET</span>
                    </>
                  )}
                </button>
                <button
                  onClick={confirmBet}
                  disabled={!canPlaceBet}
                  className={`w-full h-9 font-semibold py-2 px-4 rounded-l-none rounded-md transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-1 text-xs duration-300 ${
                    canPlaceBet
                      ? `${classes["button-primary-bg"]} ${classes["button-primary-hover"]} border ${classes["button-primary-border"]} ${classes["button-primary-text"]} shadow-md `
                      : "bg-gradient-to-r from-slate-700 to-slate-600 border border-slate-600 text-slate-400"
                  }`}
                >
                  <Check size={16} />
                  <span>PLACE BET</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </aside>
    </section>
  );
};

export default BetSlip;
