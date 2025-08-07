module.exports = {
  mode: "jit", // add this
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./components/global/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: "class", // or 'media' or 'class'
  // theme: {
  //breakpoints for screen sizes
  daisyui: {
    themes: [
      {
        lightTheme: {
          primary: "#FFFFFF",
          secondary: "#183E63",
          accent: "#EA551F",
          neutral: "#D3D2D8",
          "base-100": "#F4F3F7",
          info: "#0E66AA",
          success: "#1EAE5A",
          warning: "#ffe480",
          error: "#F52314",
          text: "#000000",
        },
      },
      {
        darkTheme: {
          primary: "#102A42",
          secondary: "#183E63",
          accent: "#EA551F",
          neutral: "#D3D2D8",
          "base-100": "#1E293B",
          info: "#3ABFF8",
          success: "#1EAE5A",
          warning: "#ffe480",
          error: "#F52314",
        },
      },
    ],
  },
  screens: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
    "2xl": "1920px",
  },
  // colors: {
  //   current: "currentColor",
  //   primary: "#F3F3F3",
  //   secondary: "#ffffff",
  //   tertiary: "#f1f1f1",
  //   accent: "rgba(51,58,86,1)",
  //   "accent-orange": {
  //     100: "#fce9dc",
  //     200: "#f3b282",
  //     300: "#ec8940",
  //     400: "#EA7B29",
  //     500: "#EA551F",
  //   },
  //   "accent-semi-light": "rgba(51,58,86,0.5)",
  //   "accent-light": "rgba(51,58,86,0.15)",
  //   "accent-focus": "#f1f1f1",
  //   title: "#6c6c6c",
  //   text: "#858585",
  //   success: "#1eae5a",
  //   error: "#f03333",
  //   warning: "#f0a433",
  //   card: "#E8EBF7",
  //   blue: "#8C99AB",
  //   chartLines: {
  //     1: "rgb(236,121,121)",
  //     2: "rgb(236,179,121)",
  //     3: "rgb(190,236,121)",
  //     4: "rgba(32, 223, 38, 0.5)",
  //     5: "rgba(32, 223, 153, 0.6)",
  //     6: "rgba(32, 194, 223, 0.5)",
  //     7: "rgba(32, 112, 223, 0.5)",
  //     8: "rgba(83, 32, 223, 0.5)",
  //     9: "rgba(140, 32, 223, 0.5)",
  //     10: "rgba(223, 32, 178, 0.5)",
  //   },

  //   chartHot: {
  //     1: "rgba(222, 12, 7, 1)", // Red
  //     2: "rgba(135, 44, 42, 1)", // Dark Red
  //     3: "rgba(125, 0, 0, 1)", // Darker Red
  //   },
  //   chartWarm: {
  //     1: "rgba(209, 112, 17, 1)", // Orange
  //     2: "rgba(250, 203, 47, 1)", // Orange Yellow
  //     3: "rgba(255, 234, 0, 1)", // Yellow
  //   },
  //   chartRegular: {
  //     1: "rgba(6, 209, 206, 1)", // Light Blue
  //     2: "rgba(2, 194, 75, 1)", // Green"
  //     3: "rgba(0, 81, 255, 1)", // Blue
  //   },
  //   selected: "#E1E0E0",
  // },
  // fontFamily: {
  //   body: ["Roboto"],
  // },
  fontSize: {
    xs: "0.65rem",
    sm: "0.8rem",
    md: "0.9rem",
    lg: "1rem",
    xl: "1.25rem",
    "2xl": "1.563rem",
    "3xl": "1.953rem",
    "4xl": "2.441rem",
    "5xl": "3.052rem",
  },

  plugins: [
    // Add plugins installed through yarn here
    require("daisyui"),
    require("tailwind-scrollbar"),
  ],
  extend: {
    maxHeight: {
      128: "32rem",
    },
    animation: {
      fade: "fadeAnimation 5s ease-in-out",
    },
    fontFamily: {
      serif: ["var(--font-space-age)"],
    },

    keyframes: {
      fadeAnimation: {
        "0%": { opacity: 0 },
        "100%": { opacity: 1 },
      },
    },
  },
  // },
};
