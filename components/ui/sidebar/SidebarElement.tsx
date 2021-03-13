import { useRouter } from "next/router";
import { useState } from "react";
import { useRecoilValue } from "recoil";
import styled, { css } from "styled-components";
import { metadataState } from "../../../styles/atoms/metadata";
import PropsTheme from "../../../styles/theme/PropsTheme";

export default function SidebarElement(props: {
  name: string;
  root: boolean;
  path: string;
  // SSG means no window abuse, so we need to pass down from context in page!
  currentPathName: string;
  tree: "file" | {};
}) {
  const [toggled, setToggled] = useState(false);

  const metadata = useRecoilValue(metadataState);

  const renderSubElements = (tree: "file" | {}, path: string) => {
    if (tree == "file") {
      return;
    }
    const keys = Object.keys(tree);

    return keys.map((key) => {
      let subPath = path;
      subPath = subPath + key + "/";
      return (
        <SidebarElement
          key={key}
          name={key}
          root={false}
          currentPathName={props.currentPathName}
          path={subPath}
          tree={tree[key]}
        />
      );
    });
  };

  const router = useRouter();

  const toggle = () => {
    if (props.tree === "file") {
      // redirect to file.
      router.push(props.path);
    } else {
      setToggled(!toggled);
    }
  };

  const hasIndex = () => {
    return Object.keys(props.tree).includes("index");
  };

  const formatTitle = () => {
    const definedTitle = metadata[props.path.slice(1, props.path.length - 1)];
    return definedTitle?.title ? definedTitle.title : props.name;
  };

  const isActive = () => {
    const active = props.currentPathName === props.path;
    if (hasIndex() && active) {
      return false;
    }
    return active;
  };

  return (
    <Wrapper root={props.root}>
      <Title active={isActive()} onClick={toggle}>
        {formatTitle()}
      </Title>
      {toggled && renderSubElements(props.tree, props.path)}
    </Wrapper>
  );
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  ${(props: { root: boolean }) =>
    !props.root &&
    css`
      margin-left: 1.5em;
    `}
`;

const Title = styled.p`
  padding: 0.5em;
  margin: 0.1em 0.5em;
  border-radius: 5px;
  font-weight: 400;
  color: ${(props: PropsTheme) => props.theme.secondaryColor};
  ${(props: { active: boolean }) =>
    props.active &&
    css`
      background: ${(props: PropsTheme) => props.theme.secondaryBackground};
    `}
`;
