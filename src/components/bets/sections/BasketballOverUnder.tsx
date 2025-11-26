import { Outcome } from "@/data/types/betting.types";
import React, { useState } from "react";
import {
  IoChevronForward,
  IoChevronDown,
  IoInformationCircleOutline,
} from "react-icons/io5";
import OddsButton from "@/components/buttons/OddsButton";
import { SkeletonCard } from "@/components/skeletons/OutComesSkeleton";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import { getClientTheme } from "@/config/theme.config";

type Props = {
  fixture_data: PreMatchFixture;
  disabled?: boolean;
  is_loading?: boolean;
  outcomes: Outcome[]; // Pass outcomes directly (for basketball, multiple marketIds)
};

const BasketballOverUnder = ({
  fixture_data,
  disabled,
  is_loading,
  outcomes,
}: Props) => {
  const [is_collapsed, setIsCollapsed] = useState<boolean>(false);
  const theme = getClientTheme();
  const marketClasses = theme.classes.game_options_modal;

  // Get title - use generic "Over/Under" for basketball
  let title = "Over/Under";
  const firstMarketName = outcomes.find(
    (item) => !!item.marketName
  )?.marketName;
  if (firstMarketName && firstMarketName !== "O/U") {
    title = firstMarketName;
  }

  if (is_loading) return <SkeletonCard title={title} />;
  console.log("BasketballOverUnder outcomes:", outcomes);
  if (outcomes.length === 0) return null;

  // Create pairs object for over/under grouping
  const pairsBySpecifier: Record<string, { over?: Outcome; under?: Outcome }> =
    {};

  // Group outcomes by specifier (works across multiple market IDs)
  outcomes.forEach((outcome) => {
    const spec = outcome.specifier;
    const outcomeName = (
      outcome.outcomeName ||
      outcome.displayName ||
      ""
    ).toLowerCase();

    // Only process outcomes with valid specifier format
    if (!spec || !spec.match(/total=(\d+(?:\.\d+)?)/)) return;

    if (!pairsBySpecifier[spec]) {
      pairsBySpecifier[spec] = {};
    }

    if (outcomeName.includes("over")) {
      pairsBySpecifier[spec].over = outcome;
    } else if (outcomeName.includes("under")) {
      pairsBySpecifier[spec].under = outcome;
    }
  });

  // Sort specifiers by numeric value
  const specifiers = Object.keys(pairsBySpecifier).sort((a, b) => {
    const getVal = (spec: string) => {
      const m = spec.match(/total=(\d+(?:\.\d+)?)/);
      return m ? parseFloat(m[1]) : 0;
    };
    return getVal(a) - getVal(b);
  });

  const hasRealOutcomes = specifiers.length > 0;
  if (!hasRealOutcomes) return null;

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
            {specifiers.map((spec, index) => {
              const group = pairsBySpecifier[spec] || {};
              const value = spec.match(/total=(\d+(?:\.\d+)?)/)?.[1] || spec;

              return (
                <div
                  key={spec}
                  className="grid grid-cols-[4rem_1fr_1fr] items-center"
                >
                  <span className="text-gray-400 text-sm justify-center font-semibold min-w-[70px] flex items-center">
                    {value}
                  </span>

                  <OddsButton
                    outcome={group?.over!}
                    game_id={fixture_data?.gameID as unknown as number}
                    fixture_data={fixture_data}
                    show_display_name={true}
                    bg_color={"bg-white text-black"}
                    height="h-12"
                    disabled={!group?.over || disabled}
                    rounded={`${
                      specifiers?.length - 1 === index
                        ? "rounded-bl-md"
                        : index === 0
                        ? "rounded-tl-md"
                        : ""
                    }`}
                  />
                  <OddsButton
                    outcome={group?.under!}
                    game_id={fixture_data?.gameID as unknown as number}
                    fixture_data={fixture_data}
                    show_display_name={true}
                    height="h-12"
                    bg_color={"bg-white text-black"}
                    disabled={!group?.under || disabled}
                    rounded={`${
                      specifiers?.length - 1 === index
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

export default BasketballOverUnder;
