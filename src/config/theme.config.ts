import environmentConfig from "@/store/services/configs/environment.config";
import { BASE_STYLES } from "./clients/base";
import { BETCRUZ_STYLES } from "./clients/betcruz";
import { BWINNERS_STYLES } from "./clients/bwinners";
import { MAXBET_STYLES } from "./clients/maxbet";

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
  classes: ThemeClasses;
}

const getThemeClassesForClient = (clientId: string): ThemeClasses => {
  switch (String(clientId)) {
    case "3": // Black & Gold theme
      return MAXBET_STYLES;
    case "9": // Black & Gold theme
      return BWINNERS_STYLES;
    case "10": // Purple & Violet theme
      return BETCRUZ_STYLES;
    default: // Default Deep Blue theme
      return BASE_STYLES;
  }
};

const buildClientTheme = (clientId: string): ClientTheme => {
  const themeClasses = getThemeClassesForClient(clientId);

  return {
    clientId,
    classes: themeClasses,
  };
};

const clientThemes: Record<string, ClientTheme> = {
  "3": buildClientTheme("3"),
  "9": buildClientTheme("9"),
  "10": buildClientTheme("10"),
  default: buildClientTheme("default"),
};

export const getClientTheme = (): ClientTheme => {
  const clientId = Number(environmentConfig.FRONTEND_CLIENT_ID);

  switch (clientId) {
    case 3:
      return clientThemes["3"];
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
