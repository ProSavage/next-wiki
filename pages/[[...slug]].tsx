import { GetStaticProps } from "next";
import { promises as fs, existsSync } from "fs";
import path from "path";
import components from "../components/mdx/components";
import React, { useEffect } from "react";
import renderToString from "next-mdx-remote/render-to-string";
import hydrate from "next-mdx-remote/hydrate";
import styled from "styled-components";
import Sidebar from "../components/ui/sidebar/Sidebar";
import matter from "gray-matter";
import { useRecoilState } from "recoil";
import { metadataState } from "../styles/atoms/metadata";

export default function WikiPage({ content, pathMetadata, pathname }) {
  const mdx = hydrate(content, { components });

  const [metadata, setMetadata] = useRecoilState(metadataState);

  useEffect(() => {
    setMetadata(pathMetadata)
  }, [content, pathname])

  return (
    <Wrapper>
      <Sidebar links={Object.keys(pathMetadata)} currentPathName={pathname} />
      <ContentContainer>{mdx}</ContentContainer>
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
`;

const ContentContainer = styled.div`
  flex-grow: 1;
  display: flex;
`;

export const getStaticProps: GetStaticProps = async (context) => {
  const slug = context.params.slug as string[];
  // If slug is undefined, we are at root, so just default to "".
  const pagePath = slug ? slug.join("/") : "";

  const cwd = process.cwd();
  // Handles finding the actual file to read from.
  let filePath = path.join(cwd, "docs", pagePath);
  // We have this present to check if the file is an index.mdx file, if path is a dir.

  const fileExists = existsSync(filePath);
  if (fileExists && (await fs.lstat(filePath)).isDirectory()) {
    filePath = filePath + "/index";
  }

  filePath = filePath + ".mdx";
  const source = await fs.readFile(filePath, "utf-8");
  const rehypePrism = require("@mapbox/rehype-prism");
  const { content, data: metadata } = matter(source);
  const mdxSource = await renderToString(content, {
    components,
    scope: metadata,
    mdxOptions: { rehypePlugins: [rehypePrism] },
  });

  const getAllFiles = async (dirPath: string, arrayOfFiles: string[]) => {
    const files = await fs.readdir(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    for (const file of files) {
      if (file.endsWith(".DS_Store")) {
        continue;
      }
      const stat = await fs.stat(dirPath + "/" + file);
      if (stat && stat.isDirectory()) {
        const subFiles = await getAllFiles(dirPath + "/" + file, arrayOfFiles);
        arrayOfFiles.concat(subFiles);
      } else {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
    return arrayOfFiles;
  };

  const pathMetadata = {};

  for (const file of (await getAllFiles(path.join(cwd, "docs"), []))) {
    const fileContent = await fs.readFile(file);
    const { content: fileContents, data: fileMetadata } = matter(fileContent);
    const pathname = file
      .replace(cwd + "/docs/", "")
      .replace("index.mdx", "index")
      .replace(".mdx", "");
    pathMetadata[pathname] = fileMetadata;
  }

  return {
    props: {
      content: mdxSource,
      meta: metadata,
      pathMetadata,
      pathname: pagePath,
    },
  };
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
      const stat = await fs.stat(dirPath + "/" + file);
      if (stat && stat.isDirectory()) {
        const subFiles = await getAllFiles(dirPath + "/" + file, arrayOfFiles);
        arrayOfFiles.concat(subFiles);
      } else {
        arrayOfFiles.push(path.join(dirPath, "/", file));
      }
    }
    return arrayOfFiles;
  };

  let allFiles = await getAllFiles(docsDir, []);
  // allFiles.shift();
  allFiles = allFiles.filter((file) => file !== ".DS_Store");
  const allFilesWithIndexes = []
  allFiles.forEach((file) => {
    const basicReplaces = file
      .replace(cwd, "")
      .replace("/docs/", "")
      .replace(".mdx", "");
    const index = "index";
    if (basicReplaces.endsWith(index)) {
      allFilesWithIndexes.push(basicReplaces.slice(0, basicReplaces.length - index.length))
    } 
     allFilesWithIndexes.push(basicReplaces)
  });
  console.log(allFilesWithIndexes)
  const paths = allFilesWithIndexes.map((page) => {
    return { params: { slug: page.split("/") } };
  });

  return {
    paths,
    fallback: false,
  };
}
