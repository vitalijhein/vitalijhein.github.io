import { unified } from "@astrojs/markdown-remark";
import { defineConfig, fontProviders } from "astro/config";
import rehypeMermaid from "rehype-mermaid";

import {
  rehypeMermaidA11y,
  rehypeMermaidSourceDetails,
} from "./src/lib/rehype-mermaid-wrap.mjs";

export default defineConfig({
  site: "https://vitalijhein.github.io",
  markdown: {
    syntaxHighlight: { type: "shiki", excludeLangs: ["mermaid"] },
    processor: unified({
      rehypePlugins: [
        rehypeMermaidSourceDetails,
        [
          rehypeMermaid,
          {
            strategy: "inline-svg",
            css: new URL("./src/lib/mermaid-fonts.css", import.meta.url),
            mermaidConfig: {
              securityLevel: "strict",
              theme: "base",
              themeVariables: {
                background: "#0a1727",
                primaryColor: "#0d263d",
                primaryTextColor: "#e9f0f7",
                primaryBorderColor: "#41d8f5",
                lineColor: "#9eabba",
                secondaryColor: "#311b29",
                tertiaryColor: "#07111f",
                fontFamily:
                  'var(--font-sans), "IBM Plex Sans", "Segoe UI", sans-serif',
              },
              flowchart: { curve: "basis", htmlLabels: false },
            },
          },
        ],
        rehypeMermaidA11y,
      ],
    }),
  },
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
