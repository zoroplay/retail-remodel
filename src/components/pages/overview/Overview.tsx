"use client";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import {
  addLiveFixture,
  LiveFixture,
  selectLiveFixtures,
  updateLiveFixture,
  updateLiveFixtureOutcome,
} from "../../../store/features/slice/live-games.slice";
import { useModal } from "../../../hooks/useModal";
import { useLiveTimeIncrement } from "../../../hooks/useLiveTimeIncrement";
import { useLiveMqtt, usePrematchMqtt } from "../../../hooks/useMqtt";
import { useBetting } from "../../../hooks/useBetting";
import { getClientTheme } from "../../../config/theme.config";
import {
  useFixturesQuery,
  useSportsHighlightLiveQuery,
  useSportsQuery,
  useTopBetsQuery,
} from "../../../store/services/bets.service";
import { AppHelper } from "../../../lib/helper";
import { SportsHighlightFixture } from "../../../store/services/data/betting.types";
import { PreMatchFixture } from "../../../store/features/types/fixtures.types";
import {
  setSelectedGame,
  updateFixtureOutcome,
} from "../../../store/features/slice/fixtures.slice";
import { MODAL_COMPONENTS } from "../../../store/features/types";
import {
  DISPLAY_NAME_ENUM,
  MARKET_NAME_ENUM,
  MARKET_SECTION,
} from "../../../data/enums/enum";
import { Fixture, Outcome } from "../../../data/types/betting.types";
import MainLayout from "../../layouts/MainLayout";
import NavigationBar from "../../layouts/NavigationBar";
import DataTable from "../../inputs/DataTable";
import Button from "../../buttons/Button";
import GameButton from "../../inputs/GameButton";
import SportsMenu from "@/components/layouts/sidebars/SportsMenu";
import OddsButton from "@/components/buttons/OddsButton";
import BetSlip from "@/components/bets/bet-slip/BetSlip";
import { ChevronRight } from "lucide-react";
import { useSearchParams, useLocation, useParams } from "react-router-dom";
import { parseSportIdFromRoute } from "@/data/routes/routeUtils";

interface OverviewScreenProps {
  sportId?: string;
}

interface MarketOutcome {
  outcomeID: number;
  outcomeName: string;
}

interface SelectedMarket {
  marketID: string;
  marketName: string;
  specifier: string;
  outcomes: MarketOutcome[];
}

