import React, { useState } from "react";
import { Outcome } from "@/data/types/betting.types";
import OddsButton from "@/components/buttons/OddsButton";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import {
  IoChevronForward,
  IoChevronDown,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { SkeletonCard } from "@/components/skeletons/OutComesSkeleton";
import { getClientTheme } from "@/config/theme.config";

interface MarketOutcome {
  outcomeName: string;
  outcomeID: string;
  odds: number;
  displayName: string;
  producerID: number;
  marketName?: string;
}

interface CombinationMarketProps {
  fixture_data: PreMatchFixture;
  disabled?: boolean;
  market_id: number;
  is_loading?: boolean;
}

const CombinationMarket: React.FC<CombinationMarketProps> = ({
  disabled = false,
  fixture_data,
  market_id,
  is_loading,
}) => {
  const [is_collapsed, setIsCollapsed] = useState<boolean>(false);
  const theme = getClientTheme();
  const marketClasses = theme.classes.game_options_modal;

  const outcomes =
    fixture_data?.outcomes?.filter(
      (outcome) => (outcome.marketID || outcome.marketId) === market_id
    ) || [];

  // Check if this is a quarter-based 1X2 market
  const isQuarterBased = outcomes.some((o) =>
    o.specifier?.includes("quarternr=")
  );
  const marketTitle =
    outcomes.find((item) => !!item.marketName)?.marketName ||
    "Combination Market";
  const isQuarter1X2 =
    isQuarterBased &&
    marketTitle.toLowerCase().includes("1x2") &&
    marketTitle.toLowerCase().includes("quarter");

  let title = isQuarter1X2 ? "Quarter 1X2" : marketTitle;
  // Parse outcomes to determine the structure
  const parseOutcomes = () => {
    const structure: Record<string, Record<string, MarketOutcome>> = {};
    const primaryOptions = new Set<string>();
    const secondaryOptions = new Set<string>();

    // Determine market type from title or first outcome
    const marketTitle = title.toLowerCase();
    const isGGNG =
      marketTitle.includes("gg") ||
      marketTitle.includes("ng") ||
      marketTitle.includes("goal");
    const is1X2 =
      marketTitle.includes("1x2") || marketTitle.includes("match result");
    const isDC =
      marketTitle.includes("dc") || marketTitle.includes("double chance");

    outcomes.forEach((outcome) => {
      const displayName = outcome.displayName.toLowerCase();
      let primary = "";
      let secondary = "";

      // Handle quarter-based 1X2 markets (e.g., "1st quarter - 1x2")
      if (isQuarter1X2) {
        // Extract quarter number from specifier and format as "1st Quarter", "2nd Quarter", etc.
        const quarterMatch = outcome.specifier?.match(/quarternr=(\d+)/);
        if (quarterMatch) {
          const quarterNum = quarterMatch[1];
          const quarterLabels: Record<string, string> = {
            "1": "1st Quarter",
            "2": "2nd Quarter",
            "3": "3rd Quarter",
            "4": "4th Quarter",
          };
          primary = quarterLabels[quarterNum] || `Q${quarterNum}`;
        }

        // Map outcome to 1/X/2
        const outcomeId = outcome.outcomeID?.toString().toLowerCase() || "";
        if (displayName === "1" || outcomeId === "1") {
          secondary = "1";
        } else if (
          displayName === "x" ||
          displayName === "draw" ||
          outcomeId === "2"
        ) {
          secondary = "x";
        } else if (displayName === "2" || outcomeId === "3") {
          secondary = "2";
        }
      }
      // Enhanced parsing for betting markets
      else if (isGGNG && (is1X2 || isDC)) {
        // Handle different display name formats
        if (displayName.includes("/")) {
          // Format like "Home/yes", "Draw/no", "Away/yes"
          const parts = displayName.split("/");
          const firstPart = parts[0]?.trim().toLowerCase() || "";
          const secondPart = parts[1]?.trim().toLowerCase() || "";

          // Map first part (team result)
          if (firstPart.includes("home") || firstPart === "1") primary = "1";
          else if (firstPart.includes("draw") || firstPart === "x")
            primary = "x";
          else if (firstPart.includes("away") || firstPart === "2")
            primary = "2";

          // Map second part (goal/no goal)
          if (secondPart.includes("yes") || secondPart.includes("gg"))
            secondary = "gg";
          else if (secondPart.includes("no") || secondPart.includes("ng"))
            secondary = "ng";
        } else if (displayName.includes("&")) {
          // Format like "1 & GG", "X & NG", "2 & GG"
          if (displayName.includes("1") && displayName.includes("gg")) {
            primary = "1";
            secondary = "gg";
          } else if (displayName.includes("1") && displayName.includes("ng")) {
            primary = "1";
            secondary = "ng";
          } else if (displayName.includes("x") && displayName.includes("gg")) {
            primary = "x";
            secondary = "gg";
          } else if (displayName.includes("x") && displayName.includes("ng")) {
            primary = "x";
            secondary = "ng";
          } else if (displayName.includes("2") && displayName.includes("gg")) {
            primary = "2";
            secondary = "gg";
          } else if (displayName.includes("2") && displayName.includes("ng")) {
            primary = "2";
            secondary = "ng";
          } else if (displayName.includes("1x") && displayName.includes("gg")) {
            primary = "1x";
            secondary = "gg";
          } else if (displayName.includes("1x") && displayName.includes("ng")) {
            primary = "1x";
            secondary = "ng";
          } else if (displayName.includes("12") && displayName.includes("gg")) {
            primary = "12";
            secondary = "gg";
          } else if (displayName.includes("12") && displayName.includes("ng")) {
            primary = "12";
            secondary = "ng";
          } else if (displayName.includes("x2") && displayName.includes("gg")) {
            primary = "x2";
            secondary = "gg";
          } else if (displayName.includes("x2") && displayName.includes("ng")) {
            primary = "x2";
            secondary = "ng";
          }
        }
      } else if (isGGNG) {
        // Handle pure GG/NG markets
        if (displayName.includes("gg") || displayName.includes("yes")) {
          primary = "both";
          secondary = "gg";
        } else if (displayName.includes("ng") || displayName.includes("no")) {
          primary = "both";
          secondary = "ng";
        }
      } else {
        // Fallback to original parsing logic
        if (displayName.includes("/")) {
          const parts = displayName.split("/");
          primary = parts[0]?.trim() || "";
          secondary = parts[1]?.trim() || "";
        } else if (displayName.includes(" and ")) {
          const parts = displayName.split(" and ");
          primary = parts[0]?.trim() || "";
          secondary = parts[1]?.trim() || "";
        } else {
          // Try to detect common patterns
          if (displayName.includes("home") || displayName.includes("1"))
            primary = "1";
          else if (displayName.includes("draw") || displayName.includes("x"))
            primary = "x";
          else if (displayName.includes("away") || displayName.includes("2"))
            primary = "2";

          if (displayName.includes("yes") || displayName.includes("gg"))
            secondary = "yes";
          else if (displayName.includes("no") || displayName.includes("ng"))
            secondary = "no";
          else if (displayName.includes("over")) secondary = "over";
          else if (displayName.includes("under")) secondary = "under";
        }
      }

      if (primary && secondary) {
        primaryOptions.add(primary);
        secondaryOptions.add(secondary);

        if (!structure[primary]) {
          structure[primary] = {};
        }
        structure[primary][secondary] = outcome;
      }
    });

    // Sort primary options for quarter-based markets
    let sortedPrimaryOptions = Array.from(primaryOptions);
    if (isQuarter1X2) {
      // Sort quarters in order: 1st Quarter, 2nd Quarter, 3rd Quarter, 4th Quarter
      const quarterOrder = [
        "1st Quarter",
        "2nd Quarter",
        "3rd Quarter",
        "4th Quarter",
      ];
      sortedPrimaryOptions.sort((a, b) => {
        const indexA = quarterOrder.indexOf(a);
        const indexB = quarterOrder.indexOf(b);
        return indexA - indexB;
      });
    }

    return {
      structure,
      primaryOptions: sortedPrimaryOptions,
      secondaryOptions: Array.from(secondaryOptions),
    };
  };

  const { structure, primaryOptions, secondaryOptions } = parseOutcomes();

  // Helper function to format labels
  const formatLabel = (text: string): string => {
    const labelMap: Record<string, string> = {
      home: "Home Win",
      draw: "Draw",
      away: "Away Win",
      yes: "Yes",
      no: "No",
      over: "Over",
      under: "Under",
      gg: "GG",
      ng: "NG",
      both: "Both Teams",
      "1": "1",
      x: "X",
      "2": "2",
      "1x": "1X",
      "12": "1/2",
      x2: "X2",
    };

    return (
      labelMap[text.toLowerCase()] ||
      text.charAt(0).toUpperCase() + text.slice(1)
    );
  };
  if (is_loading) return <SkeletonCard title={title} />;

  // Helper function to get icon for primary options
  const getIcon = (option: string): string => {
    const iconMap: Record<string, string> = {
      home: "1",
      draw: "X",
      away: "2",
      "1": "1",
      x: "X",
      "2": "2",
      "1x": "1X",
      "12": "1/2",
      x2: "X2",
      both: "GG",
    };

    return iconMap[option.toLowerCase()] || option.charAt(0).toUpperCase();
  };

  if (outcomes.length === 0) return null;

  // If we couldn't parse the structure, fall back to a simple list
  if (primaryOptions.length === 0 || secondaryOptions.length === 0) {
    return (
      <div
        className={`shadow-2xl ${marketClasses["market-card-bg"]} ${marketClasses["market-card-border"]} border rounded-md p-1 pb-2 ${marketClasses["market-card-hover"]}`}
      >
        <div className="">
          <button
            className="w-full flex items-center justify-between px-2 py-1 text-left"
            onClick={() => setIsCollapsed((prev) => !prev)}
            type="button"
          >
            <div className="flex items-center gap-2">
              {is_collapsed ? (
                <IoChevronForward
                  size={18}
                  className={marketClasses["market-title"]}
                />
              ) : (
                <IoChevronDown
                  size={18}
                  className={marketClasses["market-title"]}
                />
              )}
              <span
                className={`font-semibold text-xs ${marketClasses["market-title"]}`}
              >
                {title}
              </span>
              <IoInformationCircleOutline
                size={16}
                className={`ml-1 ${marketClasses["subtitle-text"]}`}
              />
            </div>
          </button>
          {!is_collapsed && (
            <div className="flex flex-col px-3 pb-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-1">
                {outcomes.map((outcome, index) => (
                  <OddsButton
                    key={outcome.outcomeID || index}
                    outcome={outcome as any}
                    disabled={disabled}
                    fixture_data={fixture_data}
                    game_id={fixture_data?.gameID as unknown as number}
                    show_display_name={true}
                    // bg_color={"bg-white text-black"}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className={`shadow-2xl ${marketClasses["market-card-bg"]} ${marketClasses["market-card-border"]} border rounded-md p-1 pb-2 ${marketClasses["market-card-hover"]}`}
    >
      {/* Header */}
      <div className="">
        <button
          className="w-full flex items-center justify-between px-2 py-1 text-left"
          onClick={() => setIsCollapsed((prev) => !prev)}
          type="button"
        >
          <div className="flex items-center gap-2">
            {is_collapsed ? (
              <IoChevronForward
                size={18}
                className={marketClasses["market-title"]}
              />
            ) : (
              <IoChevronDown
                size={18}
                className={marketClasses["market-title"]}
              />
            )}
            <span
              className={`font-semibold text-xs ${marketClasses["market-title"]}`}
            >
              {title}
            </span>
            <IoInformationCircleOutline
              size={16}
              className={`ml-1 ${marketClasses["subtitle-text"]}`}
            />
          </div>
        </button>
        {!is_collapsed && (
          <div className="flex flex-col px-3 pb-3">
            {/* X-axis Headers */}
            <div
              className={`grid items-center mb-2`}
              style={{
                gridTemplateColumns: `3rem repeat(${secondaryOptions.length}, 1fr)`,
              }}
            >
              <div></div> {/* Empty cell for Y-axis label space */}
              {secondaryOptions.map((secondary) => (
                <div key={`header-${secondary}`} className="text-center">
                  <span
                    className={`${marketClasses["axis-label-text"]} text-xs font-semibold`}
                  >
                    {formatLabel(secondary)}
                  </span>
                </div>
              ))}
            </div>

            {/* Outcome Rows with Y-axis labels */}
            <div className="space-y-0">
              {primaryOptions.map((primary) => {
                const rowOutcomes = structure[primary];

                return (
                  <div
                    key={primary}
                    className={`grid items-center`}
                    style={{
                      gridTemplateColumns: `3rem repeat(${secondaryOptions.length}, 1fr)`,
                    }}
                  >
                    {/* Y-axis Label (Primary Option) */}
                    <span
                      className={`${marketClasses["axis-label-text"]} text-sm justify-center font-semibold min-w-[40px] flex items-center`}
                    >
                      {getIcon(primary)}
                    </span>

                    {/* Secondary Options */}
                    {secondaryOptions.map((secondary, secIndex) => {
                      const outcome = rowOutcomes?.[secondary];

                      return outcome ? (
                        <OddsButton
                          key={`${primary}-${secondary}`}
                          outcome={outcome as any}
                          disabled={disabled}
                          fixture_data={fixture_data}
                          game_id={fixture_data?.gameID as unknown as number}
                          show_display_name={true}
                          // bg_color={"bg-white text-black"}
                          rounded={`${
                            primaryOptions.indexOf(primary) ===
                            primaryOptions.length - 1
                              ? secIndex === 0
                                ? "rounded-bl-md"
                                : secIndex === secondaryOptions.length - 1
                                ? "rounded-br-md"
                                : ""
                              : primaryOptions.indexOf(primary) === 0
                              ? secIndex === 0
                                ? "rounded-tl-md"
                                : secIndex === secondaryOptions.length - 1
                                ? "rounded-tr-md"
                                : ""
                              : ""
                          }`}
                        />
                      ) : (
                        <div
                          key={`${primary}-${secondary}`}
                          className="bg-gray-600 text-gray-500 px-3 py-2 text-sm text-center"
                        >
                          -
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            {/* Debug Info (only in development) */}
            {/* {process.env.NODE_ENV === "development" && (
              <div className="mt-4 pt-3 border-t border-gray-700">
                <details className="text-xs text-gray-500">
                  <summary className="cursor-pointer">Debug Info</summary>
                  <pre className="mt-2 text-xs overflow-auto">
                    {JSON.stringify(
                      { primaryOptions, secondaryOptions, structure },
                      null,
                      2
                    )}
                  </pre>
                </details>
              </div>
            )} */}
          </div>
        )}
      </div>
    </div>
  );
};

export default CombinationMarket;
