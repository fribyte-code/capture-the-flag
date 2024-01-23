/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("@tailwindcss/typography"), require("daisyui")],
  daisyui: {
    themes: [
      {
        dracula: {
          ...require("daisyui/src/theming/index")["dracula"],
          primary: "#00F5C9",
          secondary: "#000000",
        },
      },
      "light",
    ],
  },
};
