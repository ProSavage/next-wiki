import Link from "next/link";
import { useRouter } from "next/router";
import styled from "styled-components";
import Config from "../Config";

export default function GeneralFooter() {

    const router = useRouter();

    return <Wrapper>
        <p><strong>SavageLabs Wiki</strong></p>
        <Link href={`${Config.githubURL}`}>Edit this page on GitHub.</Link>
    </Wrapper>
}


const Wrapper = styled.div`
    display: flex;
    width: 100%;
    padding: 0 20px;
    justify-content: space-between;
`

