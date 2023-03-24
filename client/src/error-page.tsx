import { Flex, Heading, Text } from "@chakra-ui/react";
import { useNavigate, useRouteError } from "react-router-dom";
import MainButton from "./components/MainButton";

export default function ErrorPage() {
    const error = useRouteError();
    const navigate = useNavigate();
    return (
        <Flex justify="center" p="60px">
            <Flex id="error-page" flexDirection={"column"} alignItems="center">
                <Heading fontSize="60px" pb="30px">
                    Whoopsie!
                </Heading>
                <Heading pb="30px">
                    Sorry, an unexpected error has occurred:
                </Heading>
                <Text pb="20px" fontWeight={"semibold"} fontSize="30px" as="i">
                    {error.statusText || error.message}
                </Text>
                <MainButton text="Home" onClick={() => navigate("/")} w="40%" />
            </Flex>
        </Flex>
    );
}
