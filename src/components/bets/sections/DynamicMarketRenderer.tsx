import React from "react";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import {
  MainCard,
  OverUnder,
  HandicapMarket,
  CombinationMarket,
  ExactGoals,
} from "./index";

interface Market {
  marketID: string;
  marketName: string;
  specifier: string;
  sportID: number;
}

interface DynamicMarketRendererProps {
  fixture_data: PreMatchFixture;
  markets: Market[];
  disabled?: boolean;
  is_loading?: boolean;
}

// Market type detection patterns
const MARKET_PATTERNS = {
  // Over/Under markets
  OVER_UNDER: ["over/under", "o/u", "total goals", "home total", "away total"],

  // Handicap markets
  HANDICAP: ["handicap", "ft handicap", "ht handicap", "2ht handicap"],

  // Exact goals
  EXACT_GOALS: ["exact goals", "home exact goals", "away exact goals"],

  // Combination markets (1X2 + GG/NG etc)
  COMBINATION: [
    "1x2 & gg/ng",
    "dc & gg/ng",
    "ht gg/ng",
    "match result + both teams",
  ],

  // Standard 1X2 and similar simple markets
  SIMPLE: [
    "1x2",
    "double chance",
    "dnb",
    "draw no bet",
    "odd/even",
    "goal/ no goal",
    "team to score",
    "home clean sheet",
    "away clean sheet",
    "home win to nil",
    "away win to nil",
    "o/e ht",
    "home o/e",
    "away o/e",
    "half time 1x2",
    "1x2 2ht",
    "booking 1x2",
    "corners - 1x2",
    "sending off",
    "home red card",
    "away red card",
  ],
};

const DynamicMarketRenderer: React.FC<DynamicMarketRendererProps> = ({
  fixture_data,
  markets,
  disabled = false,
  is_loading = false,
}) => {
  // Function to determine market type
  const getMarketType = (marketName: string, specifier: string): string => {
    const name = marketName.toLowerCase().trim();
    const spec = specifier.toLowerCase().trim();

    // Check for over/under markets
    if (
      MARKET_PATTERNS.OVER_UNDER.some((pattern) => name.includes(pattern)) ||
      spec.includes("total")
    ) {
      return "OVER_UNDER";
    }

    // Check for handicap markets
    if (
      MARKET_PATTERNS.HANDICAP.some((pattern) => name.includes(pattern)) ||
      spec.includes("hcp")
    ) {
      return "HANDICAP";
    }

    // Check for exact goals
    if (
      MARKET_PATTERNS.EXACT_GOALS.some((pattern) => name.includes(pattern)) ||
      spec.includes("exact_goals")
    ) {
      return "EXACT_GOALS";
    }

    // Check for combination markets
    if (MARKET_PATTERNS.COMBINATION.some((pattern) => name.includes(pattern))) {
      return "COMBINATION";
    }

    // Default to simple market
    return "SIMPLE";
  };

  // Function to determine column count for simple markets
  const getColumnCount = (marketName: string, marketId: number): number => {
    const name = marketName.toLowerCase().trim();

    // 1X2 markets = 3 columns
    if (name.includes("1x2") || name.includes("half time 1x2")) {
      return 3;
    }

    // Double chance = 3 columns
    if (name.includes("double chance") || name.includes("dc")) {
      return 3;
    }

    // Team to score usually has 4 outcomes
    if (name.includes("team to score")) {
      return 4;
    }

    // Most binary markets (Yes/No, Odd/Even, etc.) = 2 columns
    return 2;
  };

  // Render component based on market type
  const renderMarketComponent = (market: Market) => {
    const marketType = getMarketType(market.marketName, market.specifier);
    const marketId = Number(market.marketID);

    // Skip if no outcomes for this market
    const marketOutcomes =
      fixture_data?.outcomes?.filter(
        (outcome) => (outcome.marketID || outcome.marketId) === marketId
      ) || [];

    if (marketOutcomes.length === 0) {
      return null;
    }

    const key = `market-${marketId}`;
    const commonProps = {
      fixture_data,
      disabled,
      is_loading,
      market_id: marketId,
    };

    switch (marketType) {
      case "OVER_UNDER":
        return <OverUnder key={key} {...commonProps} />;

      case "HANDICAP":
        return <HandicapMarket key={key} {...commonProps} />;

      case "EXACT_GOALS":
        return <ExactGoals key={key} {...commonProps} />;

      case "COMBINATION":
        return <CombinationMarket key={key} {...commonProps} />;

      case "SIMPLE":
      default:
        const columns = getColumnCount(market.marketName, marketId);
        return <MainCard key={key} {...commonProps} />;
    }
  };

  // Group markets by type for better organization
  const groupedMarkets = markets.reduce((acc, market) => {
    const type = getMarketType(market.marketName, market.specifier);
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(market);
    return acc;
  }, {} as Record<string, Market[]>);

  // Render order preference
  const renderOrder = [
    "SIMPLE",
    "OVER_UNDER",
    "HANDICAP",
    "COMBINATION",
    "EXACT_GOALS",
  ];

  return (
    <div className="flex flex-col gap-2">
      {renderOrder.map((type) => {
        const typeMarkets = groupedMarkets[type] || [];
        return typeMarkets.map((market) => renderMarketComponent(market));
      })}

      {/* Render any remaining market types not in the order */}
      {Object.entries(groupedMarkets).map(([type, typeMarkets]) => {
        if (renderOrder.includes(type)) return null;
        return typeMarkets.map((market) => renderMarketComponent(market));
      })}
    </div>
  );
};

export default DynamicMarketRenderer;
