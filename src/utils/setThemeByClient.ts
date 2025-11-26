import {
  ENVIRONMENT_VARIABLES,
  getEnvironmentVariable,
} from "@/store/services/configs/environment.config";

// Utility to set theme class on <body> based on client_id
export function setThemeByClient(): void {
  const client_id =
    getEnvironmentVariable(ENVIRONMENT_VARIABLES.CLIENT_ID) || 1;
  document.body.classList.remove(
    "theme-clientA",
    "theme-clientB",
    "theme-default"
  );
  document.body.classList.add(`theme-${client_id}`);
}
