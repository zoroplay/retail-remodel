/// <reference types="vite/client" />

interface ImportMetaEnv {
  // Custom app variables
  readonly VITE_APP_BASE_URL?: string
  readonly VITE_APP_CLIENT_ID?: string
  readonly VITE_APP_VERSION_2?: string
  readonly VITE_APP_MQTT_URI?: string
  readonly VITE_APP_MQTT_USERNAME?: string
  readonly VITE_APP_MQTT_PASSWORD?: string
  readonly VITE_APP_MQTT_CLIENTID?: string
  readonly VITE_APP_ACCESS_TOKEN?: string
  readonly VITE_APP_REFRESH_TOKEN?: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
