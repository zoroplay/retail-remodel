import { logoutUser } from "../store/features/slice/user.slice";
import { clearTokens } from "../store/services/actions/setAccessTokens";
import { store } from "../store/store";

export const handleLogout = async () => {
  try {
    // Clear tokens from storage
    await clearTokens();

    // Dispatch logout action to clear state
    store.dispatch(logoutUser());

    // Show success message
    // showToast({
    //   type: "error",
    //   title: "Session Expired",
    //   description: "Please login again",
    // });
  } catch (error) {
    console.error("Logout error:", error);
    // showToast({
    //   type: "error",
    //   title: "Logout Error",
    //   description: "Failed to logout. Please try again.",
    // });
  }
};
