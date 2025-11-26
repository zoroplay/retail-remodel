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
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import { getClientTheme } from "@/config/theme.config";
function groupExactGoals(outcomes: Outcome[]) {
  const groups: Record<string, Outcome[]> = {};
  outcomes.forEach((outcome) => {
    const spec = outcome.specifier;
    if (!spec) return;
    if (!groups[spec]) groups[spec] = [];
    groups[spec].push(outcome);
  });
  return groups;
}
const ExactGoals = ({
  fixture_data,
  market_id = MARKET_SECTION.EXACT_GOALS,
  disabled,
  is_loading,
}: OutcomeProps & { market_id?: number }) => {
  const [is_collapsed, setIsCollapsed] = useState<boolean>(false);
  const theme = getClientTheme();
  const marketClasses = theme.classes.game_options_modal;
  const outcomes =
    fixture_data?.outcomes?.filter(
      (outcome) => (outcome.marketID ?? outcome.marketId) === market_id
    ) || [];

  let title =
    outcomes.find((item) => !!item.marketName)?.marketName || "Exact Goals";
  const groups = groupExactGoals(outcomes);

  const specifiers = Object.keys(groups);

  if (is_loading) return <SkeletonCard title={title} />;
  if (outcomes.length === 0) return null;

  const key = Object.keys(groups)[0];

  // ✅ Get the length of the array for that key
  const length = groups[key]?.length;

  let group_class = ``;
  switch (length) {
    case 7:
      group_class = "grid-cols-[repeat(7,1fr)]";
      break;
    case 6:
      group_class = "grid-cols-[repeat(6,1fr)]";
      break;
    case 5:
      group_class = "grid-cols-[repeat(5,1fr)]";
      break;
    case 4:
      group_class = "grid-cols-[repeat(4,1fr)]";
      break;
    case 3:
      group_class = "grid-cols-[repeat(3,1fr)]";
      break;
    default:
      group_class = "grid-cols-[repeat(2,1fr)]";
  }
  return (
    <div
      className={`shadow-2xl ${marketClasses["market-card-bg"]} ${marketClasses["market-card-border"]} border rounded-md p-1 pb-2 ${marketClasses["market-card-hover"]}`}
    >
      <div className="">
        <button
          className="w-full flex items-center justify-between px-3 py-1 text-left"
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
            {specifiers.map((spec) => {
              const group = groups[spec];
              const value = spec.replace("variant=sr:exact_goals:", "");
              return (
                <div
                  key={spec}
                  className={`grid grid-cols-[3rem_1fr] items-center`}
                >
                  <span className="text-gray-400 text-xs justify-center font-semibold min-w-[40px] flex items-center">
                    {value}
                  </span>
                  <div className={`grid ${group_class}`}>
                    {group
                      .sort((a, b) => {
                        const parseGoal = (g: Outcome) => {
                          if (g.displayName?.includes("+")) return 99;
                          return parseInt(g.displayName, 10) || 0;
                        };
                        return parseGoal(a) - parseGoal(b);
                      })
                      .map((outcome, index) => (
                        <div
                          key={outcome.outcomeID}
                          className="flex flex-col items-center"
                        >
                          <OddsButton
                            key={outcome.outcomeID}
                            outcome={outcome}
                            game_id={fixture_data?.gameID as unknown as number}
                            fixture_data={fixture_data as PreMatchFixture}
                            show_display_name={true}
                            // bg_color={"bg-white text-black"}
                            height="h-12"
                            disabled={outcome ? false : true}
                            rounded={`${
                              index === 0
                                ? "rounded-l-md"
                                : index === group.length - 1
                                ? "rounded-r-md"
                                : ""
                            }`}
                          />
                        </div>
                      ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExactGoals;
