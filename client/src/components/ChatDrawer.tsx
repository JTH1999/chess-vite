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
    Image,
    Input,
    List,
    ListItem,
    Tab,
    TabList,
    TabPanel,
    TabPanels,
    Tabs,
    Text,
    useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";

export function ChatDrawer({ buttonRef, username, socket, isOpen, onClose }) {
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState<
        { text: string; name: string; id: string; socketId: string }[]
    >([]);

    function handleKeyDown(e) {
        if (e.key === "Enter") {
            sendMessage();
            setMessage("");
        }
    }

    function sendMessage() {
        const messageObj = {
            text: message,
            name: username,
            id: `${socket.id}${Math.random()}`,
            socketId: socket.id,
        };

        socket.emit("sendMessage", messageObj);
        setMessage("");
    }

    useEffect(() => {
        socket.on("recieveMessage", (message) => {
            setMessages([...messages, message]);
        });
    }, [socket, messages]);

    return (
        <Drawer
            isOpen={isOpen}
            placement="right"
            onClose={onClose}
            finalFocusRef={buttonRef}
            size="sm"
        >
            <DrawerOverlay />
            <DrawerContent>
                <DrawerCloseButton />
                <DrawerHeader>Chat with other players in the room</DrawerHeader>

                <DrawerBody>
                    <Box
                        // h="600px"
                        bgColor={"transparent"}
                        // borderRadius="20px"
                        // mb="30px"
                        // p="10px"
                        overflow={"auto"}
                    >
                        <List spacing="5px">
                            {messages.map((message) => (
                                <Flex
                                    justify={
                                        message.name === username
                                            ? "right"
                                            : "left"
                                    }
                                >
                                    <Flex
                                        borderRadius="20px"
                                        color="white"
                                        bgColor={
                                            message.name === username
                                                ? "green.400"
                                                : "gray.600"
                                        }
                                        p="5px"
                                        px="15px"
                                    >
                                        <ListItem key={message.id}>
                                            <Text>
                                                {message.name === username
                                                    ? ""
                                                    : message.name + ": "}
                                                {message.text}
                                            </Text>
                                        </ListItem>
                                    </Flex>
                                </Flex>
                            ))}
                        </List>
                    </Box>
                </DrawerBody>

                <DrawerFooter pb="30px">
                    <Input
                        mr="20px"
                        placeholder="Enter message here"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyDown}
                    />
                    <Button
                        bgColor="green.400"
                        color="white"
                        onClick={sendMessage}
                    >
                        Save
                    </Button>
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
