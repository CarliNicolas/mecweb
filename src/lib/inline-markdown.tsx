import type { ReactNode } from "react";

/**
 * Resolves a list of descriptions from a section that may use either the new
 * `descriptions: string[]` shape or the legacy `description1`, `description2`,
 * ... numbered fields. Returns the descriptions array, trimming empty entries.
 */
export function resolveDescriptions(
  section: { descriptions?: string[] } & Record<string, unknown>,
  legacyKeys: readonly string[],
): string[] {
  if (Array.isArray(section.descriptions) && section.descriptions.length > 0) {
    return section.descriptions.filter((d) => typeof d === "string");
  }
  return legacyKeys
    .map((k) => section[k])
    .filter((v): v is string => typeof v === "string" && v.length > 0);
}


export function renderInline(text: string): ReactNode[] {
  const nodes: ReactNode[] = [];
  const regex = /\*\*([^*]+)\*\*/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let key = 0;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    nodes.push(<strong key={`b-${key++}`}>{match[1]}</strong>);
    lastIndex = match.index + match[0].length;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}
