/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

interface Window {
  env?: {
    APP_API_URL?: string;
    APP_BUILD?: string;
    APP_BUILD_DATE?: string;
    [key: string]: string | undefined | number | boolean;
  };
}
