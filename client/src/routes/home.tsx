import { Box, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Board from "../components/boardImage/Board";
import MainButton from "../components/MainButton";
import TransparentButton from "../components/TransparentButton";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChess,
    faWifi,
    faRobot,
    faC,
} from "@fortawesome/free-solid-svg-icons";

export default function Home() {
    const [data, setData] = useState(null);
    const auth = useAuth();
    const navigate = useNavigate();
    return (
        <Flex justify="center" direction="column">
            <Flex justify="center" px="240px" py="100px">
                <Flex
                    alignItems="start"
                    textAlign="right"
                    direction="column"
                    // justify={"space-between"}
                    pr="200px"
                >
                    <Heading
                        as="h1"
                        fontSize={"60px"}
                        textAlign="left"
                        mb="0"
                        pb="0"
                    >
                        Experience the{" "}
                        <Box
                            color="green.400"
                            as="h1"
                            fontSize={"60px"}
                            textAlign="left"
                            mb="0"
                            pb="0"
                        >
                            buggiest chess site
                        </Box>{" "}
                        on the web 🐛
                    </Heading>

                    {/* <Heading
                            as="h1"
                            fontSize={"60px"}
                            textAlign="left"
                            mb="0"
                            pb="0"
                        >
                            on the web 🐛
                        </Heading> */}

                    <Text
                        fontWeight={"400"}
                        mt="30px"
                        fontSize={"24px"}
                        textAlign="left"
                    >
                        With incredible features like local matches and
                        deselecting pieces, you'd be crazy to choose robust,
                        popular sites like Chess.com
                    </Text>
                    <Flex w="100%">
                        <HStack
                            w="100%"
                            alignItems={"center"}
                            mt="30px"
                            spacing={"20px"}
                        >
                            <MainButton
                                text="Sign In"
                                onClick={() => navigate("/login")}
                                w="30%"
                            />
                            <TransparentButton
                                text="Sign Up"
                                onClick={() => navigate("/login")}
                                w="30%"
                            />
                        </HStack>
                    </Flex>
                </Flex>
                <Flex>
                    <Flex borderRadius={"12px"} overflow="hidden">
                        <Board moves={[]} colour={"white"} boardHeight={450} />
                    </Flex>
                </Flex>
            </Flex>
            <Flex
                bgColor="green.500"
                // h="400px"
                justify="space-between"
                px="240"
                py="100px"
            >
                <GameCard
                    icon={faChess}
                    heading={"Local match"}
                    text="Play offline against a friend"
                    link="/local-match"
                />
                <GameCard
                    icon={faRobot}
                    heading={"Vs Computer"}
                    text="Play against a very bad bot"
                    link="/vs-computer"
                />
                <GameCard
                    icon={faWifi}
                    heading={"Online match"}
                    text="Play online against a friend"
                    link="/online-match"
                />
            </Flex>
        </Flex>
    );
}

function GameCard({ icon, heading, text, link }) {
    const navigate = useNavigate();
    return (
        <Flex
            _hover={{ color: "gray.800" }}
            cursor="pointer"
            onClick={() => navigate(link)}
        >
            <FontAwesomeIcon icon={icon} fontSize="80px" />
            <Flex direction={"column"} ml="30px">
                <Heading fontSize="40px">{heading}</Heading>
                <Text fontSize="20px">{text}</Text>
            </Flex>
        </Flex>
    );
}
