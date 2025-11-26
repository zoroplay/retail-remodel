import Cookies from "js-cookie";
export const setAccessToken = (value: string) => {
  Cookies.set("access_token", value, { path: "/" });
};

export const setAuthToken = (value: string) => {
  Cookies.set("auth_token", value, { path: "/" });
};

export const clearTokens = () => {
  Cookies.remove("auth_token", { path: "/" });
  Cookies.remove("access_token", { path: "/" });
  Cookies.remove("user_id", { path: "/" });
};

export const getUserId = (): string | undefined => {
  return Cookies.get("user_id");
};

export const storeUserId = (value: string) => {
  Cookies.set("user_id", value, { path: "/" });
};
