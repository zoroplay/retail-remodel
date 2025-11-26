"use client";

import { showModal } from "../store/features/slice/modal.slice";
import { MODAL_COMPONENTS } from "../store/features/types";
import { store } from "../store/store";

export const showNetworkConnectionModal = () => {
  store.dispatch(
    showModal({
      // type: "popup",
      component_name: MODAL_COMPONENTS.NetworkConnection,
      dismissible: false,
      props: {
        // onRetry: async () => {
        //   const isConnected = await checkNetworkConnection();
        //   if (isConnected) {
        //     console.log("Network connection restored");
        //     // close modal here if you want
        //   }
        // },
      },
    })
  );
};

// utils/network.ts
export const checkNetworkConnection = async (): Promise<boolean> => {
  // WebView-safe browser check
  if (typeof navigator === "undefined" || !navigator.onLine) return false;

  // Optional: verify reachability by pinging a small resource
  try {
    const response = await fetch("/favicon.ico", {
      cache: "no-store",
      mode: "no-cors", // WebView-friendly mode
    });
    return response.ok || response.type === "opaque";
  } catch {
    return false;
  }
};
