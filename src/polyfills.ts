/**
 * CRITICAL: Polyfills for Android 4.x support
 * This file must be imported FIRST before any other code
 *
 * Note: whatwg-fetch and abortcontroller-polyfill have built-in feature detection
 * and won't override native implementations in modern browsers
 */

// Polyfill performance.now() for Android 4.1.2
// The performance object exists but performance.now() doesn't
if (typeof performance !== "undefined" && !performance.now) {
  const startTime = Date.now();
  performance.now = function () {
    return Date.now() - startTime;
  };
}

// Polyfill fetch API and AbortController for Android 4.x
// These polyfills check for native support before applying
import "whatwg-fetch";
import "abortcontroller-polyfill/dist/abortcontroller-polyfill-only";
