export default {
  APP_API_URL: import.meta.env.VITE_APP_API_URL,
  BRAND_TITLE: import.meta.env.VITE_BRAND_TITLE, // in browser title
  BRAND_FAVICON: import.meta.env.VITE_BRAND_FAVICON, // in browser icon
  BRAND_NAME: import.meta.env.VITE_BRAND_NAME,
  BRAND_LOGO: import.meta.env.VITE_BRAND_LOGO,
  ...window.env,
};
