import { Outcome } from "@/data/types/betting.types";
import { useBetting } from "@/hooks/useBetting";
import { PreMatchFixture } from "@/store/features/types/fixtures.types";
import { LockIcon } from "lucide-react";
import React, { useEffect } from "react";
import { FaArrowDown, FaArrowUp } from "react-icons/fa";
import { getClientTheme } from "@/config/theme.config";

type Props = {
  outcome: Outcome & { hasChange?: "up" | "down" };
  game_id: number;
  fixture_data: PreMatchFixture;
  show_display_name?: boolean;
  bg_color?: string;
  height?: string;
  disabled?: boolean;
  rounded?: string;
};

const OddsButton = ({
  outcome,
  game_id,
  fixture_data,
  show_display_name,
  bg_color,
  height,
  disabled,
  rounded = "rounded",
}: Props) => {
  const { checkBetSelected, toggleBet } = useBetting();
  const [is_disabled, setIsDisabled] = React.useState<boolean>(
    !!disabled || !outcome
  );
  const theme = getClientTheme();

  useEffect(() => {
    setIsDisabled(!!disabled || !outcome);
  }, [disabled, outcome]);
  const handleOddsPress = (outcome: Outcome) => {
    toggleBet({
      fixture_data: fixture_data as PreMatchFixture,
      outcome_data: outcome,
      element_id: fixture_data?.matchID!,
      bet_type: "pre",
      global_vars: {},
      bonus_list: [],
    });
  };
  const isSelected = checkBetSelected({
    game_id: game_id as unknown as number,
    odds_type: outcome?.displayName,
    market_id: Number(outcome?.marketID ?? outcome?.marketId),
    specifier: outcome?.specifier,
    outcome_id: outcome?.outcomeID,
  });

  // Get theme classes for odds button states
  const oddsButtonClasses = theme.classes.game_options_modal;

  // Determine button state classes
  const getButtonClasses = () => {
    if (is_disabled) {
      return `${oddsButtonClasses["odds-button-disabled-bg"]} ${oddsButtonClasses["odds-button-disabled-border"]} ${oddsButtonClasses["odds-button-disabled-text"]} opacity-50 cursor-not-allowed`;
    }

    if (isSelected) {
      return `${oddsButtonClasses["odds-button-selected-bg"]} ${oddsButtonClasses["odds-button-selected-border"]} ${oddsButtonClasses["odds-button-selected-text"]} ${oddsButtonClasses["odds-button-selected-hover"]}`;
    }

    // Use bg_color if provided (for backwards compatibility), otherwise use theme
    if (bg_color) {
      return bg_color;
    }

    return `${oddsButtonClasses["odds-button-bg"]} ${oddsButtonClasses["odds-button-border"]} ${oddsButtonClasses["odds-button-text"]} ${oddsButtonClasses["odds-button-hover"]}`;
  };

  return (
    <button
      key={outcome?.displayName}
      disabled={is_disabled}
      className={`${height} flex flex-col relative items-center w-full justify-center ${rounded} shadow-md px-2 py-0.5 min-w-[20px] transition-all border-2 text-base font-semibold ${getButtonClasses()}`}
      onClick={() => handleOddsPress(outcome)}
      type="button"
    >
      {is_disabled ? (
        <div className="flex flex-col items-center justify-center text-black">
          <LockIcon size={24} color="#a1a1a1" />
        </div>
      ) : (
        <>
          <span className="flex items-center  text-inherit text-[11px]">
            {show_display_name && outcome?.displayName}
            {outcome?.hasChange === "up" && (
              <div className="absolute top-0 right-0 bg-[#10B981]/20 p-1 flex justify-center items-center h-full w-full">
                <div className="absolute -top-1 -right-1 font-semibold p-1 flex justify-center items-center rounded-full h-6 w-6">
                  <FaArrowUp size={14} color="#10B981" />
                </div>
              </div>
            )}
            {outcome?.hasChange === "down" && (
              <div
                className={`absolute top-0 right-0 bg-[#EF4444]/20 p-1 flex justify-center items-center h-full w-full`}
              >
                <div
                  className={`absolute -top-1 -right-1 p-1 flex justify-center items-center rounded-full h-6 w-6`}
                >
                  <FaArrowDown size={14} color="#EF4444" />
                </div>
              </div>
            )}
          </span>
          <span className="font-bold text-xs text-inherit">
            {outcome?.odds.toFixed(2)}
          </span>
        </>
      )}
    </button>
  );
};

export default OddsButton;
