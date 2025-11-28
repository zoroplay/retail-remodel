/* eslint-disable @typescript-eslint/no-explicit-any */
/**
 * CRITICAL: Enable Immer ES5 mode for Android 4.x support
 *
 * Why needed:
 * - Redux Toolkit uses Immer for immutable state updates
 * - Immer can use either Proxy (modern) or ES5 getters/setters (legacy)
 * - Android 4.x doesn't support Proxy, and proxy-polyfill has limited trap support
 * - Specifically, the 'has' trap (for 'in' operator) is not supported by proxy-polyfill
 *
 * Why use enableES5() instead of proxy-polyfill:
 * - Immer's ES5 mode uses Object.defineProperty and getters/setters
 * - This is fully supported on Android 4.x without any polyfills
 * - It's slower than Proxy but more compatible
 */
import { enableES5 } from "immer";
enableES5();

import { combineReducers, configureStore } from "@reduxjs/toolkit";
import storage from "redux-persist/lib/storage";
// @ts-ignore: module types cannot be resolved under current moduleResolution; consider updating tsconfig.moduleResolution to 'node16'|'nodenext' if desired
import { encryptTransform } from "redux-persist-transform-encrypt";
import hardSet from "redux-persist/es/stateReconciler/hardSet";
import compressTransform from "redux-persist-transform-compress";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
import {
  notification,
  user,
  modal,
  betting,
  bottomSheet,
  fixtures,
  live_games,
  cashdesk,
  app,
  withdrawal,
} from "./features/slice";
import { apiSlice } from "./services/constants/api.service";

const persistConfig = {
  key: "retail:v1:0.5",
  storage,
  transforms: [
    compressTransform(),
    // Temporarily disabled encryption for Android 4.x compatibility
    // encryptTransform({
    //   secretKey: "SecreteKey",
    //   onError: (error: any) => {
    //     console.error("Encryption error:", error);
    //   },
    // }),
  ],
  stateReconciler: hardSet,
  whitelist: [
    "app",
    "user",
    "modal",
    "notification",
    "betting",
    "bottomSheet",
    "fixtures",
    "live_games",
    "cashdesk",
    "withdrawal",
  ],
  blacklist: ["app.tournament_details", "fixtures.cashdesk_fixtures"],
};
// type RootState = {
//   user: ReturnType<typeof user>;
//   modal: ReturnType<typeof modal>;
//   notification: ReturnType<typeof notification>;
//   betting: ReturnType<typeof betting>;
//   bottomSheet: ReturnType<typeof bottomSheet>;
//   fixtures: ReturnType<typeof fixtures>;
//   live_games: ReturnType<typeof live_games>;
//   [apiSlice.reducerPath]: ReturnType<typeof apiSlice.reducer>;
// };
const rootReducer = combineReducers({
  app,
  user,
  modal,
  notification,
  betting,
  bottomSheet,
  fixtures,
  live_games,
  cashdesk,
  withdrawal,
  [apiSlice.reducerPath]: apiSlice.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;

// const persistedReducer = persistReducer(persistConfig, rootReducer);
const persistedReducer = persistReducer<RootState>(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      // serializableCheck: false,
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }).concat(apiSlice.middleware),
  devTools: import.meta.env.MODE !== "production",
});

export const persistor = persistStore(store);

// export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
