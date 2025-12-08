// BetCruz palette colors for client 10 (from brand manual)
export const CLIENT_10_PALETTE = {
  E43402: "#E43402", // Red Orange
  E26F12: "#E26F12", // Orange
  "884816": "#884816", // Brown
  FCE4BF: "#FCE4BF", // Cream
  E9B593: "#E9B593", // Light Brown
  EF6006: "#EF6006", // Orange
  FCEDCB: "#FCEDCB", // Light Cream
  EB8093: "#EB8093", // Sand
  "894824": "#894824", // Brown
  E43302: "#E43302", // Red Orange
  FA9602: "#FA9602", // Carrot Orange
  EC4500: "#EC4500", // Molten Orange
  E6B394: "#E6B394", // Desert Sand
  FBE4CF: "#FBE4CF", // Almond Cream
  F99C02: "#F99C02", // Amber Glow
  FG8400: "#FG8400", // Tiger Orange (possible typo, should be FG -> F68400)
  F68400: "#F68400", // Tiger Orange (corrected)
};
/* eslint-disable @typescript-eslint/no-explicit-any */
import environmentConfig, {
  getEnvironmentVariable,
  ENVIRONMENT_VARIABLES,
} from "../store/services/configs/environment.config";

export interface ThemeColors {
  // Primary colors
  primary: string;
  "primary-light": string;
  "primary-dark": string;

  // Background colors
  "bg-main": string;
  "bg-secondary": string;
  "bg-tertiary": string;

  // Gradient backgrounds
  "bg-gradient": string;
  "bg-gradient-hover": string;

  // Accent colors
  accent: string;
  "accent-light": string;
  "accent-dark": string;

  // Text colors
  "text-primary": string;
  "text-secondary": string;
  "text-muted": string;

  // Border colors
  border: string;
  "border-light": string;
  "border-dark": string;

  // Button colors
  "button-primary": string;
  "button-primary-hover": string;
  "button-secondary": string;
  "button-secondary-hover": string;

  // Card colors
  "card-bg": string;
  "card-border": string;
  "card-shadow": string;

  // Status colors (shared across themes)
  success: string;
  warning: string;
  error: string;
  info: string;
}

export interface ThemeClasses {
  app_header: {
    "header-gradient": string;
    "highlight-indicator": string;
    "active-route-indicator": string;
    "inactive-route-indicator": string;
    divider: string;
    "login-button-bg": string;
    "login-button-hover": string;
    "login-button-text": string;
  };
  sports_sidebar: {
    "main-bg": string;
    "search-bg": string;
    "search-border": string;
    "card-border": string;
    "sport-item-border-l": string;
    divider: string;
    "item-bg": string;
    "sport-item-border": string;
    "sport-item-bg": string;
    "sport-item-hover": string;
    "sport-item-text": string;
    "sport-item-count-bg": string;
    "sport-item-count-text": string;
    "category-item-bg": string;
    "category-item-border": string;
    "category-item-active": string;
    "category-item-hover": string;
    "category-item-text": string;
    "category-item-count-bg": string;
    "category-item-count-text": string;
    "tournament-item-bg": string;
    "tournament-item-hover": string;
    "tournament-item-text": string;
    "tournament-item-count-bg": string;
    "tournament-item-count-text": string;
    "tournament-item-border": string;
    "account-icon-active": string;
  };
  betslip: {
    "main-bg": string;
    "main-border": string;
    "header-bg": string;
    divider: string;
    "tab-bg": string;
    "tab-border": string;
    "tab-active-bg": string;
    "tab-active-text": string;
    "tab-inactive-text": string;
    "outcome-name-text": string;
    "button-place-bg": string;
    "button-place-hover": string;
    "button-place-text": string;
    "button-confirm-bg": string;
    "button-confirm-hover": string;
    "button-cancel-bg": string;
    "button-cancel-hover": string;
    "slip-item-bg": string;
    "slip-item-selected-bg": string;
    "slip-item-divider": string;
    "slip-item-header": string;
    "slip-item-main": string;
    "slip-item-odds": string;
    "slip-item-remove": string;
    "slip-item-market": string;
    "slip-item-footer": string;
    "multiple-section-bg": string;
    "combined-section-bg": string;
    // --- Action buttons ---
  };
  sports_page: {
    "container-bg": string;
    "card-bg": string;
    "card-border": string;
    "card-hover": string;
    "header-bg": string;
    "header-border": string;
    "header-text": string;
    "sport-separator-bg": string;
    "sport-separator-text": string;
    "sport-separator-border": string;
    "date-separator-bg": string;
    "date-separator-text": string;
    "date-separator-border": string;
    "time-text": string;
    "time-text-live": string;
    "time-border": string;
    "match-tournament-text": string;
    "match-team-text": string;
    "score-text": string;
    "more-button-bg": string;
    "more-button-hover": string;
    "more-button-text": string;
    "more-button-border": string;
    "primary-button-bg": string;
    "primary-button-text": string;
    "secondary-button-bg": string;
    "secondary-button-text": string;
    "skeleton-bg": string;
    "skeleton-secondary": string;
    "error-text": string;
    "error-secondary": string;
    "empty-text": string;
    "empty-secondary": string;
    "live-game-indicator": string;
  };
  cashdesk_page: {
    "container-bg": string;
    "card-bg": string;
    "card-border": string;
    "header-bg": string;
    "header-text": string;
    "column-header-bg": string;
    "column-header-text": string;
    "column-header-border": string;
    "row-hover": string;
    "input-bg": string;
    "input-border": string;
    "input-text": string;
    "summary-section-bg": string;
    "summary-section-border": string;
    "summary-item-bg": string;
    "summary-item-border": string;
    "summary-label-text": string;
    "summary-value-text": string;
    "add-button-bg": string;
    "add-button-hover": string;
    "add-button-border": string;
  };
  bet_list_page: {
    "container-bg": string;
    "card-bg": string;
    "card-border": string;
    "card-text": string;
    "column-header-bg": string;
    "column-header-text": string;
    "row-hover": string;
    "input-bg": string;
    "input-border": string;
    "input-text": string;
    "header-text": string;
    "close-button": string;
    "close-button-hover": string;
    "section-bg": string;
    "section-title": string;
    "label-text": string;
    "value-text": string;
    "item-bg": string;
    "event-name": string;
    "subtitle-text": string;
    "action-button": string;
    "action-button-hover": string;
    "secondary-button": string;
    "secondary-button-hover": string;
  };

  coupon_details: {
    "section-bg": string;
    "section-border": string;
    "section-title": string;
    "label-text": string;
    "value-text": string;
    "item-bg": string;
    "item-border": string;
    "event-name": string;
    "subtitle-text": string;
    divider: string;
    "win-text": string;
    "skeleton-bg": string;
    "skeleton-pulse": string;
    "action-button": string;
    "action-button-hover": string;
    "secondary-button": string;
    "secondary-button-hover": string;
  };
  transactions_page: {
    "container-bg": string;
    "card-bg": string;
    "card-border": string;
    "card-text": string;
    "column-header-bg": string;
    "column-header-text": string;
    "row-hover": string;
    "row-text": string;
    "input-bg": string;
    "input-border": string;
    "input-text": string;
    "label-text": string;
    "value-text": string;
    "credit-text": string;
    "debit-text": string;
    "button-primary-bg": string;
    "button-primary-hover": string;
    "button-primary-text": string;
    "button-secondary-bg": string;
    "button-secondary-hover": string;
    "button-secondary-text": string;
    "checkbox-active-bg": string;
    "checkbox-active-border": string;
    "checkbox-inactive-border": string;
    "footer-bg": string;
  };
  deposit_page: {
    "container-bg": string;
    "page-bg": string;
    "page-text": string;
    "header-text": string;
    "warning-bg": string;
    "warning-border": string;
    "warning-icon": string;
    "warning-text": string;
    "card-bg": string;
    "card-border": string;
    "table-header-bg": string;
    "table-header-text": string;
    "row-hover": string;
    "row-text": string;
    "label-text": string;
    "value-text": string;
    "button-primary-bg": string;
    "button-primary-hover": string;
    "button-primary-text": string;
    "button-secondary-bg": string;
    "button-secondary-hover": string;
    "button-secondary-text": string;
    "form-bg": string;
    "form-border": string;
    "form-text": string;
    "info-bg": string;
    "info-border": string;
    "info-text": string;
    "input-bg": string;
    "input-border": string;
    "input-text": string;
    "balance-text": string;
    "balance-value": string;
    "quick-button-bg": string;
    "quick-button-hover": string;
    "quick-button-text": string;
    "quick-button-border": string;
    "security-bg": string;
    "security-border": string;
    "security-text": string;
  };
  account_page: {
    "container-bg": string;
    "card-bg": string;
    "card-border": string;
    "header-text": string;
    "subtitle-text": string;
    "section-header-text": string;
    "section-header-border": string;
    "input-bg": string;
    "input-border": string;
    "input-text": string;
    "balance-card-bg": string;
    "balance-card-border": string;
    "balance-label-text": string;
    "balance-value-text": string;
    "button-primary-bg": string;
    "button-primary-hover": string;
    "button-primary-text": string;
  };
  user_management_page: {
    "page-bg": string;
    "page-text": string;
    "header-icon-bg": string;
    "header-icon-text": string;
    "header-text": string;
    "subtitle-text": string;
    "card-bg": string;
    "card-border": string;
    "section-header-text": string;
    "section-header-border": string;
    "column-header-bg": string;
    "column-header-text": string;
    "row-hover": string;
    "row-text": string;
    "row-border": string;
    "balance-text": string;
    "input-bg": string;
    "input-border": string;
    "input-text": string;
    "button-primary-bg": string;
    "button-primary-hover": string;
    "button-primary-text": string;
    "button-secondary-bg": string;
    "button-secondary-hover": string;
    "button-secondary-text": string;
    "button-action-deposit-bg": string;
    "button-action-deposit-hover": string;
    "button-action-deposit-text": string;
    "button-action-withdraw-bg": string;
    "button-action-withdraw-hover": string;
    "button-action-withdraw-text": string;
    "info-card-bg": string;
    "info-card-border": string;
    "info-label-text": string;
    "info-value-text": string;
    "badge-deposit-bg": string;
    "badge-deposit-text": string;
    "badge-withdraw-bg": string;
    "badge-withdraw-text": string;
  };
  main_input: {
    background: string;
    border: string;
    "text-color": string;
  };
  game_options_modal: {
    "modal-border": string;
    "header-title": string;
    "header-subtitle": string;
    "header-vs-text": string;
    "header-date-text": string;
    "title-text": string;
    "subtitle-text": string;
    "market-card-bg": string;
    "market-card-border": string;
    "market-card-hover": string;
    "market-title": string;
    "axis-label-text": string;
    "axis-label-bg": string;
    "odds-button-bg": string;
    "odds-button-hover": string;
    "odds-button-text": string;
    "odds-button-border": string;
    "odds-button-selected-bg": string;
    "odds-button-selected-border": string;
    "odds-button-selected-text": string;
    "odds-button-selected-hover": string;
    "odds-button-disabled-bg": string;
    "odds-button-disabled-text": string;
    "odds-button-disabled-border": string;
  };
  modal: {
    change_password: {
      "modal-bg": string;
      "modal-border": string;
      "modal-shadow": string;
      "header-border": string;
      "header-title": string;
      "header-icon": string;
      "close-button": string;
      "close-button-hover": string;
      "info-box-bg": string;
      "info-box-border": string;
      "info-box-text": string;
      "cancel-button-bg": string;
      "cancel-button-hover": string;
      "cancel-button-text": string;
      "confirm-button-bg": string;
      "confirm-button-hover": string;
      "confirm-button-text": string;
      "confirm-button-shadow": string;
    };
    "overlay-bg": string;
    "content-bg": string;
    "content-border": string;
    "header-bg": string;
    "header-text": string;
    "header-border": string;
    "body-bg": string;
    "body-text": string;
    "footer-bg": string;
    "footer-border": string;
    "close-button": string;
    "close-button-hover": string;
  };
  "bg-main": string;
  "bg-secondary": string;
  "bg-tertiary": string;
  "bg-gradient": string;
  "bg-gradient-hover": string;
  "text-primary": string;
  "text-secondary": string;
  "text-muted": string;
  border: string;
  "border-light": string;
  primary: string;
  "primary-bg": string;
  "primary-hover": string;
  accent: string;
  "accent-bg": string;
  "button-primary": string;
  "button-secondary": string;
  card: string;
  "card-hover": string;
  "input-bg": string;
  "card-bg": string;
  "input-border": string;
  "input-focus-within": string;
  "input-ring": string;
  "select-option-bg": string;
  "input-text": string;

  // Base utility classes
  "item-hover-border-l": string;
  "light-divider": string;
  "dark-divider": string;
  "skeleton-bg": string;
  "button-primary-bg": string;
  "button-primary-border": string;
  "button-primary-hover": string;
  "button-primary-text": string;
  "button-secondary-bg": string;
  "button-secondary-border": string;
  "button-secondary-hover": string;
  "button-secondary-text": string;
  "modal-bg": string;
  "button-cancel-bg": string;
  "button-cancel-hover": string;
  "button-cancel-text": string;
  "button-cancel-border": string;
  "button-proceed-bg": string;
  "button-proceed-hover": string;
  "button-proceed-text": string;
  "button-proceed-border": string;
}

export interface ClientTheme {
  clientId: string;
  clientName: string;
  colors: ThemeColors;
  cssVariables: Record<string, string>;
  classes: ThemeClasses;
}

// ============================================================================
// THEME CONFIGURATION - ORGANIZED BY PROPERTY
// Edit all clients for a specific property in one section
// ============================================================================

// Client Names
const CLIENTNAMES = {
  "1": "Red & White Sports",
  "5": "Blue & White Premium",
  "9": "Black & Gold Luxury",
  "10": "Purple & Violet Premium",
  default: "Default Dark Gray Theme",
};

// ============================================================================
// PRIMARY COLORS
// ============================================================================
const PRIMARYCOLORS = {
  "1": "#dc2626", // Client 1: Red (main brand color)
  "5": "#1e40af", // Client 5: Deep Blue with touch of red
  "9": "#d4af37", // Client 9: Gold (main brand color)
  "10": "#EA3C00", // Client 10: BetCruz Orange (main brand color)
  default: "#6b7280", // Default: Gray-500
};

const PRIMARYLIGHTCOLORS = {
  "1": "#ef4444", // Client 1: Lighter Red
  "5": "#3b82f6", // Client 5: Medium Blue
  "9": "#ffd700", // Client 9: Bright Gold
  "10": "#FEA352", // Client 10: Light Orange
  default: "#9ca3af", // Default: Gray-400
};

const PRIMARYDARKCOLORS = {
  "1": "#991b1b", // Client 1: Dark Red
  "5": "#1e3a8a", // Client 5: Very Dark Blue
  "9": "#b8860b", // Client 9: Dark Gold
  "10": "#ea4201", // Client 10: Dark Orange
  default: "#374151", // Default: Gray-700
};

// ============================================================================
// BACKGROUND COLORS
// ============================================================================
const BGMAIN = {
  "1": "rgb(127, 29, 29)", // Client 1: Red dark (red-900)
  "5": "rgb(23, 37, 84)", // Client 5: Deep Navy Blue
  "9": "rgb(17, 17, 17)", // Client 9: Almost Black
  "10": "#DBD8D4", // Client 10: Light Neutral
  default: "rgb(17, 24, 39)", // Default: Gray-900
};

const BGSECONDARY = {
  "1": "rgb(153, 27, 27)", // Client 1: Red medium (red-800)
  "5": "rgb(30, 58, 138)", // Client 5: Navy Blue (blue-900)
  "9": "rgb(28, 28, 28)", // Client 9: Dark Gray
  "10": "#ea4201", // Client 10: Secondary Orange
  default: "rgb(31, 41, 55)", // Default: Gray-800
};

const BGTERTIARY = {
  "1": "rgb(185, 28, 28)", // Client 1: Red light (red-700)
  "5": "rgb(30, 64, 175)", // Client 5: Blue (blue-800)
  "9": "rgb(40, 40, 40)", // Client 9: Medium Gray
  "10": "#f99300", // Client 10: Tertiary Orange
  default: "rgb(55, 65, 81)", // Default: Gray-700
};

const BGGRADIENT = {
  "1": "linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%)",
  "5": "linear-gradient(135deg, #1e40af 0%, #1e3a8a 100%)",
  "9": "linear-gradient(135deg, #d4af37 0%, #1c1c1c 100%)",
  "10": "linear-gradient(135deg, #EA3C00 0%, #FEA352 100%)",
  default: "linear-gradient(135deg, #6b7280 0%, #374151 100%)",
};

const BGGRADIENTHOVER = {
  "1": "linear-gradient(135deg, #ef4444 0%, #991b1b 100%)",
  "5": "linear-gradient(135deg, #3b82f6 0%, #1e40af 100%)",
  "9": "linear-gradient(135deg, #ffd700 0%, #2c2c2c 100%)",
  "10": "linear-gradient(135deg, #ea4201 0%, #f99300 100%)",
  default: "linear-gradient(135deg, #9ca3af 0%, #4b5563 100%)",
};

// ============================================================================
// ACCENT COLORS
// ============================================================================
const ACCENTCOLORS = {
  "1": "#ffffff", // Client 1: Pure White accent
  "5": "#ef4444", // Client 5: Red accent (touch of red in blue theme)
  "9": "#ffd700", // Client 9: Bright Gold accent
  "10": "#ea4201", // Client 10: Accent Orange
  default: "#6b7280", // Default: Gray-500 accent
};

const ACCENTLIGHT = {
  "1": "#fecaca", // Client 1: Light Pink-Red
  "5": "#fca5a5", // Client 5: Light Red
  "9": "#ffe55c", // Client 9: Light Gold
  "10": "#FEA352", // Client 10: Light Accent
  default: "#d1d5db", // Default: Gray-300
};

