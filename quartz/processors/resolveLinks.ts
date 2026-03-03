import { visit } from "unist-util-visit"
import { Element } from "hast"
import { ProcessedContent } from "../plugins/vfile"
import { FullSlug, SimpleSlug, simplifySlug } from "../util/path"

/**
 * After all files are parsed, replace internal wikilink display text
 * with the target file's frontmatter title (when no explicit alias is set).
 */
export function resolveLinkTitles(content: ProcessedContent[]): void {
  // Build slug → title map from all files' frontmatter
  const titleMap = new Map<SimpleSlug, string>()
  for (const [, file] of content) {
    const slug = file.data.slug
    const title = file.data.frontmatter?.title
    if (slug && title) {
      titleMap.set(simplifySlug(slug), title)
    }
  }

  // Second pass: replace link text with frontmatter title
  for (const [tree] of content) {
    visit(tree, "element", (node: Element) => {
      if (
        node.tagName === "a" &&
        node.properties &&
        typeof node.properties["data-slug"] === "string"
      ) {
        const classes = (node.properties.className ?? []) as string[]
        // Skip links with explicit alias (e.g. [[file|Custom Title]])
        if (!classes.includes("alias")) {
          const slug = simplifySlug(node.properties["data-slug"] as FullSlug)
          const title = titleMap.get(slug)
          if (title && node.children.length === 1 && node.children[0].type === "text") {
            node.children[0].value = title
          }
        }
      }
    })
  }
}
