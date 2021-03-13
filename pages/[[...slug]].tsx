import { GetStaticProps } from "next";
import { promises as fs, existsSync } from "fs";
import path from "path";
import components from "../components/mdx/components";
import React from "react";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";

export default function WikiPage({ content }) {
  const mdx = hydrate(content, { components });
  return <>{mdx}</>;
}

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params.slug as string[];
  // If slug is undefined, we are at root, so just default to "".
  const pagePath = slug ? slug.join("/") : "";

  const cwd = process.cwd();
  // Handles finding the actual file to read from.
  let filePath = path.join(cwd, "docs", pagePath);
  // We have this present to check if the file is an index.mdx file, if path is a dir.
  
  
  const fileExists = existsSync(filePath)
  if (fileExists && (await fs.lstat(filePath)).isDirectory()) {
    filePath = filePath + "/index";
  }
  filePath = filePath + ".mdx";
  const content = await fs.readFile(filePath, "utf-8");
  const rehypePrism = require("@mapbox/rehype-prism")
  const mdxSource = await renderToString(content, { components, mdxOptions: {rehypePlugins: [rehypePrism]} });

  return { props: { content: mdxSource } };
};

export async function getStaticPaths() {
  const cwd = process.cwd();
  const docsDir = path.join(cwd, "docs");
  const getAllFiles = async (dirPath: string, arrayOfFiles: string[]) => {
    const files = await fs.readdir(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    for (const file of files) {
      if (file.endsWith(".DS_Store")) {
        continue;
      }
      const stat = (await fs.stat(dirPath + "/" + file));
      if (stat && stat.isDirectory()) {
        const subFiles = await getAllFiles(dirPath + "/" + file, arrayOfFiles);
        arrayOfFiles.concat(subFiles);
      } else {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
    return arrayOfFiles;
  };

  let allFiles = await getAllFiles(docsDir, [path.join(cwd, "docs")]);
  allFiles.shift();
  allFiles = allFiles.filter(file => file !== ".DS_Store")
  allFiles = allFiles.map((file) => {
    const basicReplaces = file
      .replace(cwd, "")
      .replace("/docs/", "")
      .replace(".mdx", "");
    const index = "index";
    if (basicReplaces.endsWith(index)) {
      return basicReplaces.slice(0, basicReplaces.length - index.length);
    } else return basicReplaces;
  });

  const paths = allFiles.map((page) => {
    return { params: { slug: page.split("/") } };
  });
  return {
    paths,
    fallback: false,
  };
}