const ACCENTDARK = {
  "1": "#f87171", // Client 1: Medium Red
  "5": "#dc2626", // Client 5: Dark Red
  "9": "#d4af37", // Client 9: Medium Gold
  "10": "#EA3C00", // Client 10: Dark Accent
  default: "#4b5563", // Default: Gray-600
};

// ============================================================================
// TEXT COLORS
// ============================================================================
const TEXTPRIMARY = {
  "1": "#ffffff",
  "5": "#ffffff",
  "9": "#ffffff",
  "10": "#EA3C00",
  default: "#ffffff",
};

const TEXTSECONDARY = {
  "1": "#fecaca", // Client 1: Light Red tint
  "5": "#bfdbfe", // Client 5: Light Blue tint
  "9": "#ffd700", // Client 9: Gold tint
  "10": "#DBD8D4", // Client 10: Light Neutral tint
  default: "#e5e7eb", // Default: Light Gray
};

const TEXTMUTED = {
  "1": "#fca5a5", // Client 1: Muted Red
  "5": "#93c5fd", // Client 5: Muted Blue
  "9": "#d4af37", // Client 9: Muted Gold
  "10": "#f99300", // Client 10: Muted Orange
  default: "#9ca3af", // Default: Gray
};

// ============================================================================
// BORDER COLORS
// ============================================================================
const BORDERCOLORS = {
  "1": "#991b1b", // Client 1: Dark Red
  "5": "#1e3a8a", // Client 5: Dark Blue
  "9": "#d4af37", // Client 9: Gold
  "10": "#EA3C00", // Client 10: Orange border
  default: "#374151", // Default: Dark Gray
};

const BORDERLIGHT = {
  "1": "#dc2626", // Client 1: Medium Red
  "5": "#2563eb", // Client 5: Medium Blue
  "9": "#ffd700", // Client 9: Bright Gold
  "10": "#FEA352", // Client 10: Light Orange border
  default: "#4b5563", // Default: Medium Gray
};

const BORDERDARK = {
  "1": "#7f1d1d", // Client 1: Very Dark Red
  "5": "#172554", // Client 5: Very Dark Blue
  "9": "#1c1c1c", // Client 9: Almost Black
  "10": "#ea4201", // Client 10: Dark Orange border
  default: "#1f2937", // Default: Very Dark Gray
};

// ============================================================================
// BUTTON COLORS
// ============================================================================
const BUTTONPRIMARY = {
  "1": "#dc2626",
  "5": "#1e40af",
  "9": "#d4af37",
  "10": "#EA3C00",
  default: "#6b7280",
};

const BUTTONPRIMARYHOVER = {
  "1": "#ef4444",
  "5": "#2563eb",
  "9": "#ffd700",
  "10": "#ea4201",
  default: "#9ca3af",
};

const BUTTONSECONDARY = {
  "1": "#991b1b",
  "5": "#1e3a8a",
  "9": "#1c1c1c",
  "10": "#f99300",
  default: "#374151",
};

const BUTTONSECONDARYHOVER = {
  "1": "#dc2626",
  "5": "#1e40af",
  "9": "#2c2c2c",
  "10": "#FEA352",
  default: "#4b5563",
};

// ============================================================================
// CARD COLORS
// ============================================================================
const CARDBG = {
  "1": "rgba(153, 27, 27, 0.3)",
  "5": "rgba(30, 58, 138, 0.3)",
  "9": "rgba(28, 28, 28, 0.5)",
  "10": "rgba(234, 60, 0, 0.3)",
  default: "rgba(31, 41, 55, 0.3)",
};

const CARDBORDER = {
  "1": "rgba(220, 38, 38, 0.3)",
  "5": "rgba(37, 99, 235, 0.3)",
  "9": "rgba(212, 175, 55, 0.4)",
  "10": "rgba(219, 216, 212, 0.3)",
  default: "rgba(107, 114, 128, 0.3)",
};

const CARDSHADOW = {
  "1": "0 10px 30px rgba(220, 38, 38, 0.2)",
  "5": "0 10px 30px rgba(30, 58, 138, 0.3)",
  "9": "0 10px 30px rgba(212, 175, 55, 0.3)",
  "10": "0 10px 30px rgba(234, 60, 0, 0.2)",
  default: "0 10px 30px rgba(0, 0, 0, 0.5)",
};

// ============================================================================
// STATUS COLORS (shared across all themes)
// ============================================================================
const STATUSCOLORS = {
  success: "#10b981",
  warning: "#f59e0b",
  error: "#ef4444",
  info: "#3b82f6",
};

// ============================================================================
// CSS VARIABLES (for :root)
// ============================================================================
const CSSVARBGMAIN = {
  "1": "127 29 29",
  "5": "23 37 84",
  "9": "17 17 17",
  "10": "76 29 149",
  default: "17 24 39",
};

const CSSVARBGSECONDARY = {
  "1": "153 27 27",
  "5": "30 58 138",
  "9": "28 28 28",
  "10": "109 40 217",
  default: "31 41 55",
};

