import { Box } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import MainButton from "../components/MainButton";
import { useAuth } from "../hooks/useAuth";

export default function Home() {
    const [data, setData] = useState(null);
    const auth = useAuth();
    return (
        <Box>
            <h1>Jack's Chess</h1>
            {auth.user
                ? `Hi ${auth.user.username}`
                : `login to see a nice friendly message`}
            <Link to="/local-match">
                <MainButton text="New Local Match" onClick={null} />
            </Link>
            <Link to="/vs-computer">
                <MainButton text="Play vs Computer" onClick={null} />
            </Link>
            <Link to="/play-online">
                <MainButton text="New Online Match" onClick={null} />
            </Link>
        </Box>
    );
}
