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
const getCleanOutcomeName = (outcomeName: string): string => {
  // Remove handicap values in parentheses like "(0:2)" or "(3:0)"
  return outcomeName.replace(/\s*\([^)]*\)\s*$/, "").trim();
};
interface HandicapOutcome {
  outcomeName: string;
  outcomeID: string;
  odds: number;
  displayName: string;
  producerID: number;
  marketName?: string;
  specifier: string;
}

interface HandicapMarketProps {
  fixture_data: PreMatchFixture;
  disabled?: boolean;
  market_id: number;
  is_loading?: boolean;
}

interface ParsedHandicap {
  handicapValue: string;
  homeHandicap: number;
  awayHandicap: number;
  outcomes: Record<string, HandicapOutcome>;
}

const HandicapMarket: React.FC<HandicapMarketProps> = ({
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

  let title =
    outcomes.find((item) => !!item.marketName)?.marketName || "Handicap Market";
  // Parse handicap outcomes to group by handicap values
  const parseHandicapOutcomes = (): Record<string, ParsedHandicap> => {
    const handicapGroups: Record<string, ParsedHandicap> = {};

    outcomes.forEach((outcome) => {
      // Extract handicap from specifier (e.g., "hcp=1:0", "hcp=0:2")
      const specifier = outcome.specifier || "";
      const handicapMatch = specifier.match(/hcp=([+-]?\d+):([+-]?\d+)/);

      if (!handicapMatch) {
        // console.log(
        //   "No handicap match for specifier:",
        //   specifier,
        //   "outcome:",
        //   outcome
        // );
        return;
      }

      const homeHandicap = parseInt(handicapMatch[1]);
      const awayHandicap = parseInt(handicapMatch[2]);
      const handicapValue = `${homeHandicap}:${awayHandicap}`;

      // console.log("Parsed handicap:", {
      //   specifier,
      //   handicapValue,
      //   homeHandicap,
      //   awayHandicap,
      // });

      if (!handicapGroups[handicapValue]) {
        handicapGroups[handicapValue] = {
          handicapValue,
          homeHandicap,
          awayHandicap,
          outcomes: {},
        };
      }

      // Determine outcome type (1, X, 2) from outcomeID and displayName patterns
      let outcomeType = "";
      const displayName = outcome.displayName?.toLowerCase() || "";
      const outcomeName = outcome.outcomeName?.toLowerCase() || "";

      // First check outcomeID which is more reliable
      if (outcome.outcomeID === "1711") {
        outcomeType = "1";
      } else if (outcome.outcomeID === "1712") {
        outcomeType = "x";
      } else if (outcome.outcomeID === "1713") {
        outcomeType = "2";
      }
      // Fallback to displayName patterns if outcomeID doesn't match
      else if (displayName.includes(": 1") || displayName.includes("(1)")) {
        outcomeType = "1";
      } else if (
        displayName.includes(": x") ||
        displayName.includes("draw") ||
        outcomeName.includes("draw")
      ) {
        outcomeType = "x";
      } else if (displayName.includes(": 2") || displayName.includes("(2)")) {
        outcomeType = "2";
      }

      if (outcomeType) {
        handicapGroups[handicapValue].outcomes[outcomeType] =
          outcome as HandicapOutcome;
      }
    });

    return handicapGroups;
  };
  const handicapGroups = parseHandicapOutcomes();
  const handicapValues = Object.keys(handicapGroups).sort((a, b) => {
    const [aHome, aAway] = a.split(":").map(Number);
    const [bHome, bAway] = b.split(":").map(Number);
    const aDiff = aHome - aAway;
    const bDiff = bHome - bAway;
    return aDiff - bDiff;
  });

  // Helper function to format handicap display
  const formatHandicap = (
    homeHandicap: number,
    awayHandicap: number
  ): string => {
    const homeDiff = homeHandicap - awayHandicap;
    if (homeDiff > 0) {
      return `+${homeDiff}`;
    } else if (homeDiff < 0) {
      return `${homeDiff}`;
    }
    return "0";
  };

  // Helper function to get team that's being handicapped
  const getHandicappedTeam = (
    homeHandicap: number,
    awayHandicap: number
  ): string => {
    const diff = homeHandicap - awayHandicap;
    if (diff > 0) {
      return `${fixture_data.homeTeam || "Home"} ${formatHandicap(
        homeHandicap,
        awayHandicap
      )}`;
    } else if (diff < 0) {
      return `${fixture_data.awayTeam || "Away"} +${Math.abs(diff)}`;
    }
    return "Level";
  };

  // Helper function to extract clean team name without handicap values

  // Helper function to get outcome headers with team names
  const getOutcomeHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = { "1": "1", x: "X", "2": "2" };

    // Extract team names from actual outcomes
    Object.values(handicapGroups).forEach((group) => {
      Object.entries(group.outcomes).forEach(([outcomeType, outcome]) => {
        if (outcome && outcome.outcomeName) {
          const cleanName = getCleanOutcomeName(outcome.outcomeName);
          if (cleanName) {
            headers[outcomeType] = cleanName;
          }
        }
      });
    });

    return headers;
  };

  if (is_loading) return <SkeletonCard title={title} />;

  if (outcomes.length === 0 || handicapValues.length === 0) return null;

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
            {/* X-axis Headers - Show team names */}
            {(() => {
              const headers = getOutcomeHeaders();
              return (
                <div
                  className="grid items-center mb-2"
                  style={{
                    gridTemplateColumns: "3rem repeat(3, 1fr)",
                  }}
                >
                  <div className="text-center">
                    <span
                      className={`${marketClasses["axis-label-text"]} text-xs font-semibold`}
                    ></span>
                  </div>
                  <div className="text-center">
                    <span
                      className={`${marketClasses["axis-label-text"]} text-xs font-semibold`}
                    >
                      {headers["1"]}
                    </span>
                  </div>
                  <div className="text-center">
                    <span
                      className={`${marketClasses["axis-label-text"]} text-xs font-semibold`}
                    >
                      {headers["x"]}
                    </span>
                  </div>
                  <div className="text-center">
                    <span
                      className={`${marketClasses["axis-label-text"]} text-xs font-semibold`}
                    >
                      {headers["2"]}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Handicap Rows */}
            <div className="space-y-0">
              {handicapValues.map((handicapValue, index) => {
                const group = handicapGroups[handicapValue];
                const isFirst = index === 0;
                const isLast = index === handicapValues.length - 1;

                return (
                  <div
                    key={handicapValue}
                    className="grid items-center"
                    style={{
                      gridTemplateColumns: "3rem repeat(3, 1fr)",
                    }}
                  >
                    {/* Y-axis Label (Handicap Value) */}
                    <div className="text-center py-2 px-1">
                      <div
                        className={`${marketClasses["axis-label-text"]} text-sm font-semibold min-w-[40px] flex flex-col items-center`}
                      >
                        <span className="text-sm uppercase">
                          {group.handicapValue}
                        </span>
                      </div>
                    </div>

                    {/* Outcome Buttons */}
                    {["1", "x", "2"].map((outcomeType, outcomeIndex) => {
                      const outcome = group.outcomes[outcomeType];

                      let rounded = "";
                      if (isFirst && outcomeIndex === 0)
                        rounded = "rounded-tl-md";
                      else if (isFirst && outcomeIndex === 2)
                        rounded = "rounded-tr-md";
                      else if (isLast && outcomeIndex === 0)
                        rounded = "rounded-bl-md";
                      else if (isLast && outcomeIndex === 2)
                        rounded = "rounded-br-md";

                      return (
                        <OddsButton
                          key={`${handicapValue}-${outcomeType}`}
                          outcome={outcome as Outcome}
                          disabled={disabled || !outcome}
                          fixture_data={fixture_data}
                          game_id={fixture_data?.gameID as unknown as number}
                          show_display_name={false}
                          // bg_color={"bg-white text-black"}
                          rounded={rounded}
                          height="h-12"
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HandicapMarket;
