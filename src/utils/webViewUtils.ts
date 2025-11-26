/* eslint-disable no-mixed-operators */
// WebView-safe storage utilities
export const safeStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        return localStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn("localStorage not available:", error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn("localStorage not available:", error);
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.removeItem(key);
      }
    } catch (error) {
      console.warn("localStorage not available:", error);
    }
  },

  clear: (): void => {
    try {
      if (typeof window !== "undefined" && window.localStorage) {
        localStorage.clear();
      }
    } catch (error) {
      console.warn("localStorage not available:", error);
    }
  },
};

export const safeSessionStorage = {
  getItem: (key: string): string | null => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        return sessionStorage.getItem(key);
      }
      return null;
    } catch (error) {
      console.warn("sessionStorage not available:", error);
      return null;
    }
  },

  setItem: (key: string, value: string): void => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.setItem(key, value);
      }
    } catch (error) {
      console.warn("sessionStorage not available:", error);
    }
  },

  removeItem: (key: string): void => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.removeItem(key);
      }
    } catch (error) {
      console.warn("sessionStorage not available:", error);
    }
  },

  clear: (): void => {
    try {
      if (typeof window !== "undefined" && window.sessionStorage) {
        sessionStorage.clear();
      }
    } catch (error) {
      console.warn("sessionStorage not available:", error);
    }
  },
};

// WebView detection utility
export const isWebView = (): boolean => {
  try {
    if (typeof window === "undefined") return false;

    const userAgent = window.navigator.userAgent.toLowerCase();

    // Common WebView indicators
    return (
      userAgent.includes("webview") ||
      userAgent.includes("wv") ||
      (userAgent.includes("android") && userAgent.includes("version/")) ||
      // iOS WebView indicators
      ((userAgent.includes("iphone") || userAgent.includes("ipad")) &&
        !userAgent.includes("safari")) ||
      // Check for common WebView properties
      !(window as any).chrome ||
      (window as any).AndroidInterface !== undefined ||
      (window as any).webkit?.messageHandlers !== undefined
    );
  } catch (error) {
    console.warn("WebView detection failed:", error);
    return false;
  }
};