// ============================================================================
// TAILWIND CLASS STRINGS
// ============================================================================
const getThemeClassesForClient = (clientId: string): ThemeClasses => {
  switch (String(clientId)) {
    case "1": // Red & White theme
      return {
        "card-bg": "bg-[#161616]",
        "input-focus-within":
          "focus-within:outline-none focus-within:ring-2 focus:outline-none focus:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:bg-smalltext/10 focus:ring-red-500/80 focus:ring-2 focus:border-red-500/80 focus:ring-red-500/80 focus-within:border-red-500/80 ",
        "input-ring":
          "outline-none ring-2 ring-red-500/80 outline-none ring-ring ring-offset-0 bg-smalltext/10 border-red-500/80",
        "select-option-bg":
          "bg-gradient-to-br from-red-800 to-red-900 text-white",
        "item-hover-border-l": "hover:border-l-red-500/80",
        app_header: {
          "highlight-indicator":
            "linear-gradient(135deg, #dc2626 0%, #991b1b 100%)",
          "header-gradient":
            "bg-gradient-to-r from-red-950 via-red-900 to-red-950",
          "active-route-indicator": "text-white",
          "inactive-route-indicator": "text-white",
          divider: "bg-red-800",
          "login-button-bg": "bg-red-600",
          "login-button-hover": "hover:bg-red-700",
          "login-button-text": "text-white",
        },
        sports_sidebar: {
          "card-border": "border-slate-700",
          "sport-item-border-l": "border-l-2 border-slate-700",
          "category-item-active": "bg-red-700 text-white",
          "account-icon-active": "text-red-500",
          "main-bg":
            "bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700",
          "search-bg": "bg-gradient-to-r from-red-900 to-red-800",
          "search-border": "border-red-700",
          divider: "bg-red-700/30",
          "item-bg": "bg-slate-800/30",
          "sport-item-border": "border-red-700 shadow-lg",
          "sport-item-bg": "bg-slate-900",
          "sport-item-hover": "hover:bg-slate-800/80",
          "sport-item-text": "text-white",
          "sport-item-count-bg": "bg-red-700/80",
          "sport-item-count-text": "text-white",
          "category-item-bg": "bg-slate-800/30",
          "category-item-hover": "hover:bg-slate-700/50",
          "category-item-text": "text-gray-200",
          "category-item-border": "border-red-700/40",
          "category-item-count-bg": "bg-gray-600/50",
          "category-item-count-text": "text-gray-400",
          "tournament-item-bg": "bg-slate-700/20",
          "tournament-item-hover": "hover:bg-slate-600/50",
          "tournament-item-text": "text-gray-300",
          "tournament-item-count-bg": "bg-gray-600/30",
          "tournament-item-count-text": "text-gray-500",
          "tournament-item-border": "border-gray-600/10",
        },
        betslip: {
          "main-bg": "bg-gradient-to-b from-red-950 to-red-900",
          "main-border": "border-red-800",
          "header-bg": "bg-red-900/50",
          divider: "bg-red-700/30",
          "tab-bg": "bg-red-800/30",
          "tab-border": "border-red-800",
          "tab-active-bg": "bg-gradient-to-br from-red-500 to-red-700",
          "tab-active-text": "text-white",
          "tab-inactive-text": "text-gray-400",
          "outcome-name-text": "text-white font-bold",
          "slip-item-bg": "bg-red-950 border-red-800/30",
          "slip-item-selected-bg": "bg-red-900/30 border-red-700/40",
          "slip-item-divider": "border-red-800/20",
          "slip-item-header": "text-red-300 font-semibold",
          "slip-item-main": "text-white font-bold",
          "slip-item-odds": "text-green-400 font-bold",
          "slip-item-remove": "text-red-600 hover:text-red-600",
          "slip-item-market": "text-gray-400",
          "slip-item-footer": "text-gray-400",
          "multiple-section-bg": "bg-red-950 border-red-800/30",
          "combined-section-bg": "bg-red-950 border-red-800/30",
          "button-place-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
          "button-place-hover": "hover:from-emerald-700 hover:to-green-700",
          "button-place-text": "text-white",
          "button-confirm-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
          "button-confirm-hover": "hover:from-emerald-700 hover:to-green-700",
          "button-cancel-bg": "bg-gradient-to-r from-red-600 to-red-500",
          "button-cancel-hover": "hover:from-red-700 hover:to-red-600",
        },
        sports_page: {
          "live-game-indicator": "bg-green-500",
          "container-bg": "bg-transparent",
          "card-bg": "bg-red-950/60",
          "card-border": "border-red-800/50",
          "card-hover": "hover:bg-red-950/80",
          "header-bg": "bg-red-900/40",
          "header-border": "border-red-800/50",
          "header-text": "text-red-100",
          "sport-separator-bg": "bg-red-900/50",
          "sport-separator-text": "text-red-100",
          "sport-separator-border": "border-red-800/60",
          "date-separator-bg": "bg-red-900/30",
          "date-separator-text": "text-red-200",
          "date-separator-border": "border-red-800/40",
          "time-text": "text-gray-300",
          "time-text-live": "text-green-400",
          "time-border": "border-gray-500",
          "match-tournament-text": "text-gray-400",
          "match-team-text": "text-white",
          "score-text": "text-green-400",
          "more-button-bg": "bg-transparent",
          "more-button-hover": "hover:text-blue-400 hover:border-blue-500",
          "more-button-text": "text-gray-300",
          "more-button-border": "border-gray-600",
          "primary-button-bg": "bg-red-600",
          "primary-button-text": "text-white",
          "secondary-button-bg": "bg-red-950/40",
          "secondary-button-text": "text-red-200",
          "skeleton-bg": "bg-gray-600",
          "skeleton-secondary": "bg-red-900/30",
          "error-text": "text-red-400",
          "error-secondary": "text-gray-400",
          "empty-text": "text-white",
          "empty-secondary": "text-gray-400",
        },
        cashdesk_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-red-950/60",
          "card-border": "border-red-800/50",
          "header-bg": "bg-gradient-to-r from-red-950 via-red-900 to-red-950",
          "header-text": "text-white",
          "column-header-bg": "bg-red-900/40",
          "column-header-text": "text-slate-300",
          "column-header-border": "border-red-800/50",
          "row-hover": "hover:bg-red-950/80",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "summary-section-bg":
            "bg-gradient-to-r from-red-950/50 to-red-900/30",
          "summary-section-border": "border-red-800/50",
          "summary-item-bg":
            "bg-gradient-to-r from-gray-600/20 to-slate-500/30",
          "summary-item-border": "border-gray-700/50",
          "summary-label-text": "text-gray-300",
          "summary-value-text": "text-white",
          // ...existing code...
          "add-button-bg": "bg-white/20",
          "add-button-hover": "hover:bg-white/30",
          "add-button-border": "border-blue-400",
        },
        bet_list_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-red-950/60",
          "card-border": "border-red-800/50",
          "card-text": "text-slate-200",
          "column-header-bg": "bg-red-900/40",
          "column-header-text": "text-slate-300",
          "row-hover": "hover:bg-red-950/80",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "header-text": "text-slate-200",
          "close-button": "bg-red-900/40",
          "close-button-hover": "hover:bg-red-800/60",
          "section-bg": "bg-red-950/40",
          "section-title": "text-red-300",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "item-bg": "bg-red-900/30",
          "event-name": "text-slate-200",
          "subtitle-text": "text-gray-400",
          "action-button": "bg-gradient-to-r from-red-600 to-red-700",
          "action-button-hover": "hover:from-red-700 hover:to-red-800",
          "secondary-button": "bg-gradient-to-r from-slate-600 to-slate-700",
          "secondary-button-hover": "hover:from-slate-700 hover:to-slate-800",
        },
        coupon_details: {
          "section-bg": "bg-red-950/40",
          "section-border": "border-red-800/30",
          "section-title": "text-red-300",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "item-bg": "bg-red-900/30",
          "item-border": "border-red-800/20",
          "event-name": "text-slate-200",
          "subtitle-text": "text-gray-400",
          divider: "border-red-800/30",
          "win-text": "text-green-500",
          "skeleton-bg": "bg-gray-700/50",
          "skeleton-pulse": "bg-gray-700/30",
          "action-button": "bg-red-600",
          "action-button-hover": "hover:bg-red-700",
          "secondary-button": "bg-red-800/50",
          "secondary-button-hover": "hover:bg-red-800",
        },
        transactions_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-red-950/60",
          "card-border": "border-red-800/50",
          "card-text": "text-slate-200",
          "column-header-bg": "bg-red-900/40",
          "column-header-text": "text-slate-300",
          "row-hover": "hover:bg-red-950/80",
          "row-text": "text-gray-200",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "credit-text": "text-green-500",
          "debit-text": "text-red-500",
          "button-primary-bg": "bg-gradient-to-r from-red-600 to-red-700",
          "button-primary-hover": "hover:from-red-700 hover:to-red-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-gradient-to-r from-slate-600 to-slate-700",
          "button-secondary-hover": "hover:from-slate-700 hover:to-slate-800",
          "button-secondary-text": "text-white",
          "checkbox-active-bg": "bg-red-600",
          "checkbox-active-border": "border-red-600",
          "checkbox-inactive-border": "border-gray-400",
          "footer-bg": "bg-red-900/40",
        },
        deposit_page: {
          "container-bg": "bg-transparent",
          "page-bg": "bg-transparent",
          "page-text": "text-white",
          "header-text": "text-black",
          "warning-bg": "bg-yellow-50",
          "warning-border": "border-yellow-200",
          "warning-icon": "text-yellow-600",
          "warning-text": "text-gray-800",
          "card-bg": "bg-red-950/60",
          "card-border": "border-red-800/50",
          "table-header-bg": "bg-red-900/40",
          "table-header-text": "text-white",
          "row-hover": "hover:bg-red-950/80",
          "row-text": "text-white",
          "label-text": "text-gray-400",
          "value-text": "text-white",
          "button-primary-bg": "bg-gradient-to-r from-red-600 to-red-700",
          "button-primary-hover": "hover:from-red-700 hover:to-red-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-slate-700",
          "button-secondary-hover": "hover:bg-slate-600",
          "button-secondary-text": "text-white",
          "form-bg": "bg-gray-800/50",
          "form-border": "border-gray-700/30",
          "form-text": "text-white",
          "info-bg": "bg-gray-700/50",
          "info-border": "border-gray-600/30",
          "info-text": "text-gray-300",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "balance-text": "text-gray-400",
          "balance-value": "text-green-400",
          "quick-button-bg": "bg-slate-700",
          "quick-button-hover": "hover:bg-slate-600",
          "quick-button-text": "text-slate-300",
          "quick-button-border": "border-slate-600",
          "security-bg": "bg-blue-500/10",
          "security-border": "border-blue-500/20",
          "security-text": "text-blue-400",
        },
        account_page: {
          "container-bg":
            "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
          "card-bg": "bg-red-950/60",
          "card-border": "border-red-800/50",
          "header-text": "text-white",
          "subtitle-text": "text-gray-400",
          "section-header-text": "text-gray-300",
          "section-header-border": "border-red-800/50",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "balance-card-bg": "bg-gradient-to-br from-red-900/20 to-red-800/10",
          "balance-card-border": "border-red-700/30",
          "balance-label-text": "text-gray-400",
          "balance-value-text": "text-red-400",
          "button-primary-bg": "bg-gradient-to-r from-red-600 to-red-700",
          "button-primary-hover": "hover:from-red-700 hover:to-red-800",
          "button-primary-text": "text-white",
        },
        user_management_page: {
          "page-bg": "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
          "page-text": "text-white",
          "header-icon-bg": "bg-red-500/10",
          "header-icon-text": "text-red-400",
          "header-text": "text-white",
          "subtitle-text": "text-gray-400",
          "card-bg": "bg-red-950/60",
          "card-border": "border-red-800/50",
          "section-header-text": "text-gray-300",
          "section-header-border": "border-red-800/50",
          "column-header-bg": "bg-red-900/40",
          "column-header-text": "text-gray-300",
          "row-hover": "hover:bg-red-950/80",
          "row-text": "text-white",
          "row-border": "border-red-800/30",
          "balance-text": "text-emerald-400",
          "input-bg": "bg-slate-800",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "button-primary-bg": "bg-gradient-to-r from-red-600 to-red-700",
          "button-primary-hover": "hover:from-red-700 hover:to-red-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-slate-700",
          "button-secondary-hover": "hover:bg-slate-600",
          "button-secondary-text": "text-white",
          "button-action-deposit-bg": "bg-green-500/20",
          "button-action-deposit-hover": "hover:bg-green-500/30",
          "button-action-deposit-text": "text-green-400",
          "button-action-withdraw-bg": "bg-red-500/20",
          "button-action-withdraw-hover": "hover:bg-red-500/30",
          "button-action-withdraw-text": "text-red-400",
          "info-card-bg": "bg-slate-700/50",
          "info-card-border": "border-slate-600/50",
          "info-label-text": "text-gray-400",
          "info-value-text": "text-white",
          "badge-deposit-bg": "bg-green-500/20",
          "badge-deposit-text": "text-green-400",
          "badge-withdraw-bg": "bg-red-500/20",
          "badge-withdraw-text": "text-red-400",
        },
        main_input: {
          background: "bg-gradient-to-r from-slate-800 to-slate-700",
          border: "border border-slate-600",
          "text-color": "text-gray-200",
        },
        game_options_modal: {
          // "modal-bg": "bg-red-950", // removed invalid key
          "modal-border": "border-red-800",
          "header-title": "text-white",
          "header-subtitle": "text-red-200",
          "header-vs-text": "text-red-400",
          "header-date-text": "text-red-300",
          "title-text": "text-red-100",
          "subtitle-text": "text-red-200",
          "market-card-bg": "bg-red-900/60",
          "market-card-border": "border-red-700/60",
          "market-card-hover": "hover:border-red-600 hover:bg-red-900/80",
          "market-title": "text-red-50",
          "axis-label-text": "text-red-200",
          "axis-label-bg": "bg-red-800/30",
          "odds-button-bg": "bg-red-700",
          "odds-button-hover": "hover:bg-red-600",
          "odds-button-text": "text-white",
          "odds-button-border": "border-red-600",
          "odds-button-selected-bg": "bg-red-500",
          "odds-button-selected-border": "border-red-400",
          "odds-button-selected-text": "text-white",
          "odds-button-selected-hover": "hover:bg-red-400",
          "odds-button-disabled-bg": "bg-gray-700/50",
          "odds-button-disabled-text": "text-gray-400",
          "odds-button-disabled-border": "border-gray-600",
        },
        modal: {
          change_password: {
            "modal-bg": "bg-slate-900",
            "modal-border": "border-red-800",
            "modal-shadow": "shadow-red-900/50",
            "header-border": "border-red-700/50",
            "header-title": "text-white",
            "header-icon": "text-red-500",
            "close-button": "text-gray-400",
            "close-button-hover": "hover:text-white",
            "info-box-bg": "bg-red-500/10",
            "info-box-border": "border-red-500/20",
            "info-box-text": "text-red-300",
            "cancel-button-bg": "bg-slate-700",
            "cancel-button-hover": "hover:bg-slate-600",
            "cancel-button-text": "text-white",
            "confirm-button-bg": "bg-gradient-to-r from-red-600 to-red-700",
            "confirm-button-hover": "hover:from-red-500 hover:to-red-600",
            "confirm-button-text": "text-white",
            "confirm-button-shadow": "shadow-red-600/25",
          },
          "overlay-bg": "bg-black/50",
          "content-bg": "bg-slate-900",
          "content-border": "border-red-800/30",
          "header-bg": "bg-gradient-to-r from-red-950 to-red-900",
          "header-text": "text-slate-200",
          "header-border": "border-red-800/30",
          "body-bg": "bg-transparent",
          "body-text": "text-slate-200",
          "footer-bg": "bg-slate-950/50",
          "footer-border": "border-red-800/30",
          "close-button": "text-gray-400 hover:text-gray-200",
          "close-button-hover": "hover:bg-red-900/40",
        },
        "bg-main": "bg-red-900",
        "bg-secondary": "bg-red-800",
        "bg-tertiary": "bg-red-700",
        "bg-gradient": "bg-gradient-to-br from-red-600 to-red-900",
        "bg-gradient-hover": "hover:from-red-500 hover:to-red-800",
        "text-primary": "text-white",
        "text-secondary": "text-red-100",
        "text-muted": "text-red-200",
        border: "border-red-800",
        "border-light": "border-red-600",
        "light-divider": "bg-gray-300",
        "dark-divider": "bg-gray-700",
        primary: "text-red-500",
        "primary-bg": "bg-red-600",
        "primary-hover": "hover:bg-red-500",
        accent: "text-white",
        "accent-bg": "bg-white",
        "button-primary": "bg-red-600 hover:bg-red-500 text-white",
        "button-secondary":
          "bg-red-900 hover:bg-red-800 text-white border border-red-700",
        "button-cancel-bg": "bg-gradient-to-r from-rose-600 to-red-600",
        "button-cancel-hover": "hover:from-rose-700 hover:to-red-700",
        "button-cancel-text": "text-white",
        "button-cancel-border": "border-rose-500/80",
        "button-proceed-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
        "button-proceed-hover": "hover:from-emerald-700 hover:to-green-700",
        "button-proceed-text": "text-white",
        "button-proceed-border": "border-emerald-500",
        "modal-bg": "bg-slate-900",
        "button-primary-bg": "bg-gradient-to-r from-red-600 to-red-700",
        "button-primary-border": "border border-red-700",
        "button-primary-hover": "hover:from-red-700 hover:to-red-800",
        "button-primary-text": "text-white",
        "button-secondary-bg": "bg-gradient-to-r from-slate-600 to-slate-700",
        "button-secondary-border": "border border-slate-700",
        "button-secondary-hover": "hover:from-slate-700 hover:to-slate-800",
        "button-secondary-text": "text-white",
        card: "bg-red-900/30 border-red-800/40",
        "card-hover": "hover:border-red-600/60 hover:bg-red-900/40",
        "input-bg":
          "bg-gradient-to-r from-slate-50 to-slate-50 placeholder-slate-400 ",
        "input-border":
          "border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/80 ",
        "input-text": "text-gray-600",
        "skeleton-bg": "bg-gray-700/50",
      };
    case "3": // Black & Gold theme
      return {
        app_header: {
          "highlight-indicator":
            "linear-gradient(90deg,rgba(17, 18, 18, 1) 0%, rgba(41, 13, 13, 1) 35%, rgba(5, 0, 0, 1) 76%, rgba(41, 7, 7, 1) 100%)",
          "header-gradient":
            "bg-gradient-to-r from-red-950 via-rose-900 to-red-950",
          "active-route-indicator": "text-white hover:text-rose-100",
          "inactive-route-indicator": "text-white hover:text-rose-200",
          divider: "bg-red-800",
          "login-button-bg": "bg-red-600",
          "login-button-hover": "hover:bg-red-700",
          "login-button-text": "text-white",
        },
        sports_sidebar: {
          "main-bg": "bg-[#161616] ",
          "card-border": "border-yellow-700/30",
          "sport-item-border-l": "border-l-yellow-600/70",
          "category-item-active": "bg-yellow-600 text-black",
          "account-icon-active": "text-yellow-500",
          "search-bg": "bg-gradient-to-r from-gray-950 to-black",
          "search-border": "border-yellow-700/40",
          divider: "bg-yellow-700/20",
          "item-bg": "bg-gray-900/30",
          "sport-item-border": "border-yellow-600/20",
          "sport-item-bg": "bg-transparent",
          "sport-item-hover": "hover:bg-[#450A0A]/30",
          "sport-item-text": "text-yellow-100",
          "sport-item-count-bg": "bg-gray-700/50",
          "sport-item-count-text": "text-yellow-300",
          "category-item-bg": "bg-[#161616]",
          "category-item-hover": "hover:bg-[#450A0A]/30",
          "category-item-text": "text-gray-300",
          "category-item-border": "border-yellow-600/60 border-l-yellow-600/80",
          "category-item-count-bg": "bg-gray-600/50",
          "category-item-count-text": "text-gray-400",
          "tournament-item-bg": "bg-[#161616]",
          "tournament-item-hover": "hover:bg-red-800/20",
          "tournament-item-text": "text-gray-300",
          "tournament-item-count-bg": "bg-gray-600/30",
          "tournament-item-count-text": "text-gray-500",
          "tournament-item-border": "border-gray-600/10",
        },
        betslip: {
          "main-bg": "bg-gradient-to-b from-black to-gray-950",
          "main-border": "border-yellow-700/40",
          "header-bg": "bg-[#161616]",
          divider: "bg-yellow-700/40",
          "tab-bg": "bg-[#161616]",
          "tab-border": "border-yellow-700/40",
          "tab-active-bg": "bg-gradient-to-br from-yellow-500 to-yellow-700",
          "tab-active-text": "text-black",
          "tab-inactive-text": "text-gray-400",
          "outcome-name-text": "text-yellow-400 font-bold",
          "slip-item-bg": "bg-[#161616] border-yellow-700/20",
          "slip-item-selected-bg": "bg-yellow-900/20 border-yellow-600/40",
          "slip-item-divider": "border-yellow-700/20",
          "slip-item-header": "text-yellow-300 font-semibold",
          "slip-item-main": "text-white font-bold",
          "slip-item-odds": "text-yellow-400 font-bold",
          "slip-item-remove": "text-red-400 hover:text-red-600",
          "slip-item-market": "text-gray-400",
          "slip-item-footer": "text-gray-400",
          "multiple-section-bg": "bg-[#161616] border-yellow-700/30",
          "combined-section-bg": "bg-[#161616] border-yellow-700/30",
          "button-place-bg": "bg-gradient-to-r from-yellow-600 to-yellow-500",
          "button-place-hover": "hover:from-yellow-700 hover:to-yellow-600",
          "button-place-text": "text-black",
          "button-confirm-bg": "bg-gradient-to-r from-yellow-600 to-yellow-500",
          "button-confirm-hover": "hover:from-yellow-700 hover:to-yellow-600",
          "button-cancel-bg": "bg-gradient-to-r from-red-600 to-red-500",
          "button-cancel-hover": "hover:from-red-700 hover:to-red-600",
        },
        sports_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-[#161616]",
          "card-border": "border-yellow-700/30",
          "card-hover": "hover:bg-black/80",
          "header-bg":
            "bg-gradient-to-r from-[#450A0A]/60 via-[#450A0A]/80 to-[#7F1D1D]/40",
          "header-border": "border-yellow-700/30",
          "header-text": "text-yellow-200",
          "sport-separator-bg": "bg-gray-900/50",
          "sport-separator-text": "text-yellow-100",
          "sport-separator-border": "border-yellow-700/40",
          "date-separator-bg": "bg-red-900/40",

          "date-separator-text": "text-yellow-100",
          "date-separator-border": "border-yellow-700/30",
          "time-text": "text-gray-300",
          "time-text-live": "text-green-400",
          "time-border": "border-gray-500",
          "match-tournament-text": "text-gray-400",
          "match-team-text": "text-white",
          "score-text": "text-green-400",
          "more-button-bg": "bg-transparent",
          "more-button-hover": "hover:text-yellow-400 hover:border-yellow-500",
          "more-button-text": "text-gray-300",
          "more-button-border": "border-gray-600",
          "primary-button-bg": "bg-yellow-600",
          "primary-button-text": "text-black",
          "secondary-button-bg": "bg-gray-800/40",
          "secondary-button-text": "text-yellow-200",
          "skeleton-bg": "bg-gray-600",
          "skeleton-secondary": "bg-gray-900/30",
          "error-text": "text-red-400",
          "error-secondary": "text-gray-400",
          "empty-text": "text-yellow-300",
          "empty-secondary": "text-gray-400",
          "live-game-indicator": "bg-yellow-500",
        },
        cashdesk_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-[#161616]",
          "card-border": "border-yellow-700/30",
          "header-bg":
            "bg-gradient-to-r from-[#450A0A]/60 via-[#450A0A]/80 to-[#7F1D1D]/40",
          "header-text": "text-yellow-200",
          "column-header-bg": "bg-red-900/40",
          "column-header-text": "text-yellow-100",
          "column-header-border": "border-yellow-700/30",
          "row-hover": "hover:bg-black/80",
          "input-bg":
            "bg-gradient-to-r from-slate-50 to-slate-50 placeholder-slate-400 ",
          "input-border":
            "border-slate-400 focus:border-blue-500 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary",
          "input-text": "text-gray-600",
          "summary-section-bg": "bg-[#161616]",
          "summary-section-border": "border-yellow-700/30",
          "summary-item-bg":
            "bg-gradient-to-r from-gray-600/20 to-slate-500/30",
          "summary-item-border": "border-gray-700/50",
          "summary-label-text": "text-gray-300",
          "summary-value-text": "text-gray-400",
          // ...existing code...
          "add-button-bg": "bg-white/20",
          "add-button-hover": "hover:bg-white/30",
          "add-button-border": "border-yellow-400",
        },
        bet_list_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-black/60",
          "card-border": "border-yellow-700/30",
          "card-text": "text-slate-200",
          "column-header-bg":
            "bg-gradient-to-r from-[#450A0A]/60 via-[#450A0A]/80 to-[#7F1D1D]/40",
          "column-header-text": "text-yellow-100",
          "row-hover": "hover:bg-black/80",
          "input-bg": "bg-gradient-to-r from-gray-950 to-slate-950",
          "input-border": "border-slate-800",
          "input-text": "text-white",
          "header-text": "text-slate-200",
          "close-button": "bg-gray-900/40",
          "close-button-hover": "hover:bg-gray-800/60",
          "section-bg": "bg-black/40",
          "section-title": "text-yellow-300",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "item-bg": "bg-gray-900/30",
          "event-name": "text-slate-200",
          "subtitle-text": "text-gray-400",
          "action-button": "bg-gradient-to-r from-yellow-600 to-yellow-500",
          "action-button-hover": "hover:from-yellow-700 hover:to-yellow-600",
          "secondary-button": "bg-gradient-to-r from-slate-700 to-slate-800",
          "secondary-button-hover": "hover:from-slate-800 hover:to-slate-900",
        },

        coupon_details: {
          "section-bg": "bg-black/40",
          "section-border": "border-yellow-700/30",
          "section-title": "text-yellow-200",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "item-bg": "bg-gray-900/30",
          "item-border": "border-yellow-700/20",
          "event-name": "text-slate-200",
          "subtitle-text": "text-gray-400",
          divider: "border-yellow-700/30",
          "win-text": "text-green-500",
          "skeleton-bg": "bg-gray-700/50",
          "skeleton-pulse": "bg-gray-700/30",
          "action-button": "bg-yellow-600",
          "action-button-hover": "hover:bg-yellow-700",
          "secondary-button": "bg-yellow-800/50",
          "secondary-button-hover": "hover:bg-yellow-800",
        },
        transactions_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-black/60",
          "card-border": "border-yellow-700/30 ",
          "card-text": "text-yellow-200",
          "column-header-bg": "bg-gray-900/40",
          "column-header-text": "text-yellow-200",
          "row-hover": "hover:bg-black/80",
          "row-text": "text-yellow-50",
          "input-bg": "bg-gradient-to-r from-gray-950 to-slate-950",
          "input-border": "border-slate-800",
          "input-text": "text-white",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "credit-text": "text-green-500",
          "debit-text": "text-red-500",
          "button-primary-bg": "bg-gradient-to-r from-yellow-600 to-yellow-500",
          "button-primary-hover": "hover:from-yellow-700 hover:to-yellow-600",
          "button-primary-text": "text-black",
          "button-secondary-bg": "bg-gradient-to-r from-slate-700 to-slate-800",
          "button-secondary-hover": "hover:from-slate-800 hover:to-slate-900",
          "button-secondary-text": "text-white",
          "checkbox-active-bg": "bg-yellow-600",
          "checkbox-active-border": "border-yellow-600",
          "checkbox-inactive-border": "border-gray-400",
          "footer-bg": "bg-gray-900/40",
        },
        deposit_page: {
          "container-bg": "bg-transparent",
          "page-bg": "bg-transparent",
          "page-text": "text-white",
          "header-text": "text-yellow-100",
          "warning-bg": "bg-yellow-50",
          "warning-border": "border-yellow-200",
          "warning-icon": "text-yellow-600",
          "warning-text": "text-gray-800",
          "card-bg": "bg-black/60",
          "card-border": "border-yellow-700/30",
          "table-header-bg": "bg-gray-900/40",
          "table-header-text": "text-white",
          "row-hover": "hover:bg-black/80",
          "row-text": "text-white",
          "label-text": "text-gray-400",
          "value-text": "text-white",
          "button-primary-bg": "bg-gradient-to-r from-yellow-600 to-yellow-500",
          "button-primary-hover": "hover:from-yellow-700 hover:to-yellow-600",
          "button-primary-text": "text-black",
          "button-secondary-bg": "bg-slate-700",
          "button-secondary-hover": "hover:bg-slate-600",
          "button-secondary-text": "text-white",
          "form-bg": "bg-gray-800/50",
          "form-border": "border-gray-700/30",
          "form-text": "text-white",
          "info-bg": "bg-red-900/30",
          "info-border": "border-yellow-800/30",
          "info-text": "text-gray-300",
          "input-bg": "bg-gradient-to-r from-gray-950 to-slate-950",
          "input-border": "border-slate-800",
          "input-text": "text-white",
          "balance-text": "text-gray-400",
          "balance-value": "text-green-400",
          "quick-button-bg": "bg-red-900/30",
          "quick-button-hover": "hover:bg-red-800/40",
          "quick-button-text": "text-yellow-200/60",
          "quick-button-border": "border-yellow-800/40",
          "security-bg": "bg-blue-500/10",
          "security-border": "border-blue-500/20",
          "security-text": "text-blue-400",
        },
        main_input: {
          background: "bg-gradient-to-r from-gray-950 to-slate-950",
          border: "border border-slate-800",
          "text-color": "text-gray-200",
        },
        account_page: {
          "container-bg": "bg-gradient-to-br from-black via-gray-950 to-black",
          "card-bg": "bg-gray-900/50",
          "card-border": "border-gray-800/30",
          "header-text": "text-yellow-300",
          "subtitle-text": "text-gray-400",
          "section-header-text": "text-yellow-200",
          "section-header-border": "border-gray-800",
          "input-bg": "bg-gradient-to-r from-gray-950 to-slate-950",
          "input-border": "border-slate-800",
          "input-text": "text-white",
          "balance-card-bg":
            "bg-gradient-to-br from-yellow-900/20 to-yellow-800/10",
          "balance-card-border": "border-yellow-700/30",
          "balance-label-text": "text-gray-400",
          "balance-value-text": "text-yellow-400",
          "button-primary-bg": "bg-gradient-to-r from-yellow-600 to-yellow-700",
          "button-primary-hover": "hover:from-yellow-700 hover:to-yellow-800",
          "button-primary-text": "text-black",
        },
        user_management_page: {
          "page-bg": "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
          "page-text": "text-white",
          "header-icon-bg": "bg-yellow-500/10",
          "header-icon-text": "text-yellow-400",
          "header-text": "text-white",
          "subtitle-text": "text-gray-400",
          "card-bg": "bg-gray-800/50",
          "card-border": "border-gray-700/30",
          "section-header-text": "text-gray-300",
          "section-header-border": "border-gray-700",
          "column-header-bg": "bg-gray-800/50",
          "column-header-text": "text-gray-300",
          "row-hover": "hover:bg-slate-700/30",
          "row-text": "text-white",
          "row-border": "border-slate-700/30",
          "balance-text": "text-emerald-400",
          "input-bg": "bg-slate-800",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "button-primary-bg": "bg-gradient-to-r from-yellow-600 to-yellow-500",
          "button-primary-hover": "hover:from-yellow-700 hover:to-yellow-600",
          "button-primary-text": "text-black",
          "button-secondary-bg": "bg-slate-700",
          "button-secondary-hover": "hover:bg-slate-600",
          "button-secondary-text": "text-white",
          "button-action-deposit-bg": "bg-green-500/20",
          "button-action-deposit-hover": "hover:bg-green-500/30",
          "button-action-deposit-text": "text-green-400",
          "button-action-withdraw-bg": "bg-red-500/20",
          "button-action-withdraw-hover": "hover:bg-red-500/30",
          "button-action-withdraw-text": "text-red-400",
          "info-card-bg": "bg-slate-700/50",
          "info-card-border": "border-slate-600/50",
          "info-label-text": "text-gray-400",
          "info-value-text": "text-white",
          "badge-deposit-bg": "bg-green-500/20",
          "badge-deposit-text": "text-green-400",
          "badge-withdraw-bg": "bg-red-500/20",
          "badge-withdraw-text": "text-red-400",
        },
        game_options_modal: {
          "modal-border": "border-yellow-700/40",
          "header-title": "text-yellow-400",
          "header-subtitle": "text-gray-300",
          "header-vs-text": "text-yellow-500",
          "header-date-text": "text-gray-500",
          "title-text": "text-yellow-300",
          "subtitle-text": "text-gray-400",
          "market-card-bg": "bg-gray-500/10",
          "market-card-border": "border-[#DC2626]/10",
          "market-card-hover":
            "hover:border-[#DC2626]/20 hover:bg-[#450A0A]/20",
          "market-title": "text-gray-300",
          "axis-label-text": "text-gray-400",
          "axis-label-bg": "bg-yellow-900/20",
          "odds-button-bg": "bg-gray-200",
          "odds-button-hover": "hover:bg-[#F87171]",
          "odds-button-text": "text-gray-800",
          "odds-button-border": "border-gray-600/50",
          "odds-button-selected-bg":
            "bg-gradient-to-r from-[#7F1D1D] via-rose-800 to-[#7F1D1D]",
          "odds-button-selected-border": "border-[#DC2626]/70",
          "odds-button-selected-text": "text-gray-200",
          "odds-button-selected-hover": "hover:bg-[#DC2626]/30",
          "odds-button-disabled-bg": "bg-gray-100/90",
          "odds-button-disabled-text": "text-gray-800",
          "odds-button-disabled-border": "border-gray-400",
        },
        modal: {
          change_password: {
            "modal-bg": "bg-slate-900",
            "modal-border": "border-yellow-700",
            "modal-shadow": "shadow-yellow-900/20",
            "header-border": "border-yellow-700/50",
            "header-title": "text-yellow-400",
            "header-icon": "text-yellow-500",
            "close-button": "text-gray-400",
            "close-button-hover": "hover:text-yellow-300",
            "info-box-bg": "bg-yellow-500/10",
            "info-box-border": "border-yellow-500/20",
            "info-box-text": "text-yellow-300",
            "cancel-button-bg": "bg-slate-700",
            "cancel-button-hover": "hover:bg-slate-600",
            "cancel-button-text": "text-white",
            "confirm-button-bg":
              "bg-gradient-to-r from-yellow-600 to-yellow-700",
            "confirm-button-hover": "hover:from-yellow-500 hover:to-yellow-600",
            "confirm-button-text": "text-black",
            "confirm-button-shadow": "shadow-yellow-600/25",
          },
          "overlay-bg": "bg-black/50",
          "content-bg": "bg-gray-900",
          "content-border": "border-yellow-700/30",
          "header-bg": "bg-gradient-to-r from-black to-gray-900",
          "header-text": "text-yellow-100",
          "header-border": "border-yellow-700/30",
          "body-bg": "bg-transparent",
          "body-text": "text-slate-200",
          "footer-bg": "bg-black/50",
          "footer-border": "border-yellow-700/30",
          "close-button": "text-gray-400 hover:text-yellow-400",
          "close-button-hover": "hover:bg-yellow-900/40",
        },
        "bg-main": "bg-gradient-to-r from-black via-[#1a1a1a] to-black",
        "bg-secondary": "bg-gray-900",
        "bg-tertiary": "bg-gray-800",
        "bg-gradient": "bg-gradient-to-br from-gray-900 to-black",
        "bg-gradient-hover": "hover:from-gray-800 hover:to-gray-900",
        "text-primary": "text-yellow-50",
        "text-secondary": "text-yellow-100/60",
        "text-muted": "text-yellow-600",
        border: "border-yellow-800/50",
        "border-light": "border-yellow-300/20",
        primary: "text-yellow-500",
        "primary-bg": "bg-yellow-600",
        "card-bg": "bg-[#161616]",
        "primary-hover": "hover:bg-yellow-500",
        accent: "text-yellow-400",
        "light-divider": "bg-yellow-300/40",
        "dark-divider": "bg-gray-700",
        "accent-bg": "bg-yellow-500",
        "button-primary":
          "bg-yellow-600 hover:bg-yellow-500 text-black font-bold",
        "button-secondary":
          "bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-yellow-700",
        card: "bg-[#161616] border-yellow-700/30",
        "card-hover": "hover:border-yellow-500/60 hover:bg-gray-900/70",
        "input-bg":
          "bg-gradient-to-r from-slate-50 to-slate-50 placeholder-slate-400 ",
        "input-border": "border-slate-400 ",
        "input-focus-within":
          "focus-within:outline-none focus-within:ring-2 focus:outline-none focus:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:bg-smalltext/10 focus:ring-yellow-500/80  focus:ring-2 focus:border-yellow-500/80 focus:ring-yellow-500/80 focus-within:border-yellow-500/80 ",
        "input-ring":
          "outline-none ring-2 ring-yellow-500/80 outline-none ring-ring ring-offset-0 bg-smalltext/10 border-yellow-500/80",
        "select-option-bg":
          "bg-gradient-to-br from-yellow-800 to-yellow-900  text-white",
        "input-text": "text-gray-700",
        "skeleton-bg": "bg-gray-700/50",
        "modal-bg": "bg-[#161616]",
        "button-primary-bg": "bg-gradient-to-r from-yellow-600 to-yellow-500",
        "button-primary-border": "border border-yellow-700",
        "button-primary-hover": "hover:from-yellow-700 hover:to-yellow-600",
        "button-primary-text": "text-black",
        "button-secondary-bg":
          "bg-gradient-to-r transition-all from-rose-800/40 to-rose-900/40",
        "button-secondary-border": "border border-yellow-800/50",
        "item-hover-border-l": "hover:border-l-yellow-500/80",
        "button-secondary-hover": "hover:from-rose-800/80 hover:to-rose-900/80",
        "button-secondary-text": "text-white",
        "button-cancel-bg": "bg-gradient-to-r from-rose-600 to-red-600",
        "button-cancel-hover": "hover:from-rose-700 hover:to-red-700",
        "button-cancel-text": "text-white",
        "button-cancel-border": "border-rose-500/80",
        "button-proceed-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
        "button-proceed-hover": "hover:from-emerald-700 hover:to-green-700",
        "button-proceed-text": "text-white",
        "button-proceed-border": "border-emerald-500",
      };

    case "5": // Blue & White with touch of Red theme
      return {
        "card-bg": "bg-[#161616]",
        "input-focus-within":
          "focus-within:outline-none focus-within:ring-2 focus:outline-none focus:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:bg-smalltext/10 focus:ring-blue-500/80 focus:ring-2 focus:border-blue-500/80 focus:ring-blue-500/80 focus-within:border-blue-500/80 ",
        "input-ring":
          "outline-none ring-2 ring-blue-500/80 outline-none ring-ring ring-offset-0 bg-smalltext/10 border-blue-500/80",
        "select-option-bg":
          "bg-gradient-to-br from-blue-800 to-blue-900 text-white",
        "item-hover-border-l": "hover:border-l-blue-500/80",
        "modal-bg": "bg-slate-900",
        "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
        "button-primary-border": "border border-blue-700",
        "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
        "button-primary-text": "text-white",
        "button-secondary-bg": "bg-gradient-to-r from-slate-600 to-slate-700",
        "button-secondary-border": "border border-slate-700",
        "button-secondary-hover": "hover:from-slate-700 hover:to-slate-800",
        "button-secondary-text": "text-white",
        "skeleton-bg": "bg-gray-700/50",
        "input-bg": "bg-slate-800",
        "input-text": "text-white",
        "input-border": "border-slate-600",
        app_header: {
          "highlight-indicator":
            "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          "header-gradient":
            "bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950",
          "active-route-indicator": "text-white",
          "inactive-route-indicator": "text-white",
          divider: "bg-blue-800",
          "login-button-bg": "bg-blue-600",
          "login-button-hover": "hover:bg-blue-700",
          "login-button-text": "text-white",
        },
        sports_sidebar: {
          "card-border": "border-blue-800/50",
          "sport-item-border-l": "border-l-2 border-blue-800/50",
          "category-item-active": "bg-blue-700 text-white",
          "account-icon-active": "text-blue-500",
          "main-bg":
            "bg-gradient-to-b from-slate-900 to-slate-800 border border-slate-700",
          "search-bg": "bg-gradient-to-r from-blue-900 to-blue-800",
          "search-border": "border-blue-700",
          divider: "bg-blue-700/30",
          "item-bg": "bg-slate-800/30",
          "sport-item-border": "border-gray-600/80",
          "sport-item-bg": "bg-transparent",
          "sport-item-hover": "hover:bg-slate-800/50",
          "sport-item-text": "text-gray-300",
          "sport-item-count-bg": "bg-gray-700/50",
          "sport-item-count-text": "text-gray-300",
          "category-item-bg": "bg-slate-800/30",
          "category-item-hover": "hover:bg-slate-700/50",
          "category-item-text": "text-gray-200",
          "category-item-border": "border-blue-700/40",
          "category-item-count-bg": "bg-gray-600/50",
          "category-item-count-text": "text-gray-400",
          "tournament-item-bg": "bg-slate-700/20",
          "tournament-item-hover": "hover:bg-slate-600/50",
          "tournament-item-text": "text-gray-300",
          "tournament-item-count-bg": "bg-gray-600/30",
          "tournament-item-count-text": "text-gray-500",
          "tournament-item-border": "border-gray-600/10",
        },
        betslip: {
          "main-bg": "bg-gradient-to-b from-blue-950 to-blue-900",
          "main-border": "border-blue-800",
          "header-bg": "bg-blue-900/50",
          divider: "bg-blue-700/30",
          "tab-bg": "bg-blue-800/30",
          "tab-border": "border-blue-800",
          "tab-active-bg": "bg-gradient-to-br from-blue-500 to-blue-700",
          "tab-active-text": "text-white",
          "tab-inactive-text": "text-gray-400",
          "outcome-name-text": "text-white font-bold",
          "slip-item-bg": "bg-blue-950 border-blue-800/30",
          "slip-item-selected-bg": "bg-blue-900/30 border-blue-700/40",
          "slip-item-divider": "border-blue-800/20",
          "slip-item-header": "text-blue-300 font-semibold",
          "slip-item-main": "text-white font-bold",
          "slip-item-odds": "text-green-400 font-bold",
          "slip-item-remove": "text-red-600 hover:text-red-600",
          "slip-item-market": "text-gray-400",
          "slip-item-footer": "text-gray-400",
          "multiple-section-bg": "bg-blue-950 border-blue-800/30",
          "combined-section-bg": "bg-blue-950 border-blue-800/30",
          "button-place-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
          "button-place-hover": "hover:from-emerald-700 hover:to-green-700",
          "button-place-text": "text-white",
          "button-confirm-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
          "button-confirm-hover": "hover:from-emerald-700 hover:to-green-700",
          "button-cancel-bg": "bg-gradient-to-r from-red-600 to-red-500",
          "button-cancel-hover": "hover:from-red-700 hover:to-red-600",
        },
        sports_page: {
          "live-game-indicator": "bg-blue-500",
          "container-bg": "bg-transparent",
          "card-bg": "bg-blue-950/60",
          "card-border": "border-blue-800/50",
          "card-hover": "hover:bg-blue-950/80",
          "header-bg": "bg-blue-900/40",
          "header-border": "border-blue-800/50",
          "header-text": "text-blue-100",
          "sport-separator-bg": "bg-blue-900/50",
          "sport-separator-text": "text-blue-100",
          "sport-separator-border": "border-blue-800/60",
          "date-separator-bg": "bg-blue-900/30",
          "date-separator-text": "text-blue-200",
          "date-separator-border": "border-blue-800/40",
          "time-text": "text-gray-300",
          "time-text-live": "text-green-400",
          "time-border": "border-gray-500",
          "match-tournament-text": "text-gray-400",
          "match-team-text": "text-white",
          "score-text": "text-green-400",
          "more-button-bg": "bg-transparent",
          "more-button-hover": "hover:text-blue-400 hover:border-blue-500",
          "more-button-text": "text-gray-300",
          "more-button-border": "border-gray-600",
          "primary-button-bg": "bg-blue-600",
          "primary-button-text": "text-white",
          "secondary-button-bg": "bg-blue-950/40",
          "secondary-button-text": "text-blue-200",
          "skeleton-bg": "bg-gray-600",
          "skeleton-secondary": "bg-blue-900/30",
          "error-text": "text-red-400",
          "error-secondary": "text-gray-400",
          "empty-text": "text-white",
          "empty-secondary": "text-gray-400",
        },
        cashdesk_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-blue-950/60",
          "card-border": "border-blue-800/50",
          "header-bg":
            "bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950",
          "header-text": "text-white",
          "column-header-bg": "bg-blue-900/40",
          "column-header-text": "text-slate-300",
          "column-header-border": "border-blue-800/50",
          "row-hover": "hover:bg-blue-950/80",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "summary-section-bg":
            "bg-gradient-to-r from-blue-950/50 to-blue-900/30",
          "summary-section-border": "border-blue-800/50",
          "summary-item-bg":
            "bg-gradient-to-r from-gray-600/20 to-slate-500/30",
          "summary-item-border": "border-gray-700/50",
          "summary-label-text": "text-gray-300",
          "summary-value-text": "text-white",
          "add-button-bg": "bg-white/20",
          "add-button-hover": "hover:bg-white/30",
          "add-button-border": "border-blue-400",
        },
        bet_list_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-blue-950/60",
          "card-border": "border-blue-800/50",
          "card-text": "text-slate-200",
          "column-header-bg": "bg-blue-900/40",
          "column-header-text": "text-slate-300",
          "row-hover": "hover:bg-blue-950/80",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "header-text": "text-slate-200",
          "close-button": "bg-blue-900/40",
          "close-button-hover": "hover:bg-blue-800/60",
          "section-bg": "bg-blue-950/40",
          "section-title": "text-blue-300",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "item-bg": "bg-blue-900/30",
          "event-name": "text-slate-200",
          "subtitle-text": "text-gray-400",
          "action-button": "bg-gradient-to-r from-blue-600 to-blue-700",
          "action-button-hover": "hover:from-blue-700 hover:to-blue-800",
          "secondary-button": "bg-gradient-to-r from-slate-600 to-slate-700",
          "secondary-button-hover": "hover:from-slate-700 hover:to-slate-800",
        },
        coupon_details: {
          "section-bg": "bg-blue-950/40",
          "section-border": "border-blue-800/30",
          "section-title": "text-blue-300",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "item-bg": "bg-blue-900/30",
          "item-border": "border-blue-800/20",
          "event-name": "text-slate-200",
          "subtitle-text": "text-gray-400",
          divider: "border-blue-800/30",
          "win-text": "text-green-500",
          "skeleton-bg": "bg-gray-700/50",
          "skeleton-pulse": "bg-gray-700/30",
          "action-button": "bg-blue-600",
          "action-button-hover": "hover:bg-blue-700",
          "secondary-button": "bg-blue-800/50",
          "secondary-button-hover": "hover:bg-blue-800",
        },
        transactions_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-blue-950/60",
          "card-border": "border-blue-800/50",
          "card-text": "text-slate-200",
          "column-header-bg": "bg-blue-900/40",
          "column-header-text": "text-slate-300",
          "row-hover": "hover:bg-blue-950/80",
          "row-text": "text-gray-200",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "credit-text": "text-green-500",
          "debit-text": "text-red-500",
          "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
          "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-gradient-to-r from-slate-600 to-slate-700",
          "button-secondary-hover": "hover:from-slate-700 hover:to-slate-800",
          "button-secondary-text": "text-white",
          "checkbox-active-bg": "bg-blue-600",
          "checkbox-active-border": "border-blue-600",
          "checkbox-inactive-border": "border-gray-400",
          "footer-bg": "bg-blue-900/40",
        },
        deposit_page: {
          "container-bg": "bg-transparent",
          "page-bg": "bg-transparent",
          "page-text": "text-white",
          "header-text": "text-black",
          "warning-bg": "bg-yellow-50",
          "warning-border": "border-yellow-200",
          "warning-icon": "text-yellow-600",
          "warning-text": "text-gray-800",
          "card-bg": "bg-blue-950/60",
          "card-border": "border-blue-800/50",
          "table-header-bg": "bg-blue-900/40",
          "table-header-text": "text-white",
          "row-hover": "hover:bg-blue-950/80",
          "row-text": "text-white",
          "label-text": "text-gray-400",
          "value-text": "text-white",
          "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
          "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-slate-700",
          "button-secondary-hover": "hover:bg-slate-600",
          "button-secondary-text": "text-white",
          "form-bg": "bg-gray-800/50",
          "form-border": "border-gray-700/30",
          "form-text": "text-white",
          "info-bg": "bg-gray-700/50",
          "info-border": "border-gray-600/30",
          "info-text": "text-gray-300",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "balance-text": "text-gray-400",
          "balance-value": "text-green-400",
          "quick-button-bg": "bg-slate-700",
          "quick-button-hover": "hover:bg-slate-600",
          "quick-button-text": "text-slate-300",
          "quick-button-border": "border-slate-600",
          "security-bg": "bg-blue-500/10",
          "security-border": "border-blue-500/20",
          "security-text": "text-blue-400",
        },
        main_input: {
          background: "bg-gradient-to-r from-slate-800 to-slate-700",
          border: "border border-slate-600",
          "text-color": "text-gray-200",
        },
        account_page: {
          "container-bg":
            "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
          "card-bg": "bg-gray-800/50",
          "card-border": "border-gray-700/30",
          "header-text": "text-white",
          "subtitle-text": "text-gray-400",
          "section-header-text": "text-gray-300",
          "section-header-border": "border-gray-700",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "balance-card-bg":
            "bg-gradient-to-br from-blue-900/20 to-blue-800/10",
          "balance-card-border": "border-blue-700/30",
          "balance-label-text": "text-gray-400",
          "balance-value-text": "text-blue-400",
          "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
          "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
          "button-primary-text": "text-white",
        },
        user_management_page: {
          "page-bg": "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
          "page-text": "text-white",
          "header-icon-bg": "bg-blue-500/10",
          "header-icon-text": "text-blue-400",
          "header-text": "text-white",
          "subtitle-text": "text-gray-400",
          "card-bg": "bg-gray-800/50",
          "card-border": "border-gray-700/30",
          "section-header-text": "text-gray-300",
          "section-header-border": "border-gray-700",
          "column-header-bg": "bg-gray-800/50",
          "column-header-text": "text-gray-300",
          "row-hover": "hover:bg-slate-700/30",
          "row-text": "text-white",
          "row-border": "border-slate-700/30",
          "balance-text": "text-emerald-400",
          "input-bg": "bg-slate-800",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
          "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-slate-700",
          "button-secondary-hover": "hover:bg-slate-600",
          "button-secondary-text": "text-white",
          "button-action-deposit-bg": "bg-green-500/20",
          "button-action-deposit-hover": "hover:bg-green-500/30",
          "button-action-deposit-text": "text-green-400",
          "button-action-withdraw-bg": "bg-red-500/20",
          "button-action-withdraw-hover": "hover:bg-red-500/30",
          "button-action-withdraw-text": "text-red-400",
          "info-card-bg": "bg-slate-700/50",
          "info-card-border": "border-slate-600/50",
          "info-label-text": "text-gray-400",
          "info-value-text": "text-white",
          "badge-deposit-bg": "bg-green-500/20",
          "badge-deposit-text": "text-green-400",
          "badge-withdraw-bg": "bg-red-500/20",
          "badge-withdraw-text": "text-red-400",
        },
        game_options_modal: {
          // "modal-bg": "bg-blue-950", // removed invalid key
          "modal-border": "border-blue-800",
          "header-title": "text-slate-800",
          "header-subtitle": "text-slate-600",
          "header-vs-text": "text-blue-600",
          "header-date-text": "text-slate-500",
          "title-text": "text-blue-100",
          "subtitle-text": "text-blue-200",
          "market-card-bg": "bg-blue-900/60",
          "market-card-border": "border-blue-700/60",
          "market-card-hover": "hover:border-blue-600 hover:bg-blue-900/80",
          "market-title": "text-blue-50",
          "axis-label-text": "text-blue-200",
          "axis-label-bg": "bg-blue-800/30",
          "odds-button-bg": "bg-blue-700",
          "odds-button-hover": "hover:bg-blue-600",
          "odds-button-text": "text-white",
          "odds-button-border": "border-blue-600",
          "odds-button-selected-bg": "bg-blue-500",
          "odds-button-selected-border": "border-blue-400",
          "odds-button-selected-text": "text-white",
          "odds-button-selected-hover": "hover:bg-blue-400",
          "odds-button-disabled-bg": "bg-gray-700/50",
          "odds-button-disabled-text": "text-gray-400",
          "odds-button-disabled-border": "border-gray-600",
        },
        modal: {
          change_password: {
            "modal-bg": "bg-slate-900",
            "modal-border": "border-blue-800",
            "modal-shadow": "shadow-blue-900/50",
            "header-border": "border-blue-700/50",
            "header-title": "text-white",
            "header-icon": "text-blue-500",
            "close-button": "text-gray-400",
            "close-button-hover": "hover:text-white",
            "info-box-bg": "bg-blue-500/10",
            "info-box-border": "border-blue-500/20",
            "info-box-text": "text-blue-300",
            "cancel-button-bg": "bg-slate-700",
            "cancel-button-hover": "hover:bg-slate-600",
            "cancel-button-text": "text-white",
            "confirm-button-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
            "confirm-button-hover": "hover:from-blue-500 hover:to-blue-600",
            "confirm-button-text": "text-white",
            "confirm-button-shadow": "shadow-blue-600/25",
          },
          "overlay-bg": "bg-black/50",
          "content-bg": "bg-slate-900",
          "content-border": "border-blue-800/30",
          "header-bg": "bg-gradient-to-r from-blue-950 to-blue-900",
          "header-text": "text-blue-200",
          "header-border": "border-blue-800/30",
          "body-bg": "bg-transparent",
          "body-text": "text-slate-200",
          "footer-bg": "bg-blue-950/50",
          "footer-border": "border-blue-800/30",
          "close-button": "text-gray-400 hover:text-blue-200",
          "close-button-hover": "hover:bg-blue-900/40",
        },
        "bg-main": "bg-blue-950",
        "bg-secondary": "bg-blue-900",
        "bg-tertiary": "bg-blue-800",
        "bg-gradient": "bg-gradient-to-br from-blue-700 to-blue-950",
        "bg-gradient-hover": "hover:from-blue-600 hover:to-blue-900",
        "text-primary": "text-white",
        "text-secondary": "text-blue-100",
        "text-muted": "text-blue-200",
        "light-divider": "bg-gray-300",
        "dark-divider": "bg-gray-700",
        border: "border-blue-800",
        "border-light": "border-blue-600",
        primary: "text-blue-400",
        "primary-bg": "bg-blue-700",
        "primary-hover": "hover:bg-blue-600",
        accent: "text-red-400",
        "accent-bg": "bg-red-500",
        "button-primary": "bg-blue-700 hover:bg-blue-600 text-white",
        "button-secondary":
          "bg-blue-900 hover:bg-blue-800 text-white border border-blue-700",
        "button-cancel-bg": "bg-gradient-to-r from-rose-600 to-red-600",
        "button-cancel-hover": "hover:from-rose-700 hover:to-red-700",
        "button-cancel-text": "text-white",
        "button-cancel-border": "border-rose-500/80",
        "button-proceed-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
        "button-proceed-hover": "hover:from-emerald-700 hover:to-green-700",
        "button-proceed-text": "text-white",
        "button-proceed-border": "border-emerald-500",

        card: "bg-blue-900/30 border-blue-800/40",
        "card-hover": "hover:border-blue-600/60 hover:bg-blue-900/40",
      };
    case "9": // Black & Gold theme
      return {
        "card-bg": "bg-[#161616]",
        "input-focus-within":
          "focus-within:outline-none focus-within:ring-2 focus:outline-none focus:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:bg-smalltext/10 focus:ring-yellow-500/80 focus:ring-2 focus:border-yellow-500/80 focus:ring-yellow-500/80 focus-within:border-yellow-500/80 ",
        "input-ring":
          "outline-none ring-2 ring-yellow-500/80 outline-none ring-ring ring-offset-0 bg-smalltext/10 border-yellow-500/80",
        "select-option-bg":
          "bg-gradient-to-br from-yellow-800 to-yellow-900 text-white",
        "item-hover-border-l": "hover:border-l-yellow-500/80",
        "modal-bg": "bg-[#161616]",
        "button-primary-bg": "bg-gradient-to-r from-gray-600 to-gray-700",
        "button-primary-border": "border border-gray-700",
        "button-primary-hover": "hover:from-gray-700 hover:to-gray-800",
        "button-primary-text": "text-white",
        "button-secondary-bg": "bg-gradient-to-r from-slate-600 to-slate-700",
        "button-secondary-border": "border border-slate-700",
        "button-secondary-hover": "hover:from-slate-700 hover:to-slate-800",
        "button-secondary-text": "text-white",
        app_header: {
          "highlight-indicator":
            "linear-gradient(135deg, #eab308 0%, #ca8a04 100%)",
          "header-gradient":
            "bg-gradient-to-r from-black via-gray-900 to-black",
          "active-route-indicator": "text-white",
          "inactive-route-indicator": "text-white",
          divider: "bg-yellow-700/40",
          "login-button-bg": "bg-yellow-600",
          "login-button-hover": "hover:bg-yellow-700",
          "login-button-text": "text-black",
        },
        sports_sidebar: {
          "card-border": "border-yellow-700/30",
          "sport-item-border-l": "border-l-2 border-yellow-700/30",
          "category-item-active": "bg-yellow-700 text-black",
          "account-icon-active": "text-yellow-500",
          "main-bg": "bg-[#161616]",
          "search-bg": "bg-gradient-to-r from-gray-950 to-black",
          "search-border": "border-yellow-700/40",
          divider: "bg-yellow-700/20",
          "item-bg": "bg-gray-900/30",
          "sport-item-border": "border-gray-600/80",
          "sport-item-bg": "bg-transparent",
          "sport-item-hover": "hover:bg-gray-900/50",
          "sport-item-text": "text-yellow-300",
          "sport-item-count-bg": "bg-gray-700/50",
          "sport-item-count-text": "text-yellow-300",
          "category-item-bg": "bg-gray-900/30",
          "category-item-hover": "hover:bg-gray-800/50",
          "category-item-text": "text-yellow-200",
          "category-item-border": "border-yellow-700/40",
          "category-item-count-bg": "bg-gray-600/50",
          "category-item-count-text": "text-gray-400",
          "tournament-item-bg": "bg-gray-900/20",
          "tournament-item-hover": "hover:bg-gray-800/50",
          "tournament-item-text": "text-yellow-100",
          "tournament-item-count-bg": "bg-gray-600/30",
          "tournament-item-count-text": "text-gray-500",
          "tournament-item-border": "border-gray-600/10",
        },
        betslip: {
          "main-bg": "bg-gradient-to-b from-black to-gray-950",
          "main-border": "border-yellow-700/40",
          "header-bg": "bg-gray-900/50",
          divider: "bg-yellow-700/20",
          "tab-bg": "bg-gray-800/30",
          "tab-border": "border-yellow-700/40",
          "tab-active-bg": "bg-gradient-to-br from-yellow-500 to-yellow-700",
          "tab-active-text": "text-black",
          "tab-inactive-text": "text-gray-400",
          "outcome-name-text": "text-yellow-500 font-bold",
          "slip-item-bg": "bg-gray-900 border-yellow-700/20",
          "slip-item-selected-bg": "bg-yellow-900/20 border-yellow-600/40",
          "slip-item-divider": "border-yellow-700/20",
          "slip-item-header": "text-yellow-300 font-semibold",
          "slip-item-main": "text-white font-bold",
          "slip-item-odds": "text-yellow-500 font-bold",
          "slip-item-remove": "text-red-400 hover:text-red-600",
          "slip-item-market": "text-gray-400",
          "slip-item-footer": "text-gray-400",
          "multiple-section-bg": "bg-gray-900 border-yellow-700/30",
          "combined-section-bg": "bg-gray-900 border-yellow-700/30",
          "button-place-bg": "bg-gradient-to-r from-yellow-600 to-yellow-500",
          "button-place-hover": "hover:from-yellow-700 hover:to-yellow-600",
          "button-place-text": "text-black",
          "button-confirm-bg": "bg-gradient-to-r from-yellow-600 to-yellow-500",
          "button-confirm-hover": "hover:from-yellow-700 hover:to-yellow-600",
          "button-cancel-bg": "bg-gradient-to-r from-red-600 to-red-500",
          "button-cancel-hover": "hover:from-red-700 hover:to-red-600",
        },
        sports_page: {
          "live-game-indicator": "bg-yellow-500",
          "container-bg": "bg-transparent",
          "card-bg": "bg-[#161616]",
          "card-border": "border-yellow-700/30",
          "card-hover": "hover:bg-black/80",
          "header-bg": "bg-gray-900/40",
          "header-border": "border-yellow-700/30",
          "header-text": "text-yellow-100",
          "date-separator-bg": "bg-gray-900/30",
          "date-separator-text": "text-yellow-200",
          "date-separator-border": "border-yellow-700/30",
          "time-text": "text-gray-300",
          "time-text-live": "text-green-400",
          "time-border": "border-gray-500",
          "match-tournament-text": "text-gray-400",
          "match-team-text": "text-white",
          "score-text": "text-green-400",
          "more-button-bg": "bg-transparent",
          "more-button-hover": "hover:text-yellow-400 hover:border-yellow-500",
          "more-button-text": "text-gray-300",
          "more-button-border": "border-gray-600",
          "primary-button-bg": "bg-yellow-500",
          "primary-button-text": "text-black",
          "secondary-button-bg": "bg-gray-300",
          "secondary-button-text": "text-gray-800",
          "skeleton-bg": "bg-gray-600",
          "skeleton-secondary": "bg-gray-900/30",
          "error-text": "text-red-600",
          "error-secondary": "text-gray-600",
          "empty-text": "text-gray-900",
          "empty-secondary": "text-gray-600",
          "sport-separator-bg": "bg-gray-200",
          "sport-separator-text": "text-gray-900",
          "sport-separator-border": "border-gray-300",
        },
        cashdesk_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-white",
          "card-border": "border-yellow-700/30",
          "header-bg": "bg-gradient-to-r from-black via-gray-900 to-black",
          "header-text": "text-white",
          "column-header-bg": "bg-gray-900/40",
          "column-header-text": "text-slate-300",
          "column-header-border": "border-yellow-700/30",
          "row-hover": "hover:bg-black/80",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",

          "summary-section-bg": "bg-[#161616]",
          "summary-section-border": "border-yellow-700/30",
          "summary-item-bg":
            "bg-gradient-to-r from-gray-600/20 to-slate-500/30",
          "summary-item-border": "border-gray-700/50",
          "summary-label-text": "text-gray-300",
          "summary-value-text": "text-gray-400",
          // ...existing code...
          "add-button-bg": "bg-white/20",
          "add-button-hover": "hover:bg-white/30",
          "add-button-border": "border-yellow-400",
        },
        bet_list_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-gray-800/60",
          "card-border": "border-gray-700/50",
          "card-text": "text-slate-200",
          "column-header-bg": "bg-gray-700/40",
          "column-header-text": "text-slate-300",
          "row-hover": "hover:bg-gray-800/80",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "header-text": "text-slate-200",
          "close-button": "bg-gray-700/40",
          "close-button-hover": "hover:bg-gray-600/60",
          "section-bg": "bg-gray-900/40",
          "section-title": "text-gray-300",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "item-bg": "bg-gray-800/30",
          "event-name": "text-slate-200",
          "subtitle-text": "text-gray-400",
          "action-button": "bg-gradient-to-r from-gray-600 to-gray-700",
          "action-button-hover": "hover:from-gray-700 hover:to-gray-800",
          "secondary-button": "bg-gradient-to-r from-slate-600 to-slate-700",
          "secondary-button-hover": "hover:from-slate-700 hover:to-slate-800",
        },
        modal: {
          change_password: {
            "modal-bg": "bg-gray-900",
            "modal-border": "border-gray-700",
            "modal-shadow": "shadow-gray-900/50",
            "header-border": "border-gray-700/50",
            "header-title": "text-white",
            "header-icon": "text-gray-400",
            "close-button": "text-gray-400",
            "close-button-hover": "hover:text-white",
            "info-box-bg": "bg-gray-500/10",
            "info-box-border": "border-gray-500/20",
            "info-box-text": "text-gray-300",
            "cancel-button-bg": "bg-gray-800",
            "cancel-button-hover": "hover:bg-gray-700",
            "cancel-button-text": "text-white",
            "confirm-button-bg": "bg-gradient-to-r from-gray-600 to-gray-700",
            "confirm-button-hover": "hover:from-gray-500 hover:to-gray-600",
            "confirm-button-text": "text-white",
            "confirm-button-shadow": "shadow-gray-600/25",
          },
          "overlay-bg": "bg-black/50",
          "content-bg": "bg-gray-900",
          "content-border": "border-gray-700/30",
          "header-bg": "bg-gradient-to-r from-black to-gray-900",
          "header-text": "text-gray-200",
          "header-border": "border-gray-700/30",
          "body-bg": "bg-transparent",
          "body-text": "text-slate-200",
          "footer-bg": "bg-black/50",
          "footer-border": "border-gray-700/30",
          "close-button": "text-gray-400 hover:text-gray-200",
          "close-button-hover": "hover:bg-gray-800/40",
        },
        coupon_details: {
          "section-bg": "bg-gray-900/40",
          "section-border": "border-gray-700/30",
          "section-title": "text-gray-300",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "item-bg": "bg-gray-800/30",
          "item-border": "border-gray-700/20",
          "event-name": "text-slate-200",
          "subtitle-text": "text-gray-400",
          divider: "border-gray-700/30",
          "win-text": "text-green-500",
          "skeleton-bg": "bg-gray-700/50",
          "skeleton-pulse": "bg-gray-700/30",
          "action-button": "bg-gray-600",
          "action-button-hover": "hover:bg-gray-700",
          "secondary-button": "bg-gray-800/50",
          "secondary-button-hover": "hover:bg-gray-800",
        },
        transactions_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-gray-800/60",
          "card-border": "border-gray-700/50",
          "card-text": "text-slate-200",
          "column-header-bg": "bg-gray-700/40",
          "column-header-text": "text-slate-300",
          "row-hover": "hover:bg-gray-800/80",
          "row-text": "text-gray-200",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "label-text": "text-gray-400",
          "value-text": "text-gray-300",
          "credit-text": "text-green-500",
          "debit-text": "text-red-500",
          "button-primary-bg": "bg-gradient-to-r from-gray-600 to-gray-700",
          "button-primary-hover": "hover:from-gray-700 hover:to-gray-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-gradient-to-r from-slate-600 to-slate-700",
          "button-secondary-hover": "hover:from-slate-700 hover:to-slate-800",
          "button-secondary-text": "text-white",
          "checkbox-active-bg": "bg-gray-600",
          "checkbox-active-border": "border-gray-600",
          "checkbox-inactive-border": "border-gray-400",
          "footer-bg": "bg-gray-700/40",
        },
        deposit_page: {
          "container-bg": "bg-transparent",
          "page-bg": "bg-transparent",
          "page-text": "text-white",
          "header-text": "text-black",
          "warning-bg": "bg-yellow-50",
          "warning-border": "border-yellow-200",
          "warning-icon": "text-yellow-600",
          "warning-text": "text-gray-800",
          "card-bg": "bg-gray-800/60",
          "card-border": "border-gray-700/50",
          "table-header-bg": "bg-gray-700/40",
          "table-header-text": "text-white",
          "row-hover": "hover:bg-gray-800/80",
          "row-text": "text-white",
          "label-text": "text-gray-400",
          "value-text": "text-white",
          "button-primary-bg": "bg-gradient-to-r from-gray-600 to-gray-700",
          "button-primary-hover": "hover:from-gray-700 hover:to-gray-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-slate-700",
          "button-secondary-hover": "hover:bg-slate-600",
          "button-secondary-text": "text-white",
          "form-bg": "bg-gray-800/50",
          "form-border": "border-gray-700/30",
          "form-text": "text-white",
          "info-bg": "bg-gray-700/50",
          "info-border": "border-gray-600/30",
          "info-text": "text-gray-300",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "balance-text": "text-gray-400",
          "balance-value": "text-green-400",
          "quick-button-bg": "bg-slate-700",
          "quick-button-hover": "hover:bg-slate-600",
          "quick-button-text": "text-slate-300",
          "quick-button-border": "border-slate-600",
          "security-bg": "bg-blue-500/10",
          "security-border": "border-blue-500/20",
          "security-text": "text-blue-400",
        },
        main_input: {
          background: "bg-gradient-to-r from-slate-800 to-slate-700",
          border: "border border-slate-600",
          "text-color": "text-gray-200",
        },
        account_page: {
          "container-bg": "bg-gradient-to-br from-black via-gray-900 to-black",
          "card-bg": "bg-gray-900/50",
          "card-border": "border-yellow-800/30",
          "header-text": "text-yellow-300",
          "subtitle-text": "text-gray-400",
          "section-header-text": "text-yellow-200",
          "section-header-border": "border-yellow-800",
          "input-bg": "bg-gradient-to-r from-slate-800 to-slate-700",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "balance-card-bg":
            "bg-gradient-to-br from-yellow-900/20 to-yellow-800/10",
          "balance-card-border": "border-yellow-700/30",
          "balance-label-text": "text-gray-400",
          "balance-value-text": "text-yellow-400",
          "button-primary-bg": "bg-gradient-to-r from-yellow-600 to-yellow-700",
          "button-primary-hover": "hover:from-yellow-700 hover:to-yellow-800",
          "button-primary-text": "text-black",
        },
        user_management_page: {
          "page-bg": "bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900",
          "page-text": "text-white",
          "header-icon-bg": "bg-green-500/10",
          "header-icon-text": "text-green-400",
          "header-text": "text-white",
          "subtitle-text": "text-gray-400",
          "card-bg": "bg-gray-800/50",
          "card-border": "border-gray-700/30",
          "section-header-text": "text-gray-300",
          "section-header-border": "border-gray-700",
          "column-header-bg": "bg-gray-800/50",
          "column-header-text": "text-gray-300",
          "row-hover": "hover:bg-slate-700/30",
          "row-text": "text-white",
          "row-border": "border-slate-700/30",
          "balance-text": "text-emerald-400",
          "input-bg": "bg-slate-800",
          "input-border": "border-slate-600",
          "input-text": "text-white",
          "button-primary-bg": "bg-gradient-to-r from-primary to-primary/80",
          "button-primary-hover": "hover:from-primary/90 hover:to-primary/70",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-slate-700",
          "button-secondary-hover": "hover:bg-slate-600",
          "button-secondary-text": "text-white",
          "button-action-deposit-bg": "bg-green-500/20",
          "button-action-deposit-hover": "hover:bg-green-500/30",
          "button-action-deposit-text": "text-green-400",
          "button-action-withdraw-bg": "bg-red-500/20",
          "button-action-withdraw-hover": "hover:bg-red-500/30",
          "button-action-withdraw-text": "text-red-400",
          "info-card-bg": "bg-slate-700/50",
          "info-card-border": "border-slate-600/50",
          "info-label-text": "text-gray-400",
          "info-value-text": "text-white",
          "badge-deposit-bg": "bg-green-500/20",
          "badge-deposit-text": "text-green-400",
          "badge-withdraw-bg": "bg-red-500/20",
          "badge-withdraw-text": "text-red-400",
        },
        game_options_modal: {
          "modal-border": "border-yellow-700/40",
          "header-title": "text-yellow-500",
          "header-subtitle": "text-gray-300",
          "header-vs-text": "text-yellow-400",
          "header-date-text": "text-gray-400",
          "title-text": "text-yellow-300",
          "subtitle-text": "text-yellow-200",
          "market-card-bg": "bg-yellow-950/30",
          "market-card-border": "border-yellow-600/40",
          "market-card-hover":
            "hover:border-yellow-500/50 hover:bg-yellow-950/50",
          "market-title": "text-yellow-300",
          "axis-label-text": "text-yellow-400",
          "axis-label-bg": "bg-yellow-900/20",
          "odds-button-bg": "bg-yellow-50",
          "odds-button-hover": "hover:bg-yellow-500",
          "odds-button-text": "text-black",
          "odds-button-border": "border-yellow-500/30",
          "odds-button-selected-bg":
            "bg-gradient-to-r from-[#F59E0B] via-yellow-500 to-[#F59E0B]",
          "odds-button-selected-border": "border-yellow-400",
          "odds-button-selected-text": "text-black",
          "odds-button-selected-hover": "hover:bg-yellow-300",
          "odds-button-disabled-bg": "bg-gray-400/50",
          "odds-button-disabled-text": "text-gray-700",
          "odds-button-disabled-border": "border-gray-400",
        },
        "bg-main": "bg-black",
        "bg-secondary": "bg-gray-900",
        "bg-tertiary": "bg-gray-800",

        "bg-gradient": "bg-gradient-to-br from-gray-900 to-black",
        "bg-gradient-hover": "hover:from-gray-800 hover:to-gray-900",
        "text-primary": "text-white",
        "text-secondary": "text-yellow-400",
        "text-muted": "text-yellow-600",
        border: "border-yellow-700",
        "border-light": "border-yellow-500",
        primary: "text-yellow-500",
        "primary-bg": "bg-yellow-600",
        "primary-hover": "hover:bg-yellow-500",
        accent: "text-yellow-400",
        "accent-bg": "bg-yellow-500",
        "light-divider": "bg-gray-300",
        "dark-divider": "bg-gray-700",
        "button-primary":
          "bg-yellow-600 hover:bg-yellow-500 text-black font-bold",
        "button-secondary":
          "bg-gray-800 hover:bg-gray-700 text-yellow-400 border border-yellow-700",
        card: "bg-gray-900/50 border-yellow-700/30",
        "card-hover": "hover:border-yellow-500/60 hover:bg-gray-900/70",
        "input-bg":
          "bg-gradient-to-r from-slate-50 to-slate-50 placeholder-slate-400 ",
        "input-border":
          "border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/80 ",
        "input-text": "text-gray-600",
        "skeleton-bg": "bg-gray-700/50",
        "button-cancel-bg": "bg-gradient-to-r from-rose-600 to-red-600",
        "button-cancel-hover": "hover:from-rose-700 hover:to-red-700",
        "button-cancel-text": "text-white",
        "button-cancel-border": "border-rose-500/80",
        "button-proceed-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
        "button-proceed-hover": "hover:from-emerald-700 hover:to-green-700",
        "button-proceed-text": "text-white",
        "button-proceed-border": "border-emerald-500",
      };
    case "10": // Purple & Violet theme
      return {
        app_header: {
          "highlight-indicator":
            "linear-gradient(135deg, #EA3C00 0%, #FEA352 100%)",
          "header-gradient":
            "bg-gradient-to-r from-[#894824] via-[#884816] to-[#894824]",
          "active-route-indicator": "text-white",
          "inactive-route-indicator": "text-white",
          divider: "bg-[#FEA352]",
          "login-button-bg": "bg-[#EA3C00]",
          "login-button-hover": "hover:bg-[#ea4201]",
          "login-button-text": "text-white",
        },
        sports_sidebar: {
          "card-border": "border-[#EA3C00]/30",
          "sport-item-border-l": "border-l-2 border-[#EA3C00]/30",
          "category-item-active": "bg-[#EA3C00] text-white",
          "account-icon-active": "text-[#884816]",
          "main-bg": "bg-[#ffffff]/60",
          "search-bg": "bg-gradient-to-r from-[#EA3C00] to-[#FEA352]",
          "search-border": "border-[#EA3C00]",
          divider: "bg-[#FEA352]/30",
          "item-bg": "bg-[#FEA352]/30",
          "sport-item-border": "border-[#EA3C00]/30 shadow-lg",
          "sport-item-bg": "bg-[#FCE4BF]/30",
          "sport-item-hover": "hover:bg-[#f99300]/20",
          "sport-item-text": "text-[#884816]",
          "sport-item-count-bg": "bg-[#ea4201]/80",
          "sport-item-count-text": "text-white",
          "category-item-bg": "",
          "category-item-hover": "hover:bg-[#f99300]/30",
          "category-item-text": "text-[#884816]",
          "category-item-border": "border-[#EA3C00]/70 border-l-[#EA3C00]",
          "category-item-count-bg": "bg-[#DBD8D4]/40",
          "category-item-count-text": "text-[#ea4201]",
          "tournament-item-bg": "bg-[#FEA352]/20",
          "tournament-item-hover": "hover:bg-[#f99300]/20",
          "tournament-item-text": "text-[#884816]",
          "tournament-item-count-bg": "bg-[#DBD8D4]/30",
          "tournament-item-count-text": "text-[#ea4201]",
          "tournament-item-border": "border-[#FEA352]/10",
        },
        betslip: {
          "main-bg": "bg-[#ffffff]/60",
          "main-border": "border-[#EA3C00]/30",
          "header-bg": "bg-[#FEA352]/50",
          divider: "bg-[#EA3C00]/30",
          "tab-bg": "bg-[#FEA352]/30",
          "tab-border": "border-[#EA3C00]",
          "tab-active-bg": "bg-gradient-to-br from-[#EA3C00] to-[#ea4201]",
          "tab-active-text": "text-white",
          "tab-inactive-text": "text-[#ea4201]",
          "outcome-name-text": "text-[#EA3C00] font-bold",
          "slip-item-bg": "bg-[#ffffff]/80 border-[#EA3C00]/30",
          "slip-item-selected-bg": "bg-[#ea4201]/30 border-[#EA3C00]/40",
          "slip-item-divider": "border-[#EA3C00]/20",
          "slip-item-header": "text-[#884816] font-semibold",
          "slip-item-main": "text-[#EA3C00] font-bold",
          "slip-item-odds": "text-green-600 font-bold",
          "slip-item-remove": "text-[#ea4201] hover:text-[#EA3C00]",
          "slip-item-market": "text-[#EA3C00]",
          "slip-item-footer": "text-[#ea4201]",
          "multiple-section-bg": "bg-[#FEA352] border-[#EA3C00]/30",
          "combined-section-bg": "bg-[#FEA352] border-[#EA3C00]/30",
          "button-place-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
          "button-place-hover": "hover:from-emerald-700 hover:to-green-700",
          "button-place-text": "text-white",
          "button-confirm-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
          "button-confirm-hover": "hover:from-emerald-700 hover:to-green-700",
          "button-cancel-bg": "bg-gradient-to-r from-[#EA3C00] to-[#ea4201]",
          "button-cancel-hover": "hover:from-[#ea4201] hover:to-[#EA3C00]",
        },
        sports_page: {
          "live-game-indicator": "bg-green-500",
          "container-bg": "bg-transparent",
          "card-bg": "bg-[#ffffff]/60",
          "card-border": "border-[#EA3C00]/30",
          "card-hover": "hover:bg-[#FEA352]/60",
          "header-bg":
            "bg-gradient-to-r from-[#894824] via-[#884816] to-[#894824]",
          "header-border": "border-[#EA3C00]/50",
          "header-text": "text-[#FCE4BF]",
          "sport-separator-bg": "bg-[#FEA352]/50",
          "sport-separator-text": "text-[#EA3C00]",
          "sport-separator-border": "border-[#EA3C00]/60",
          "date-separator-bg": "bg-[#FEA352]/30",
          "date-separator-text": "text-[#ea4201]",
          "date-separator-border": "border-[#EA3C00]/40",
          "time-text": "text-[#ea4201]",
          "time-text-live": "text-green-400",
          "time-border": "border-gray-500",
          "match-tournament-text": "text-[#EA3C00]",
          "match-team-text": "text-[#894824]",
          "score-text": "text-green-400",
          "more-button-bg": "bg-transparent",
          "more-button-hover": "hover:text-blue-400 hover:border-blue-500",
          "more-button-text": "text-[#ea4201]",
          "more-button-border": "border-gray-600",
          "primary-button-bg": "bg-[#EA3C00]",
          "primary-button-text": "text-white",
          "secondary-button-bg": "bg-[#FEA352]/40",
          "secondary-button-text": "text-[#EA3C00]",
          "skeleton-bg": "bg-gray-600",
          "skeleton-secondary": "bg-[#FEA352]/30",
          "error-text": "text-[#ea4201]",
          "error-secondary": "text-[#FEA352]",
          "empty-text": "text-[#EA3C00]",
          "empty-secondary": "text-[#ea4201]",
        },
        cashdesk_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-[#FEA352]/20",
          "card-border": "border-[#EA3C00]/30",
          "header-bg": "bg-[#894824]",
          "header-text": "text-[#FCEDCB]",
          "column-header-bg": "bg-[#FEA352]/40",
          "column-header-text": "text-[#ea4201]",
          "column-header-border": "border-[#EA3C00]/30",
          "row-hover": "hover:bg-[#FEA352]/80",
          "input-bg": "bg-white",
          "input-border": "border-[#EA3C00]/30",
          "input-text": "text-[#884816]",
          "summary-section-bg":
            "bg-gradient-to-r from-[#DBD8D4]/10 to-[#FEA352]/20",
          "summary-section-border": "border-[#EA3C00]/50",
          "summary-item-bg": "bg-[#FCEDCB]",
          "summary-item-border": "border-[#EA3C00]/30",
          "summary-label-text": "text-[#ea4201]",
          "summary-value-text": "text-[#884816]",
          // ...existing code...
          "add-button-bg": "bg-[#FEA352]/20",
          "add-button-hover": "hover:bg-[#FEA352]/30",
          "add-button-border": "border-[#EA3C00]/50",
        },
        bet_list_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-[#FEA352]/60",
          "card-border": "border-[#EA3C00]/50",
          "card-text": "text-[#ea4201]",
          "column-header-bg": "bg-[#FEA352]/40",
          "column-header-text": "text-[#ea4201]",
          "row-hover": "hover:bg-[#FEA352]/80",
          "input-bg": "bg-gradient-to-r from-[#DBD8D4] to-[#FEA352]",
          "input-border": "border-[#EA3C00]",
          "input-text": "text-[#EA3C00]",
          "header-text": "text-[#ea4201]",
          "close-button": "bg-[#FEA352]/40",
          "close-button-hover": "hover:bg-[#FEA352]/60",
          "section-bg": "bg-[#FEA352]/40",
          "section-title": "text-[#EA3C00]",
          "label-text": "text-[#ea4201]",
          "value-text": "text-[#EA3C00]",
          "item-bg": "bg-[#FEA352]/30",
          "event-name": "text-[#ea4201]",
          "subtitle-text": "text-[#ea4201]",
          "action-button": "bg-gradient-to-r from-[#EA3C00] to-[#ea4201]",
          "action-button-hover": "hover:from-[#ea4201] hover:to-[#EA3C00]",
          "secondary-button": "bg-gradient-to-r from-[#FEA352] to-[#DBD8D4]",
          "secondary-button-hover": "hover:from-[#f99300] hover:to-[#EA3C00]",
        },
        modal: {
          change_password: {
            "modal-bg": "bg-[#DBD8D4]",
            "modal-border": "border-[#EA3C00]",
            "modal-shadow": "shadow-[#EA3C00]/50",
            "header-border": "border-[#EA3C00]/50",
            "header-title": "text-[#EA3C00]",
            "header-icon": "text-[#ea4201]",
            "close-button": "text-[#ea4201]",
            "close-button-hover": "hover:text-[#EA3C00]",
            "info-box-bg": "bg-[#FEA352]/10",
            "info-box-border": "border-[#FEA352]/20",
            "info-box-text": "text-[#ea4201]",
            "cancel-button-bg": "bg-[#FEA352]",
            "cancel-button-hover": "hover:bg-[#f99300]",
            "cancel-button-text": "text-[#EA3C00]",
            "confirm-button-bg": "bg-gradient-to-r from-[#EA3C00] to-[#ea4201]",
            "confirm-button-hover": "hover:from-[#ea4201] hover:to-[#EA3C00]",
            "confirm-button-text": "text-white",
            "confirm-button-shadow": "shadow-[#EA3C00]/25",
          },
          "overlay-bg": "bg-black/50",
          "content-bg": "bg-[#DBD8D4]",
          "content-border": "border-[#EA3C00]/30",
          "header-bg": "bg-gradient-to-r from-[#EA3C00] to-[#FEA352]",
          "header-text": "text-[#EA3C00]",
          "header-border": "border-[#EA3C00]/30",
          "body-bg": "bg-transparent",
          "body-text": "text-[#ea4201]",
          "footer-bg": "bg-[#FEA352]/30",
          "footer-border": "border-[#EA3C00]/30",
          "close-button": "text-[#ea4201] hover:text-[#EA3C00]",
          "close-button-hover": "hover:bg-[#FEA352]/40",
        },
        coupon_details: {
          "section-bg": "bg-[#FEA352]/40",
          "section-border": "border-[#EA3C00]/30",
          "section-title": "text-[#EA3C00]",
          "label-text": "text-[#ea4201]",
          "value-text": "text-[#EA3C00]",
          "item-bg": "bg-[#FEA352]/30",
          "item-border": "border-[#EA3C00]/20",
          "event-name": "text-[#ea4201]",
          "subtitle-text": "text-[#ea4201]",
          divider: "border-[#EA3C00]/30",
          "win-text": "text-green-500",
          "skeleton-bg": "bg-[#FEA352]/20",
          "skeleton-pulse": "bg-[#FEA352]/30",
          "action-button": "bg-gradient-to-r from-[#EA3C00] to-[#ea4201]",
          "action-button-hover": "hover:from-[#ea4201] hover:to-[#EA3C00]",
          "secondary-button": "bg-gradient-to-r from-[#FEA352] to-[#DBD8D4]",
          "secondary-button-hover": "hover:from-[#f99300] hover:to-[#EA3C00]",
        },
        transactions_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-[#FEA352]/60",
          "card-border": "border-[#EA3C00]/30",

          "card-text": "text-[#ea4201]",
          "column-header-bg": "bg-[#FEA352]/40",
          "column-header-text": "text-[#FCE4BF]",
          "row-hover": "hover:bg-[#FEA352]/20",
          "row-text": "text-[#EA3C00]",
          "input-bg": "bg-gradient-to-r from-[#DBD8D4] to-[#FEA352]",
          "input-border": "border-[#EA3C00]",
          "input-text": "text-[#EA3C00]",
          "label-text": "text-[#ea4201]",
          "value-text": "text-[#EA3C00]",
          "credit-text": "text-green-500",
          "debit-text": "text-red-500",
          "button-primary-bg": "bg-gradient-to-r from-[#EA3C00] to-[#ea4201]",
          "button-primary-hover": "hover:from-[#ea4201] hover:to-[#EA3C00]",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-gradient-to-r from-[#FEA352] to-[#DBD8D4]",
          "button-secondary-hover": "hover:from-[#f99300] hover:to-[#EA3C00]",
          "button-secondary-text": "text-[#EA3C00]",
          "checkbox-active-bg": "bg-[#EA3C00]",
          "checkbox-active-border": "border-[#EA3C00]",
          "checkbox-inactive-border": "border-[#FEA352]",
          "footer-bg": "bg-[#FEA352]/30",
        },
        deposit_page: {
          "container-bg": "bg-transparent",

          "page-bg": "bg-transparent",
          "page-text": "text-[#EA3C00]",
          "header-text": "text-black",
          "warning-bg": "bg-yellow-50",
          "warning-border": "border-yellow-200",
          "warning-icon": "text-yellow-600",
          "warning-text": "text-gray-800",
          "card-bg": "bg-[#FEA352]/60",
          "card-border": "border-[#EA3C00]/50",
          "table-header-bg": "bg-[#FEA352]/40",
          "table-header-text": "text-[#ea4201]",
          "row-hover": "hover:bg-[#FEA352]/80",
          "row-text": "text-[#EA3C00]",
          "label-text": "text-[#ea4201]",
          "value-text": "text-[#EA3C00]",
          "button-primary-bg": "bg-gradient-to-r from-[#EA3C00] to-[#ea4201]",

          "button-primary-hover": "hover:from-[#ea4201] hover:to-[#EA3C00]",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-gradient-to-r from-[#FEA352] to-[#DBD8D4]",
          "button-secondary-hover": "hover:from-[#f99300] hover:to-[#EA3C00]",
          "button-secondary-text": "text-[#EA3C00]",
          "form-bg": "bg-[#FEA352]/50",

          "form-border": "border-[#EA3C00]/30",
          "form-text": "text-[#EA3C00]",
          "info-bg": "bg-[#FEA352]/50",
          "info-border": "border-[#EA3C00]/30",
          "info-text": "text-[#ea4201]",
          "input-bg": "bg-gradient-to-r from-[#DBD8D4] to-[#FEA352]",
          "input-border": "border-[#EA3C00]",
          "input-text": "text-[#EA3C00]",
          "balance-text": "text-[#ea4201]",
          "balance-value": "text-green-400",
          "quick-button-bg": "bg-[#FEA352]/30",
          "quick-button-hover": "hover:bg-[#FEA352]/40",
          "quick-button-text": "text-[#EA3C00]",
          "quick-button-border": "border-[#EA3C00]",
          "security-bg": "bg-[#EA3C00]/10",
          "security-border": "border-[#EA3C00]/20",
          "security-text": "text-[#ea4201]",
        },
        game_options_modal: {
          "modal-border": "border-[#EA3C00]/40",
          "header-title": "text-[#884816]",
          "header-subtitle": "text-[#ea4201]",
          "header-vs-text": "text-[#EA3C00]",
          "header-date-text": "text-[#ea4201]",
          "title-text": "text-[#EA3C00]",
          "subtitle-text": "text-[#ea4201]",
          "market-card-bg": "bg-[#FCE4BF]/50",
          "market-card-border": "border-[#EA3C00]/20",
          "market-card-hover": "hover:border-[#EA3C00]/20 hover:bg-[#FEA352]/5",
          "market-title": "text-[#884816]",
          "axis-label-text": "text-[#EA3C00]",
          "axis-label-bg": "bg-[#EA3C00]/20",
          "odds-button-bg": "bg-white",
          "odds-button-hover": "hover:bg-[#ffcfab]",
          "odds-button-text": "text-[#884816]",
          "odds-button-border": "border-[#884816]/30",
          "odds-button-selected-bg":
            "bg-gradient-to-r from-[#EA3C00] to-[#ea4201]",
          "odds-button-selected-border": "border-[#EA3C00]/40",
          "odds-button-selected-text": "text-white",
          "odds-button-selected-hover": "hover:bg-[#f99300]/40",
          "odds-button-disabled-bg": "bg-gray-400/50",
          "odds-button-disabled-text": "text-gray-700",
          "odds-button-disabled-border": "border-gray-400",
        },
        main_input: {
          background: "bg-gradient-to-r from-[#FEA352] to-[#DBD8D4]",
          border: "border border-[#EA3C00]",
          "text-color": "text-[#EA3C00]",
        },
        account_page: {
          "container-bg": "bg-gradient-to-br from-gray-50 via-white to-gray-50",
          "card-bg": "bg-white",
          "card-border": "border-gray-300",
          "header-text": "text-slate-800",
          "subtitle-text": "text-slate-600",
          "section-header-text": "text-slate-700",
          "section-header-border": "border-gray-300",
          "input-bg": "bg-gradient-to-r from-slate-50 to-slate-50",
          "input-border": "border-slate-300 focus:border-blue-500",
          "input-text": "text-gray-600",
          "balance-card-bg": "bg-gradient-to-br from-blue-50/20 to-white",
          "balance-card-border": "border-gray-300",
          "balance-label-text": "text-slate-600",
          "balance-value-text": "text-blue-700",
          "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
          "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
          "button-primary-text": "text-white",
        },
        user_management_page: {
          "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
          "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-gray-200",
          "button-secondary-hover": "hover:bg-gray-300",
          "button-secondary-text": "text-gray-700",
          "page-bg": "bg-gradient-to-br from-gray-50 via-white to-gray-50",
          "page-text": "text-gray-900",
          "header-icon-bg": "bg-blue-100",
          "header-icon-text": "text-blue-600",
          "header-text": "text-gray-900",
          "subtitle-text": "text-gray-600",
          "card-bg": "bg-white",
          "card-border": "border-gray-300",
          "section-header-text": "text-gray-700",
          "section-header-border": "border-gray-300",
          "column-header-bg": "bg-gray-100",
          "column-header-text": "text-gray-700",
          "row-hover": "hover:bg-gray-50",
          "row-text": "text-gray-900",
          "row-border": "border-gray-200",
          "balance-text": "text-emerald-600",
          "input-bg": "bg-white",
          "input-border": "border-gray-300",
          "input-text": "text-gray-900",

          "button-action-deposit-bg": "bg-green-100",
          "button-action-deposit-hover": "hover:bg-green-200",
          "button-action-deposit-text": "text-green-700",
          "button-action-withdraw-bg": "bg-red-100",
          "button-action-withdraw-hover": "hover:bg-red-200",
          "button-action-withdraw-text": "text-red-700",
          "info-card-bg": "bg-gray-50",
          "info-card-border": "border-gray-300",
          "info-label-text": "text-gray-600",
          "info-value-text": "text-gray-900",
          "badge-deposit-bg": "bg-green-100",
          "badge-deposit-text": "text-green-700",
          "badge-withdraw-bg": "bg-red-100",
          "badge-withdraw-text": "text-red-700",
        },
        "bg-main": "bg-[#FCEDCB]",
        "bg-secondary": "bg-[#FEA352]",
        "bg-tertiary": "bg-[#EA3C00]",
        "bg-gradient": "bg-gradient-to-br from-blue-800 to-blue-950",
        "bg-gradient-hover": "hover:from-blue-700 hover:to-blue-900",
        "text-primary": "text-gray-700",
        "text-secondary": "text-gray-600",
        "text-muted": "text-gray-400",
        "light-divider": "bg-gray-300",
        "dark-divider": "bg-gray-700",
        border: "border-gray-300",
        "border-light": "border-gray-500",
        primary: "text-blue-400",
        "primary-bg": "bg-blue-600",
        "primary-hover": "hover:bg-blue-500",
        accent: "text-blue-300",
        "accent-bg": "bg-blue-400",
        "card-bg": "bg-[#DBD8D4]",
        card: "bg-gray-800/30 border-gray-700/30",
        "card-hover": "hover:border-blue-600/60",
        "input-focus-within":
          "focus-within:outline-none focus-within:ring-2 focus:outline-none focus:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:bg-[#FEA352]/10 focus:ring-[#EA3C00]/80 focus:ring-2 focus:border-[#EA3C00]/80 focus-within:border-[#EA3C00]/80 ",
        "input-ring":
          "outline-none ring-2 ring-[#EA3C00]/80 outline-none ring-ring ring-offset-0 bg-[#FEA352]/10 border-[#EA3C00]/80",
        "select-option-bg":
          "bg-gradient-to-br from-[#EA3C00] to-[#f99300] text-white",
        "item-hover-border-l": "hover:border-l-[#EA3C00]/60",
        "input-bg":
          "bg-gradient-to-r from-slate-50 to-slate-50 placeholder-slate-400 ",
        "input-border": "border-slate-300  ",

        // "input-focus-within":
        //   "focus-within:outline-none focus-within:ring-2 focus:outline-none focus:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:bg-smalltext/10 focus:ring-blue-500/80  focus:ring-2 focus:border-blue-500/80 focus:ring-blue-500/80 focus-within:border-blue-500/80 ",
        // "input-ring":
        //   "outline-none ring-2 ring-blue-500/80 outline-none ring-ring ring-offset-0 bg-smalltext/10 border-blue-500/80",
        // "select-option-bg":
        // "bg-gradient-to-br from-blue-800 to-blue-900  text-white",
        "input-text": "text-[#894824]",
        "modal-bg": "bg-[#ffffff]",
        "button-primary": "bg-blue-600 hover:bg-blue-500 text-white",
        "button-secondary": "bg-gray-700 hover:bg-gray-600 text-white",
        "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
        "button-primary-border": "border border-blue-300",
        "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
        "button-primary-text": "text-white",
        "button-secondary-bg": "bg-gray-200",
        "button-secondary-border": "border border-gray-300",
        "button-secondary-hover": "hover:bg-gray-300",
        "button-secondary-text": "text-gray-700",
        "button-cancel-bg": "bg-gradient-to-r from-rose-600 to-red-600",
        "button-cancel-hover": "hover:from-rose-700 hover:to-red-700",
        "button-cancel-text": "text-white",
        "button-cancel-border": "border-rose-500/80",
        "button-proceed-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
        "button-proceed-hover": "hover:from-emerald-700 hover:to-green-700",
        "button-proceed-text": "text-white",
        "button-proceed-border": "border-emerald-500",
      };
    default: // Default Deep Blue theme
      return {
        app_header: {
          "highlight-indicator":
            "linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)",
          "header-gradient":
            "bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950",
          "active-route-indicator": "text-white hover:text-blue-200",
          "inactive-route-indicator": "text-white hover:text-blue-200",
          divider: "bg-blue-800",
          "login-button-bg": "bg-blue-600",
          "login-button-hover": "hover:bg-blue-700",
          "login-button-text": "text-white",
        },
        sports_sidebar: {
          "card-border": "border-gray-300",
          "sport-item-border-l": "border-l-blue-800",
          "category-item-active": "bg-blue-600 text-white",
          "account-icon-active": "text-blue-500",
          "main-bg": "bg-white border border-gray-200",
          "search-bg": "bg-gray-50",
          "search-border": "border-gray-300",
          divider: "bg-gray-200",
          "item-bg": "bg-gray-50",
          "sport-item-border": "border-gray-300",
          "sport-item-bg": "bg-white",
          "sport-item-hover": "hover:bg-gray-50",
          "sport-item-text": "text-slate-700",
          "sport-item-count-bg": "bg-gray-200",
          "sport-item-count-text": "text-slate-600",
          "category-item-bg": "bg-gray-50/50",
          "category-item-border": "border-l-blue-600",
          // "category-item-active": "bg-blue-600", // duplicate removed
          "category-item-hover": "hover:bg-gray-100",
          "category-item-text": "text-slate-700",
          // "account-icon-active": "text-blue-500", // duplicate removed
          "category-item-count-bg": "bg-gray-200",
          "category-item-count-text": "text-slate-500",
          "tournament-item-bg": "bg-white",
          "tournament-item-hover": "hover:bg-blue-50",
          "tournament-item-text": "text-slate-600",
          "tournament-item-count-bg": "bg-gray-100",
          "tournament-item-count-text": "text-slate-500",
          "tournament-item-border": "border-gray-200",
        },
        betslip: {
          "main-bg": "bg-white",
          "main-border": "border-slate-300",
          "header-bg": "bg-slate-100",
          divider: "bg-gray-100",
          "tab-bg": "bg-slate-200",
          "tab-border": "border-slate-300",
          "tab-active-bg": "bg-gradient-to-br from-blue-800 to-blue-900",
          "tab-active-text": "text-gray-300",
          "tab-inactive-text": "text-gray-600",
          "outcome-name-text": "text-slate-700 font-bold",
          "slip-item-bg": "bg-white border-slate-300",
          "slip-item-selected-bg": "bg-blue-100 border-blue-300",
          "slip-item-divider": "border-slate-200",
          "slip-item-header": "text-blue-700 font-semibold",
          "slip-item-main": "text-gray-900 font-bold",
          "slip-item-odds": "text-blue-700 font-bold",
          "slip-item-remove": "text-red-400 hover:text-red-600",
          "slip-item-market": "text-gray-500",
          "slip-item-footer": "text-gray-500",
          "multiple-section-bg": "bg-white border-slate-300",
          "combined-section-bg": "bg-white border-slate-300",
          "button-place-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
          "button-place-hover": "hover:from-emerald-700 hover:to-green-700",
          "button-place-text": "text-white",
          "button-confirm-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
          "button-confirm-hover": "hover:from-emerald-700 hover:to-green-700",
          "button-cancel-bg": "bg-gradient-to-r from-red-600 to-red-500",
          "button-cancel-hover": "hover:from-red-700 hover:to-red-600",
        },
        sports_page: {
          // "live-game-indicator": "bg-blue-500", // duplicate removed
          "container-bg": "bg-transparent",
          "card-bg": "bg-white",
          "card-border": "border-gray-300",
          "card-hover": "hover:bg-slate-200/80 hover:border-blue-600/80",
          "header-bg": "bg-gradient-to-r from-blue-950 to-blue-900",
          "header-border": "border-slate-700/50",
          "header-text": "text-gray-100",
          "date-separator-bg": "bg-blue-800",
          "date-separator-text": "text-gray-300",
          "date-separator-border": "border-slate-700/40",
          "time-text": "text-gray-500",
          "time-text-live": "text-green-600",
          "time-border": "border-gray-500",
          "match-tournament-text": "text-gray-500",
          "match-team-text": "text-gray-700",
          "score-text": "text-green-400",
          "more-button-bg": "bg-transparent",
          "more-button-hover": "hover:text-blue-400 hover:border-blue-500/50",
          "more-button-text": "text-gray-600",
          "more-button-border": "border-gray-600",
          "primary-button-bg": "bg-blue-700",
          "primary-button-text": "text-white",
          "secondary-button-bg": "bg-slate-200",
          "secondary-button-text": "text-slate-700",
          "sport-separator-bg": "bg-blue-900",
          "sport-separator-text": "text-gray-200",
          "sport-separator-border": "border-blue-700",
          "skeleton-bg": "bg-gray-600",
          "skeleton-secondary": "bg-slate-800/30",
          "error-text": "text-red-400",
          "error-secondary": "text-gray-400",
          "empty-text": "text-gray-500",
          "empty-secondary": "text-gray-400",
          "live-game-indicator": "bg-blue-500",
        },
        cashdesk_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-white",
          "card-border": "border-slate-700/50",
          "header-bg":
            "bg-gradient-to-r from-blue-950 via-blue-900 to-blue-950",
          "header-text": "text-white",
          "column-header-bg": "bg-blue-800",
          "column-header-text": "text-slate-300",
          "column-header-border": "border-slate-700/50",
          "row-hover": "hover:bg-slate-900/80",
          "input-bg":
            "bg-gradient-to-r from-slate-50 to-slate-50 placeholder-slate-400 ",
          "input-border":
            "border-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/80 ",
          "input-text": "text-gray-600",
          "summary-section-bg": "bg-gradient-to-r from-white to-gray-50",
          "summary-section-border": "border-blue-500/20",
          "summary-item-bg":
            "bg-gradient-to-r from-gray-600/10 to-slate-500/20",
          "summary-item-border": "border-gray-300",
          "summary-label-text": "text-gray-500",
          "summary-value-text": "text-gray-700",
          // ...existing code...
          "add-button-bg": "bg-white/20",
          "add-button-hover": "hover:bg-white/30",
          "add-button-border": "border-blue-400",
        },
        bet_list_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-white",
          "card-border": "border-slate-300",
          "card-text": "text-slate-600",
          "column-header-bg": "bg-blue-800",
          "column-header-text": "text-slate-300",
          "row-hover": "hover:bg-slate-100",
          "input-bg": "bg-gradient-to-r from-slate-50 to-slate-50",
          "input-border": "border-slate-400",
          "input-text": "text-gray-600",
          "header-text": "text-gray-900",
          "close-button": "bg-gray-200",
          "close-button-hover": "hover:bg-gray-300",
          "section-bg": "bg-gray-50",
          "section-title": "text-blue-900",
          "label-text": "text-gray-600",
          "value-text": "text-gray-900",
          "item-bg": "bg-white",
          "event-name": "text-gray-900",
          "subtitle-text": "text-gray-500",
          "action-button": "bg-gradient-to-r from-blue-600 to-blue-700",
          "action-button-hover": "hover:from-blue-700 hover:to-blue-800",
          "secondary-button": "bg-gradient-to-r from-slate-500 to-slate-600",
          "secondary-button-hover": "hover:from-slate-600 hover:to-slate-700",
        },

        coupon_details: {
          "section-bg": "bg-gray-50",
          "section-border": "border-gray-200",
          "section-title": "text-blue-900",
          "label-text": "text-gray-600",
          "value-text": "text-gray-900",
          "item-bg": "bg-white",
          "item-border": "border-gray-200",
          "event-name": "text-gray-900",
          "subtitle-text": "text-gray-500",
          divider: "border-gray-200",
          "win-text": "text-green-600",
          "skeleton-bg": "bg-gray-200",
          "skeleton-pulse": "bg-gray-100",
          "action-button": "bg-blue-600",
          "action-button-hover": "hover:bg-blue-700",
          "secondary-button": "bg-gray-500",
          "secondary-button-hover": "hover:bg-gray-600",
        },
        transactions_page: {
          "container-bg": "bg-transparent",
          "card-bg": "bg-white",
          "card-border": "border-slate-300",

          "card-text": "text-slate-700",
          "column-header-bg": "bg-blue-800",
          "column-header-text": "text-slate-300",
          "row-hover": "hover:bg-slate-100",
          "row-text": "text-gray-700",
          "input-bg": "bg-gradient-to-r from-slate-50 to-slate-50",
          "input-border": "border-slate-300",
          "input-text": "text-gray-600",
          "label-text": "text-gray-600",
          "value-text": "text-gray-700",
          "credit-text": "text-green-600",
          "debit-text": "text-red-600",
          "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
          "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-gradient-to-r from-slate-500 to-slate-600",
          "button-secondary-hover": "hover:from-slate-600 hover:to-slate-700",
          "button-secondary-text": "text-white",
          "checkbox-active-bg": "bg-blue-600",
          "checkbox-active-border": "border-blue-600",
          "checkbox-inactive-border": "border-gray-400",
          "footer-bg": "bg-white",
        },
        deposit_page: {
          "container-bg": "bg-transparent",
          "page-bg": "bg-transparent",
          "page-text": "text-gray-900",
          "header-text": "text-black",
          "warning-bg": "bg-yellow-50",
          "warning-border": "border-yellow-200",
          "warning-icon": "text-yellow-600",
          "warning-text": "text-gray-800",
          "card-bg": "bg-white",
          "card-border": "border-slate-300",
          "table-header-bg": "bg-blue-800",
          "table-header-text": "text-white",
          "row-hover": "hover:bg-slate-100 hover:border-l-blue-600/80",
          "row-text": "text-gray-900",
          "label-text": "text-gray-600",
          "value-text": "text-gray-900",
          "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
          "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-slate-500",
          "button-secondary-hover": "hover:bg-slate-600",
          "button-secondary-text": "text-white",
          "form-bg": "bg-gray-50",
          "form-border": "border-gray-300",
          "form-text": "text-gray-900",
          "info-bg": "bg-gray-100",
          "info-border": "border-gray-300",
          "info-text": "text-gray-700",
          "input-bg": "bg-white",
          "input-border": "border-gray-300",
          "input-text": "text-gray-900",
          "balance-text": "text-gray-600",
          "balance-value": "text-green-600",
          "quick-button-bg": "bg-slate-200",
          "quick-button-hover": "hover:bg-slate-300",
          "quick-button-text": "text-slate-700",
          "quick-button-border": "border-slate-300",
          "security-bg": "bg-blue-50",
          "security-border": "border-blue-200",
          "security-text": "text-blue-700",
        },
        main_input: {
          background: "bg-gradient-to-r from-slate-800 to-slate-700",
          border: "border border-slate-600",
          "text-color": "text-gray-200",
        },
        account_page: {
          "container-bg": "bg-gradient-to-br from-gray-50 via-white to-gray-50",
          "card-bg": "bg-white",
          "card-border": "border-gray-300",
          "header-text": "text-slate-800",
          "subtitle-text": "text-slate-600",
          "section-header-text": "text-slate-700",
          "section-header-border": "border-gray-300",
          "input-bg": "bg-gradient-to-r from-slate-50 to-slate-50",
          "input-border": "border-slate-300 focus:border-blue-500",
          "input-text": "text-gray-600",
          "balance-card-bg": "bg-gradient-to-br from-blue-50/20 to-white",
          "balance-card-border": "border-gray-300",
          "balance-label-text": "text-slate-600",
          "balance-value-text": "text-blue-700",
          "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
          "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
          "button-primary-text": "text-white",
        },
        user_management_page: {
          "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
          "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
          "button-primary-text": "text-white",
          "button-secondary-bg": "bg-gray-200",
          "button-secondary-hover": "hover:bg-gray-300",
          "button-secondary-text": "text-gray-700",
          "page-bg": "bg-gradient-to-br from-gray-50 via-white to-gray-50",
          "page-text": "text-gray-900",
          "header-icon-bg": "bg-blue-100",
          "header-icon-text": "text-blue-600",
          "header-text": "text-gray-900",
          "subtitle-text": "text-gray-600",
          "card-bg": "bg-white",
          "card-border": "border-gray-300",
          "section-header-text": "text-gray-700",
          "section-header-border": "border-gray-300",
          "column-header-bg": "bg-gray-100",
          "column-header-text": "text-gray-700",
          "row-hover": "hover:bg-gray-50",
          "row-text": "text-gray-900",
          "row-border": "border-gray-200",
          "balance-text": "text-emerald-600",
          "input-bg": "bg-white",
          "input-border": "border-gray-300",
          "input-text": "text-gray-900",

          "button-action-deposit-bg": "bg-green-100",
          "button-action-deposit-hover": "hover:bg-green-200",
          "button-action-deposit-text": "text-green-700",
          "button-action-withdraw-bg": "bg-red-100",
          "button-action-withdraw-hover": "hover:bg-red-200",
          "button-action-withdraw-text": "text-red-700",
          "info-card-bg": "bg-gray-50",
          "info-card-border": "border-gray-300",
          "info-label-text": "text-gray-600",
          "info-value-text": "text-gray-900",
          "badge-deposit-bg": "bg-green-100",
          "badge-deposit-text": "text-green-700",
          "badge-withdraw-bg": "bg-red-100",
          "badge-withdraw-text": "text-red-700",
        },
        game_options_modal: {
          "modal-border": "border-gray-300",
          "header-title": "text-slate-800",
          "header-subtitle": "text-slate-600",
          "header-vs-text": "text-blue-600",
          "header-date-text": "text-slate-500",
          "title-text": "text-slate-800",
          "subtitle-text": "text-slate-600",
          "market-card-bg": "bg-white",
          "market-card-border": "border-slate-300",
          "market-card-hover": "hover:border-blue-400 hover:bg-blue-50",
          "market-title": "text-slate-800",
          "axis-label-text": "text-slate-600",
          "axis-label-bg": "bg-slate-200/50",
          "odds-button-bg": "bg-gray-100",
          "odds-button-hover": "hover:bg-blue-300",
          "odds-button-text": "text-slate-800",
          "odds-button-border": "border-slate-300",
          "odds-button-selected-bg":
            "bg-gradient-to-r from-blue-700 via-blue-600 to-blue-700",
          "odds-button-selected-border": "border-blue-500",
          "odds-button-selected-text": "text-white",
          "odds-button-selected-hover": "hover:bg-blue-500",
          "odds-button-disabled-bg": "bg-gray-800/50",
          "odds-button-disabled-text": "text-gray-500",
          "odds-button-disabled-border": "border-gray-700",
        },
        modal: {
          change_password: {
            "modal-bg": "bg-white",
            "modal-border": "border-gray-300",
            "modal-shadow": "shadow-gray-500/20",
            "header-border": "border-gray-200",
            "header-title": "text-gray-900",
            "header-icon": "text-blue-600",
            "close-button": "text-gray-500",
            "close-button-hover": "hover:text-gray-900",
            "info-box-bg": "bg-blue-50",
            "info-box-border": "border-blue-200",
            "info-box-text": "text-blue-700",
            "cancel-button-bg": "bg-gray-200",
            "cancel-button-hover": "hover:bg-gray-300",
            "cancel-button-text": "text-gray-900",
            "confirm-button-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
            "confirm-button-hover": "hover:from-blue-500 hover:to-blue-600",
            "confirm-button-text": "text-white",
            "confirm-button-shadow": "shadow-blue-600/25",
          },
          "overlay-bg": "bg-black/30",
          "content-bg": "bg-white",
          "content-border": "border-slate-300",
          "header-bg": "bg-gradient-to-r from-slate-100 to-slate-50",
          "header-text": "text-gray-900",
          "header-border": "border-slate-300",
          "body-bg": "bg-transparent",
          "body-text": "text-gray-900",
          "footer-bg": "bg-slate-50",
          "footer-border": "border-slate-300",
          "close-button": "text-gray-600 hover:text-gray-900",
          "close-button-hover": "hover:bg-gray-200",
        },
        "bg-main": "bg-gradient-to-r from-gray-50 via-white to-slate-50",
        "bg-secondary": "bg-blue-900",
        "bg-tertiary": "bg-blue-800",
        "bg-gradient": "bg-gradient-to-br from-blue-800 to-blue-950",
        "bg-gradient-hover": "hover:from-blue-700 hover:to-blue-900",
        "text-primary": "text-gray-700",
        "text-secondary": "text-gray-600",
        "text-muted": "text-gray-400",
        "light-divider": "bg-gray-300",
        "dark-divider": "bg-gray-700",
        border: "border-gray-300",
        "border-light": "border-gray-500",
        primary: "text-blue-400",
        "primary-bg": "bg-blue-600",
        "primary-hover": "hover:bg-blue-500",
        accent: "text-blue-300",
        "accent-bg": "bg-blue-400",
        "button-primary": "bg-blue-600 hover:bg-blue-500 text-white",
        "button-secondary": "bg-gray-700 hover:bg-gray-600 text-white",
        card: "bg-gray-800/30 border-gray-700/30",
        "card-hover": "hover:border-blue-600/60",
        "item-hover-border-l": "hover:border-l-blue-500/80",
        "card-bg": "bg-[#161616]",
        "input-bg":
          "bg-gradient-to-r from-slate-50 to-slate-50 placeholder-slate-400 ",
        "input-border": "border-slate-300  ",
        "input-focus-within":
          "focus-within:outline-none focus-within:ring-2 focus:outline-none focus:ring-2 focus-within:ring-ring focus-within:ring-offset-0 focus-within:bg-smalltext/10 focus:ring-blue-500/80  focus:ring-2 focus:border-blue-500/80 focus:ring-blue-500/80 focus-within:border-blue-500/80 ",
        "input-ring":
          "outline-none ring-2 ring-blue-500/80 outline-none ring-ring ring-offset-0 bg-smalltext/10 border-blue-500/80",
        "select-option-bg":
          "bg-gradient-to-br from-blue-800 to-blue-900  text-white",
        "input-text": "text-gray-600",
        "skeleton-bg": "bg-gray-200",
        "modal-bg": "bg-slate-50",
        "button-primary-bg": "bg-gradient-to-r from-blue-600 to-blue-700",
        "button-primary-border": "border border-blue-300",
        "button-primary-hover": "hover:from-blue-700 hover:to-blue-800",
        "button-primary-text": "text-white",
        "button-secondary-bg": "bg-gray-200",
        "button-secondary-border": "border border-gray-300",
        "button-secondary-hover": "hover:bg-gray-300",
        "button-secondary-text": "text-gray-700",
        "button-cancel-bg": "bg-gradient-to-r from-rose-600 to-red-600",
        "button-cancel-hover": "hover:from-rose-700 hover:to-red-700",
        "button-cancel-text": "text-white",
        "button-cancel-border": "border-rose-500/80",
        "button-proceed-bg": "bg-gradient-to-r from-emerald-600 to-green-600",
        "button-proceed-hover": "hover:from-emerald-700 hover:to-green-700",
        "button-proceed-text": "text-white",
        "button-proceed-border": "border-emerald-500",
      };
  }
};

