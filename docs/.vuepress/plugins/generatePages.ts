import { createPage } from "@vuepress/core";
import { extname, join, resolve } from "path";
import { readdirSync, readFileSync } from "fs";
import fm from "front-matter";
import { EsaFrontMatter } from "../../@types/types";
import dayjs = require("dayjs");
import { PluginFunction } from "vuepress-vite";
import { isArchivedPage } from "../utils/isArchivedPage";

const extension = [".md"];

const extractPageData = (dirPath: string) => {
  const dirName = join(resolve(), dirPath);
  const filenames = readdirSync(dirName).filter((name) => extension.includes(extname(name)));

  return filenames.map((fileName) => {
    const path = join(dirName, fileName);
    const fileContents = readFileSync(path).toString();
    const fmInstance = fm<EsaFrontMatter>(fileContents);

    return {
      frontMatter: fmInstance.attributes,
      body: fmInstance.body,
    };
  });
};

const createFrontPageOption = () => {
  const [{ frontMatter, body }] = extractPageData("/esa/frontpage");

  return {
    path: `/`,
    frontMatter: {
      ...frontMatter,
      home: true,
      lastUpdated: dayjs(frontMatter.updated_at).format("YYYY-MM-DD"),
      date: dayjs(frontMatter.created_at).format("YYYY-MM-DD"),
    },
    content: body,
  };
};

const createContentsPageOptions = () => {
  const pageData = extractPageData("/esa/contents");
  const pageOptions = pageData.map(({ frontMatter, body }) => {
    return {
      path: `/contents/${frontMatter.title}`,
      frontMatter: {
        ...frontMatter,
        lastUpdated: dayjs(frontMatter.updated_at).format("YYYY-MM-DD"),
        date: dayjs(frontMatter.created_at).format("YYYY-MM-DD"),
      },
      content: body,
    };
  });

  // archiveとなっているもの以外を表示
  return pageOptions.filter(
    (option) => !isArchivedPage(option.frontMatter.title)
  );
};

const plugin: PluginFunction = () => ({
  name: "generatePages",
  async onInitialized(app) {
    // frontPageの生成
    const frontPageOption = createFrontPageOption();
    const frontPage = await createPage(app, frontPageOption);

    // contentsの生成
    const contentsPageOptions = createContentsPageOptions();
    const contentsPages = await Promise.all(
      contentsPageOptions.map(async (pageOption) => {
        return await createPage(app, pageOption);
      })
    );

    [frontPage, ...contentsPages].forEach((page) => {
      app.pages.push(page);
    });
  },
});

export default plugin;
