import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoClose } from "react-icons/io5";
import { useTheme } from "../providers/ThemeProvider";
import { X } from "lucide-react";
import { getClientTheme } from "../../config/theme.config";

interface SideOverlayProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title?: string | React.ReactNode;
  width?: string; // Tailwind width class, e.g. w-[400px]
  children: React.ReactNode;
  backdrop?: boolean;
  className?: string;
  variant?: "default" | "game_options"; // Add variant prop to select styling
}

const SideOverlay: React.FC<SideOverlayProps> = ({
  open,
  onOpenChange,
  title,
  width = "w-[400px]",
  children,
  backdrop = true,
  className = "",
  variant = "default",
}) => {
  const { theme } = useTheme();
  const { classes } = getClientTheme();

  // Get styling based on variant
  const getVariantStyles = () => {
    return {
      background: classes.game_options_modal["modal-bg"],
      border: classes.game_options_modal["modal-border"],
      titleText: classes.game_options_modal["title-text"],
      headerBorder: classes.game_options_modal["modal-border"],
    };
  };

  const styles = getVariantStyles();

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          {backdrop && (
            <motion.div
              key="side-overlay-backdrop"
              className="fixed inset-0 z-[1000] bg-black/30 backdrop-blur-sm transition-opacity"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              onClick={() => onOpenChange(false)}
            />
          )}
          {/* Side Panel */}
          <motion.aside
            key="side-overlay-panel"
            className={`fixed top-0 right-0 z-[1210] h-full ${width} max-w-full flex flex-col shadow-2xl ${styles.background} border-l ${styles.border} ${styles.titleText} ${className}`}
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 400, damping: 40 }}
            style={{ boxShadow: "-4px 0 32px 0 rgba(0,0,0,0.12)" }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div
              className={`flex items-center justify-between px-6 py-4 border-b ${styles.headerBorder} sticky top-0 bg-inherit z-10`}
            >
              <span className={`text-lg font-semibold ${styles.titleText}`}>
                {title}
              </span>
              <button
                onClick={() => onOpenChange(false)}
                className={`w-9 h-9 flex items-center justify-center rounded-full transition-colors ${
                  variant === "game_options"
                    ? "hover:bg-opacity-20 hover:bg-white"
                    : "hover:bg-gray-200 dark:hover:bg-slate-800"
                }`}
                aria-label="Close"
              >
                <X size={22} />
              </button>
            </div>
            {/* Content */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden px-4 max-h-[90vh] py-2">
              {children}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};

export default SideOverlay;
