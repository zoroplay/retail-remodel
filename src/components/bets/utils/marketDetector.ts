/**
 * Market Detection and Grouping Utility
 * Analyzes outcome structures and automatically determines the best display component
 */

export interface MarketOutcome {
  outcomeID: string | number;
  outcomeName: string;
  displayName?: string;
  marketName?: string;
  specifier?: string;
  odds: number;
  [key: string]: any;
}

export interface MarketGroup {
  type:
    | "simple"
    | "overunder"
    | "handicap"
    | "combination"
    | "grid"
    | "player"
    | "timerange";
  displayType: "1x2" | "2way" | "3way" | "ou_pairs" | "grid" | "table" | "list";
  marketName: string;
  marketId?: number;
  specifiers?: string[];
  data: any;
}

/**
 * Detect Over/Under markets with paired outcomes
 */
export function detectOverUnderMarket(
  outcomes: MarketOutcome[]
): MarketGroup | null {
  const hasOvers = outcomes.some(
    (o) =>
      o.displayName?.toLowerCase().includes("over") ||
      o.outcomeName?.toLowerCase().includes("over")
  );
  const hasUnders = outcomes.some(
    (o) =>
      o.displayName?.toLowerCase().includes("under") ||
      o.outcomeName?.toLowerCase().includes("under")
  );

  if (!hasOvers || !hasUnders) return null;

  // Group by specifier (total=X.X)
  const pairsBySpecifier: Record<
    string,
    { over?: MarketOutcome; under?: MarketOutcome; total?: string }
  > = {};

  outcomes.forEach((outcome) => {
    const spec = outcome.specifier || "default";
    if (!pairsBySpecifier[spec]) pairsBySpecifier[spec] = {};

    // Extract total value from specifier (e.g., "total=2.5" -> "2.5")
    const totalMatch = spec.match(/total=(\d+(?:\.\d+)?)/);
    if (totalMatch) {
      pairsBySpecifier[spec].total = totalMatch[1];
    }

    const name = (outcome.displayName || outcome.outcomeName).toLowerCase();
    if (name.includes("over")) {
      pairsBySpecifier[spec].over = outcome;
    } else if (name.includes("under")) {
      pairsBySpecifier[spec].under = outcome;
    }
  });

  // Sort specifiers by total value
  const sortedSpecifiers = Object.keys(pairsBySpecifier).sort((a, b) => {
    const valA = parseFloat(pairsBySpecifier[a].total || "0");
    const valB = parseFloat(pairsBySpecifier[b].total || "0");
    return valA - valB;
  });

  return {
    type: "overunder",
    displayType: "ou_pairs",
    marketName: outcomes[0]?.marketName || "Over/Under",
    specifiers: sortedSpecifiers,
    data: pairsBySpecifier,
  };
}

/**
 * Detect Handicap markets with home/draw/away outcomes
 */
export function detectHandicapMarket(
  outcomes: MarketOutcome[]
): MarketGroup | null {
  const marketName = outcomes[0]?.marketName?.toLowerCase() || "";
  if (!marketName.includes("handicap") && !marketName.includes("hcp")) {
    return null;
  }

  // Group by specifier (hcp=X:X)
  const groups: Record<
    string,
    { home?: MarketOutcome; draw?: MarketOutcome; away?: MarketOutcome }
  > = {};

  outcomes.forEach((outcome) => {
    const spec = outcome.specifier || "default";
    if (!groups[spec]) groups[spec] = {};

    const name = outcome.outcomeName.toLowerCase();
    if (name.includes("draw") || outcome.outcomeID === "1712") {
      groups[spec].draw = outcome;
    } else if (
      outcome.outcomeID === "1711" ||
      name.includes("home") ||
      outcome.outcomeID === "1"
    ) {
      groups[spec].home = outcome;
    } else if (
      outcome.outcomeID === "1713" ||
      name.includes("away") ||
      outcome.outcomeID === "3"
    ) {
      groups[spec].away = outcome;
    }
  });

  // Sort specifiers
  const sortedSpecifiers = Object.keys(groups).sort((a, b) => {
    if (a === "default") return 1;
    if (b === "default") return -1;
    return a.localeCompare(b);
  });

  return {
    type: "handicap",
    displayType: "table",
    marketName: outcomes[0]?.marketName || "Handicap",
    specifiers: sortedSpecifiers,
    data: groups,
  };
}

/**
 * Detect combination markets (e.g., 1X2 & GG/NG, HT/FT)
 */
