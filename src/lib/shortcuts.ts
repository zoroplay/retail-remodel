// Shortcuts Configuration for b_winners App
// This file centralizes all shortcut sequences and their actions

export interface ShortcutAction {
  id: string;
  sequence: string;
  description: string;
  action: () => void;
  category: "navigation" | "betting" | "system" | "admin";
  requiresAuth?: boolean;
  icon?: string;
}

export interface ShortcutGroup {
  name: string;
  shortcuts: ShortcutAction[];
}

// Shortcut Sequences
export const SHORTCUT_SEQUENCES = {
  // Navigation Shortcuts
  MENU: "*#*",
  SPORTS_MENU: "*1*",
  LIVE_BETS: "*2*",
  PREMATCH: "*3*",

  // Betting Shortcuts
  RESET_BETS: "*9*",
  CLEAR_GAME: "*8*",
  PLACE_BET: "*7*",
  CONFIRM_BET: "*6*",

  // System Shortcuts
  LOGOUT: "*0*",
  REFRESH: "*5*",
  HELP: "*4*",

  // Admin Shortcuts (if needed)
  ADMIN_PANEL: "*A*",
  DEBUG_MODE: "*D*",
} as const;

// Shortcut Categories
export const SHORTCUT_CATEGORIES: ShortcutGroup[] = [
  {
    name: "Navigation",
    shortcuts: [
      {
        id: "menu",
        sequence: SHORTCUT_SEQUENCES.MENU,
        description: "Open Main Menu",
        action: () => console.log("Menu shortcut triggered"),
        category: "navigation",
        icon: "menu",
      },
      {
        id: "sports_menu",
        sequence: SHORTCUT_SEQUENCES.SPORTS_MENU,
        description: "Open Sports Menu",
        action: () => console.log("Sports menu shortcut triggered"),
        category: "navigation",
        icon: "basketball",
      },
      {
        id: "live_bets",
        sequence: SHORTCUT_SEQUENCES.LIVE_BETS,
        description: "Switch to Live Bets",
        action: () => console.log("Live bets shortcut triggered"),
        category: "navigation",
        icon: "radio",
      },
      {
        id: "prematch",
        sequence: SHORTCUT_SEQUENCES.PREMATCH,
        description: "Switch to Prematch",
        action: () => console.log("Prematch shortcut triggered"),
        category: "navigation",
        icon: "calendar",
      },
    ],
  },
  {
    name: "Betting",
    shortcuts: [
      {
        id: "reset_bets",
        sequence: SHORTCUT_SEQUENCES.RESET_BETS,
        description: "Reset All Bets",
        action: () => console.log("Reset bets shortcut triggered"),
        category: "betting",
        icon: "refresh",
      },
      {
        id: "clear_game",
        sequence: SHORTCUT_SEQUENCES.CLEAR_GAME,
        description: "Clear Current Game",
        action: () => console.log("Clear game shortcut triggered"),
        category: "betting",
        icon: "close-circle",
      },
      {
        id: "place_bet",
        sequence: SHORTCUT_SEQUENCES.PLACE_BET,
        description: "Place Bet",
        action: () => console.log("Place bet shortcut triggered"),
        category: "betting",
        icon: "checkmark-circle",
      },
      {
        id: "confirm_bet",
        sequence: SHORTCUT_SEQUENCES.CONFIRM_BET,
        description: "Confirm Bet",
        action: () => console.log("Confirm bet shortcut triggered"),
        category: "betting",
        icon: "shield-checkmark",
      },
    ],
  },
  {
    name: "System",
    shortcuts: [
      {
        id: "logout",
        sequence: SHORTCUT_SEQUENCES.LOGOUT,
        description: "Logout User",
        action: () => console.log("Logout shortcut triggered"),
        category: "system",
        requiresAuth: true,
        icon: "log-out",
      },
      {
        id: "refresh",
        sequence: SHORTCUT_SEQUENCES.REFRESH,
        description: "Refresh Data",
        action: () => console.log("Refresh shortcut triggered"),
        category: "system",
        icon: "reload",
      },
      {
        id: "help",
        sequence: SHORTCUT_SEQUENCES.HELP,
        description: "Show Help",
        action: () => console.log("Help shortcut triggered"),
        category: "system",
        icon: "help-circle",
      },
    ],
  },
];

// Helper function to get shortcut by sequence
export const getShortcutBySequence = (
  sequence: string
): ShortcutAction | undefined => {
  for (const category of SHORTCUT_CATEGORIES) {
    const shortcut = category.shortcuts.find((s) => s.sequence === sequence);
    if (shortcut) return shortcut;
  }
  return undefined;
};

// Helper function to get shortcuts by category
export const getShortcutsByCategory = (category: string): ShortcutAction[] => {
  const found = SHORTCUT_CATEGORIES.find(
    (c) => c.name.toLowerCase() === category.toLowerCase()
  );
  return found ? found.shortcuts : [];
};

// Helper function to validate shortcut sequence format
export const isValidShortcutSequence = (sequence: string): boolean => {
  return /^\*[#\*0-9A-Za-z]+\*$/.test(sequence);
};

// Helper function to format shortcut for display
export const formatShortcutDisplay = (sequence: string): string => {
  return sequence;
  // return sequence.replace(/\*/g, "•");
};
