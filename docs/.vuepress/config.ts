import { resolve } from "path";
import { DefaultThemeOptions, defineUserConfig } from "vuepress-vite";
import { createSidebar } from "./utils/createSidebar";

const config = () => {
  const contentsSidebar = createSidebar("contents", "contents");

  return defineUserConfig<DefaultThemeOptions>({
    lang: "ja",
    title: "esa vuepress example",
    description: "An example of using esa as a CMS and creating a static site with VuePress v2.",
    dest: "dist",
    base: "/esa-vuepress-example/",
    themeConfig: {
      navbar: [
        {
          text: "Contents",
          children: contentsSidebar[0].children,
        },
      ],
      sidebar: {
        "/contents": contentsSidebar,
      },
    },
    plugins: [
      resolve(__dirname, "./plugins/generatePages.ts"),
    ],
    markdown: {
      linkify: true,
    },
  });
};

export default config();
