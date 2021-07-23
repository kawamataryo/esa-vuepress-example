import { resolve } from "path";
import { DefaultThemeOptions, defineUserConfig } from "vuepress-vite";
import { createSidebar } from "./utils/createSidebar";

const config = () => {
  const contentsSidebar = createSidebar("contents", "contents");

  return defineUserConfig<DefaultThemeOptions>({
    lang: "ja",
    title: "esa vuepress starter",
    dest: "dist",
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
