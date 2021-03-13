import styled from "styled-components";
import PropsTheme from "../../../styles/theme/PropsTheme";
import SidebarElement from "./SidebarElement";

export default function Sidebar(props: {
  links: string[];
  currentPathName: string;
}) {
  const renderLinks = () => {
    // first turn list into tree.
    const tree = buildTree(props.links);
    return renderSubElements(tree);
  };

  const renderSubElements = (tree: {}) => {
    const keys = Object.keys(tree);
    return keys.map((key) => {
      let subPath = "/" + key + "/";
      return (
        <SidebarElement
          key={key}
          name={key}
          root={true}
          currentPathName={props.currentPathName}
          path={subPath}
          tree={tree[key]}
        />
      );
    });
  };

  const renderChildren = (title: string | undefined = undefined, tree) => {
    const keys = Object.keys(tree);
    return (
      <>
        {title && <p style={{ margin: 0 }}>{title}</p>}
        <SublistContainer>
          {keys.map((key) => {
            const result = tree[key];
            const isFile = result === "file";
            if (!isFile) {
              return renderChildren(key, result);
            } else {
              return <p>{key}</p>;
            }
          })}
        </SublistContainer>
      </>
    );
  };

  return <Wrapper>{renderLinks()}</Wrapper>;
}

const Wrapper = styled.div`
  display: flex;
  flex-basis: 20%;
  min-width: 250px;
  flex-direction: column;
  border-right: 1px solid ${(props: PropsTheme) => props.theme.borderColor};
  height: 100%;
`;

const SublistContainer = styled.div`
  margin-right: 1em;
`;

const buildTree = (files) => {
  var fileTree = {};

  if (files instanceof Array === false) {
    throw new Error("Expected an Array of file paths, but saw " + files);
  }

  function mergePathsIntoFileTree(prevDir, currDir, i, filePath) {
    if (i === filePath.length - 1) {
      prevDir[currDir] = "file";
    }

    if (!prevDir.hasOwnProperty(currDir)) {
      prevDir[currDir] = {};
    }

    return prevDir[currDir];
  }

  function parseFilePath(filePath) {
    var fileLocation = filePath.split("/");

    // If file is in root directory, eg 'index.js'
    if (fileLocation.length === 1) {
      return (fileTree[fileLocation[0]] = "file");
    }

    fileLocation.reduce(mergePathsIntoFileTree, fileTree);
  }

  files.forEach(parseFilePath);

  return fileTree;
};
