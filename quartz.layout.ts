import { PageLayout, SharedLayout } from "./quartz/cfg"
import * as Component from "./quartz/components"

// components shared across all pages
export const sharedPageComponents: SharedLayout = {
  head: Component.Head(),
  header: [],
  afterBody: [
    // 只在首頁顯示所有筆記列表與 tag 列表
    Component.ConditionalRender({
      component: Component.RecentNotes({
        title: "所有筆記",
        limit: 100,
        filter: (f) => f.slug !== "index",
        showTags: false,
      }),
      condition: (page) => page.fileData.slug === "index",
    }),
    Component.ConditionalRender({
      component: Component.AllTagsList(),
      condition: (page) => page.fileData.slug === "index",
    }),
  ],
  // 改為只在首頁顯示 footer
  footer: Component.ConditionalRender({
    component: Component.Footer({
      links: {
        GitHub: "https://github.com/leafwind/river",
        "Discord Community": "https://discord.gg/HF5SEUQcX5",
      },
    }),
    condition: (page) => page.fileData.slug === "index",
  }),
}

// components for pages that display a single page (e.g. a single note)
export const defaultContentPageLayout: PageLayout = {
  beforeBody: [
    Component.ConditionalRender({
      component: Component.Breadcrumbs(),
      condition: (page) => page.fileData.slug !== "index",
    }),
    Component.ArticleTitle(),
    // 移除 readingTime
    Component.ContentMeta({ showReadingTime: false }),
    // 移除 TagList，因為都是短文，很快就會在內文看到
    // Component.TagList(),
  ],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
        // { Component: Component.ReaderMode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [
    // 改為只在桌面顯示 Graph
    Component.DesktopOnly(Component.Graph()),
    Component.DesktopOnly(Component.TableOfContents()),
    Component.Backlinks(),
  ],
}

// components for pages that display lists of pages  (e.g. tags or folders)
export const defaultListPageLayout: PageLayout = {
  beforeBody: [Component.Breadcrumbs(), Component.ArticleTitle(), Component.ContentMeta()],
  left: [
    Component.PageTitle(),
    Component.MobileOnly(Component.Spacer()),
    Component.Flex({
      components: [
        {
          Component: Component.Search(),
          grow: true,
        },
        { Component: Component.Darkmode() },
      ],
    }),
    Component.Explorer(),
  ],
  right: [],
}
