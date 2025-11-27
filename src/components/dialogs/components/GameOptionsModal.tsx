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
import Modal from "../Modal";

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

  // Render market sections in the order received from the backend
  const createDynamicMarketSections = () => {
    if (!fixture_data || !fixture_data.outcomes) {
      return [];
    }

    // Group outcomes by marketId, preserving order
    const marketIdOrder: number[] = [];
    const marketGroups: { [key: number]: any[] } = {};
    fixture_data.outcomes.forEach((outcome) => {
      const marketId = outcome.marketId;
      if (!marketGroups[marketId]) {
        marketGroups[marketId] = [];
        marketIdOrder.push(marketId);
      }
      marketGroups[marketId].push(outcome);
    });

    const componentProps = {
      fixture_data: fixture_data!,
      disabled: isFixtureLoading,
      is_loading: isFixtureLoading,
    };

    // Render each market group in the order received
    return marketIdOrder.map((marketId) => {
      const outcomes = marketGroups[marketId];
      const marketName = outcomes[0]?.marketName || "";
      const specifier = outcomes[0]?.specifier || "";
      const marketType = detectMarketType(marketName, specifier, outcomes);

      // Render the correct component for each market type
      if (
        marketType === "1X2" ||
        marketType === "DOUBLE_CHANCE" ||
        marketType === "DNB" ||
        marketType === "SIMPLE"
      ) {
        return {
          type: marketType,
          component: (
            <MainCard
              key={`${marketType}-${marketId}`}
              {...componentProps}
              market_id={marketId}
            />
          ),
        };
      } else if (marketType === "OVER_UNDER") {
        const isBasketball = Number(fixture_data?.sportID) === 2;
        return {
          type: marketType,
          component: isBasketball ? (
            <BasketballOverUnder
              key={`${marketType}-${marketId}`}
              {...componentProps}
              outcomes={outcomes}
            />
          ) : (
            <OverUnder
              key={`${marketType}-${marketId}`}
              {...componentProps}
              market_id={marketId}
            />
          ),
        };
      } else if (marketType === "HANDICAP") {
        return {
          type: marketType,
          component: (
            <HandicapMarket
              key={`${marketType}-${marketId}`}
              {...componentProps}
              market_id={marketId}
            />
          ),
        };
      } else if (marketType === "HOME_TOTAL") {
        return {
          type: marketType,
          component: (
            <OverUnder
              key={`${marketType}-${marketId}`}
              {...componentProps}
              market_id={marketId}
              title="Home Total"
            />
          ),
        };
      } else if (marketType === "AWAY_TOTAL") {
        return {
          type: marketType,
          component: (
            <OverUnder
              key={`${marketType}-${marketId}`}
              {...componentProps}
              market_id={marketId}
              title="Away Total"
            />
          ),
        };
      } else if (
        marketType === "QUARTER_1X2" ||
        marketType === "COMBINATION" ||
        marketType === "HT_FT_OUTCOME"
      ) {
        return {
          type: marketType,
          component: (
            <CombinationMarket
              key={`${marketType}-${marketId}`}
              {...componentProps}
              market_id={marketId}
            />
          ),
        };
      } else if (marketType === "EXACT_GOALS") {
        return {
          type: marketType,
          component: (
            <ExactGoals
              key={`${marketType}-${marketId}`}
              {...componentProps}
              market_id={marketId}
            />
          ),
        };
      } else if (marketType === "GOALSCORER") {
        return {
          type: marketType,
          component: (
            <AnytimeGoalscorer
              key={`${marketType}-${marketId}`}
              {...componentProps}
              market_id={marketId}
            />
          ),
        };
      } else if (marketType === "HT_FT_CORRECT_SCORE") {
        return {
          type: marketType,
          component: (
            <HalfTimeFullTimeScore
              key={`${marketType}-${marketId}`}
              {...componentProps}
              market_id={marketId}
            />
          ),
        };
      }
      // Default fallback
      return {
        type: marketType,
        component: (
          <MainCard
            key={`default-${marketId}`}
            {...componentProps}
            market_id={marketId}
          />
        ),
      };
    });
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
    <Modal
      open={true}
      onOpenChange={() => onClose()}
      className="!w-[660px]"
      header={
        isFixtureLoading ? (
          <SkeletonTitle />
        ) : (
          <>
            <div className="flex flex-col gap-1 pb-2">
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
    </Modal>
  );
};

export default GameOptionsModal;
