import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import Config from "../Config";
import PropsTheme from "../styles/theme/PropsTheme";

export default function GeneralFooter() {
  const router = useRouter();

  return (
    <Container>
        <HorizontalLine/>
      <Wrapper>
        <p>
          <strong>SavageLabs Wiki</strong>
        </p>
        <Link href={`${Config.githubURL}`}>Edit this page on GitHub.</Link>
      </Wrapper>
    </Container>
  );
}

const Wrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 0 20px;
  justify-content: space-between;
  margin-top: 1.5em;
  align-items: center;
`;

const Container = styled.div`
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 1.5em;
`

const HorizontalLine = styled.hr`
  height: 1px;
  background-color: ${(props: PropsTheme) => props.theme.borderColor};
  border: none;
  width: 100%;
`;