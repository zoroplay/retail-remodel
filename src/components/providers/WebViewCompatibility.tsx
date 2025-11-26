"use client";
import { useEffect } from "react";
import { isWebView } from "../../utils/webViewUtils";

export const WebViewCompatibility = () => {
  useEffect(() => {
    // WebView-specific initialization
    if (typeof window !== "undefined") {
      const isInWebView = isWebView();

      if (isInWebView) {
        console.log("Running in WebView - applying compatibility fixes");

        // Add WebView class to body for CSS targeting
        document.body.classList.add("webview");

        // Prevent context menu on long press
        document.addEventListener("contextmenu", (e) => {
          e.preventDefault();
          return false;
        });

        // Prevent drag and drop
        document.addEventListener("dragstart", (e) => {
          e.preventDefault();
          return false;
        });

        // Handle WebView-specific touch events
        document.addEventListener(
          "touchstart",
          (e) => {
            // Allow normal touch interactions
          },
          { passive: true }
        );

        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener(
          "touchend",
          (e) => {
            const now = new Date().getTime();
            if (now - lastTouchEnd <= 300) {
              e.preventDefault();
            }
            lastTouchEnd = now;
          },
          false
        );
      }

      // Add viewport meta tag if missing
      const viewportMeta = document.querySelector('meta[name="viewport"]');
      if (!viewportMeta) {
        const meta = document.createElement("meta");
        meta.name = "viewport";
        meta.content =
          "width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no";
        document.head.appendChild(meta);
      }

      // Set up WebView communication bridge (if needed)
      if ((window as any).AndroidInterface) {
        console.log("Android WebView interface detected");
        // Add any Android-specific setup here
      }

      if ((window as any).webkit?.messageHandlers) {
        console.log("iOS WebKit interface detected");
        // Add any iOS-specific setup here
      }
    }
  }, []);

  return null; // This component doesn't render anything
};
