import { Box, Flex, Heading, Stack, VStack } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, Outlet, redirect } from "react-router-dom";
import MainButton from "../components/MainButton";
import MenuButton from "../components/MenuButton";
import { useAuth } from "../hooks/useAuth";

export default function Root() {
    const [data, setData] = useState(null);
    const auth = useAuth();
    useEffect(() => {
        auth.getUser();
    }, []);
    return (
        <>
            <Flex flex="1">
                <Flex
                    bgColor={"gray.900"}
                    borderRightColor="gray.700"
                    borderRightWidth={"2px"}
                    height="100vh"
                    // justify={"center"}
                    w="190px"
                    direction="column"
                >
                    <Stack
                        width="100%"
                        direction={"column"}
                        align={"center"}
                        spacing="6px"
                    >
                        <Heading w="100%" pl="30px" my="10px">
                            <Link to="/">Chess</Link>
                        </Heading>
                        <MenuButton text={"Local Match"} url="/local-match" />
                        <MenuButton
                            text={"Play vs Computer"}
                            url="/vs-computer"
                        />
                        <MenuButton text={"Online Match"} url="/online-match" />
                        {auth.user?.username ? (
                            <MenuButton text={"My Games"} url="/my-games" />
                        ) : (
                            <></>
                        )}
                    </Stack>
                    <Flex borderTopColor={"gray.700"} borderTopWidth="2px">
                        <MenuButton
                            text={auth.user?.username ? "Logout" : "Login"}
                            url={auth.user?.username ? "/logout" : "/login"}
                        />
                    </Flex>
                </Flex>
                <Box flex="1" overflowX={"scroll"} h="100vh">
                    <Outlet />
                </Box>
            </Flex>
        </>
    );
}
