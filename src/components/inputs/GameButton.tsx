import React, { useEffect, useState } from "react";
// import {
//   MdLock,
//   MdArrowUpward,
//   MdArrowDownward,
//   MdRemove,
// } from "react-icons/md";
import { AppHelper } from "../../lib/helper";
import { selectOddsChange } from "../../store/features/slice/betting.slice";
import { useAppSelector } from "../../store/hooks/useAppDispatch";
import { ArrowDown, ArrowUp, Lock, X } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  is_selected?: boolean;
  disabled?: boolean;
  variant?: "primary" | "secondary" | "outline" | "danger" | "odds";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: string;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  onClick?: () => void;
  // Odds tracking props
  match_id?: number;
  outcome_id?: string;
  // Suspension props
  match_status?: string;
  outcome?: any;
}

const GameButton: React.FC<ButtonProps> = ({
  title,
  variant = "primary",
  size = "md",
  isLoading = false,
  icon,
  iconPosition = "left",
  fullWidth = false,
  disabled = false,
  is_selected = false,
  onClick,
  match_id,
  outcome_id,
  match_status,
  outcome,
  ...props
}) => {
  // Odds change tracking
  const oddsChange = useAppSelector((state) => {
    if (!match_id || !outcome_id || !state.betting) {
      return undefined;
    }
    try {
      return selectOddsChange(state as any, match_id, outcome_id);
    } catch (error) {
      console.warn("Error accessing odds change:", error);
      return undefined;
    }
  });

  const [showChangeIndicator, setShowChangeIndicator] = useState(false);
  const [animationClass, setAnimationClass] = useState("");

  const isMatchSuspended = AppHelper.isMatchSuspended(match_status || 0);
  const isOutcomeSuspended = !outcome
    ? AppHelper.isOutcomeSuspended(outcome)
    : false;
  const isOddsZero = parseFloat(title) === 0;
  const shouldBeSuspended = isMatchSuspended || isOddsZero;

  // Show change indicator when odds change
  useEffect(() => {
    if (oddsChange) {
      setShowChangeIndicator(true);
      setAnimationClass("animate-pulse animate-bounce");

      // Auto-hide after display duration
      const timer = setTimeout(() => {
        setAnimationClass("animate-fade-out");
        setTimeout(() => {
          setShowChangeIndicator(false);
          setAnimationClass("");
        }, 300);
      }, oddsChange.display_until - Date.now());

      return () => clearTimeout(timer);
    }
  }, [oddsChange]);

  // Determine background color based on variant and state
  const getBackgroundColor = () => {
    if (disabled || shouldBeSuspended) return "bg-gray-400";

    // Add odds change color effects
    if (showChangeIndicator && oddsChange) {
      if (oddsChange.change_direction === "up") {
        return "bg-green-100 border-green-500";
      } else if (oddsChange.change_direction === "down") {
        return "bg-red-100 border-red-500";
      }
    }

    switch (variant) {
      case "primary":
        return "bg-game-btn";
      case "secondary":
        return "bg-gray-500";
      case "outline":
        return "bg-transparent";
      case "danger":
        return "bg-red-500";
      case "odds":
        if (is_selected) return "!bg-game-btn-selected";
        return "bg-game-btn";
      default:
        return "bg-game-btn";
    }
  };

  // Determine text color based on variant and state
  const getTextColor = () => {
    if (disabled || shouldBeSuspended) return "text-gray-500";

    switch (variant) {
      case "outline":
        return "text-game-btn";
      case "odds":
        return "text-white";
      default:
        return "text-white";
    }
  };

  // Determine border based on variant
  const getBorder = () => {
    switch (variant) {
      case "outline":
        return "border border-game-btn";
      case "odds":
        if (is_selected) return "!border-none";
        return "border border-game-btn";
      default:
        return "";
    }
  };

  // Determine padding based on size
  const getPadding = () => {
    switch (size) {
      case "sm":
        return "py-1 px-2";
      case "lg":
        return "py-3 px-2";
      default:
        return "py-2 px-2";
    }
  };

  // Determine text size based on button size
  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-sm";
      case "lg":
        return "text-lg";
      default:
        return "text-base";
    }
  };

  return (
    <button
      className={`rounded cursor-pointer active:scale-95 transition-all flex items-center justify-center h-[44px] relative ${getBackgroundColor()} ${getBorder()} ${getPadding()} w-full ${
        disabled || shouldBeSuspended ? "opacity-60" : ""
      } ${is_selected ? "ring-2 ring-game-btn-selected" : ""}`}
      disabled={disabled || isLoading || shouldBeSuspended}
      onClick={shouldBeSuspended ? undefined : onClick}
      {...props}
    >
      <div className="flex items-center justify-center relative">
        {isLoading ? (
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
        ) : (
          <>
            {shouldBeSuspended ? (
              // Show padlock for suspended matches
              <div className="flex items-center justify-center">
                <Lock
                  size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
                  color="#9CA3AF"
                />
              </div>
            ) : (
              <>
                {icon && iconPosition === "left" && (
                  <div className="mr-2">
                    {/* Icon placeholder - you can add icon mapping here if needed */}
                  </div>
                )}
                <p
                  className={`${getTextColor()} ${getTextSize()} font-semibold text-center`}
                >
                  {title}
                </p>
                {icon && iconPosition === "right" && (
                  <div className="ml-2">
                    {/* Icon placeholder - you can add icon mapping here if needed */}
                  </div>
                )}
              </>
            )}

            {/* Odds Change Indicator */}
            {showChangeIndicator && oddsChange && (
              <div
                className={`absolute -top-2 -right-2 px-1 py-0.5 rounded-full z-10 ${animationClass} ${
                  oddsChange.change_direction === "up"
                    ? "bg-green-500"
                    : oddsChange.change_direction === "down"
                    ? "bg-red-500"
                    : "bg-gray-500"
                }`}
              >
                <div className="flex items-center">
                  {oddsChange.change_direction === "up" ? (
                    <ArrowUp size={14} color="white" />
                  ) : oddsChange.change_direction === "down" ? (
                    <ArrowDown size={14} color="white" />
                  ) : (
                    <X size={14} color="white" />
                  )}
                  <p className="text-white text-xs font-bold ml-1">
                    {oddsChange.change_direction === "up" ? "+" : ""}
                    {(
                      ((oddsChange.current_odds - oddsChange.previous_odds) /
                        oddsChange.previous_odds) *
                      100
                    ).toFixed(1)}
                    %
                  </p>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </button>
  );
};

export default GameButton;
