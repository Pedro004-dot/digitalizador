import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "black-color": "var(--black-color)",
        "brand-color": "var(--brand-color)",
        "cloud-strage-dashboardteks-1": "var(--cloud-strage-dashboardteks-1)",
        "cloud-strage-dashboardteks-3": "var(--cloud-strage-dashboardteks-3)",
        "gray-500": "var(--gray-500)",
        "main-color-2": "var(--main-color-2)",
        "sub-color": "var(--sub-color)",
        "basegray-100": "var(--basegray-100)",
        "basegray-200": "var(--basegray-200)",
        "basegray-300": "var(--basegray-300)",
        "basegray-400": "var(--basegray-400)",
        basewhite: "var(--basewhite)",
        white: "var(--white)",
      },
      boxShadow: {
        drop: "var(--drop)",
        med: "var(--med)",
      },
      fontFamily: {
        "text-bold-16": "var(--text-bold-16-font-family)",
        "text-regular-16": "var(--text-regular-16-font-family)",
      },
    },
  },
  plugins: [],
} satisfies Config;
