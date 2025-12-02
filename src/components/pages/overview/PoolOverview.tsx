"use client";
import React, { useCallback, useState, useEffect, useMemo } from "react";

import OddsButton from "@/components/buttons/OddsButton";
import { ChevronRight } from "lucide-react";
import { useSearchParams, useLocation, useParams } from "react-router-dom";
import { getClientTheme } from "@/config/theme.config";
import { MARKET_SECTION, DISPLAY_NAME_ENUM } from "@/data/enums/enum";
import { Outcome, Fixture } from "@/data/types/betting.types";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { useBetting } from "@/hooks/useBetting";
import { useModal } from "@/hooks/useModal";
import { usePrematchMqtt } from "@/hooks/useMqtt";
import {
  setSelectedGame,
  updateFixtureOutcome,
} from "@/store/features/slice/fixtures.slice";
import { LiveFixture } from "@/store/features/slice/live-games.slice";
import { MODAL_COMPONENTS } from "@/store/features/types";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import {
  useTopBetsQuery,
  useFixturesQuery,
  useSportsQuery,
  useSportsHighlightLiveQuery,
  usePoolFixturesQuery,
} from "@/store/services/bets.service";
import { PoolFixtures } from "@/store/services/types/responses";

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

export default function PoolOverviewScreen({
  sportId: propSportId,
}: OverviewScreenProps = {}) {
  function getWeekNumber(date: Date): number {
    const tempDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate())
    );
    const dayNum = tempDate.getUTCDay() || 7;
    tempDate.setUTCDate(tempDate.getUTCDate() + 4 - dayNum);
    const yearStart = new Date(Date.UTC(tempDate.getUTCFullYear(), 0, 1));
    return Math.ceil(
      ((tempDate.getTime() - yearStart.getTime()) / 86400000 + 1) / 7
    );
  }

  const { data: poolData } = usePoolFixturesQuery({
    week: getWeekNumber(new Date()),
    year: new Date().getFullYear(),
  });
  const { tournament_details } = useAppSelector((state) => state.app);
  const { app_refresh } = useAppSelector((state) => state.app);
  const dispatch = useAppDispatch();
  const { openModal } = useModal();
  const params = useParams();
  const sport_id = params.sport_id?.replace("sport_", "");

  const { classes } = getClientTheme();
  const sportsPageClasses = classes.sports_page;

  const { subscribeToPrematchOdds, subscribeToPrematchBetStop } =
    usePrematchMqtt();

  // Use betting hook
  const { selected_bets, toggleBet } = useBetting();

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

  // Refetch fixtures when app_refresh changes
  useEffect(() => {
    if (!tournament_details.query && refetch) {
      refetch();
    }
  }, [app_refresh, tournament_details.query, refetch]);

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

  const displayFixtures = poolData?.fixtures || [];
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
      className={`min-h-[calc(100vh-110px)] flex justify-center items-start text-white relative w-full ${sportsPageClasses["container-bg"]}`}
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
              className={`grid grid-cols-[repeat(10,minmax(0,1fr))] gap-1 px-6 py-1 text-xs font-semibold ${sportsPageClasses["header-text"]}`}
            >
              <div className="col-span-2">Time</div>
              <div className="col-span-6">Match</div>
              {selectedMarkets.map((market) => {
                // Only show the 'X' outcome in the header for each market
                const xOutcome = market.outcomes.find(
                  (outcome) =>
                    outcome.outcomeName === "X" || outcome.outcomeID === "X"
                );
                if (!xOutcome) return null;
                return (
                  <div
                    key={market.marketID}
                    className="col-span-2 flex items-center justify-center"
                  >
                    <span
                      key={xOutcome.outcomeID}
                      className="flex-1 flex justify-center items-center"
                    >
                      {xOutcome.outcomeName}
                    </span>
                  </div>
                );
              })}
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
                <p className={`${sportsPageClasses["empty-text"]}`}>
                  No pool games available
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
                      fixture.eventTime
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
                  {fixtures.map((fixture: PoolFixtures) => {
                    return (
                      <div
                        key={fixture.matchID}
                        className={`grid grid-cols-[repeat(10,minmax(0,1fr))] gap-1 p-2 ${sportsPageClasses["card-hover"]} transition-colors duration-200 cursor-pointer border-l-4 border-transparent`}
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
                            className={`text-xs flex flex-col font-medium ${sportsPageClasses["match-team-text"]}`}
                          >
                            <span className="font-semibold">
                              {fixture.homeTeam}
                            </span>
                            <span>vs</span>
                            <span className="font-semibold">
                              {fixture.awayTeam}
                            </span>
                          </div>
                        </div>

                        {/* Dynamic Market Outcomes */}
                        {selectedMarkets.map((marketConfig, marketIndex) => {
                          // Only show the 'X' outcome (draw) for each market
                          // Find the outcome with name 'X' or outcomeName 'X'
                          const xOutcomeConfig = marketConfig.outcomes.find(
                            (outcome) =>
                              outcome.outcomeName === "X" ||
                              outcome.outcomeID === "X"
                          );
                          if (!xOutcomeConfig) return null;
                          const marketOutcomes = getMarketOutcomes(fixture, {
                            ...marketConfig,
                            outcomes: [xOutcomeConfig],
                          });
                          const foundOutcome = marketOutcomes[0];
                          return (
                            <div
                              key={marketConfig.marketID}
                              className="col-span-2 flex items-center justify-center"
                            >
                              <OddsButton
                                key={`${marketConfig.marketID}-${xOutcomeConfig.outcomeID}`}
                                outcome={foundOutcome}
                                game_id={Number(fixture.gameID)}
                                fixture_data={fixture as PreMatchFixture}
                                height={"h-10"}
                                disabled={!foundOutcome}
                                rounded={"rounded-md"}
                              />
                            </div>
                          );
                        })}
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