export default function OverviewScreen({
  sportId: propSportId,
}: OverviewScreenProps = {}) {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  // Dynamic market configuration based on selected markets
  // This should ideally come from API response or props
  //
  // Example configurations:
  // 1. Only 1X2: [{ marketID: "1", marketName: "1X2", ... }]
  // 2. Only Double Chance: [{ marketID: "10", marketName: "Double Chance", ... }]
  // 3. 1X2 + Over/Under: [1X2_config, over_under_config]
  // 4. Any combination based on selectedMarkets from API

  // Use prop sportId if provided, otherwise parse from route/search params
  const { tournament_details } = useAppSelector((state) => state.app);
  const { user } = useAppSelector((state) => state.user);
  const { fixtures = [] } = useAppSelector((state) => state.fixtures);
  const dispatch = useAppDispatch();
  const { openModal } = useModal();
  const params = useParams();
  const sport_id = params.sport_id?.replace("sport_", "");

  const { classes } = getClientTheme();
  const sportsPageClasses = classes.sports_page;

  const { subscribeToPrematchOdds, subscribeToPrematchBetStop } =
    usePrematchMqtt();

  // Use betting hook
  const {
    selected_bets,
    total_odds,
    potential_winnings,
    stake,
    toggleBet,
    checkBetSelected,
    getGameBetCount,
    hasGameBets,
  } = useBetting();

  const { data: data_to_bets, isLoading: is_top_bets_loading } =
    useTopBetsQuery();
  const top_bets = Array.isArray(data_to_bets?.data) ? data_to_bets.data : [];
  const top_bet = top_bets.find(
    (bet) => bet?.sportName.toLowerCase() === "soccer"
  );
  const tournamentId = useMemo(
    () =>
      String(
        !sport_id
          ? top_bet?.tournamentID
          : tournament_details?.tournament_id || top_bet?.tournamentID || ""
      ),
    [tournament_details?.tournament_id, top_bet?.tournamentID]
  );

  const sportId = useMemo(
    () =>
      String(
        !sport_id
          ? top_bet?.sportID
          : tournament_details?.sport_id ?? top_bet?.sportID ?? ""
      ),
    [tournament_details?.sport_id, top_bet?.sportID]
  );

  const {
    data: fixturesData,
    isLoading: fixturesLoading,
    refetch,
    status: fixturesStatus,
  } = useFixturesQuery(
    {
      tournament_id: tournamentId,
      sport_id: sportId,
      period: "all",
      markets: [
        String(MARKET_SECTION.ONE_X_TWO),
        String(MARKET_SECTION.DOUBLE_CHANCE),
        String(MARKET_SECTION.OVER_UNDER),
        String(MARKET_SECTION.TENNIS_WINNER),
        String(MARKET_SECTION.NFL_ONE_X_TWO),
        String(MARKET_SECTION.NFL_HSH),
      ],
      specifier: "",
    },
    {
      skip: !!tournament_details.query,
    }
  );
  const {
    data: sports_data,
    // isLoading: fixturesLoading,
    // refetch,
    // status: fixturesStatus,
  } = useSportsQuery(
    {
      sport_id: String(sport_id ?? 1),
    },
    {
      skip: !!tournament_details.query,
    }
  );
  // Filter selected markets based on sport ID
  let selectedMarkets: SelectedMarket[] = Array.isArray(
    fixturesData?.selectedMarket
  )
    ? fixturesData.selectedMarket
    : [];

  // For soccer (sportID 1), only show 1X2 and Double Chance markets
  if ((sport_id || 1) == "1") {
    selectedMarkets = selectedMarkets.filter(
      (market) =>
        market.marketID === String(MARKET_SECTION.ONE_X_TWO) || // 1X2
        market.marketID === String(MARKET_SECTION.DOUBLE_CHANCE) // Double Chance
    );
  }

  // Live sports highlight query
  const {
    data: liveData,
    isLoading: liveLoading,
    error: liveError,
    refetch: liveRefetch,
    status: liveStatus,
  } = useSportsHighlightLiveQuery(
    {
      sport_id: "0", // 0 for all sports
      markets: "1,10,18", // 1X2, DC, Over/Under markets
    },
    {
      skip: !!tournament_details.query,
    }
  );

  // Safe refetch helpers
  const safeRefetchFixtures = useCallback(() => {
    if (
      !tournament_details.query &&
      fixturesStatus !== "uninitialized" &&
      refetch
    ) {
      try {
        return refetch();
      } catch (error) {
        console.warn("Failed to refetch fixtures:", error);
      }
    }
  }, [tournament_details.query, fixturesStatus, refetch]);

  const safeRefetchLive = useCallback(() => {
    if (
      !tournament_details.query &&
      liveStatus !== "uninitialized" &&
      liveRefetch
    ) {
      try {
        return liveRefetch();
      } catch (error) {
        console.warn("Failed to refetch live games:", error);
      }
    }
  }, [tournament_details.query, liveStatus, liveRefetch]);

  useEffect(() => {
    // Refetch fixtures when tournament changes
    if (tournament_details.tournament_id) {
      safeRefetchFixtures();
    }
  }, [tournament_details.tournament_id]);

  // Set up 1-minute polling for both live and pre-match games
  // useEffect(() => {
  //   const pollingInterval = setInterval(() => {
  //     safeRefetchFixtures(); // Refetch pre-match games
  //     safeRefetchLive(); // Refetch live games
  //   }, 60000); // 1 minute

  //   // Cleanup interval on unmount
  //   return () => {
  //     clearInterval(pollingInterval);
  //   };
  // }, [safeRefetchFixtures, safeRefetchLive]);

  // Set up MQTT subscriptions for real-time updates
  useEffect(() => {
    const unsubscribePrematchOdds = subscribeToPrematchOdds(
      handlePrematchOddsChange
    );
    const unsubscribePrematchBetStop = subscribeToPrematchBetStop(
      handlePrematchBetStop
    );
    return () => {
      unsubscribePrematchOdds();
      unsubscribePrematchBetStop();
    };
  }, [subscribeToPrematchOdds, subscribeToPrematchBetStop]);

  const displayFixtures = fixtures;
  const isLoading = fixturesLoading;

  // Helper function to get outcomes for a specific market from a fixture
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
      dispatch(setSelectedGame(game));
      openModal({
        modal_name: MODAL_COMPONENTS.GAME_OPTIONS,
        title: "Menu",
        ref: game.gameID,
      });
    },
    [openModal]
  );

  const handleOddsPress = ({
    game_id,
    odds_type,
    odds_value,
  }: {
    game_id: string;
    odds_type: DISPLAY_NAME_ENUM;
    odds_value: number;
  }) => {
    const game = displayFixtures.find((g) => g.matchID === game_id);
    if (!game) return;
    const outcome = game.outcomes.find((o) => o.displayName === odds_type);
    toggleBet({
      fixture_data: game as PreMatchFixture | LiveFixture,
      outcome_data: outcome! as Outcome,
      element_id: game_id,
      bet_type: "Single",
      global_vars: {},
      bonus_list: [],
    });
  };

  const handlePrematchOddsChange = (data: any) => {
    const matchId = data.event_id || data.match_id;
    if (!matchId) return;

    const markets = data.markets || data.odds?.markets || [];
    markets.forEach((market: any) => {
      const outcomes = market.outcomes || market.outcome || [];
      outcomes.forEach((outcome: any) => {
        dispatch(
          updateFixtureOutcome({
            matchID: matchId.toString(),
            outcomeID: outcome.id,
            updates: {
              odds: outcome.odds,
              active:
                typeof outcome.active === "boolean"
                  ? outcome.active
                    ? 1
                    : 0
                  : outcome.active || 0,
              status: market.status || 0,
            },
          })
        );
      });
    });
  };

  const handlePrematchBetStop = (data: any) => {
    const matchId = data.event_id || data.match_id;
    if (!matchId) return;
  };

  return (
    <div
      className={`min-h-[calc(100vh-140px)] flex justify-center items-start text-white relative w-full ${sportsPageClasses["container-bg"]}`}
    >
      <div className="h-full p-1 w-full">
        {/* Unified Table Structure */}
        <div
          className={`${sportsPageClasses["card-bg"]} border ${sportsPageClasses["card-border"]} shadow-2xl overflow-hidden rounded-lg`}
        >
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
          </div>

          {(isLoading || is_top_bets_loading) && (
            <div
              className={`divide-y ${sportsPageClasses["card-border"]} max-h-[84vh] overflow-y-auto `}
            >
              {[...Array(3)].map((_, groupIndex) => (
                <div key={groupIndex}>
                  <div
                    className={`${sportsPageClasses["date-separator-bg"]} px-6 py-1 border-b ${sportsPageClasses["date-separator-border"]}`}
                  >
                    <div
                      className={`h-4 ${sportsPageClasses["skeleton-secondary"]} rounded animate-pulse w-32`}
                    ></div>
                  </div>
                  {[...Array(4)].map((_, gameIndex) => (
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

          {!isLoading &&
            !is_top_bets_loading &&
            displayFixtures.length === 0 && (
              <div className={`flex-1 justify-center items-center p-4`}>
                <p className={`${sportsPageClasses["empty-text"]} text-lg`}>
                  No Prematch games available
                </p>
              </div>
            )}

          {/* Games grouped by date */}
          {!isLoading && !is_top_bets_loading && displayFixtures.length > 0 && (
            <div className="divide-y divide-gray-700 max-h-[85vh] overflow-y-auto overflow-x-hidden">
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

                        <div className="col-span-1 ml-2 px-2 flex items-center justify-center">
                          <div
                            onClick={(e) => {
                              e.stopPropagation();
                              handleMorePress(fixture as PreMatchFixture);
                            }}
                            className={`text-[10px] flex justify-center items-center h-10 rounded-md w-14 p-1 ${sportsPageClasses["more-button-text"]} ${sportsPageClasses["more-button-border"]} ${sportsPageClasses["more-button-hover"]} transition-colors border`}
                          >
                            <span>+{fixture.activeMarkets || 0}</span>
                            <ChevronRight size={14} />
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
      </div>
    </div>
  );
}
