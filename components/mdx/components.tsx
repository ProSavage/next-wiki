import Link from "next/link";
import styled from "styled-components";
import PropsTheme from "../../styles/theme/PropsTheme";
import ActiveLink from "../ActiveLink";

const components = {
  wrapper: (props) => (
    <article
      style={{
        width: "100%",
        padding: "20px",
      }}
    >
      <main {...props} />
    </article>
  ),
  ol: (props) => (
    <ol
      style={{
        padding: "0 20px",
      }}
      {...props}
    />
  ),
  code: (props) => (
      <code
      {...props}
    />
  ),
  inlineCode: (props) => (
    <InlineCode {...props}/>
  ),
  h2: (props) => (
    <>
      <h2 {...props} />
      <HorizontalLine />
    </>
  ),
};

export default components;

const HorizontalLine = styled.hr`
  height: 1px;
  background-color: ${(props: PropsTheme) => props.theme.borderColor};
  border: none;
`;

const InlineCode = styled.p`
  display: inline;
  padding: 2px .25em;
  border-radius: 5px;
  background-color: ${(props: PropsTheme) => props.theme.secondaryBackground};
`

