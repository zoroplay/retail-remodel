export const getToken = (): string => {
  const match = document.cookie.match(new RegExp("(^| )access_token=([^;]+)"));
  if (match) return match[2];
  console.error("Access token cookie not found");
  return "";
};

export const getAuthToken = (): string => {
  const match = document.cookie.match(new RegExp("(^| )auth_token=([^;]+)"));
  if (match) return match[2];
  console.error("Auth token cookie not found");
  return "";
};
