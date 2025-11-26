import React, { forwardRef } from "react";
import { IconType } from "react-icons";
import Spinner from "../layouts/Spinner";
import { Loader } from "lucide-react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  title: string;
  variant?: "primary" | "secondary" | "outline" | "danger";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  icon?: IconType;
  iconPosition?: "left" | "right";
  fullWidth?: boolean;
  height?: string;
  onPress?: React.MouseEventHandler<HTMLButtonElement>;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      title,
      variant = "primary",
      size = "md",
      isLoading = false,
      icon: Icon,
      iconPosition = "left",
      fullWidth = false,
      height = "h-[42px]",
      disabled,
      className,
      onClick,
      onPress,
      type,
      ...rest
    },
    ref
  ) => {
    // Determine background color based on variant
    const getBackgroundColor = () => {
      if (disabled) return "bg-gray-300";

      switch (variant) {
        case "primary":
          return "bg-primary";
        case "secondary":
          return "bg-gray-500";
        case "outline":
          return "bg-transparent";
        case "danger":
          return "bg-red-500";
        default:
          return "bg-btn-primary";
      }
    };

    // Determine text color based on variant
    const getTextColor = () => {
      if (disabled) return "text-gray-500";

      switch (variant) {
        case "outline":
          return "text-btn-primary";
        default:
          return "text-white";
      }
    };

    // Determine border based on variant
    const getBorder = () => {
      switch (variant) {
        case "outline":
          return "border border-btn-primary";
        default:
          return "";
      }
    };

    // Determine padding based on size
    const getPadding = () => {
      switch (size) {
        case "sm":
          return "p-2";
        case "lg":
          return "p-3";
        default:
          return "p-2";
      }
    };

    // Determine text size based on button size
    const getTextSize = () => {
      switch (size) {
        case "sm":
          return "text-xs";
        case "lg":
          return "text-lg";
        default:
          return "text-base";
      }
    };

    return (
      <button
        ref={ref}
        type={type ?? "button"}
        className={`rounded-md cursor-pointer flex items-center justify-center ${height} ${getBackgroundColor()} ${getBorder()} ${getPadding()} ${
          fullWidth ? "w-full" : ""
        } ${disabled ? "opacity-60" : ""} ${className ?? ""}`}
        disabled={disabled || isLoading}
        onClick={onClick ?? onPress}
        {...rest}
      >
        <div className="flex items-center  gap-2 justify-center flex-row">
          <>
            {/* {Icon && iconPosition === "left" && React.createElement(Icon, {
                size: size === "sm" ? 16 : size === "lg" ? 24 : 20,
                color: variant === "outline" ? "#3b82f6" : "#ffffff",
                style: { marginRight: 8 }
              })} */}
            <p
              className={`${getTextColor()} ${getTextSize()} font-semibold text-center`}
            >
              {title}
            </p>
            {isLoading ? <Loader className="animate-spin" /> : null}
            {/* {Icon && iconPosition === "right" && (
                <Icon
                  size={size === "sm" ? 16 : size === "lg" ? 24 : 20}
                  color={variant === "outline" ? "#3b82f6" : "#ffffff"}
                  style={{ marginLeft: 8 }}
                />
              )} */}
          </>
        </div>
      </button>
    );
  }
);

export default Button;
