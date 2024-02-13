export default {
  APP_API_URL: import.meta.env.VITE_APP_API_URL,
  APP_BRAND_TITLE: import.meta.env.VITE_APP_BRAND_TITLE, // in browser title
  APP_BRAND_FAVICON: import.meta.env.VITE_APP_BRAND_FAVICON, // in browser icon
  APP_BRAND_NAME: import.meta.env.VITE_APP_BRAND_NAME,
  APP_BRAND_LOGO: import.meta.env.VITE_APP_BRAND_LOGO,
  APP_BRAND_LOGO_DARK: import.meta.env.VITE_APP_BRAND_LOGO_DARK,
  APP_COLOR_SCHEME: import.meta.env.VITE_APP_COLOR_SCHEME,
  ...window.env,
};
