import { defineConfig, fontProviders } from "astro/config";

export default defineConfig({
  site: "https://vitalijhein.github.io",
  fonts: [
    {
      provider: fontProviders.local(),
      name: "IBM Plex Sans",
      cssVariable: "--font-sans",
      fallbacks: ["Segoe UI", "Helvetica", "Arial", "sans-serif"],
      display: "swap",
      options: {
        variants: [
          {
            weight: "100 700",
            style: "normal",
            src: ["./src/assets/fonts/ibm-plex-sans-latin-wght-normal.woff2"],
          },
        ],
      },
    },
    {
      provider: fontProviders.local(),
      name: "IBM Plex Mono",
      cssVariable: "--font-mono",
      fallbacks: ["SFMono-Regular", "Consolas", "Liberation Mono", "monospace"],
      display: "swap",
      options: {
        variants: [
          {
            weight: 400,
            style: "normal",
            src: ["./src/assets/fonts/ibm-plex-mono-latin-400-normal.woff2"],
          },
          {
            weight: 600,
            style: "normal",
            src: ["./src/assets/fonts/ibm-plex-mono-latin-600-normal.woff2"],
          },
          {
            weight: 700,
            style: "normal",
            src: ["./src/assets/fonts/ibm-plex-mono-latin-700-normal.woff2"],
          },
        ],
      },
    },
  ],
});
