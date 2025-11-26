"use client";
import React, { useEffect, useState } from "react";
import SideOverlay from "../SideOverlay";
import { useAppDispatch, useAppSelector } from "../../../hooks/useAppDispatch";
import { useBetting } from "../../../hooks/useBetting";
import { useGetFixtureQuery } from "@/store/services/bets.service";
import { Outcome } from "@/data/types/betting.types";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import OddsButton from "@/components/buttons/OddsButton";
import {
  CombinationMarket,
  HandicapMarket,
  MainCard,
} from "@/components/bets/sections";
import AnytimeGoalscorer from "@/components/bets/sections/AnytimeGoalscorer";
import HalfTimeFullTimeScore from "@/components/bets/sections/HalfTimeFullTimeScore";
import OverUnder from "@/components/bets/sections/OverUnder";
import BasketballOverUnder from "@/components/bets/sections/BasketballOverUnder";
import { MARKET_SECTION } from "@/data/enums/enum";
import ExactGoals from "@/components/bets/sections/ExactGoals";
import { SkeletonTitle } from "@/components/skeletons/OutComesSkeleton";
import { getClientTheme } from "@/config/theme.config";

export const groupLiveSports = (data: PreMatchFixture[] | PreMatchFixture) => {
  // Handle both single fixture object and array of outcomes
  if (data && !Array.isArray(data)) {
    // Single fixture data
    return [
      {
        sport_id: data.sportID,
        sport_name: data.sportName,
        category: data.categoryName,
        Id: data.gameID || data.matchID,
        Name: data.tournament,
        Events: [data],
      },
    ];
  }

  // Array of outcomes (original logic)
  data = Array.isArray(data) ? data : [];
  const ArrKeyHolder: {
    sport_id: number;
    sport_name: string;
    category: string;
    tournament_id: number;
    name: string;
    events: any[];
  }[] = [];
  const Arr: {
    sport_id: number;
    sport_name: string;
    category: string;
    tournament_id: number;
    name: string;
    events: any[];
  }[] = [];
  data.forEach(function (item) {
    ArrKeyHolder[item.tournamentID] = ArrKeyHolder[item.tournamentID] || {};
    let obj = ArrKeyHolder[item.tournamentID];

    if (Object.keys(obj).length === 0) Arr.push(obj);

    obj.sport_id = Number(item.sportID);
    obj.sport_name = item.sportName;
    obj.category = item.categoryName;
    obj.tournament_id = item.tournamentID;
    obj.name = item.tournament;
    obj.events = obj.events || [];

    obj.events.push(item);
  });
  return Arr;
};

type Props = {
  onClose: () => void;
  eventId?: string;
};

