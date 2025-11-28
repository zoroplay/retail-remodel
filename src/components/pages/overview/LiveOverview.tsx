"use client";
import OddsButton from "@/components/buttons/OddsButton";
import SwitchInput from "@/components/inputs/SwitchInput";
import { getClientTheme } from "@/config/theme.config";
import { MARKET_SECTION } from "@/data/enums/enum";
import { Fixture } from "@/data/types/betting.types";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { useBetting } from "@/hooks/useBetting";
import { useLiveTimeIncrement } from "@/hooks/useLiveTimeIncrement";
import { useModal } from "@/hooks/useModal";
import { useLiveMqtt } from "@/hooks/useMqtt";
import { AppHelper } from "@/lib/helper";
import {
  setSelectedGame,
  updateFixtureOutcome,
} from "@/store/features/slice/fixtures.slice";
import {
  selectLiveFixtures,
  addLiveFixture,
  updateLiveFixtureOutcome,
  updateLiveFixture,
  LiveFixture,
} from "@/store/features/slice/live-games.slice";
import { MODAL_COMPONENTS } from "@/store/features/types";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import {
  useTopBetsQuery,
  useSportsQuery,
  useSportsHighlightLiveQuery,
} from "@/store/services/bets.service";
import { SportsHighlightFixture } from "@/store/services/data/betting.types";
import { ChevronRight } from "lucide-react";
import React, { useCallback, useState, useEffect, useMemo } from "react";
import { useSearchParams, useLocation, useParams } from "react-router-dom";

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

