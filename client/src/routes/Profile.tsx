import { Flex, Heading, Text, useColorMode } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useColour } from "../hooks/useColour";

export function ProfileRoute() {
    const auth = useAuth();
    const { colourScheme } = useColour();
    return (
        <Flex justify="center" direction="column">
            <Flex justify="center" px="240px" py="100px">
                <Flex
                    alignItems="start"
                    textAlign="left"
                    direction="column"
                    pr="200px"
                    w="100%"
                >
                    <Flex mb="60px">
                        <Flex w="150px" h="150px" bgColor="gray" mr="60px">
                            Edit picture goes here
                        </Flex>
                        <Flex direction="column">
                            <Heading
                                as="h1"
                                fontSize={"80px"}
                                textAlign="left"
                                mb="0"
                                pb="0"
                            >
                                {auth.user.username}
                            </Heading>

                            <Text
                                fontWeight={"400"}
                                mt="30px"
                                fontSize={"24px"}
                                textAlign="left"
                            >
                                Figure out something to put here
                            </Text>
                        </Flex>
                    </Flex>
                    <Heading
                        as="h1"
                        fontSize={"60px"}
                        textAlign="left"
                        mb="0"
                        pb="30px"
                    >
                        Statistics
                    </Heading>
                    <Flex>
                        <Flex direction={"column"}>
                            <Heading
                                as="h3"
                                fontSize={"40px"}
                                textAlign="left"
                                pr="80px"
                            >
                                Games Played
                            </Heading>
                            <Heading
                                as="h3"
                                fontSize={"120px"}
                                textAlign="left"
                                color={colourScheme.primary}
                            >
                                50
                            </Heading>
                        </Flex>
                        <Flex direction={"column"}>
                            <Heading
                                as="h3"
                                fontSize={"40px"}
                                textAlign="left"
                                pr="80px"
                            >
                                Won
                            </Heading>
                            <Heading
                                as="h3"
                                fontSize={"120px"}
                                textAlign="left"
                                color={colourScheme.primary}
                            >
                                5
                            </Heading>
                        </Flex>
                        <Flex direction={"column"}>
                            <Heading
                                as="h3"
                                fontSize={"40px"}
                                textAlign="left"
                                pr="80px"
                            >
                                Lost
                            </Heading>
                            <Heading
                                as="h3"
                                fontSize={"120px"}
                                textAlign="left"
                                color={colourScheme.primary}
                                pr="80px"
                            >
                                40
                            </Heading>
                        </Flex>
                        <Flex direction={"column"}>
                            <Heading
                                as="h3"
                                fontSize={"40px"}
                                textAlign="left"
                                pr="60px"
                            >
                                Drawn
                            </Heading>
                            <Heading
                                as="h3"
                                fontSize={"120px"}
                                textAlign="left"
                                color={colourScheme.primary}
                            >
                                5
                            </Heading>
                        </Flex>
                    </Flex>
                    <Link to={"/my-games"}>
                        <Heading
                            as="h3"
                            fontSize={"40px"}
                            textAlign="left"
                            pt="60px"
                            _hover={{
                                color: colourScheme.primary,
                                textDecor: "underline",
                            }}
                        >
                            Analyse your previous games
                        </Heading>
                    </Link>
                </Flex>
            </Flex>
        </Flex>
    );
}
