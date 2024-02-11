/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_API_URL: string;
  readonly VITE_APP_BRAND_TITLE: string; // in browser title
  readonly VITE_APP_BRAND_FAVICON: string; // in browser icon
  readonly VITE_APP_BRAND_NAME: string;
  readonly VITE_APP_BRAND_LOGO: string;
  readonly VITE_APP_BRAND_LOGO_DARK: string;
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
    APP_BRAND_TITLE?: string;
    APP_BRAND_FAVICON?: string;
    APP_BRAND_NAME?: string;
    APP_BRAND_LOGO?: string;
    APP_BRAND_LOGO_DARK?: string;
    [key: string]: string | undefined | number | boolean;
  };
}
