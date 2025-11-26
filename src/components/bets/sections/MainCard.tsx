import React, { useState } from "react";
import { OutcomeProps } from ".";
import { SkeletonCard } from "@/components/skeletons/OutComesSkeleton";
import {
  IoChevronForward,
  IoChevronDown,
  IoInformationCircleOutline,
} from "react-icons/io5";
import OddsButton from "@/components/buttons/OddsButton";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import { getClientTheme } from "@/config/theme.config";
type Props = {
  fixture_data: PreMatchFixture;
  disabled?: boolean;
  is_loading?: boolean;
  market_id: number;
};
const MainCard = ({ fixture_data, disabled, is_loading, market_id }: Props) => {
  const [is_collapsed, setIsCollapsed] = useState<boolean>(false);
  const theme = getClientTheme();
  const marketClasses = theme.classes.game_options_modal;

  const outcomes =
    fixture_data?.outcomes?.filter(
      (outcome) => (outcome.marketID || outcome.marketId) === market_id
    ) || [];
  let title = outcomes.find((item) => !!item.marketName)?.marketName || "";
  if (is_loading) return <SkeletonCard title={title} />;
  if (outcomes.length === 0) return null;
  if (!title) return null;
  let gridColsClass = "";
  switch (outcomes.length) {
    case 1:
      gridColsClass = "grid-cols-1";
      break;
    case 2:
      gridColsClass = "grid-cols-2";
      break;
    case 3:
      gridColsClass = "grid-cols-3";
      break;
    case 4:
      gridColsClass = "grid-cols-4";
      break;
    case 5:
      gridColsClass = "grid-cols-5";
      break;
    case 6:
      gridColsClass = "grid-cols-6";
      break;
    case 7:
      gridColsClass = "grid-cols-7";
      break;
    default:
      gridColsClass = "grid-cols-2";
  }

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
          <div className={`grid px-2 ${gridColsClass}`}>
            {outcomes.map((outcome, index) => (
              <OddsButton
                key={outcome?.outcomeID}
                outcome={outcome}
                game_id={fixture_data?.gameID as unknown as number}
                fixture_data={fixture_data}
                show_display_name={true}
                // bg_color={"bg-white text-black"}
                height="h-12"
                disabled={disabled}
                rounded={`${
                  index === 0
                    ? "rounded-l-md"
                    : outcomes.length - 1 === index
                    ? "rounded-r-md"
                    : ""
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MainCard;
