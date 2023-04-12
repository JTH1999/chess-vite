import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Input,
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
  useTheme,
  VStack,
} from "@chakra-ui/react";
import {
  faGear,
  faSun,
  faMoon,
  faPalette,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useEffect, useRef, useState } from "react";
import { Link, Outlet, redirect } from "react-router-dom";
import Board from "../deprecated/boardImage/Board";
import MainButton from "../components/MainButton";
import MenuButton from "../components/MenuButton";
import { useAuth } from "../hooks/useAuth";
import { useColour } from "../hooks/useColour";
import { HamburgerIcon } from "@chakra-ui/icons";

export default function Root() {
  const [data, setData] = useState(null);
  const { colorMode, toggleColorMode } = useColorMode();
  const auth = useAuth();
  const { colourScheme, updateColourScheme, updateTheme } = useColour();
  const [paletteOpen, setPaletteOpen] = useState(false);
  const {
    isOpen: isPaletteOpen,
    onOpen: onPaletteOpen,
    onClose: onPaletteClose,
  } = useDisclosure();
  const {
    isOpen: isDrawerOpen,
    onOpen: onDrawerOpen,
    onClose: onDrawerClose,
  } = useDisclosure();
  const { getDisclosureProps, getButtonProps } = useDisclosure();
  const buttonProps = getButtonProps();
  const disclosureProps = getDisclosureProps();
  const theme = useTheme();
  const btnRef = useRef();

  useEffect(() => {
    auth?.getUser();
  }, []);
  return (
    <>
      <IconButton
        aria-label="menu"
        icon={<HamburgerIcon />}
        position="absolute"
        right="10px"
        top="10px"
        display={["flex", "flex", "flex", "none", "none", "none"]}
        {...buttonProps}
      />

      <Flex
        bgColor={colourScheme.darker}
        borderRightColor={colourScheme.border}
        borderRightWidth={"2px"}
        height="100vh"
        w="190px"
        direction="column"
        position="absolute"
        {...disclosureProps}
        zIndex={"1000"}
      >
        <Stack width="100%" direction={"column"} align={"center"} spacing="6px">
          <Heading
            w="100%"
            pl="30px"
            my="10px"
            transition="0.3s ease"
            _hover={{ color: colourScheme.primary }}
          >
            <Link to="/">Chess</Link>
          </Heading>
          <MenuButton text={"Local Match"} url="/local-match" icon={null} />
          <MenuButton
            text={"Play vs Computer"}
            url="/vs-computer"
            icon={null}
          />
          <MenuButton text={"Online Match"} url="/online-match" icon={null} />
          {auth?.user.username ? (
            <>
              <MenuButton text={"My Games"} url="/my-games" icon={null} />
              <MenuButton text={"My Profile"} url="/profile" icon={null} />
            </>
          ) : (
            <></>
          )}
        </Stack>
        <Flex
          borderTopColor={
            colorMode === "light" ? "light.border" : "dark.border"
          }
          borderTopWidth="2px"
        >
          <MenuButton
            text={auth?.user.username ? "Logout" : "Login"}
            url={auth?.user.username ? "/logout" : "/login"}
            icon={null}
          />
        </Flex>
        <Flex flex="1 1 auto"></Flex>
        <Flex
          fontSize="30px"
          pb="40px"
          pl="30px"
          color={colourScheme.text}
          w="60%"
          justifyContent={"space-between"}
        >
          <Flex
            transition="0.2s ease"
            cursor="pointer"
            _hover={{ color: "gray.300" }}
            onClick={updateTheme}
          >
            <FontAwesomeIcon icon={colorMode === "light" ? faSun : faMoon} />
          </Flex>
          <Flex
            transition="0.2s ease"
            cursor="pointer"
            _hover={{ color: "gray.300" }}
            onClick={onPaletteOpen}
            onMouseEnter={() => setPaletteOpen(true)}
            onMouseLeave={() => setPaletteOpen(false)}
            position="relative"
          >
            <FontAwesomeIcon icon={faPalette} />
          </Flex>
        </Flex>
      </Flex>
      <Box
        className="overlay"
        w="100%"
        h="100%"
        position={"fixed"}
        top="0"
        left="0"
        right="0"
        bottom="0"
        bgColor="rgba(0,0,0,0.5)"
        cursor="pointer"
        zIndex={900}
        {...buttonProps}
        {...disclosureProps}
      ></Box>

      <Flex flex="1">
        <Flex
          bgColor={colourScheme.darker}
          borderRightColor={colourScheme.border}
          borderRightWidth={"2px"}
          height="100vh"
          w="190px"
          direction="column"
          display={["none", "none", "none", "flex", "flex", "flex"]}
        >
          <Stack
            width="100%"
            direction={"column"}
            align={"center"}
            spacing="6px"
          >
            <Heading
              w="100%"
              pl="30px"
              my="10px"
              transition="0.3s ease"
              _hover={{ color: colourScheme.primary }}
            >
              <Link to="/">Chess</Link>
            </Heading>
            <MenuButton text={"Local Match"} url="/local-match" icon={null} />
            <MenuButton
              text={"Play vs Computer"}
              url="/vs-computer"
              icon={null}
            />
            <MenuButton text={"Online Match"} url="/online-match" icon={null} />
            {auth?.user.username ? (
              <>
                <MenuButton text={"My Games"} url="/my-games" icon={null} />
                <MenuButton text={"My Profile"} url="/profile" icon={null} />
              </>
            ) : (
              <></>
            )}
          </Stack>
          <Flex
            borderTopColor={
              colorMode === "light" ? "light.border" : "dark.border"
            }
            borderTopWidth="2px"
          >
            <MenuButton
              text={auth?.user.username ? "Logout" : "Login"}
              url={auth?.user.username ? "/logout" : "/login"}
              icon={null}
            />
          </Flex>
          <Flex flex="1 1 auto"></Flex>
          <Flex
            fontSize="30px"
            pb="40px"
            pl="30px"
            color={colourScheme.text}
            w="60%"
            justifyContent={"space-between"}
          >
            <Flex
              transition="0.2s ease"
              cursor="pointer"
              _hover={{ color: "gray.300" }}
              onClick={updateTheme}
            >
              <FontAwesomeIcon icon={colorMode === "light" ? faSun : faMoon} />
            </Flex>
            <Flex
              transition="0.2s ease"
              cursor="pointer"
              _hover={{ color: "gray.300" }}
              onClick={onPaletteOpen}
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
      <Modal isOpen={isPaletteOpen} onClose={onPaletteClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor={colourScheme.body} p="20px">
          <ModalHeader textAlign={"center"}>
            Select your preferred colour scheme
          </ModalHeader>
          <ModalCloseButton onClick={onPaletteClose} />
          <ModalBody>
            <Flex>
              <Flex direction="column" justify="space-between" pr="30px">
                <Flex>
                  <Flex
                    w="50px"
                    h="50px"
                    borderRadius="12px"
                    bgColor="green.400"
                    mr="20px"
                    cursor="pointer"
                    onClick={() => updateColourScheme("green")}
                  ></Flex>

                  <Flex
                    w="50px"
                    h="50px"
                    borderRadius="12px"
                    bgColor="blue.400"
                    cursor="pointer"
                    onClick={() => updateColourScheme("blue")}
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
                    onClick={() => updateColourScheme("purple")}
                  ></Flex>

                  <Flex
                    w="50px"
                    h="50px"
                    borderRadius="12px"
                    bgColor="red.400"
                    cursor="pointer"
                    onClick={() => updateColourScheme("red")}
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
                    onClick={() => updateColourScheme("yellow")}
                  ></Flex>
                  <Flex
                    w="50px"
                    h="50px"
                    borderRadius="12px"
                    bgColor="pink.400"
                    cursor="pointer"
                    onClick={() => {
                      updateColourScheme("pink");
                    }}
                  ></Flex>
                </Flex>
              </Flex>
              <Flex>
                <Board moves={[]} colour={"white"} boardHeight={200} />
              </Flex>
            </Flex>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
}
