import { extname, join, resolve } from "path";
import { readdirSync, readFileSync, statSync } from "fs";
import fm from "front-matter";
import { EsaFrontMatter } from "../../@types/types";
import { isArchivedPage } from "./isArchivedPage";

const extension = [".md"];

export const createSidebar = (folder: string, title: string) => {
  const dirName = join(resolve(), `/esa/${folder}`);
  const files = readdirSync(dirName)
    .filter((item) => {
      return (
        statSync(join(dirName, item)).isFile() &&
        extension.includes(extname(item))
      );
    })
    .map(
      (fileName) =>
        fm<EsaFrontMatter>(readFileSync(join(dirName, fileName)).toString())
          .attributes.title
    )
    .sort((a, b) => {
      if (a < b) return -1;
      if (a > b) return 1;
      return 0;
    })
    .filter((title) => !isArchivedPage(title)) // archivedのページは表示しない
    .map((title) => {
      return `/${folder}/${title}`;
    });

  return [{ text: title, children: files }];
};
