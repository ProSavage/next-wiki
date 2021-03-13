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
  a: (props) => (
    <A {...props}/>
  ),
  code: (props) => <code {...props} />,
  inlineCode: (props) => <InlineCode {...props} />,
  h2: (props) => (
    <>
      <h2 id={formatSlug(props.children)} {...props} />
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

const InlineCode = styled.span`
  display: inline;
  padding: 2px 0.25em;
  border-radius: 5px;
  background-color: ${(props: PropsTheme) => props.theme.secondaryBackground};
`;

const A = styled.a`
  color: ${(props: PropsTheme) => props.theme.accentColor};
`

const formatSlug = (str) => {
  str = str.replace(/^\s+|\s+$/g, ""); // trim
  str = str.toLowerCase();

  // remove accents, swap ñ for n, etc
  var from = "àáäâèéëêìíïîòóöôùúüûñç·/_,:;";
  var to = "aaaaeeeeiiiioooouuuunc------";
  for (var i = 0, l = from.length; i < l; i++) {
    str = str.replace(new RegExp(from.charAt(i), "g"), to.charAt(i));
  }

  str = str
    .replace(/[^a-z0-9 -]/g, "") // remove invalid chars
    .replace(/\s+/g, "-") // collapse whitespace and replace by -
    .replace(/-+/g, "-"); // collapse dashes

  return str;
};
