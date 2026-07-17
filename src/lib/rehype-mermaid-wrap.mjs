/**
 * Rehype companions for build-time Mermaid rendering.
 *
 * `rehypeMermaidSourceDetails` runs before rehype-mermaid: it wraps every
 * mermaid code fence in the DOM contract the site's CSS and the previous
 * client renderer established (`figure.mermaid-figure > div.mermaid-rendered`
 * plus a `details.mermaid-source-details` disclosure holding a copy of the
 * diagram source). rehype-mermaid then replaces the original fence inside
 * `div.mermaid-rendered` with an inline SVG.
 *
 * `rehypeMermaidA11y` runs after rehype-mermaid: it sets `role="img"` and a
 * per-diagram `aria-label` derived from the document's h1, mirroring the
 * labels the client renderer produced.
 */

function isElement(node, tagName) {
  return (
    node && node.type === "element" && (!tagName || node.tagName === tagName)
  );
}

function classList(node) {
  const value = node.properties && node.properties.className;
  if (Array.isArray(value)) return value.map(String);
  if (typeof value === "string") return value.split(/\s+/);
  return [];
}

function walk(node, callback, parent = null, index = null) {
  callback(node, parent, index);
  const children = node.children;
  if (!Array.isArray(children)) return;
  for (let i = 0; i < children.length; i += 1) {
    walk(children[i], callback, node, i);
  }
}

function textContent(node) {
  if (node.type === "text") return node.value;
  if (!Array.isArray(node.children)) return "";
  return node.children.map(textContent).join("");
}

function isMermaidPre(node) {
  if (!isElement(node, "pre")) return false;
  if (classList(node).includes("mermaid")) return true;
  return (node.children || []).some(
    (child) =>
      isElement(child, "code") && classList(child).includes("language-mermaid"),
  );
}

export function rehypeMermaidSourceDetails() {
  return (tree) => {
    const matches = [];
    walk(tree, (node, parent, index) => {
      if (
        isMermaidPre(node) &&
        parent &&
        index !== null &&
        !insideMermaidFigure(parent)
      ) {
        matches.push({ node, parent, index });
      }
    });

    for (const { node, parent, index } of matches) {
      const sourceCopy = JSON.parse(JSON.stringify(node));
      sourceCopy.properties = { className: ["mermaid-source"] };
      for (const child of sourceCopy.children || []) {
        if (isElement(child, "code")) child.properties = {};
      }

      const details = {
        type: "element",
        tagName: "details",
        properties: { className: ["mermaid-source-details"] },
        children: [
          {
            type: "element",
            tagName: "summary",
            properties: {},
            children: [{ type: "text", value: "View diagram source" }],
          },
          sourceCopy,
        ],
      };

      parent.children[index] = {
        type: "element",
        tagName: "figure",
        properties: { className: ["mermaid-figure"] },
        children: [
          {
            type: "element",
            tagName: "div",
            properties: { className: ["mermaid-rendered"] },
            children: [node],
          },
          details,
        ],
      };
    }
  };
}

function insideMermaidFigure(parent) {
  return (
    isElement(parent, "div") && classList(parent).includes("mermaid-rendered")
  );
}

export function rehypeMermaidA11y() {
  return (tree) => {
    let title = "";
    walk(tree, (node) => {
      if (!title && isElement(node, "h1")) title = textContent(node).trim();
    });

    let count = 0;
    walk(tree, (node, parent) => {
      if (isElement(node, "svg") && parent && insideMermaidFigure(parent)) {
        count += 1;
        node.properties = node.properties || {};
        node.properties.role = "img";
        node.properties.ariaLabel = `Diagram ${count}: ${title || "case study"}`;
      }
    });
  };
}
