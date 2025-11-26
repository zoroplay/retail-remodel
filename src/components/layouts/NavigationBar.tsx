import React, { useCallback, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useBetting } from "../../hooks/useBetting";
import { useAppDispatch } from "../../hooks/useAppDispatch";
import { useModal } from "../../hooks/useModal";
import {
  useFindBetMutation,
  useFindCouponMutation,
} from "../../store/services/bets.service";
import { MODAL_COMPONENTS } from "../../store/features/types";
import {
  ENVIRONMENT_VARIABLES,
  getEnvironmentVariable,
} from "../../store/services/configs/environment.config";
import { showToast } from "../tools/toast";
import { setCouponData } from "../../store/features/slice/fixtures.slice";
import { Menu } from "lucide-react";
import SingleSearchInput from "../inputs/SingleSearchInput";
import {
  FindBetResponse,
  FindCouponResponse,
} from "@/store/services/data/betting.types";

interface MenuItem {
  id: string;
  number: string;
  code: string;
  label: string;
}

interface NavigationBarProps {
  activeTab?: "sports" | "live" | "prematch";
  onTabPress?: (tab: "sports" | "live" | "prematch") => void;
  onSearchPress?: () => void;
}

export const NavigationBar: React.FC<NavigationBarProps> = React.memo(
  ({ activeTab = "sports", onTabPress, onSearchPress }) => {
    const navigate = useNavigate();
    const { clearBets, addBet } = useBetting();
    const dispatch = useAppDispatch();
    const { openModal } = useModal();
    const [bookingNumber, setBookingNumber] = useState("");
    const [couponCode, setCouponCode] = useState("");

    // Mutations for finding bets and coupons
    const [findBet, { isLoading: isFindingBet }] = useFindBetMutation();
    const [findCoupon, { isLoading: isFindingCoupon }] =
      useFindCouponMutation();
    const openMenuModal = useCallback(() => {
      openModal({
        modal_name: MODAL_COMPONENTS.MENU_BAR,
        title: "Menu",
      });
    }, [openModal]);

    const openSportMenuModal = useCallback(() => {
      openModal({
        modal_name: MODAL_COMPONENTS.SPORT_MENU,
        title: "Sport Menu",
      });
    }, [openModal]);

    const handleBookingNumberChange = useCallback(
      async (text: string) => {
        setBookingNumber(text);

        // Check for shortcut sequences
        if (text === "*#11") {
          // Sports
          navigate("/");
          setBookingNumber("");
          return;
        }
        if (text === "*#21") {
          // Statements
          navigate("/transactions");
          setBookingNumber("");
          return;
        }
        if (text === "*#23") {
          // Bet List
          navigate("/bet-list");
          setBookingNumber("");
          return;
        }
        if (text === "*#31") {
          // Load Bet
          navigate("/load-bets");
          setBookingNumber("");
          return;
        }
        if (text === "*#34") {
          // Deposit
          openModal({
            modal_name: MODAL_COMPONENTS.ONLINE_DEPOSIT,
            title: "Online Deposit",
          });
          setBookingNumber("");
          return;
        }
        if (text === "*#37") {
          // Commission
          navigate("/commission");
          setBookingNumber("");
          return;
        }

        if (text.length === 7) {
          try {
            const result = (await findBet({
              betslipId: text,
              clientId:
                getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID) || "",
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
                  },
                  element_id: selection.eventId,
                  bet_type: "pre",
                  global_vars: {},
                  bonus_list: [],
                });
              });

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

        // Check for shortcut sequences
        if (text === "*#11") {
          // Sports
          navigate("/");
          setCouponCode("");
          return;
        }
        if (text === "*#21") {
          // Statements
          navigate("/transactions");
          setCouponCode("");
          return;
        }
        if (text === "*#23") {
          // Bet List
          navigate("/bet-list");
          setCouponCode("");
          return;
        }
        if (text === "*#31") {
          // Load Bet
          navigate("/load-bets");
          setCouponCode("");
          return;
        }
        if (text === "*#34") {
          // Deposit
          openModal({
            modal_name: MODAL_COMPONENTS.ONLINE_DEPOSIT,
            title: "Online Deposit",
          });
          setCouponCode("");
          return;
        }
        if (text === "*#37") {
          // Commission
          navigate("/commission");
          setCouponCode("");
          return;
        }

        if (text.length === 7) {
          try {
            const result = (await findCoupon({
              betslipId: text,
              clientId:
                getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID) || "",
            })) as unknown as { data: FindCouponResponse };

            if (result.data && result.data.success) {
              dispatch(setCouponData(result.data.data));
              openModal({
                modal_name: MODAL_COMPONENTS.COUPON_DETAILS,
                title: `Betslip ${result.data.data.betslipId}`,
              });

              showToast({
                type: "success",
                title: "Coupon Found!",
                description: "Coupon details displayed",
              });
            }
          } catch (error) {
            console.error("Error checking coupon:", error);
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
      <>
        <div className="bg-secondary flex items-center justify-between px-4 gap-2 py-3 w-full">
          {/* Left Section - Menu and Sports Button */}
          <div className="flex items-center gap-2 w-1/7">
            <button
              onClick={openMenuModal}
              className="bg-blue-600 w-10 h-12  rounded flex flex-col items-center justify-center cursor-pointer"
            >
              <Menu size={20} color="white" />
              <div className="bg-black/20 h-5 px-1 rounded flex items-center justify-center">
                <p className="text-white font-semibold text-center">*#*</p>
              </div>
            </button>

            <button
              onClick={openSportMenuModal}
              className={`px-4 py-2 rounded h-10 cursor-pointer ${
                activeTab === "sports" ? "bg-blue-600" : "bg-blue-500"
              }`}
            >
              <p className="text-white font-semibold">Sports</p>
            </button>
          </div>

          {/* Middle Section - Booking Number and Coupon Code Search */}
          <div className="flex items-center justify-center gap-2 w-3/6">
            <div className="flex-1 items-center justify-center gap-2">
              <SingleSearchInput
                placeholder={"Insert Booking Number"}
                value={bookingNumber}
                onChange={(e) => handleBookingNumberChange(e.target.value)}
                // onClear={() => setBookingNumber("")}
                // isLoading={isFindingBet}
                height="h-[36px]"
                onSearch={() => {}}
                searchState={{
                  isValid: false,
                  isNotFound: false,
                  isLoading: isFindingBet,
                  message: "",
                }}
              />
            </div>
            <div className="flex-1 items-center justify-center gap-2">
              <SingleSearchInput
                placeholder={"Insert Coupon Code"}
                value={couponCode}
                onChange={(e) => handleCouponCodeChange(e.target.value)}
                // onClear={() => setCouponCode("")}
                // isLoading={isFindingCoupon}
                height="h-[36px]"
                onSearch={() => {}}
                searchState={{
                  isValid: false,
                  isNotFound: false,
                  isLoading: isFindingCoupon,
                  message: "",
                }}
              />
            </div>
          </div>

          {/* Right Section - Search and Tab Buttons */}
          <div className="flex items-center gap-2 w-2/6">
            <button
              onClick={() => onTabPress?.("live")}
              className={`px-4 py-2 rounded cursor-pointer ${
                activeTab === "live" ? "bg-blue-600" : "bg-white"
              }`}
            >
              <p
                className={`font-semibold ${
                  activeTab === "live" ? "text-white" : "text-gray-700"
                }`}
              >
                Live **1
              </p>
            </button>

            <button
              onClick={() => onTabPress?.("prematch")}
              className={`px-4 py-2 rounded cursor-pointer ${
                activeTab === "prematch" ? "bg-blue-600" : "bg-white"
              }`}
            >
              <p
                className={`font-semibold ${
                  activeTab === "prematch" ? "text-white" : "text-gray-700"
                }`}
              >
                Prematch **2
              </p>
            </button>
          </div>
        </div>
      </>
    );
  }
);

export default NavigationBar;
