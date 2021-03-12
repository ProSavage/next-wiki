import { createGlobalStyle } from "styled-components";
import PropsTheme from "./theme/PropsTheme";

const GlobalStyle = createGlobalStyle`

    body {
        transition: 250ms all;
        color: ${(props: PropsTheme) => props.theme.color};
        background: ${(props: PropsTheme) => props.theme.background};
        padding: 0;
        margin: 0;
        font-family: 'Roboto', -apple-system, BlinkMacSystemFont, Segoe UI, Roboto, Oxygen,
            Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue, sans-serif;
    } 

    a {
        color: ${(props: PropsTheme) => props.theme.color};
    }

    article li {
        margin: 0.25em 0;
    }

    article h2, article h3, article h4, article h5 {
      margin-bottom: 0;
    }

    article pre[class*="language-"] {
        border-radius: 5px;
    }

`;

export default GlobalStyle;
