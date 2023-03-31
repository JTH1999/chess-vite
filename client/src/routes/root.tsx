import {
    Box,
    Flex,
    Heading,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Stack,
    Text,
    useColorMode,
    useDisclosure,
    VStack,
} from "@chakra-ui/react";
import {
    faGear,
    faSun,
    faMoon,
    faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useState } from "react";
import { Link, Outlet, redirect } from "react-router-dom";
import Board from "../components/boardImage/Board";
import MainButton from "../components/MainButton";
import MenuButton from "../components/MenuButton";
import { useAuth } from "../hooks/useAuth";
import { useColour } from "../hooks/useColour";

export default function Root() {
    const [data, setData] = useState(null);
    const { colorMode, toggleColorMode } = useColorMode();
    const auth = useAuth();
    const { colourScheme, updateColourScheme, updateTheme } = useColour();
    const [paletteOpen, setPaletteOpen] = useState(false);
    const { isOpen, onOpen, onClose } = useDisclosure();

    useEffect(() => {
        auth.getUser();
    }, []);
    return (
        <>
            <Flex flex="1">
                <Flex
                    bgColor={colourScheme.darker}
                    borderRightColor={
                        colorMode === "light" ? "light.border" : "dark.border"
                    }
                    borderRightWidth={"2px"}
                    height="100vh"
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
                            <>
                                <MenuButton text={"My Games"} url="/my-games" />
                                <MenuButton
                                    text={"My Profile"}
                                    url="/profile"
                                />
                            </>
                        ) : (
                            <></>
                        )}
                    </Stack>
                    <Flex
                        borderTopColor={
                            colorMode === "light"
                                ? "light.border"
                                : "dark.border"
                        }
                        borderTopWidth="2px"
                    >
                        <MenuButton
                            text={auth.user?.username ? "Logout" : "Login"}
                            url={auth.user?.username ? "/logout" : "/login"}
                        />
                    </Flex>
                    <Flex flex="1 1 auto"></Flex>
                    <Flex
                        fontSize="30px"
                        pb="40px"
                        pl="30px"
                        color={
                            colorMode === "light" ? "light.text" : "dark.text"
                        }
                        w="60%"
                        justifyContent={"space-between"}
                    >
                        <Flex
                            _hover={{ color: "gray.300", cursor: "pointer" }}
                            onClick={updateTheme}
                        >
                            <FontAwesomeIcon
                                icon={colorMode === "light" ? faSun : faMoon}
                            />
                        </Flex>
                        <Flex
                            _hover={{ color: "gray.300", cursor: "pointer" }}
                            onClick={onOpen}
                            onMouseEnter={() => setPaletteOpen(true)}
                            onMouseLeave={() => setPaletteOpen(false)}
                            position="relative"
                        >
                            <FontAwesomeIcon icon={faPalette} />
                        </Flex>
                    </Flex>
                </Flex>
                <Box flex="1" overflowX={"scroll"} h="100vh">
                    <Outlet />
                </Box>
            </Flex>
            <Modal isOpen={isOpen} onClose={onClose} isCentered>
                <ModalOverlay />
                <ModalContent bgColor={colourScheme.body} p="20px">
                    <ModalHeader textAlign={"center"}>
                        Select your preferred colour scheme
                    </ModalHeader>
                    <ModalCloseButton onClick={onClose} />
                    <ModalBody>
                        <Flex>
                            <Flex
                                direction="column"
                                justify="space-between"
                                pr="30px"
                            >
                                <Flex>
                                    <Flex
                                        w="50px"
                                        h="50px"
                                        borderRadius="12px"
                                        bgColor="green.400"
                                        mr="20px"
                                        cursor="pointer"
                                        onClick={() =>
                                            updateColourScheme("green")
                                        }
                                    ></Flex>

                                    <Flex
                                        w="50px"
                                        h="50px"
                                        borderRadius="12px"
                                        bgColor="blue.400"
                                        cursor="pointer"
                                        onClick={() =>
                                            updateColourScheme("blue")
                                        }
                                    ></Flex>
                                </Flex>
                                <Flex>
                                    <Flex
                                        w="50px"
                                        h="50px"
                                        borderRadius="12px"
                                        bgColor="purple.400"
                                        cursor="pointer"
                                        mr="20px"
                                        onClick={() =>
                                            updateColourScheme("purple")
                                        }
                                    ></Flex>

                                    <Flex
                                        w="50px"
                                        h="50px"
                                        borderRadius="12px"
                                        bgColor="red.400"
                                        cursor="pointer"
                                        onClick={() =>
                                            updateColourScheme("red")
                                        }
                                    ></Flex>
                                </Flex>
                                <Flex>
                                    <Flex
                                        w="50px"
                                        h="50px"
                                        borderRadius="12px"
                                        bgColor="yellow.400"
                                        cursor="pointer"
                                        mr="20px"
                                        onClick={() =>
                                            updateColourScheme("yellow")
                                        }
                                    ></Flex>
                                    <Flex
                                        w="50px"
                                        h="50px"
                                        borderRadius="12px"
                                        bgColor="pink.400"
                                        cursor="pointer"
                                        onClick={() =>
                                            updateColourScheme("pink")
                                        }
                                    ></Flex>
                                </Flex>
                            </Flex>
                            <Flex>
                                <Board
                                    moves={[]}
                                    colour={"white"}
                                    boardHeight={200}
                                />
                            </Flex>
                        </Flex>
                    </ModalBody>

                    <ModalFooter></ModalFooter>
                </ModalContent>
            </Modal>
        </>
    );
}