export function detectCombinationMarket(
  outcomes: MarketOutcome[]
): MarketGroup | null {
  const marketName = outcomes[0]?.marketName?.toLowerCase() || "";

  // Check for common combination patterns
  const isCombination = outcomes.some((o) => {
    const displayName = (o.displayName || o.outcomeName).toLowerCase();
    return (
      displayName.includes("/") ||
      displayName.includes(" & ") ||
      displayName.includes(" and ")
    );
  });

  if (!isCombination) return null;

  // Parse combination structure
  const structure: Record<string, Record<string, MarketOutcome>> = {};
  const primaryOptions = new Set<string>();
  const secondaryOptions = new Set<string>();

  outcomes.forEach((outcome) => {
    const displayName = (
      outcome.displayName || outcome.outcomeName
    ).toLowerCase();
    let primary = "";
    let secondary = "";

    // Parse different combination formats
    if (displayName.includes(" & ")) {
      // Format: "1 & GG", "X & NG"
      const parts = displayName.split(" & ");
      primary = parts[0]?.trim() || "";
      secondary = parts[1]?.trim() || "";
    } else if (displayName.includes(" and ")) {
      // Format: "Peterborough and yes"
      const parts = displayName.split(" and ");
      primary = parts[0]?.trim() || "";
      secondary = parts[1]?.trim() || "";

      // Normalize
      if (primary.includes("home") || displayName.includes("peterborough"))
        primary = "1";
      else if (primary.includes("draw")) primary = "x";
      else if (primary.includes("away") || primary.includes("stock"))
        primary = "2";

      if (secondary.includes("yes") || secondary.includes("gg"))
        secondary = "gg";
      else if (secondary.includes("no") || secondary.includes("ng"))
        secondary = "ng";
      else if (secondary.includes("over")) secondary = "over";
      else if (secondary.includes("under")) secondary = "under";
    } else if (displayName.includes("/")) {
      // Format: "1/GG", "X/NG"
      const parts = displayName.split("/");
      primary = parts[0]?.trim() || "";
      secondary = parts[1]?.trim() || "";
    }

    if (primary && secondary) {
      primaryOptions.add(primary);
      secondaryOptions.add(secondary);
      if (!structure[primary]) structure[primary] = {};
      structure[primary][secondary] = outcome;
    }
  });

  if (primaryOptions.size === 0 || secondaryOptions.size === 0) return null;

  return {
    type: "combination",
    displayType: "table",
    marketName: outcomes[0]?.marketName || "Combination",
    data: {
      structure,
      primaryOptions: Array.from(primaryOptions),
      secondaryOptions: Array.from(secondaryOptions),
    },
  };
}

/**
 * Detect simple 1X2 markets
 */
export function detect1X2Market(outcomes: MarketOutcome[]): MarketGroup | null {
  if (outcomes.length !== 3) return null;

  const marketName = outcomes[0]?.marketName?.toLowerCase() || "";
  if (!marketName.includes("1x2") && outcomes.length !== 3) return null;

  const has1 = outcomes.some(
    (o) => o.outcomeID === "1" || o.displayName === "1"
  );
  const hasX = outcomes.some(
    (o) => o.outcomeID === "2" || o.displayName === "X"
  );
  const has2 = outcomes.some(
    (o) => o.outcomeID === "3" || o.displayName === "2"
  );

  if (!has1 || !hasX || !has2) return null;

  return {
    type: "simple",
    displayType: "3way",
    marketName: outcomes[0]?.marketName || "1X2",
    data: outcomes,
  };
}

/**
 * Detect 2-way markets (DNB, GG/NG, etc.)
 */
export function detect2WayMarket(
  outcomes: MarketOutcome[]
): MarketGroup | null {
  if (outcomes.length !== 2) return null;

  return {
    type: "simple",
    displayType: "2way",
    marketName: outcomes[0]?.marketName || "2-Way",
    data: outcomes,
  };
}

/**
 * Detect player markets (goalscorer, etc.)
 */
export function detectPlayerMarket(
  outcomes: MarketOutcome[]
): MarketGroup | null {
  const marketName = outcomes[0]?.marketName?.toLowerCase() || "";

  if (!marketName.includes("goalscorer") && !marketName.includes("scorer")) {
    return null;
  }

  // Check if outcomes contain player names
  const hasPlayers = outcomes.some((o) => {
    const id = String(o.outcomeID);
    return id.includes("sr:player:") || o.outcomeName.includes(",");
  });

  if (!hasPlayers) return null;

  return {
    type: "player",
    displayType: "list",
    marketName: outcomes[0]?.marketName || "Player Market",
    data: outcomes.filter((o) => String(o.outcomeID) !== "1716"), // Filter out "no goal"
  };
}

/**
 * Detect time range markets (10 minute intervals, etc.)
 */
export function detectTimeRangeMarket(
  outcomes: MarketOutcome[]
): MarketGroup | null {
  const hasTimeRanges = outcomes.some((o) => {
    const name = (o.displayName || o.outcomeName).toLowerCase();
    return name.match(/\d+-\d+/) || name.includes("min");
  });

  if (!hasTimeRanges) return null;

  return {
    type: "timerange",
    displayType: "grid",
    marketName: outcomes[0]?.marketName || "Time Range",
    data: outcomes,
  };
}

/**
 * Main detection function - tries all detectors in order
 */
export function detectMarketType(outcomes: MarketOutcome[]): MarketGroup {
  if (!outcomes || outcomes.length === 0) {
    return {
      type: "simple",
      displayType: "grid",
      marketName: "Unknown",
      data: [],
    };
  }

  // Try specific detectors first
  const detectors = [
    detectPlayerMarket,
    detectOverUnderMarket,
    detectHandicapMarket,
    detectCombinationMarket,
    detect1X2Market,
    detect2WayMarket,
    detectTimeRangeMarket,
  ];

  for (const detector of detectors) {
    const result = detector(outcomes);
    if (result) return result;
  }

  // Fallback: group by specifier or simple grid
  const hasSpecifiers = outcomes.some((o) => o.specifier && o.specifier !== "");

  if (hasSpecifiers) {
    const groups: Record<string, MarketOutcome[]> = {};
    outcomes.forEach((outcome) => {
      const spec = outcome.specifier || "default";
      if (!groups[spec]) groups[spec] = [];
      groups[spec].push(outcome);
    });

    return {
      type: "grid",
      displayType: "grid",
      marketName: outcomes[0]?.marketName || "Market",
      specifiers: Object.keys(groups),
      data: groups,
    };
  }

  // Ultimate fallback: simple grid
  return {
    type: "simple",
    displayType: "grid",
    marketName: outcomes[0]?.marketName || "Market",
    data: outcomes,
  };
}
