export default {
  APP_API_URL: import.meta.env.VITE_APP_API_URL,
  brand_title: import.meta.env.VITE_brand_title, // in browser title
  brand_name: import.meta.env.VITE_brand_name,
  brand_logo: import.meta.env.VITE_brand_logo,
  ...window.env,
};
