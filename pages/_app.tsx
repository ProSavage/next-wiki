import React, { useState } from "react";
import styled, { ThemeProvider } from "styled-components";
import LightTheme from "../styles/theme/LightTheme";
import Navbar from "./../components/ui/Navbar";
import GlobalStyle from "../styles/GlobalStyle";
import { Sun, Moon } from "react-feather";
import DarkTheme from "../styles/theme/DarkTheme";
import { RecoilRoot } from "recoil";
import { useRecoilValue } from "recoil";
import { themeState } from "../styles/atoms/theme";
import Footer from "../components/ui/Footer";
import { MDXProvider } from "@mdx-js/react";
import components from "../components/mdx/components";
import "modern-normalize/modern-normalize.css";
import "./../styles/prism-syntax.css";
import GeneralFooter from "../components/GeneralFooter";

function MyApp({ Component, pageProps }) {
  return (
    <Wrapper>
      <RecoilRoot>
        <WrappedApp Component={Component} pageProps={pageProps} />
      </RecoilRoot>
    </Wrapper>
  );
}

function WrappedApp({ Component, pageProps }) {
  const theme = useRecoilValue(themeState);

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <PageContainer>
        <Navbar />
        <MDXProvider components={components}>
          <Component {...pageProps} />
        </MDXProvider>
        <GeneralFooter />
        <Footer />
      </PageContainer>
    </ThemeProvider>
  );
}

const PageContainer = styled.div`
  height: 100%;
  width: 100%;
  padding: 0 0.5rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  max-width: 960px;
`;

const Wrapper = styled.div`
  height: 100vh;
  width: 100vw;

  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
`;

export default MyApp;
