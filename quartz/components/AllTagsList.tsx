import { QuartzComponent, QuartzComponentConstructor, QuartzComponentProps } from "./types"
import { FullSlug, resolveRelative } from "../util/path"
import { classNames } from "../util/lang"

interface Options {
  title?: string
}

export default ((userOpts?: Options) => {
  const AllTagsList: QuartzComponent = ({ allFiles, fileData, displayClass }: QuartzComponentProps) => {
    // 從所有筆記的 frontmatter 中蒐集並去重所有 tag，按字母排序
    const tags = [...new Set(allFiles.flatMap((f) => f.frontmatter?.tags ?? []))].sort()

    if (tags.length === 0) return null

    return (
      <div class={classNames(displayClass, "all-tags-list")}>
        <h3>{userOpts?.title ?? "所有標籤"}</h3>
        <ul class="tags">
          {tags.map((tag) => (
            <li>
              <a href={resolveRelative(fileData.slug!, `tags/${tag}` as FullSlug)} class="internal tag-link">
                {tag}
              </a>
            </li>
          ))}
        </ul>
      </div>
    )
  }

  return AllTagsList
}) satisfies QuartzComponentConstructor
