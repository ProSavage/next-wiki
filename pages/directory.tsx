import { promises as fs } from "fs";
import path from "path";
import Link from "next/link";
import styled from "styled-components";
import PropsTheme from "../styles/theme/PropsTheme";

export default function DocumentationPage({ pages }) {
  return (
    <>
      <h1>All Static Pages ({pages.length})</h1>
      <ul>
        {pages.map((page: { fileName: string }) => (
          <li key={page.fileName}>
            <Link href={page.fileName}>
              <PageLink>{page.fileName}</PageLink>
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}

export async function getStaticProps(context) {
  const cwd = process.cwd();
  const docsDir = path.join(cwd, "docs");
  const getAllFiles = async (dirPath: string, arrayOfFiles: string[]) => {
    const files = await fs.readdir(dirPath);
    arrayOfFiles = arrayOfFiles || [];
    for (const file of files) {
      if (file.endsWith(".DS_Store")) {
        continue;
      }
      if ((await fs.lstat(dirPath + "/" + file)).isDirectory()) {
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

  const pages = await Promise.all(
    allFiles.map(async (fileName) => {
      
      const fileContent = await fs.readFile(fileName, "utf-8");
      let processedFileName = fileName
      .replace(cwd, "")
      .replace("/docs", "")
      .replace("/index.mdx", "")
      .replace(".mdx", "")
      if (processedFileName === "") processedFileName = "/"
      return {
        fileName: processedFileName,
        content: fileContent,
      };
    })
  );

  return {
    props: {
      pages,
    }, // will be passed to the page component as props
  };
}

const PageLink = styled.h3`
  cursor: pointer;
  color: ${(props: PropsTheme) => props.theme.accentColor};
`;
