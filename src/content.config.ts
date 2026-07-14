import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";

const cases = defineCollection({
  loader: glob({
    base: "./vendor/engineering-case-studies/case-studies",
    pattern: "**/*.md",
    retainBody: true,
  }),
});

export const collections = { cases };