// ============================================================================
// BUILD THEME OBJECTS FROM CONFIGURATION
// ============================================================================
const buildClientTheme = (clientId: string): ClientTheme => {
  const themeClasses = getThemeClassesForClient(clientId);

  return {
    clientId,
    clientName: CLIENTNAMES[clientId as keyof typeof CLIENTNAMES],
    colors: {
      primary: PRIMARYCOLORS[clientId as keyof typeof PRIMARYCOLORS],
      "primary-light":
        PRIMARYLIGHTCOLORS[clientId as keyof typeof PRIMARYLIGHTCOLORS],
      "primary-dark":
        PRIMARYDARKCOLORS[clientId as keyof typeof PRIMARYDARKCOLORS],

      "bg-main": BGMAIN[clientId as keyof typeof BGMAIN],
      "bg-secondary": BGSECONDARY[clientId as keyof typeof BGSECONDARY],
      "bg-tertiary": BGTERTIARY[clientId as keyof typeof BGTERTIARY],

      "bg-gradient": BGGRADIENT[clientId as keyof typeof BGGRADIENT],
      "bg-gradient-hover":
        BGGRADIENTHOVER[clientId as keyof typeof BGGRADIENTHOVER],

      accent: ACCENTCOLORS[clientId as keyof typeof ACCENTCOLORS],
      "accent-light": ACCENTLIGHT[clientId as keyof typeof ACCENTLIGHT],
      "accent-dark": ACCENTDARK[clientId as keyof typeof ACCENTDARK],

      "text-primary": TEXTPRIMARY[clientId as keyof typeof TEXTPRIMARY],
      "text-secondary": TEXTSECONDARY[clientId as keyof typeof TEXTSECONDARY],
      "text-muted": TEXTMUTED[clientId as keyof typeof TEXTMUTED],

      border: BORDERCOLORS[clientId as keyof typeof BORDERCOLORS],
      "border-light": BORDERLIGHT[clientId as keyof typeof BORDERLIGHT],
      "border-dark": BORDERDARK[clientId as keyof typeof BORDERDARK],

      "button-primary": BUTTONPRIMARY[clientId as keyof typeof BUTTONPRIMARY],
      "button-primary-hover":
        BUTTONPRIMARYHOVER[clientId as keyof typeof BUTTONPRIMARYHOVER],
      "button-secondary":
        BUTTONSECONDARY[clientId as keyof typeof BUTTONSECONDARY],
      "button-secondary-hover":
        BUTTONSECONDARYHOVER[clientId as keyof typeof BUTTONSECONDARYHOVER],

      "card-bg": CARDBG[clientId as keyof typeof CARDBG],
      "card-border": CARDBORDER[clientId as keyof typeof CARDBORDER],
      "card-shadow": CARDSHADOW[clientId as keyof typeof CARDSHADOW],

      ...STATUSCOLORS,
    },
    cssVariables: {
      "--color-primary": PRIMARYCOLORS[clientId as keyof typeof PRIMARYCOLORS],
      "--color-primary-light":
        PRIMARYLIGHTCOLORS[clientId as keyof typeof PRIMARYLIGHTCOLORS],
      "--color-primary-dark":
        PRIMARYDARKCOLORS[clientId as keyof typeof PRIMARYDARKCOLORS],
      "--color-bg-main": CSSVARBGMAIN[clientId as keyof typeof CSSVARBGMAIN],
      "--color-bg-secondary":
        CSSVARBGSECONDARY[clientId as keyof typeof CSSVARBGSECONDARY],
      "--color-accent": ACCENTCOLORS[clientId as keyof typeof ACCENTCOLORS],
    },
    classes: themeClasses,
  };
};

// Build all client themes
const clientThemes: Record<string, ClientTheme> = {
  "1": buildClientTheme("1"),
  "3": buildClientTheme("3"),
  "5": buildClientTheme("5"),
  "9": buildClientTheme("9"),
  "10": buildClientTheme("10"),
  default: buildClientTheme("default"),
};

/**
 * Get the theme configuration based on clientId
 * @returns ClientTheme object with colors and CSS variables
 */
export const getClientTheme = (): ClientTheme => {
  const clientId = Number(environmentConfig.CLIENT_ID);

  // Switch case to determine theme
  switch (clientId) {
    case 1:
      return clientThemes["1"];
    case 3:
      return clientThemes["3"];
    case 5:
      return clientThemes["5"];
    case 9:
      return clientThemes["9"];
    case 10:
      return clientThemes["10"];
    default:
      return clientThemes.default;
  }
};

export default {
  getClientTheme,
};