const GameOptionsModal: React.FC<Props> = ({ onClose }) => {
  const dispatch = useAppDispatch();
  const { toggleBet } = useBetting();
  const { selectedGame } = useAppSelector((state) => state.fixtures);
  const theme = getClientTheme();
  const modalClasses = theme.classes.game_options_modal;
  const searchParams = new URLSearchParams(window.location.search);
  const ref = searchParams.get("ref");
  const {
    data: fixturesData,
    isSuccess,
    isLoading: isFixtureLoading,
    error,
    refetch: refetchFixtures,
    isError,
  } = useGetFixtureQuery(
    {
      tournament_id: ref || "",
      sport_id: "1",
      period: "all",
      markets: ["1", "10", "18"],
      specifier: "",
    },
    { skip: !ref }
  );

  const [fixture_data, setFixtureData] = useState<PreMatchFixture | null>(
    !ref ? selectedGame : null
  );
  const fetchFixtureData = async (eventId: string) => {
    // setIsFormLoading(true);
    try {
      const newQueryParams = {
        tournament_id: eventId,
        sport_id: "1",
        period: "all",
        markets: ["1", "10", "18"],
        specifier: "",
      };

      // await getFixture(newQueryParams);
    } catch (error) {
      console.error("Error fetching fixture:", error);
      // setIsFormLoading(false);
    }
  };
  // console.log("selectedGame in GameOptionsModal:", selectedGame);
  useEffect(() => {
    if (ref) {
      refetchFixtures();
    }
  }, [ref]);
  useEffect(() => {
    if (isSuccess) {
      setFixtureData(fixturesData as unknown as PreMatchFixture);
    }
  }, [isSuccess]);

  const renderOddsButton = ({
    outcome,
    disabled,
  }: {
    outcome: Outcome & { hasChange?: "up" | "down" };
    disabled?: boolean;
  }) => {
    return (
      <OddsButton
        key={outcome?.outcomeID}
        outcome={outcome}
        game_id={fixture_data?.gameID as unknown as number}
        fixture_data={fixture_data as PreMatchFixture}
        show_display_name={true}
        bg_color={"bg-white text-black"}
        height="h-12"
        disabled={disabled}
      />
    );
  };

  // Pattern-based market type detection (data-driven, not hardcoded IDs)
  const detectMarketType = (
    marketName: string,
    specifier: string,
    outcomes: any[]
  ): string => {
    const name = marketName.toLowerCase().trim();
    const spec = specifier?.toLowerCase().trim() || "";

    // Check for quarter-based 1X2 markets (e.g., "1st quarter - 1x2" with specifier "quarternr=1")
    // These should be grouped together and rendered as combination markets
    // Important: Only detect as QUARTER_1X2 if it's actually a 1X2 market, not over/under
    if (
      spec.includes("quarternr=") &&
      name.includes("quarter") &&
      name.includes("1x2")
    ) {
      return "QUARTER_1X2";
    }

    // 1X2 detection (always first)
    if (name === "1x2" || name.includes("match result")) {
      return "1X2";
    }

    // Double Chance detection (always second)
    if (name.includes("double chance") || name.includes("dc")) {
      return "DOUBLE_CHANCE";
    }

    // Draw No Bet detection
    if (name.includes("draw no bet") || name.includes("dnb")) {
      return "DNB";
    }

    // Home Total detection
    if (name.includes("home total") || name === "home total") {
      return "HOME_TOTAL";
    }

    // Away Total detection
    if (name.includes("away total") || name === "away total") {
      return "AWAY_TOTAL";
    }

    // Over/Under detection - general totals
    if (
      name.includes("over/under") ||
      name.includes("o/u") ||
      (name.includes("total") &&
        !name.includes("home") &&
        !name.includes("away")) ||
      spec.includes("total=") ||
      (outcomes.some((o) => o.outcomeName?.toLowerCase().includes("over")) &&
        outcomes.some((o) => o.outcomeName?.toLowerCase().includes("under")))
    ) {
      return "OVER_UNDER";
    }

    // Handicap detection (specifier like hcp=X:Y)
    if (
      name.includes("handicap") ||
      spec.includes("hcp=") ||
      outcomes.some((o) => o.outcomeName?.includes("("))
    ) {
      return "HANDICAP";
    }

    // Combination markets (& or + in market name)
    if (name.includes("&") || name.includes("+") || name.includes("gg/ng")) {
      return "COMBINATION";
    }

    // Exact goals detection
    if (name.includes("exact") && name.includes("goal")) {
      return "EXACT_GOALS";
    }

    // Goalscorer markets
    if (name.includes("scorer") || name.includes("goal scorer")) {
      return "GOALSCORER";
    }

    // HT/FT Correct Score (numeric scores like "0:0/1:1", "1:0/2:1")
    if (
      (name.includes("ht/ft") && name.includes("c:s")) ||
      (name.includes("half") &&
        name.includes("full") &&
        name.includes("correct") &&
        name.includes("score"))
    ) {
      return "HT_FT_CORRECT_SCORE";
    }

    // HalfTime/FullTime outcome market (Home/Draw/Away combinations)
    if (
      name.includes("ht/ft") ||
      name.includes("half time/full time") ||
      name.includes("halftime/fulltime") ||
      (name.includes("half") &&
        name.includes("full") &&
        !name.includes("correct"))
    ) {
      return "HT_FT_OUTCOME";
    }

    // Default to simple card
    return "SIMPLE";
  };

  // Group markets by their component type (not by individual market ID)
  const createDynamicMarketSections = () => {
    if (!fixture_data || !fixture_data.outcomes) {
      return [];
    }

    // First, group outcomes by marketId
    const marketGroups: { [key: number]: any[] } = {};
    fixture_data.outcomes.forEach((outcome) => {
      const marketId = outcome.marketId;
      if (!marketGroups[marketId]) {
        marketGroups[marketId] = [];
      }
      marketGroups[marketId].push(outcome);
    });

    // Check if over/under markets have quarter-based outcomes
    const hasQuarterOverUnder = fixture_data.outcomes.some(
      (o) =>
        o.specifier?.includes("total=") && o.specifier?.includes("quarternr=")
    );

    // Then group markets by their detected type
    const typeGroups: {
      [type: string]: { marketIds: number[]; allOutcomes: any[] };
    } = {};

    Object.entries(marketGroups).forEach(([marketIdStr, outcomes]) => {
      const marketId = parseInt(marketIdStr);
      const marketName = outcomes[0]?.marketName || "";
      const specifier = outcomes[0]?.specifier || "";
      const marketType = detectMarketType(marketName, specifier, outcomes);

      if (!typeGroups[marketType]) {
        typeGroups[marketType] = {
          marketIds: [],
          allOutcomes: [],
        };
      }

      typeGroups[marketType].marketIds.push(marketId);
      typeGroups[marketType].allOutcomes.push(...outcomes);
    });

    // Fixed render order: SIMPLE(1st), SIMPLE(2nd), OVER_UNDER(3rd), COMBINATION(4th), HANDICAP(5th)
    const sections: any[] = [];
    const componentProps = {
      fixture_data: fixture_data!,
      disabled: isFixtureLoading,
      is_loading: isFixtureLoading,
    };

    // Collect all components by type
    const componentsByType: { [key: string]: any[] } = {};

    // Build components for each type
    Object.entries(typeGroups).forEach(([type, group]) => {
      if (!group || group.marketIds.length === 0) return;

      if (!componentsByType[type]) {
        componentsByType[type] = [];
      }

      if (type === "1X2") {
        group.marketIds.forEach((marketId) => {
          componentsByType[type].push({
            type,
            marketIds: [marketId],
            component: (
              <MainCard
                key={`${type}-${marketId}`}
                {...componentProps}
                market_id={marketId}
              />
            ),
          });
        });
      } else if (type === "DOUBLE_CHANCE") {
        group.marketIds.forEach((marketId) => {
          componentsByType[type].push({
            type,
            marketIds: [marketId],
            component: (
              <MainCard
                key={`${type}-${marketId}`}
                {...componentProps}
                market_id={marketId}
              />
            ),
          });
        });
      } else if (type === "DNB") {
        group.marketIds.forEach((marketId) => {
          componentsByType[type].push({
            type,
            marketIds: [marketId],
            component: (
              <MainCard
                key={`${type}-${marketId}`}
                {...componentProps}
                market_id={marketId}
              />
            ),
          });
        });
      } else if (type === "OVER_UNDER") {
        // Check if basketball sport (sportID 2)
        const isBasketball = Number(fixture_data?.sportID) === 2;

        // Check if this is quarter-based over/under - split by quarter
        if (hasQuarterOverUnder && !isBasketball) {
          // Group outcomes by quarter
          const quarterGroups: { [quarter: string]: any[] } = {};
          group.allOutcomes.forEach((outcome) => {
            const quarterMatch = outcome.specifier?.match(/quarternr=(\d+)/);
            if (quarterMatch) {
              const quarter = quarterMatch[1];
              if (!quarterGroups[quarter]) {
                quarterGroups[quarter] = [];
              }
              quarterGroups[quarter].push(outcome);
            }
          });

          // Create separate component for each quarter
          const quarters = ["1", "2", "3", "4"];
          quarters.forEach((quarter) => {
            if (quarterGroups[quarter] && quarterGroups[quarter].length > 0) {
              componentsByType[type].push({
                type: `OVER_UNDER_Q${quarter}`,
                marketIds: group.marketIds,
                component: (
                  <OverUnder
                    key={`${type}-Q${quarter}`}
                    {...componentProps}
                    market_id={group.marketIds[0]}
                    title={`Quarter ${quarter} Over/Under`}
                    filterOutcomes={(outcomes) =>
                      outcomes.filter((o) =>
                        o.specifier?.includes(`quarternr=${quarter}`)
                      )
                    }
                  />
                ),
              });
            }
          });
        } else {
          componentsByType[type].push({
            type,
            marketIds: group.marketIds,
            component: isBasketball ? (
              <BasketballOverUnder
                key={`${type}-${group.marketIds.join("-")}`}
                {...componentProps}
                outcomes={group.allOutcomes}
              />
            ) : (
              <OverUnder
                key={`${type}-${group.marketIds.join("-")}`}
                {...componentProps}
                market_id={group.marketIds[0]}
              />
            ),
          });
        }
      } else if (type === "HANDICAP") {
        componentsByType[type].push({
          type,
          marketIds: group.marketIds,
          component: (
            <HandicapMarket
              key={`${type}-${group.marketIds[0]}`}
              {...componentProps}
              market_id={group.marketIds[0]}
            />
          ),
        });
      } else if (type === "HOME_TOTAL") {
        componentsByType[type].push({
          type,
          marketIds: group.marketIds,
          component: (
            <OverUnder
              key={`${type}-${group.marketIds[0]}`}
              {...componentProps}
              market_id={group.marketIds[0]}
              title="Home Total"
            />
          ),
        });
      } else if (type === "AWAY_TOTAL") {
        componentsByType[type].push({
          type,
          marketIds: group.marketIds,
          component: (
            <OverUnder
              key={`${type}-${group.marketIds[0]}`}
              {...componentProps}
              market_id={group.marketIds[0]}
              title="Away Total"
            />
          ),
        });
      } else if (type === "QUARTER_1X2") {
        // Group all quarter-based 1X2 outcomes together into single combination market
        componentsByType[type].push({
          type,
          marketIds: group.marketIds,
          component: (
            <CombinationMarket
              key={`${type}-combined`}
              {...componentProps}
              market_id={group.marketIds[0]}
            />
          ),
        });
      } else if (type === "COMBINATION") {
        group.marketIds.forEach((marketId) => {
          componentsByType[type].push({
            type,
            marketIds: [marketId],
            component: (
              <CombinationMarket
                key={`${type}-${marketId}`}
                {...componentProps}
                market_id={marketId}
              />
            ),
          });
        });
      } else if (type === "EXACT_GOALS") {
        componentsByType[type].push({
          type,
          marketIds: group.marketIds,
          component: (
            <ExactGoals
              key={`${type}-${group.marketIds[0]}`}
              {...componentProps}
              market_id={group.marketIds[0]}
            />
          ),
        });
      } else if (type === "GOALSCORER") {
        group.marketIds.forEach((marketId) => {
          componentsByType[type].push({
            type,
            marketIds: [marketId],
            component: (
              <AnytimeGoalscorer
                key={`${type}-${marketId}`}
                {...componentProps}
                market_id={marketId}
              />
            ),
          });
        });
      } else if (type === "HT_FT_CORRECT_SCORE") {
        // Use MainCard for correct score markets (numeric scores)
        group.marketIds.forEach((marketId) => {
          componentsByType[type].push({
            type,
            marketIds: [marketId],
            component: (
              <HalfTimeFullTimeScore
                key={`${type}-${marketId}`}
                {...componentProps}
                market_id={marketId}
              />
            ),
          });
        });
      } else if (type === "HT_FT_OUTCOME") {
        // Use CombinationMarket for outcome markets (Home/Draw/Away combinations)
        group.marketIds.forEach((marketId) => {
          componentsByType[type].push({
            type,
            marketIds: [marketId],
            component: (
              <CombinationMarket
                key={`${type}-${marketId}`}
                {...componentProps}
                market_id={marketId}
              />
            ),
          });
        });
      } else if (type === "SIMPLE") {
        group.marketIds.forEach((marketId) => {
          componentsByType[type].push({
            type,
            marketIds: [marketId],
            component: (
              <MainCard
                key={`${type}-${marketId}`}
                {...componentProps}
                market_id={marketId}
              />
            ),
          });
        });
      }
    });

    // Fixed order positions for key markets
    const orderedMarkets = [
      { type: "1X2", position: 1 },
      { type: "DOUBLE_CHANCE", position: 2 },
      { type: "OVER_UNDER", position: 3 },
      { type: "HANDICAP", position: 4 },
      { type: "DNB", position: 5 }, // Draw No Bet
      { type: "COMBINATION", position: 6 }, // Teams to Score (GG/NG, etc)
      { type: "EXACT_GOALS", position: 7 },
      { type: "HOME_TOTAL", position: 8 },
      { type: "AWAY_TOTAL", position: 9 },
    ];

    // Add fixed position markets first
    orderedMarkets.forEach(({ type }) => {
      const components = componentsByType[type] || [];
      if (components.length > 0) {
        sections.push(components[0]); // Add first instance
      }
    });

    // Collect remaining markets for randomization
    const remainingComponents: any[] = [];

    // Add remaining instances of ordered markets
    orderedMarkets.forEach(({ type }) => {
      const components = componentsByType[type] || [];
      remainingComponents.push(...components.slice(1)); // Skip first, already added
    });

    // Add other market types that will be randomized
    const randomizedTypes = [
      "QUARTER_1X2",
      "GOALSCORER",
      "HT_FT_CORRECT_SCORE",
      "HT_FT_OUTCOME",
      "SIMPLE",
    ];

    randomizedTypes.forEach((type) => {
      const components = componentsByType[type] || [];
      remainingComponents.push(...components);
    });

    // Shuffle remaining components for randomization
    const shuffled = remainingComponents.sort(() => Math.random() - 0.5);
    sections.push(...shuffled);

    return sections;
  };

  // Create dynamic market sections - always render components, they handle their own loading states
  const dynamicMarketSections = createDynamicMarketSections();

  // Create skeleton components for loading state
  const skeletonSections = [
    {
      type: "1X2",
      component: (
        <MainCard
          key="skeleton-1x2"
          {...{ fixture_data: fixture_data!, disabled: true, is_loading: true }}
          market_id={MARKET_SECTION.ONE_X_TWO}
        />
      ),
    },
    {
      type: "DOUBLE_CHANCE",
      component: (
        <MainCard
          key="skeleton-dc"
          {...{ fixture_data: fixture_data!, disabled: true, is_loading: true }}
          market_id={MARKET_SECTION.DOUBLE_CHANCE}
        />
      ),
    },
    {
      type: "OVER_UNDER",
      component: (
        <OverUnder
          key="skeleton-ou"
          {...{ fixture_data: fixture_data!, disabled: true, is_loading: true }}
          market_id={MARKET_SECTION.OVER_UNDER}
        />
      ),
    },
    {
      type: "COMBINATION",
      component: (
        <CombinationMarket
          key="skeleton-combo"
          {...{ fixture_data: fixture_data!, disabled: true, is_loading: true }}
          market_id={MARKET_SECTION.GOAL_NOGOAL}
        />
      ),
    },
    {
      type: "HANDICAP",
      component: (
        <HandicapMarket
          key="skeleton-handicap"
          {...{ fixture_data: fixture_data!, disabled: true, is_loading: true }}
          market_id={MARKET_SECTION.FT_HANDICAP}
        />
      ),
    },
  ];

  return (
    <SideOverlay
      open={true}
      onOpenChange={() => onClose()}
      width="w-[660px]"
      variant="game_options"
      title={
        isFixtureLoading ? (
          <SkeletonTitle />
        ) : (
          <>
            <div className="flex flex-col gap-1">
              <span
                className={`font-bold text-sm ${modalClasses["header-title"]}`}
              >
                {fixture_data?.competitor1}{" "}
                <span className={modalClasses["header-vs-text"]}>vs</span>{" "}
                {fixture_data?.competitor2}
              </span>
              <div className="flex justify-between items-center gap-2">
                <span className={`text-xs ${modalClasses["header-subtitle"]}`}>
                  {fixture_data?.categoryName} &middot;{" "}
                  {fixture_data?.sportName}
                </span>
                <span className={`text-xs ${modalClasses["header-date-text"]}`}>
                  {fixture_data?.date}
                </span>
              </div>
            </div>
          </>
        )
      }
    >
      <div className="flex flex-col min-w-[560px] w-full gap-1">
        {/* Show skeleton components while loading */}
        {isFixtureLoading &&
          skeletonSections.map((section, index) => (
            <div key={`skeleton-${section.type}-${index}`}>
              {section.component}
            </div>
          ))}

        {/* Show actual market sections when data is loaded */}
        {!isFixtureLoading &&
          dynamicMarketSections.map((section, index) => (
            <div key={`${section.type}-${index}`}>{section.component}</div>
          ))}

        {/* Fallback message if no markets available */}
        {dynamicMarketSections.length === 0 && !isFixtureLoading && (
          <div className="flex items-center justify-center p-8 text-gray-400">
            No betting markets available for this match.
          </div>
        )}
      </div>
    </SideOverlay>
  );
};

export default GameOptionsModal;
