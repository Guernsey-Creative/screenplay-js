const { description } = require("../../package");

module.exports = {
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#title
   */
  title: "ScreenplayJS",
  /**
   * Ref：https://v1.vuepress.vuejs.org/config/#description
   */
  description: description,

  /**
   * Extra tags to be injected to the page HTML `<head>`
   *
   * ref：https://v1.vuepress.vuejs.org/config/#head
   */
  head: [
    ["meta", { name: "theme-color", content: "#198754" }],
    ["meta", { name: "apple-mobile-web-app-capable", content: "yes" }],
    [
      "meta",
      { name: "apple-mobile-web-app-status-bar-style", content: "black" },
    ],
  ],

  /**
   * Theme configuration, here is the default theme configuration for VuePress.
   *
   * ref：https://v1.vuepress.vuejs.org/theme/default-theme-config.html
   */
  themeConfig: {
    repo: "",
    editLinks: false,
    docsDir: "",
    editLinkText: "",
    lastUpdated: false,
    nav: [
      {
        text: "Get Started",
        link: "/guide/",
      },
    ],
    sidebar: {
      "/guide/": [
        {
          title: "Getting Started",
          collapsable: false,
          children: ["", "installation", "how-to-use"],
        },
        {
          title: "Parsers",
          collapsable: false,
          children: ["parsers/", "parsers/fountain-parser/"],
          sidebarDepth: 2,
        },
        {
          title: "Types",
          collapsable: false,
          children: [
            "typescript/",
            "typescript/script-json",
            "typescript/script-page",
            "typescript/token",
          ],
        },
        {
          title: "Examples",
          collapsable: false,
          children: [
            // "examples/",
            "examples/guernsey-bros",
            "examples/converting-final-draft",
          ],
        },
      ],
    },
  },

  /**
   * Apply plugins，ref：https://v1.vuepress.vuejs.org/zh/plugin/
   */
  plugins: ["@vuepress/plugin-back-to-top", "@vuepress/plugin-medium-zoom"],
};