export default function LiveOverviewScreen({
  sportId: propSportId,
}: OverviewScreenProps = {}) {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const { tournament_details } = useAppSelector((state) => state.app);
  const { user } = useAppSelector((state) => state.user);
  const live_fixtures = useAppSelector(selectLiveFixtures);
  const dispatch = useAppDispatch();
  const { openModal } = useModal();
  const params = useParams();
  const sport_id = params.sport_id?.replace("sport_", "");
  const { classes } = getClientTheme();
  const sportsPageClasses = classes.sports_page;

  // State for selected sport filter
  const [selectedSport, setSelectedSport] = useState<string | null>(null);

  const { hasLiveGamesWithTime } = useLiveTimeIncrement(1000); //
  const {
    subscribeToLiveOdds,
    subscribeToLiveBetStop,
    subscribeToLiveFixtureChange,
  } = useLiveMqtt();
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

  // Get markets by sport from the live data response
  const marketsBySport = useMemo(() => {
    if (!liveData?.markets) return {};

    const grouped: Record<string, SelectedMarket[]> = {};

    liveData.markets.forEach((market) => {
      const sportId = String(market.sportID);
      const marketId = parseInt(market.marketID);

      // Only include 1X2 (marketID: 1) and Winner (marketID: 186) markets
      // Other markets can be accessed through the modal
      if (
        marketId === MARKET_SECTION.ONE_X_TWO ||
        marketId === MARKET_SECTION.TENNIS_WINNER
      ) {
        if (!grouped[sportId]) {
          grouped[sportId] = [];
        }

        grouped[sportId].push({
          marketID: market.marketID,
          marketName: market.marketName,
          specifier: market.specifier || "",
          outcomes: market.outcomes.map((outcome) => ({
            outcomeID: outcome.outcomeID,
            outcomeName: outcome.outcomeName || "",
          })),
        });
      }
    });

    // Limit each sport to only 2 markets since UI only handles 2 odds groups
    Object.keys(grouped).forEach((sportId) => {
      grouped[sportId] = grouped[sportId].slice(0, 2);
    });

    return grouped;
  }, [liveData?.markets]);

  // Fallback default markets if no markets from API
  const defaultMarkets: SelectedMarket[] = [
    {
      marketID: String(MARKET_SECTION.ONE_X_TWO),
      marketName: "1X2",
      specifier: "",
      outcomes: [
        { outcomeID: 1, outcomeName: "1" },
        { outcomeID: 2, outcomeName: "X" },
        { outcomeID: 3, outcomeName: "2" },
      ],
    },
  ];

  // Safe refetch helper for live games
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

  // Set up 1-minute polling for live games
  useEffect(() => {
    const pollingInterval = setInterval(() => {
      safeRefetchLive(); // Refetch live games
    }, 60000); // 1 minute

    // Cleanup interval on unmount
    return () => {
      clearInterval(pollingInterval);
    };
  }, [safeRefetchLive]);

  // Set up MQTT subscriptions for real-time updates
  useEffect(() => {
    // Subscribe to live odds changes
    const unsubscribeLiveOdds = subscribeToLiveOdds(handleLiveOddsChange);

    // Subscribe to live bet stops
    const unsubscribeLiveBetStop = subscribeToLiveBetStop(handleLiveBetStop);

    // Subscribe to live fixture changes
    const unsubscribeLiveFixtureChange = subscribeToLiveFixtureChange(
      handleLiveFixtureChange
    );

    // Cleanup subscriptions on unmount
    return () => {
      unsubscribeLiveOdds();
      unsubscribeLiveBetStop();
      unsubscribeLiveFixtureChange();
    };
  }, [
    subscribeToLiveOdds,
    subscribeToLiveBetStop,
    subscribeToLiveFixtureChange,
  ]);

  // Process live data when it comes in and store in slice
  useEffect(() => {
    if (liveData?.fixtures) {
      liveData.fixtures.forEach((liveFixture: SportsHighlightFixture) => {
        // Check if it's a valid time format for live games
        const cleanTime = AppHelper.extractCleanTime(liveFixture.eventTime);
        if (AppHelper.isValidLiveTime(cleanTime)) {
          // Store in live games slice for time increment
          dispatch(
            addLiveFixture({
              ...liveFixture,
              event_type: "live" as const,
              status: 0,
              eventTime: AppHelper.createLiveTimeString(cleanTime, true),
              competitor1: "",
              competitor2: "",
              outcomes: liveFixture.outcomes.map((outcome) => ({
                ...outcome,
                marketId: outcome.marketID || outcome.marketId,
                marketName: "", // SportsHighlightOutcome doesn't have marketName
                displayName: outcome.displayName || outcome.outcomeName, // Ensure displayName is always present
                active:
                  typeof outcome.active === "boolean"
                    ? outcome.active
                      ? 1
                      : 0
                    : outcome.active,
              })),
            })
          );
        }
      });
    }
  }, [liveData, dispatch]);

  // Only display live fixtures
  const displayFixtures = live_fixtures;
  const isLoading = liveLoading;

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

  const handleLiveOddsChange = (data: any) => {
    const matchId = data.event_id || data.match_id;
    if (!matchId) return;

    const markets = data.markets || data.odds?.markets || [];
    markets.forEach((market: any) => {
      const outcomes = market.outcomes || market.outcome || [];
      outcomes.forEach((outcome: any) => {
        dispatch(
          updateLiveFixtureOutcome({
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

  const handleLiveBetStop = (data: any) => {
    const matchId = data.event_id || data.match_id;
    if (!matchId) return;

    dispatch(
      updateLiveFixture({
        matchID: matchId.toString(),
        matchStatus: "1", // Suspended
      })
    );
  };

  const handleLiveFixtureChange = (data: any) => {
    const matchId = data.event_id || data.match_id;
    if (!matchId || !data.sport_event_status) return;

    const matchStatus = data.sport_event_status.match_status || 0;
    const homeScore = data.sport_event_status.home_score || 0;
    const awayScore = data.sport_event_status.away_score || 0;

    dispatch(
      updateLiveFixture({
        matchID: matchId.toString(),
        homeScore: String(homeScore),
        awayScore: String(awayScore),
        matchStatus: String(matchStatus),
      })
    );
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

    // For prematch, we can update the fixture status
    // You might want to add a similar action to the fixtures slice
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
                      {defaultMarkets.map((market: SelectedMarket) => (
                        <div
                          key={market.marketID}
                          className="col-span-4 flex items-center justify-center gap-1"
                        >
                          {market.outcomes.map((outcome: MarketOutcome) => (
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

          {liveError && (
            <div className="flex-1 justify-center items-center py-8">
              <p className={`${sportsPageClasses["error-text"]} text-lg`}>
                Error loading live games
              </p>
              <p
                className={`${sportsPageClasses["error-secondary"]} text-sm mt-2`}
              >
                {typeof liveError === "object" && "message" in liveError
                  ? (liveError as any).message
                  : "Please try again"}
              </p>
            </div>
          )}

          {!isLoading &&
            !is_top_bets_loading &&
            displayFixtures.length === 0 && (
              <div className={`flex-1 justify-center items-center p-4`}>
                <p className={`${sportsPageClasses["empty-text"]} text-lg`}>
                  No live games available
                </p>
                <p
                  className={`${sportsPageClasses["empty-secondary"]} text-sm mt-2`}
                >
                  Live data:{" "}
                  {liveData
                    ? `${liveData.fixtures?.length || 0} fixtures`
                    : "No data"}
                </p>
              </div>
            )}

          {!isLoading && !is_top_bets_loading && displayFixtures.length > 0 && (
            <div
              className={`${sportsPageClasses["header-bg"]} border-b ${sportsPageClasses["header-border"]} flex gap-2 flex-wrap`}
            >
              <SwitchInput
                options={[
                  { title: "all Sports" },
                  ...Array.from(
                    new Set(displayFixtures.map((f) => f.sportName))
                  ).map((sportName) => ({ title: sportName })),
                ]}
                selected={
                  Array.from(
                    new Set(displayFixtures.map((f) => f.sportName))
                  ).findIndex((f, _) => f === selectedSport) + 1
                }
                onChange={(i) => {
                  const sport =
                    Array.from(
                      new Set(displayFixtures.map((f) => f.sportName))
                    ).find((_, f) => f === i - 1) ?? 0;
                  setSelectedSport(sport || null);
                }}
                rounded="rounded-md"
                background={`${classes.betslip["tab-bg"]} ${classes.betslip["tab-border"]} !p-[1px] border shadow-sm`}
                thumb_background={`${classes.betslip["tab-bg"]}`}
                thumb_color={`${classes.betslip["tab-active-bg"]} ${classes.betslip["tab-active-text"]} transition-all duration-300`}
                text_color={`${classes.betslip["tab-inactive-text"]} !text-[11px] font-medium`}
                selected_text_color={`${classes.betslip["tab-active-text"]} !text-[11px] font-medium`}
              />
            </div>
          )}

          {!isLoading && !is_top_bets_loading && displayFixtures.length > 0 && (
            <div className="max-h-[80vh] overflow-y-auto overflow-x-hidden space-y-6">
              {Object.entries(
                displayFixtures
                  .filter(
                    (fixture) =>
                      !selectedSport || fixture.sportName === selectedSport
                  )
                  .reduce(
                    (
                      groups: Record<
                        string,
                        Record<string, typeof displayFixtures>
                      >,
                      fixture
                    ) => {
                      // Group by sport first, then by tournament
                      const sportKey = fixture.sportName;
                      const tournamentKey = `${fixture.tournament} - ${fixture.categoryName}`;

                      if (!groups[sportKey]) {
                        groups[sportKey] = {};
                      }
                      if (!groups[sportKey][tournamentKey]) {
                        groups[sportKey][tournamentKey] = [];
                      }
                      groups[sportKey][tournamentKey].push(fixture);
                      return groups;
                    },
                    {}
                  )
              ).map(([sportName, tournaments]) => (
                <div key={sportName}>
                  {/* Sport Header */}
                  <div
                    className={`${sportsPageClasses["sport-separator-bg"]} px-4 py-2 border-b ${sportsPageClasses["sport-separator-border"]}`}
                  >
                    <h2
                      className={`${sportsPageClasses["sport-separator-text"]} font-bold text-xs uppercase tracking-wide`}
                    >
                      {sportName}
                    </h2>
                  </div>

                  {/* Table for this sport */}
                  <div
                    className={`${sportsPageClasses["card-bg"]} border ${sportsPageClasses["card-border"]} shadow-2xl overflow-hidden `}
                  >
                    {(() => {
                      // Get the first fixture to determine sport ID for this group
                      const firstFixture = Object.values(tournaments)[0]?.[0];
                      const sportIdForMarkets = firstFixture?.sportID;

                      // Get markets for this specific sport, fallback to default
                      const sportMarkets =
                        sportIdForMarkets && marketsBySport[sportIdForMarkets]
                          ? marketsBySport[sportIdForMarkets]
                          : defaultMarkets;

                      return (
                        <>
                          {/* Table Header */}
                          <div
                            className={`${sportsPageClasses["header-bg"]} border-b ${sportsPageClasses["header-border"]}`}
                          >
                            <div
                              className={`grid grid-cols-[repeat(17,minmax(0,1fr))] gap-1 px-6 py-1 text-xs font-semibold ${sportsPageClasses["header-text"]}`}
                            >
                              <div className="col-span-2">Time</div>
                              <div className="col-span-6">Match</div>
                              {sportMarkets.map((market, index) => (
                                <div
                                  key={market.marketID}
                                  className="col-span-8 flex items-center justify-between "
                                >
                                  {market.outcomes.map(
                                    (outcome, outcomeIndex) => (
                                      <span
                                        key={outcome.outcomeID}
                                        className="w-1/3 flex justify-center truncate items-center"
                                      >
                                        {outcome.outcomeName}
                                      </span>
                                    )
                                  )}
                                </div>
                              ))}
                              <div className="col-span-1 text-center">+</div>
                            </div>
                          </div>

                          {/* Tournaments and Games for this sport */}
                          <div className="divide-y divide-gray-700">
                            {Object.entries(tournaments).map(
                              ([tournamentName, fixtures]) => (
                                <div key={tournamentName}>
                                  {/* Tournament Separator */}
                                  <div
                                    className={`${sportsPageClasses["date-separator-bg"]} px-6 py-1 border-b ${sportsPageClasses["date-separator-border"]}`}
                                  >
                                    <h3
                                      className={`${sportsPageClasses["date-separator-text"]} font-medium text-xs uppercase tracking-wide`}
                                    >
                                      {tournamentName}
                                    </h3>
                                  </div>

                                  {/* Games for this date */}
                                  {fixtures.map(
                                    (fixture: LiveFixture | Fixture) => {
                                      return (
                                        <div
                                          key={fixture.matchID}
                                          className={`relative grid grid-cols-[repeat(17,minmax(0,1fr))] gap-1 p-2 ${sportsPageClasses["card-hover"]} transition-colors duration-200 border-r-4 border-transparent cursor-pointer pr-4`}
                                        >
                                          {/* Slanted left border accent */}
                                          <div
                                            className={`absolute left-0 top-0 bottom-0 w-3 ${sportsPageClasses["live-game-indicator"]} `}
                                            style={{
                                              clipPath:
                                                "polygon(0% 0%, 100% 0%, 50% 80%, 0% 100%)",
                                            }}
                                          ></div>
                                          {/* Time */}
                                          <div
                                            className={`col-span-2 ${sportsPageClasses["time-border"]} border-r flex flex-col items-start justify-center pl-2`}
                                          >
                                            <span
                                              className={`text-[11px] font-semibold ${sportsPageClasses["time-text-live"]}`}
                                            >
                                              {fixture.eventTime}
                                            </span>
                                            <span
                                              className={`text-xs ${sportsPageClasses["time-text-live"]}`}
                                            >
                                              {fixture.matchStatus}
                                            </span>
                                          </div>

                                          {/* Match Info */}
                                          <div className="col-span-5 flex flex-col justify-center">
                                            <div
                                              className={`text-[11px] flex flex-col font-semibold ${sportsPageClasses["match-team-text"]}`}
                                            >
                                              <span>{fixture.homeTeam}</span>
                                              <span className="">vs</span>
                                              <span>{fixture.awayTeam}</span>
                                            </div>
                                          </div>
                                          <div className="flex items-center flex-col">
                                            <span
                                              className={`${sportsPageClasses["score-text"]} font-bold text-xs`}
                                            >
                                              {fixture.homeScore || "0"}
                                            </span>
                                            <span
                                              className={`${sportsPageClasses["match-tournament-text"]} text-xs`}
                                            >
                                              -
                                            </span>
                                            <span
                                              className={`${sportsPageClasses["score-text"]} font-bold text-xs`}
                                            >
                                              {fixture.awayScore || "0"}
                                            </span>
                                          </div>

                                          {/* Dynamic Market Outcomes */}
                                          {sportMarkets.map(
                                            (marketConfig, marketIndex) => {
                                              const marketOutcomes =
                                                getMarketOutcomes(
                                                  fixture,
                                                  marketConfig
                                                );

                                              return (
                                                <div
                                                  key={marketConfig.marketID}
                                                  className="col-span-8 flex items-center justify-center"
                                                >
                                                  {marketConfig.outcomes.map(
                                                    (
                                                      expectedOutcome,
                                                      outcomeIndex
                                                    ) => {
                                                      const foundOutcome =
                                                        marketOutcomes.find(
                                                          (outcome: any) =>
                                                            outcome?.outcomeID.toString() ===
                                                            expectedOutcome.outcomeID.toString()
                                                        );

                                                      const isFirst =
                                                        outcomeIndex === 0;
                                                      const isLast =
                                                        outcomeIndex ===
                                                        marketConfig.outcomes
                                                          .length -
                                                          1;
                                                      let rounded = "";
                                                      if (isFirst)
                                                        rounded =
                                                          "rounded-l-md";
                                                      else if (isLast)
                                                        rounded =
                                                          "rounded-r-md";

                                                      return (
                                                        <OddsButton
                                                          key={`${marketConfig.marketID}-${expectedOutcome.outcomeID}`}
                                                          outcome={
                                                            foundOutcome!
                                                          }
                                                          game_id={Number(
                                                            fixture.gameID
                                                          )}
                                                          fixture_data={
                                                            fixture as PreMatchFixture
                                                          }
                                                          height={"h-10"}
                                                          disabled={
                                                            !foundOutcome
                                                          }
                                                          rounded={rounded}
                                                        />
                                                      );
                                                    }
                                                  )}
                                                </div>
                                              );
                                            }
                                          )}

                                          <div className="col-span-1 ml-2 px-2 flex items-center justify-center relative">
                                            <div
                                              onClick={(e) => {
                                                e.stopPropagation();
                                                handleMorePress(
                                                  fixture as PreMatchFixture
                                                );
                                              }}
                                              className={`text-[10px] flex justify-center items-center h-10 rounded-md w-12 p-1   ${
                                                classes.game_options_modal[
                                                  "odds-button-hover"
                                                ]
                                              } shadow font-semibold transition-colors border-2 ${
                                                selected_bets.some(
                                                  (bet) =>
                                                    bet.game &&
                                                    (bet.game.matchID ==
                                                      Number(fixture.matchID) ||
                                                      bet.game.game_id ==
                                                        Number(fixture.gameID))
                                                )
                                                  ? `${classes.game_options_modal["odds-button-selected-bg"]}   ${classes.game_options_modal["odds-button-selected-text"]} ${classes.game_options_modal["odds-button-selected-border"]}`
                                                  : `${classes.game_options_modal["odds-button-border"]} ${classes.game_options_modal["odds-button-bg"]} ${classes.game_options_modal["odds-button-text"]}`
                                              }`}
                                            >
                                              <span>
                                                +{fixture.activeMarkets || 0}
                                              </span>
                                              <ChevronRight size={12} />
                                            </div>
                                          </div>
                                        </div>
                                      );
                                    }
                                  )}
                                </div>
                              )
                            )}
                          </div>
                        </>
                      );
                    })()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
    // </MainLayout>
  );
}
