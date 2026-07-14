import type { CollectionEntry } from "astro:content";

export type CaseEntry = CollectionEntry<"cases">;

type CasePresentation = {
  order: number;
  category: string;
  shortLabel: string;
  tags: readonly string[];
  accent: "cyan" | "coral";
};

export const casePresentation = {
  "agentic-engineering-control-plane": {
    order: 1,
    category: "Agentic engineering",
    shortLabel: "Multi-agent delivery control plane",
    tags: ["Orchestration", "Git worktrees", "Verification"],
    accent: "cyan",
  },
  "secure-construction-knowledge-system": {
    order: 2,
    category: "Enterprise knowledge",
    shortLabel: "Secure project intelligence",
    tags: ["Azure", "Retrieval", "Security"],
    accent: "cyan",
  },
  "voice-agent-regression-testing": {
    order: 3,
    category: "Voice systems",
    shortLabel: "Real-call regression testing",
    tags: ["Graphs", "ACS", "Evaluation"],
    accent: "cyan",
  },
  "csharp-rag-latency-engine": {
    order: 4,
    category: "Latency engineering",
    shortLabel: "Low-latency C# retrieval",
    tags: ["C#", "RAG", "Performance"],
    accent: "coral",
  },
  "mirror-os": {
    order: 5,
    category: "Personal data systems",
    shortLabel: "Evidence-aware personal intelligence",
    tags: ["Python", "Provenance", "Local-first"],
    accent: "coral",
  },
  "content-engine": {
    order: 6,
    category: "Agentic workflows",
    shortLabel: "Closed-loop content operations",
    tags: ["State machines", "Quality gates", "Feedback"],
    accent: "coral",
  },
} as const satisfies Record<string, CasePresentation>;

export type CaseSlug = keyof typeof casePresentation;

function normalizeMarkdown(value: string): string {
  return value
    .replace(/\[([^\]]+)\]\([^\)]+\)/g, "$1")
    .replace(/[*_`]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function extract(body: string, pattern: RegExp, label: string, slug: string): string {
  const value = body.match(pattern)?.[1];
  if (!value) throw new Error(`Canonical case ${slug} is missing ${label}`);
  return normalizeMarkdown(value);
}

function assertSlug(id: string): asserts id is CaseSlug {
  if (!(id in casePresentation)) {
    throw new Error(`Canonical case ${id} has no website presentation metadata`);
  }
}

export function getCaseMeta(entry: CaseEntry) {
  assertSlug(entry.id);
  const body = entry.body ?? "";
  const title = extract(body, /^#\s+(.+)$/m, "an H1 title", entry.id);
  const summary = extract(body, /^\*\*([\s\S]*?)\*\*\s*$/m, "a summary deck", entry.id);
  const role = extract(
    body,
    /^- \*\*Role:\*\*\s*([\s\S]*?)(?=\n- \*\*|\n\n)/m,
    "a role declaration",
    entry.id,
  );
  const presentation = casePresentation[entry.id];
  const description = summary.length > 157 ? `${summary.slice(0, 154).trimEnd()}…` : summary;

  return {
    slug: entry.id,
    title,
    summary,
    description,
    role,
    sourceUrl: `https://github.com/vitalijhein/engineering-case-studies/blob/main/case-studies/${entry.id}.md`,
    number: String(presentation.order).padStart(2, "0"),
    ...presentation,
  };
}

export function getOrderedCases(entries: CaseEntry[]) {
  const expected = Object.keys(casePresentation).sort();
  const received = entries.map(({ id }) => id).sort();
  if (JSON.stringify(expected) !== JSON.stringify(received)) {
    throw new Error(
      `Case manifest drift: expected ${expected.join(", ")}; received ${received.join(", ")}`,
    );
  }

  return entries
    .map((entry) => ({ entry, meta: getCaseMeta(entry) }))
    .sort((left, right) => left.meta.order - right.meta.order);
}
