import { Outcome } from "@/data/types/betting.types";
import React, { useState } from "react";
import {
  IoChevronForward,
  IoChevronDown,
  IoInformationCircleOutline,
} from "react-icons/io5";
import { OutcomeProps } from ".";
import OddsButton from "@/components/buttons/OddsButton";
import { SkeletonCard } from "@/components/skeletons/OutComesSkeleton";
import { MARKET_SECTION } from "@/data/enums/enum";
import { getClientTheme } from "@/config/theme.config";
const OverUnder = ({
  fixture_data,
  market_id = MARKET_SECTION.OVER_UNDER,
  disabled,
  is_loading,
  title: customTitle,
  filterOutcomes,
}: OutcomeProps & {
  market_id?: number;
  title?: string;
  filterOutcomes?: (outcomes: Outcome[]) => Outcome[];
}) => {
  const [is_collapsed, setIsCollapsed] = useState<boolean>(false);
  const theme = getClientTheme();
  const marketClasses = theme.classes.game_options_modal;

  // Create local objects for this render to prevent data leakage
  const ouPairsBySpecifier: Record<
    string,
    { over?: Outcome; under?: Outcome }
  > = {};
  const homeTotalPairsBySpecifier: {
    [key: string]: { over?: any; under?: any };
  } = {};
  const awayTotalPairsBySpecifier: {
    [key: string]: { over?: any; under?: any };
  } = {};

  let outcomes = [];
  let pairsObject = ouPairsBySpecifier;
  outcomes =
    fixture_data?.outcomes?.filter(
      (outcome) => (outcome.marketID || outcome.marketId) === market_id
    ) || [];

  // Apply custom filter if provided (for quarter-based filtering)
  if (filterOutcomes) {
    outcomes = filterOutcomes(outcomes);
  }

  let title =
    customTitle || outcomes.find((item) => !!item.marketName)?.marketName || "";
  if (!customTitle) {
    title = title === "O/U" ? "Over/Under" : title || "Over/Under";
  }
  switch (market_id) {
    case MARKET_SECTION.HOME_TOTAL:
      pairsObject = homeTotalPairsBySpecifier;
      outcomes.forEach((outcome) => {
        const spec = outcome.specifier;
        // Only process outcomes with valid specifier format and displayName
        if (
          !spec ||
          !outcome.displayName ||
          !spec.match(/total=(\d+(?:\.\d+)?)/)
        )
          return;
        if (!homeTotalPairsBySpecifier[spec])
          homeTotalPairsBySpecifier[spec] = {};
        if ((outcome.displayName || "").toLowerCase().includes("over")) {
          homeTotalPairsBySpecifier[spec].over = outcome;
        } else if (outcome.displayName.toLowerCase().includes("under")) {
          homeTotalPairsBySpecifier[spec].under = outcome;
        }
      });
      break;
    case MARKET_SECTION.AWAY_TOTAL:
      pairsObject = awayTotalPairsBySpecifier;

      outcomes.forEach((outcome) => {
        const spec = outcome.specifier;
        // Only process outcomes with valid specifier format and displayName
        if (
          !spec ||
          !outcome.displayName ||
          !spec.match(/total=(\d+(?:\.\d+)?)/)
        )
          return;
        if (!awayTotalPairsBySpecifier[spec])
          awayTotalPairsBySpecifier[spec] = {};
        if ((outcome.displayName || "")?.toLowerCase()?.includes("over")) {
          awayTotalPairsBySpecifier[spec].over = outcome;
        } else if (outcome.displayName?.toLowerCase().includes("under")) {
          awayTotalPairsBySpecifier[spec].under = outcome;
        }
      });
      break;
    default:
      pairsObject = ouPairsBySpecifier;

      outcomes.forEach((outcome) => {
        const spec = outcome.specifier;
        const outcomeName = (
          outcome.outcomeName ||
          outcome.displayName ||
          ""
        ).toLowerCase();

        // Match both formats: "total=X.5" and "total=X.5|quarternr=1"
        if (!spec || !spec.match(/total=(\d+(?:\.\d+)?)/)) return;

        if (!ouPairsBySpecifier[spec]) ouPairsBySpecifier[spec] = {};

        if (outcomeName.includes("over")) {
          ouPairsBySpecifier[spec].over = outcome;
        } else if (outcomeName.includes("under")) {
          ouPairsBySpecifier[spec].under = outcome;
        }
        title = "Over/Under";
      });
      break;
  }
  if (is_loading) return <SkeletonCard title={title} />;
  if (outcomes.length === 0) return null;

  const specifiers = Object.keys(pairsObject).sort((a, b) => {
    // Extract numeric value from specifier (handles both "total=3.5" and "total=3.5|quarternr=1")
    const getVal = (spec: string) => {
      const m = spec.match(/total=(\d+(?:\.\d+)?)/);
      return m ? parseFloat(m[1]) : 0;
    };

    const getQuarter = (spec: string) => {
      const m = spec.match(/quarternr=(\d+)/);
      return m ? parseInt(m[1]) : 0;
    };

    // Sort by quarter first, then by total value
    const quarterA = getQuarter(a);
    const quarterB = getQuarter(b);

    if (quarterA !== quarterB) {
      return quarterA - quarterB;
    }

    return getVal(a) - getVal(b);
  });

  // If no real outcomes, create dummy disabled buttons for predictable values
  const dummyValues = ["0.5", "1.5", "2.5", "3.5", "4.5"];
  const hasRealOutcomes = specifiers.length > 0;
  const displayItems = hasRealOutcomes
    ? specifiers
    : dummyValues.map((val) => `total=${val}`);

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
            {/* Column Headers */}
            <div className="grid grid-cols-[3rem_1fr_1fr] items-center mb-2">
              <span></span>
              <span
                className={`${marketClasses["axis-label-text"]} text-xs font-semibold text-center`}
              >
                Over
              </span>
              <span
                className={`${marketClasses["axis-label-text"]} text-xs font-semibold text-center`}
              >
                Under
              </span>
            </div>
            {displayItems.map((spec, index) => {
              const group = hasRealOutcomes ? pairsObject[spec] || {} : {};
              const value = spec.match(/total=(\d+(?:\.\d+)?)/)?.[1] || spec;

              // Extract quarter number if present (for NFL/Basketball quarters)
              const quarterMatch = spec.match(/quarternr=(\d+)/);
              const quarterLabel = quarterMatch ? ` Q${quarterMatch[1]}` : "";

              // Create fallback outcomes for disabled buttons
              const fallbackOverOutcome: Outcome = {
                outcomeName: "Over",
                specifier: spec,
                outcomeID: `${spec}-over-fallback`,
                odds: 0,
                oddID: 0,
                status: 0,
                active: 0,
                producerID: 0,
                marketID: 0,
                producerStatus: 0,
                displayName: "Over",
                marketName: "",
                marketId: 0,
              };

              const fallbackUnderOutcome: Outcome = {
                outcomeName: "Under",
                specifier: spec,
                outcomeID: `${spec}-under-fallback`,
                odds: 0,
                oddID: 0,
                status: 0,
                active: 0,
                producerID: 0,
                marketID: 0,
                producerStatus: 0,
                displayName: "Under",
                marketName: "",
                marketId: 0,
              };

              return (
                <div
                  key={spec}
                  className="grid grid-cols-[3rem_1fr_1fr] items-center"
                >
                  <span
                    className={`${marketClasses["axis-label-text"]} text-xs justify-center font-semibold min-w-[50px] flex items-center`}
                  >
                    {value}
                    {quarterLabel}
                  </span>

                  <OddsButton
                    outcome={group?.over || fallbackOverOutcome}
                    game_id={fixture_data?.gameID as unknown as number}
                    fixture_data={fixture_data}
                    // show_display_name={true}
                    height="h-12"
                    // bg_color={"bg-white text-black"}
                    //   height="h-12"
                    disabled={!group?.over || !hasRealOutcomes}
                    rounded={`${
                      displayItems?.length - 1 === index
                        ? "rounded-bl-md"
                        : index === 0
                        ? "rounded-tl-md"
                        : ""
                    }`}
                  />
                  <OddsButton
                    outcome={group?.under || fallbackUnderOutcome}
                    game_id={fixture_data?.gameID as unknown as number}
                    fixture_data={fixture_data}
                    // show_display_name={true}
                    // bg_color={"bg-white text-black"}
                    height="h-12"
                    // height="h-12"
                    disabled={!group?.under || !hasRealOutcomes}
                    rounded={`${
                      displayItems?.length - 1 === index
                        ? "rounded-br-md"
                        : index === 0
                        ? "rounded-tr-md"
                        : ""
                    }`}
                  />
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default OverUnder;
