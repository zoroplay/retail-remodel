"use client";
import React, {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";

import { useAppSelector } from "../../../hooks/useAppDispatch";
import { useBetting } from "../../../hooks/useBetting";
import { useMqtt } from "../../../hooks/useMqtt";
import {
  useFetchFixturesMutation,
  useFindBetMutation,
  useFindCouponMutation,
} from "../../../store/services/bets.service";
import { usePlaceBet } from "../../../hooks/usePlaceBet";
import { AppHelper } from "../../../lib/helper";
import environmentConfig, {
  ENVIRONMENT_VARIABLES,
  getEnvironmentVariable,
} from "../../../store/services/configs/environment.config";
import { ChevronRight, Grid, X } from "lucide-react";
import Spinner from "../../layouts/Spinner";
import NavigationBar from "../../layouts/CDNavigationBar";
import SingleSearchInput from "@/components/inputs/SingleSearchInput";
import Input from "@/components/inputs/Input";
import { MODAL_COMPONENTS, SelectedBet } from "@/store/features/types";
import { FetchFixtureResponse } from "@/store/services/data/betting.types";
import { useModal } from "@/hooks/useModal";
import QuickBets from "@/components/bets/QuickBets";
import { getClientTheme } from "@/config/theme.config";
import { useAppDispatch } from "@/hooks/useAppDispatch";
import {
  addCashDeskItem,
  setFormData,
} from "@/store/features/slice/cashdesk.slice";
import { CashDeskFormData } from "@/store/features/types/cashdesk.types";
import CurrencyFormatter from "@/components/inputs/CurrencyFormatter";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import { Fixture, SelectedMarket } from "@/data/types/betting.types";
import { removeCashDeskFixture } from "@/store/features/slice/fixtures.slice";
import OddsButton from "@/components/buttons/OddsButton";
import { BET_TYPES_ENUM, MARKET_SECTION } from "@/data/enums/enum";

const FixtureDisplay = forwardRef<
  HTMLDivElement,
  {
    displayFixtures: (PreMatchFixture | Fixture)[];
    selectedMarkets: SelectedMarket[];
    sport_id: number;
    is_loading?: boolean;
  }
>(({ displayFixtures, selectedMarkets, sport_id, is_loading }, ref) => {
  const { classes } = getClientTheme();
  const sportsPageClasses = classes.sports_page;
  const { openModal } = useModal();
  const { selected_bets } = useBetting();
  selectedMarkets = Array.isArray(selectedMarkets) ? selectedMarkets : [];

  // For soccer (sportID 1), only show 1X2 and Double Chance markets
  if (sport_id == 1) {
    selectedMarkets = selectedMarkets.filter(
      (market) =>
        market.marketID === String(MARKET_SECTION.ONE_X_TWO) || // 1X2
        market.marketID === String(MARKET_SECTION.DOUBLE_CHANCE) // Double Chance
    );
  }

  const dispatch = useAppDispatch();
  const getMarketOutcomes = (fixture: any, marketConfig: SelectedMarket) => {
    return marketConfig.outcomes
      .map((expectedOutcome: any) => {
        return fixture?.outcomes?.find(
          (outcome: any) =>
            outcome.marketID.toString() === marketConfig.marketID &&
            outcome.outcomeID.toString() ===
              expectedOutcome.outcomeID.toString()
        );
      })
      .filter(Boolean); // Remove undefined outcomes
  };

  const handleMorePress = useCallback(
    (game: PreMatchFixture) => {
      // dispatch(setSelectedGame(game));
      openModal({
        modal_name: MODAL_COMPONENTS.GAME_OPTIONS,
        title: "Menu",
        ref: game.gameID,
      });
    },
    [openModal]
  );

  return (
    <div
      ref={ref as React.RefObject<HTMLDivElement>}
      className={`${sportsPageClasses["card-bg"]} border ${sportsPageClasses["card-border"]} shadow-2xl overflow-hidden rounded-lg`}
    >
      <div
        className={`p-1 flex items-center justify-end ${sportsPageClasses["header-bg"]} border-b ${sportsPageClasses["header-border"]}`}
      >
        <button
          onClick={() => {
            dispatch(removeCashDeskFixture());
          }}
          className="p-1  flex justify-center items-center text-red-500 bg-red-500/40 cursor-pointer h-6 w-12  border-red-600/50 rounded-lg border hover:bg-red-700/80 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <div
        className={`${sportsPageClasses["header-bg"]} border-b ${sportsPageClasses["header-border"]}`}
      >
        <div
          className={`grid grid-cols-[repeat(17,minmax(0,1fr))] gap-1 px-6 py-1 text-xs font-semibold ${sportsPageClasses["header-text"]}`}
        >
          <div className="col-span-2">Time</div>
          <div className="col-span-6">Match</div>
          {selectedMarkets.map((market, index) => (
            <div
              key={market.marketID}
              className="col-span-4 flex items-center justify-between"
            >
              {market.outcomes.map((outcome, outcomeIndex) => (
                <span
                  key={outcome.outcomeID}
                  className="w-1/3 flex justify-center items-center"
                >
                  {outcome.outcomeName}
                </span>
              ))}
            </div>
          ))}
          <div className="col-span-1 text-center">+</div>
        </div>
        {is_loading && (
          <div
            className={`divide-y ${sportsPageClasses["card-border"]} max-h-[84vh] overflow-y-auto `}
          >
            {[...Array(1)].map((_, groupIndex) => (
              <div key={groupIndex}>
                <div
                  className={`${sportsPageClasses["date-separator-bg"]} px-6 py-1 border-b ${sportsPageClasses["date-separator-border"]}`}
                >
                  <div
                    className={`h-4 ${sportsPageClasses["skeleton-secondary"]} rounded animate-pulse w-32`}
                  ></div>
                </div>
                {[...Array(3)].map((_, gameIndex) => (
                  <div
                    key={gameIndex}
                    className="grid grid-cols-[repeat(17,minmax(0,1fr))] gap-1 px-2 py-4 border-l-4 border-transparent animate-pulse"
                  >
                    {/* Time Skeleton */}
                    <div
                      className={`col-span-2 ${sportsPageClasses["time-border"]} border-r flex flex-col items-start justify-center`}
                    >
                      <div
                        className={`h-4 ${sportsPageClasses["skeleton-bg"]} rounded w-12 mb-1 animate-pulse`}
                      ></div>
                    </div>

                    {/* Match Info Skeleton */}
                    <div className="col-span-6 flex flex-col justify-center">
                      <div
                        className={`h-3 ${sportsPageClasses["skeleton-bg"]} rounded w-32 mb-2 animate-pulse`}
                      ></div>
                      <div
                        className={`h-4 ${sportsPageClasses["skeleton-bg"]} rounded w-48 animate-pulse`}
                      ></div>
                    </div>

                    {/* Dynamic Market Outcomes Skeleton */}
                    {selectedMarkets.map((market) => (
                      <div
                        key={market.marketID}
                        className="col-span-4 flex items-center justify-center gap-1"
                      >
                        {market.outcomes.map((outcome) => (
                          <div
                            key={outcome.outcomeID}
                            className={`h-11 ${sportsPageClasses["skeleton-bg"]} rounded flex-1 animate-pulse`}
                          ></div>
                        ))}
                      </div>
                    ))}

                    {/* More Button Skeleton */}
                    <div className="col-span-1 ml-2 px-2 flex items-center justify-center">
                      <div
                        className={`h-8 ${sportsPageClasses["skeleton-bg"]} rounded w-12 animate-pulse`}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>
      {!is_loading && displayFixtures.length > 0 && (
        <div className="divide-y divide-gray-700 max-h-[70vh] overflow-y-auto overflow-x-hidden">
          {Object.entries(
            displayFixtures.reduce(
              (groups: Record<string, typeof displayFixtures>, fixture) => {
                // Parse date correctly from the fixture data format
                const fixtureDate = new Date(
                  fixture.date || fixture.eventTime
                ).toLocaleDateString("en-GB", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                });

                if (!groups[fixtureDate]) {
                  groups[fixtureDate] = [];
                }
                groups[fixtureDate].push(fixture);
                return groups;
              },
              {}
            )
          ).map(([date, fixtures]) => (
            <div key={date}>
              {/* Date Separator */}
              <div
                className={`${sportsPageClasses["date-separator-bg"]} px-6 py-1 border-b ${sportsPageClasses["date-separator-border"]}`}
              >
                <h3
                  className={`${sportsPageClasses["date-separator-text"]} font-medium text-xs uppercase tracking-wide`}
                >
                  {date}
                </h3>
              </div>

              {/* Games for this date */}
              {fixtures.map((fixture: PreMatchFixture | Fixture) => {
                return (
                  <div
                    key={fixture.matchID}
                    className={`grid grid-cols-[repeat(17,minmax(0,1fr))] gap-1 p-2 ${sportsPageClasses["card-hover"]} transition-colors duration-200 cursor-pointer border-l-4 border-transparent`}
                  >
                    {/* Time */}
                    <div
                      className={`col-span-2 ${sportsPageClasses["time-border"]} border-r flex flex-col items-start justify-center`}
                    >
                      <span
                        className={`text-[11px] font-semibold ${sportsPageClasses["time-text"]}`}
                      >
                        {fixture.eventTime}
                      </span>

                      <span
                        className={`text-[11px] ${sportsPageClasses["match-tournament-text"]} whitespace-nowrap`}
                      >
                        ID: {fixture.matchID}
                      </span>
                    </div>

                    {/* Match Info */}
                    <div className="col-span-6 flex flex-col justify-center">
                      <div
                        className={`text-[10px] ${sportsPageClasses["match-tournament-text"]} mb-1`}
                      >
                        {fixture.tournament} • {fixture.categoryName}
                      </div>
                      <div
                        className={`text-xs font-medium ${sportsPageClasses["match-team-text"]}`}
                      >
                        {fixture.homeTeam} vs {fixture.awayTeam}
                      </div>
                    </div>

                    {/* Dynamic Market Outcomes */}
                    {selectedMarkets.map((marketConfig, marketIndex) => {
                      const marketOutcomes = getMarketOutcomes(
                        fixture,
                        marketConfig
                      );

                      return (
                        <div
                          key={marketConfig.marketID}
                          className="col-span-4 flex items-center justify-center"
                        >
                          {marketConfig.outcomes.map(
                            (expectedOutcome, outcomeIndex) => {
                              const foundOutcome = marketOutcomes.find(
                                (outcome: any) =>
                                  outcome?.outcomeID.toString() ===
                                  expectedOutcome.outcomeID.toString()
                              );

                              const isFirst = outcomeIndex === 0;
                              const isLast =
                                outcomeIndex ===
                                marketConfig.outcomes.length - 1;
                              let rounded = "";
                              if (isFirst) rounded = "rounded-l-md";
                              else if (isLast) rounded = "rounded-r-md";

                              return (
                                <OddsButton
                                  key={`${marketConfig.marketID}-${expectedOutcome.outcomeID}`}
                                  outcome={foundOutcome!}
                                  game_id={Number(fixture.gameID)}
                                  fixture_data={fixture as PreMatchFixture}
                                  height={"h-10"}
                                  disabled={!foundOutcome}
                                  rounded={rounded}
                                />
                              );
                            }
                          )}
                        </div>
                      );
                    })}

                    <div className="col-span-1 ml-2 px-2 flex items-center justify-center relative">
                      <div
                        onClick={(e) => {
                          e.stopPropagation();
                          handleMorePress(fixture as PreMatchFixture);
                        }}
                        className={`text-[10px] flex justify-center items-center h-10 rounded-md w-12 p-1   ${
                          classes.game_options_modal["odds-button-hover"]
                        } shadow font-semibold transition-colors border-2 ${
                          selected_bets.some(
                            (bet) =>
                              bet.game &&
                              (bet.game.matchID == Number(fixture.matchID) ||
                                bet.game.game_id == Number(fixture.gameID))
                          )
                            ? `${classes.game_options_modal["odds-button-selected-bg"]}   ${classes.game_options_modal["odds-button-selected-text"]} ${classes.game_options_modal["odds-button-selected-border"]}`
                            : `${classes.game_options_modal["odds-button-border"]} ${classes.game_options_modal["odds-button-bg"]} ${classes.game_options_modal["odds-button-text"]}`
                        }`}
                      >
                        <span>+{fixture.activeMarkets || 0}</span>
                        <ChevronRight size={12} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
});

const LoadBetsPage = () => {
  // Initialize theme
  const { classes } = getClientTheme();
  const cashdeskClasses = classes.cashdesk_page;

  // Add betType state
  const [betType, setBetType] = useState<BET_TYPES_ENUM>(
    BET_TYPES_ENUM.MULTIPLE
  );
  const dispatch = useAppDispatch();
  const [bookingNumber, setBookingNumber] = useState("");
  const [couponCode, setCouponCode] = useState("");
  const [quickBetEntries, setQuickBetEntries] = useState<any[]>([]); // Track items in quick bet entry
  const { global_variables } = useAppSelector((state) => state.app);
  const { form_data } = useAppSelector((state) => state.cashdesk);
  const { cashdesk_fixtures } = useAppSelector((state) => state.fixtures);

  const [eventId, setEventId] = useState("");

  const addForm = () => {
    dispatch(addCashDeskItem());
  };

  const smartCodeInputRef = React.useRef<HTMLInputElement>(null);

  const [isFormLoading, setIsFormLoading] = useState(false);
  const {
    selected_bets = [],
    total_odds,
    stake,
    potential_winnings,
    updateStake,
    clearBets,
    addBet,
    removeBet,
    updateBetOdds,
  } = useBetting();

  const {
    isConfirming,
    isPlacingBet,
    placeBet,
    confirmBet,
    cancelBet,
    canPlaceBet,

    // InsufficientBalanceModalComponent,
    // SuccessModalComponent,
  } = usePlaceBet();

  const [
    getFixture,
    {
      data: fixturesData,
      isSuccess,
      isLoading: isFixtureLoading,
      error,
      isError,
    },
  ] = useFetchFixturesMutation();
  const { openModal } = useModal();

  useEffect(() => {
    const couponSelections = Array.isArray(selected_bets) ? selected_bets : [];

    // If couponSelections is empty, keep the default empty selection
    if (couponSelections.length === 0) {
      // setFormData([
      //   {
      //     eventId: "",
      //     eventDate: "",
      //     event: "",
      //     odds: "",
      //     smartCode: "",
      //     is_edit: false,
      //   },
      // ]);
      return;
    }

    const run = async () => {
      // setFormData([]);
      try {
        // Otherwise, map the coupon selections
        const updatedSelections = await Promise.all(
          couponSelections.map(async (sel) => {
            const newQueryParams = {
              tournament_id: sel.game?.event_id,
              sport_id: "1",
              period: "all",
              markets: ["1", "10", "18"],
              specifier: "",
            };

            const result = (await getFixture(
              newQueryParams
            )) as unknown as FetchFixtureResponse;
            // console.log("Fetched Fixture for Quick Bet:", fixturesData);
            console.log("Fetched Fixture for Quick Bet:", result.data);

            const res: CashDeskFormData = {
              eventId: sel.game?.event_id?.toString() || "",
              eventDate:
                AppHelper.convertToTimeString(new Date(sel.game?.event_date)) ||
                "",
              event: sel.game?.event_name || "",
              odds: sel.game?.odds?.toString() || "",
              smartCode: sel.game?.display_name || "",
              is_edit: true,
              fixture: result?.data!,
            };
            return res;
          })
        );

        dispatch(setFormData(updatedSelections));
      } catch (err) {
        console.error(
          "Error fetching fixtures for quick bets:",
          err,
          "yui",
          fixturesData
        );
      }
    };
    run();
  }, []);
  // MQTT for tracking odds changes on selected bets
  const { subscribe } = useMqtt();
  const [oddsChangeNotifications, setOddsChangeNotifications] = useState<any[]>(
    []
  );

  // Get fixtures from the store (populated by the query)
  const [findBet, { isLoading: isFindingBet }] = useFindBetMutation();
  const [findCoupon, { isLoading: isFindingCoupon }] = useFindCouponMutation();

  // Subscribe to odds changes for selected bets
  useEffect(() => {
    if (selected_bets.length === 0) return;

    // Get unique match IDs from selected bets
    const matchIds = Array.from(
      new Set(
        selected_bets
          .map((bet) => bet.game?.matchID || bet.game?.match_id)
          .filter(Boolean)
      )
    );

    const unsubscribers: (() => void)[] = [];

    // Subscribe to odds changes for each match with selected bets
    matchIds.forEach((matchId) => {
      if (matchId) {
        // Subscribe to both live and prematch odds changes for this match
        unsubscribers.push(
          subscribe(`feeds/live/odds_change/${matchId}`, (data) => {
            handleOddsChangeForSelectedBets(data, String(matchId));
          })
        );

        unsubscribers.push(
          subscribe(`feeds/prematch/odds_change/${matchId}`, (data) => {
            handleOddsChangeForSelectedBets(data, String(matchId));
          })
        );
      }
    });

    return () => {
      unsubscribers.forEach((unsub) => unsub());
    };
  }, [selected_bets, subscribe]);

  // Handle odds changes for selected bets
  const handleOddsChangeForSelectedBets = (data: any, matchId: string) => {
    const markets = data.markets || data.odds?.markets || [];

    markets.forEach((market: any) => {
      const outcomes = market.outcomes || market.outcome || [];

      outcomes.forEach((outcome: any) => {
        // Find if this outcome is in our selected bets
        const selectedBet = selected_bets.find(
          (bet) =>
            String(bet.game?.matchID || bet.game?.match_id) === matchId &&
            bet.game?.outcome_id === outcome.id
        );

        if (selectedBet) {
          // Update the odds for this selected bet
          updateBetOdds({
            event_id: Number(
              selectedBet.game?.event_id ||
                selectedBet.game?.matchID ||
                selectedBet.game?.match_id
            ),
            outcome_id: outcome.id,
            new_odds: outcome.odds,
            status: market.status || 0,
            active: outcome.active ? 1 : 0,
          });

          // Show notification for odds change
          setOddsChangeNotifications((prev) => [
            ...prev.slice(-2),
            {
              id: Date.now(),
              matchId,
              outcomeName: outcome.name || selectedBet.game?.outcome_name,
              oldOdds: selectedBet.game?.odds,
              newOdds: outcome.odds,
              timestamp: new Date().toLocaleTimeString(),
            },
          ]);

          // Auto-remove notification after 5 seconds
          setTimeout(() => {
            setOddsChangeNotifications((prev) =>
              prev.filter((notif) => notif.id !== Date.now())
            );
          }, 5000);
        }
      });
    });
  };

  const fetchFixtureData = async (eventId: string) => {
    setIsFormLoading(true);
    console.log("Fetching fixture data for event ID:", eventId);
    try {
      const newQueryParams = {
        tournament_id: eventId,
        sport_id: "1",
        period: "all",
        markets: ["1", "10", "18"],
        specifier: "",
      };

      const result = await getFixture(newQueryParams);
    } catch (error) {
      console.error("Error fetching fixture:", error);
      setIsFormLoading(false);
    }
  };

  const handleCheckCoupon = async () => {
    if (!couponCode.trim()) {
      console.log("Please enter a coupon code");
      return;
    }

    try {
      const result = await findCoupon({
        betslipId: couponCode,
        clientId: getEnvironmentVariable(
          ENVIRONMENT_VARIABLES.CLIENT_ID
        ) as unknown as string,
      });
      console.log("Check coupon code:", result);
    } catch (error) {
      console.error("Error checking coupon:", error);
    }
  };

  const theme = "dark";

  // Ref for FixtureDisplay
  const fixtureDisplayRef = useRef<HTMLDivElement>(null);

  // Scroll to FixtureDisplay when fixtures appear
  useEffect(() => {
    if (cashdesk_fixtures.fixtures.length && fixtureDisplayRef.current) {
      fixtureDisplayRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  }, [cashdesk_fixtures.fixtures.length]);

  return (
    <div
      className={`px-4 pb-8 text-white h-[calc(100vh-100px)] overflow-y-auto relative ${cashdeskClasses["container-bg"]}`}
    >
      {/* <SportsMenu /> */}
      <main className=" relative">
        <div className="flex flex-col lg:flex-row gap-2">
          {/* Left: main content */}
          <section className="flex-1">
            {/* Event Details Form - Modern Betting Platform Design */}
            <div
              className={`${classes.sports_page["card-bg"]} border ${cashdeskClasses["card-border"]} rounded-md shadow-2xl overflow-hidden mb-1`}
            >
              {/* Header */}
              <div
                className={`${cashdeskClasses["header-text"]} ${cashdeskClasses["header-bg"]} px-4 py-3`}
              >
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                      <Grid size={12} className="" />
                    </div>
                    <h2 className=" font-bold text-sm">Quick Bet Entry</h2>
                  </div>
                  <div className="addFormflex items-center gap-2">
                    <button
                      onClick={addForm}
                      className={`${cashdeskClasses["add-button-bg"]} border ${cashdeskClasses["add-button-border"]} ${cashdeskClasses["add-button-hover"]} text-white text-xs font-medium px-3 py-1.5 rounded-full transition`}
                    >
                      Add Another
                    </button>
                  </div>
                </div>
                {isFormLoading && (
                  <div className="flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse"></div>
                    <span className="text-white text-xs">Loading...</span>
                  </div>
                )}
              </div>

              {/* Form Content */}
              <div className="">
                <div
                  className={`grid grid-cols-[repeat(13,minmax(0,1fr))] gap-3 px-2 py-1 ${cashdeskClasses["column-header-bg"]} border-b ${cashdeskClasses["column-header-border"]} mb-1`}
                >
                  {[
                    { id: "down", name: "" },
                    { id: "event_id", name: "Event Id" },
                    { id: "date", name: "Match Date" },
                    { id: "event", name: "Event " },
                    { id: "code", name: "Smart Code" },
                    { id: "odds", name: "Odds" },
                  ].map((item, index) => (
                    <div
                      key={index}
                      className={`${
                        item.id === "event"
                          ? "col-span-4"
                          : item.id === "odds" || item.id === "down"
                          ? "col-span-1"
                          : item.id === "code"
                          ? "col-span-3"
                          : "col-span-2"
                      } ${
                        cashdeskClasses["column-header-text"]
                      } text-[11px] font-semibold uppercase tracking-wide whitespace-nowrap `}
                    >
                      {item.name}
                    </div>
                  ))}
                </div>
                <div className="max-h-[65vh] overflow-y-auto">
                  {form_data.map((_formData, index) => (
                    <QuickBets
                      key={index}
                      formData={_formData}
                      total={form_data.length}
                      index={index}
                      is_empty_form={form_data.some((fd) => !fd.eventId)}
                    />
                  ))}
                </div>
              </div>
              <div>
                <div
                  className={`p-2 mt-1 ${cashdeskClasses["summary-section-bg"]} border-t-2 ${cashdeskClasses["card-border"]} border-b-0`}
                >
                  <div className="grid grid-cols-[2fr_1fr] gap-2">
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        {
                          label: "Total Selections",
                          value: selected_bets.length,
                        },
                        {
                          label: "Min Bonus",
                          value: "",
                        },
                        {
                          label: "Potential Win",
                          value: (
                            <CurrencyFormatter
                              amount={Number(potential_winnings)}
                              className=""
                              spanClassName=""
                            />
                          ),
                        },
                        {
                          label: "Total Odds",
                          value: total_odds.toFixed(2),
                        },
                        {
                          label: "Max Bonus",
                          value: "",
                        },
                        {
                          label: "Max Win",
                          value: (
                            <CurrencyFormatter
                              amount={Number(global_variables?.max_payout)}
                              className=""
                              spanClassName=""
                            />
                          ),
                        },
                      ].map((item, index) => (
                        <div
                          key={index}
                          className={`p-2 text-xs border ${cashdeskClasses["summary-item-border"]} rounded-md ${cashdeskClasses["summary-item-bg"]} flex flex-col justify-start items-start`}
                        >
                          <p
                            className={`${cashdeskClasses["summary-label-text"]} text-[10px]`}
                          >
                            {item.label}:
                          </p>
                          <p
                            className={`${cashdeskClasses["summary-value-text"]} font-medium`}
                          >
                            {item.value}
                          </p>
                        </div>
                      ))}
                    </div>
                    <div
                      className={`flex flex-col gap-2 ${classes["text-secondary"]} p-2 rounded-md`}
                    >
                      <Input
                        label="Total Stake"
                        value={String(stake || "")}
                        onChange={(e) => {
                          const v = Number(e.target.value || 0);
                          updateStake({ stake: Number.isNaN(v) ? 0 : v });
                        }}
                        tabIndex={3}
                        bg_color={cashdeskClasses["input-bg"]}
                        className={`w-full border ${cashdeskClasses["input-border"]} rounded-lg px-3 py-2 placeholder-slate-400 transition-all`}
                        // text_color="text-white"
                        // className="w-full rounded-lg text-white placeholder-slate-400 transition-all duration-200"]
                        text_color={cashdeskClasses["input-text"]}
                        placeholder="Enter stake amount"
                        name={""}
                        height={"h-[36px]"}
                        type="num_select"
                        num_select_placeholder={"NGN"}
                      />
                      <div className="grid grid-cols-2 gap-1">
                        <button
                          className={`p-2 ${classes["button-cancel-bg"]} ${classes["button-cancel-hover"]} ${classes["button-cancel-text"]} border  shadow-md  text-xs font-semibold rounded-md h-9 flex justify-center items-center ${classes["button-cancel-border"]}`}
                        >
                          Cancel
                        </button>
                        <button
                          className={`p-2 ${classes["button-proceed-bg"]} ${classes["button-proceed-hover"]} ${classes["button-proceed-border"]} ${classes["button-proceed-text"]} border   shadow-md  text-xs font-semibold rounded-md h-9 flex justify-center items-center`}
                        >
                          Proceed
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl border border-slate-700/50 shadow-2xl overflow-hidden">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-4 py-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-5 h-5 bg-white/20 rounded-lg flex items-center justify-center">
                      <Ticket size={12} className="text-white" />
                    </div>
                    <h2 className="text-white font-bold text-sm">
                      Betting Slip
                    </h2>
                    {selected_bets.length > 0 && (
                      <span className="bg-white/20 text-white text-[10px] font-semibold px-2 py-1 rounded-full">
                        {selected_bets.length} selection
                        {selected_bets.length !== 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                  <div className="text-white/80 text-xs font-medium">
                    Total Odds:{" "}
                    <span className="text-yellow-300 font-bold">
                      {selected_bets
                        .reduce(
                          (acc, bet) => acc * parseFloat(bet.game.odds || "1"),
                          1
                        )
                        .toFixed(2)}
                    </span>
                  </div>
                  <button
                    onClick={handleCancel}
                    className="bg-red-600/50 hover:bg-red-600/60 border border-red-500/50 text-red-300 px-3 py-1.5 rounded-full text-xs font-medium transition-all duration-200 hover:scale-105"
                  >
                    Clear All
                  </button>
                </div>
              </div>

              <div className={`${classes["bg-secondary"]} border-b ${classes.border}`}>
                <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-3 px-4 py-3">
                  <div className={`col-span-1 ${classes["text-secondary"]} text-xs font-semibold uppercase tracking-wider`}>
                    ID
                  </div>
                  <div className="col-span-4 text-slate-300 text-xs font-semibold uppercase tracking-wider">
                    Match
                  </div>
                  <div className="col-span-1 text-slate-300 text-xs font-semibold uppercase tracking-wider text-center">
                    Time
                  </div>
                  <div className="col-span-3 text-slate-300 text-xs font-semibold uppercase tracking-wider text-center">
                    Selection
                  </div>
                  <div className="col-span-1 text-slate-300 text-xs font-semibold uppercase tracking-wider text-center">
                    Odds
                  </div>
                  <div className="col-span-3 text-slate-300 text-xs font-semibold uppercase tracking-wider text-center">
                    Actions
                  </div>
                </div>
              </div>

              <div className="min-h-[300px]">
                {selected_bets.length === 0 ? (
                  <div className="py-16 flex flex-col items-center justify-center text-center">
                    <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mb-4">
                      <Ticket size={24} className="text-slate-400" />
                    </div>
                    <h3 className="text-slate-300 text-lg font-semibold mb-2">
                      Empty Betting Slip
                    </h3>
                    <p className="text-slate-500 text-sm mb-1">
                      No selections yet
                    </p>
                    <p className="text-slate-600 text-xs max-w-sm">
                      Add games to your betting slip by entering Event ID and
                      Smart Code above
                    </p>
                  </div>
                ) : (
                  <div className="max-h-[500px] overflow-y-auto">
                    {selected_bets.map((bet, index) => (
                      <div
                        key={`${bet.game_id}-${index}`}
                        className={`group hover:${classes["bg-tertiary"]} transition-all duration-200 border-b ${classes.border} last:border-b-0`}>
                      >
                        <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-3 p-2 items-center">
                          <div className="col-span-1">
                            <div className="w-10 p-1 h-8 bg-blue-600/20 rounded-lg flex items-center justify-center">
                              <span className="text-blue-400 text-xs font-bold">
                                {bet.game_id}
                              </span>
                            </div>
                          </div>

                          <div className="col-span-4">
                            <div
                              className="space-y-1"
                              title={bet.game.event_name}
                            >
                              <p className="text-white font-semibold text-xs leading-tight truncate">
                                {
                                  String(bet.game.event_name ?? "").split(
                                    "\n"
                                  )[0]
                                }
                              </p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400 bg-slate-700/50 px-2 py-1 rounded truncate">
                                  {bet.game.market_name || "Unknown Market"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-1 text-center h-full">
                            <div className="bg-slate-700/50 rounded-lg px-2 py-1 h-full flex items-center justify-center">
                              <span className="text-slate-300 text-base font-mono">
                                {bet.game.event_date
                                  ? AppHelper.formatMatchTime(
                                      new Date(bet.game.event_date)
                                    )
                                  : "--:--"}
                              </span>
                            </div>
                          </div>

                          <div className="col-span-3 text-center">
                            <div className="rounded-lg px-2 py-2 flex flex-col items-center">
                              <p className="text-green-300 font-bold text-xs truncate">
                                {bet.game.outcome_name}
                              </p>
                              <div className="flex items-center gap-1">
                                <span className="text-xs text-slate-400 border border-slate-600 bg-slate-700/50 px-2 py-1 rounded truncate font-bold">
                                  {bet.game.display_name || "Unknown Market"}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="col-span-1 text-center">
                            <div className=" rounded flex justify-center items-center h-10 w-10">
                              <span className="text-yellow-300 font-bold">
                                {bet.game.odds}
                              </span>
                            </div>
                          </div>

                          <div className="col-span-3">
                            <div className="flex items-center justify-center gap-2">
                              <button
                                title="Edit Selection"
                                onClick={() => handleUpdateSelectedBet(bet)}
                                className="group/btn w-10 h-10 bg-emerald-600/40 border border-emerald-600 text-emerald-500 hover:bg-emerald-500/50 rounded-lg flex items-center justify-center transition-all duration-200  active:scale-95"
                              >
                                <Edit3
                                  size={18}
                                  className="text-emerald-500 group-hover/btn:scale-110 transition-transform"
                                />
                              </button>

                              <button
                                title="Remove Selection"
                                onClick={() => handleRemoveSelectedBet(bet)}
                                className="group/btn w-10 h-10 bg-red-600/40 border border-red-600 text-red-500 hover:bg-red-500/50 rounded-md flex items-center justify-center transition-all duration-200  active:scale-95"
                              >
                                <Trash2
                                  size={18}
                                  className="text-red-600 group-hover/btn:scale-110 transition-transform"
                                />
                              </button>
                              <button
                                className="ml-2 px-2 py-1 rounded bg-gray-700 text-white hover:bg-blue-600 transition"
                                title="Preview"
                                onClick={() => {
                                  openModal({
                                    modal_name: MODAL_COMPONENTS.GAME_OPTIONS,
                                    ref: bet.game.event_id,
                                  });
                                }}
                              >
                                &#9654;
                              </button>
                            </div>
                          </div>
                        </div>

                        <div className="px-4 pb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <div className="flex items-center gap-4 text-xs text-slate-400">
                            <span>
                              Match ID:{" "}
                              {bet.game.matchID || bet.game.match_id || "N/A"}
                            </span>
                            <span>•</span>
                            <span>
                              Market: {bet.game.market_name || "Standard"}
                            </span>
                            <span>•</span>
                            <span className="text-green-400">
                              Potential Return:{" "}
                              {(
                                parseFloat(bet.game.odds || "1") * (stake || 0)
                              ).toFixed(2)}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div> */}
          </section>

          {/* Right sidebar - Betting Controls */}
        </div>

        {/* Modals */}
        {/* <InsufficientBalanceModal
          open={showInsufficientBalanceModal}
          {...modalData}
          onClose={() => setShowInsufficientBalanceModal(false)}
          onDeposit={handleDeposit}
        />
        <SuccessModal
          open={showSuccessModal}
          title={modalData.title}
          message={modalData.message}
          onClose={() => setShowSuccessModal(false)}
        /> */}
      </main>
      <main className="flex flex-col gap-4 mt-2">
        {cashdesk_fixtures.fixtures.length ? (
          <FixtureDisplay
            ref={fixtureDisplayRef}
            displayFixtures={cashdesk_fixtures.fixtures}
            selectedMarkets={cashdesk_fixtures.selectedMarket}
            sport_id={cashdesk_fixtures.sport_id}
            is_loading={cashdesk_fixtures.is_loading}
          />
        ) : null}
      </main>
    </div>
    // </LoadBetsLayout>
  );
};

export default LoadBetsPage;
