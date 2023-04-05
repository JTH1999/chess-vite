import { useEffect, useState } from "react";
import reactLogo from "./assets/react.svg";
import { io } from "socket.io-client";
import { Box, Flex, Input, List, ListItem, Text } from "@chakra-ui/react";
import MainButton from "../components/MainButton";
import { useAuth } from "../hooks/useAuth";
const socket = io("http://localhost:8082");

function SocketTest() {
    const [messages, setMessages] = useState<
        { text: string; name: string; id: string; socketId: string }[]
    >([]);
    const [message, setMessage] = useState("");
    const auth = useAuth();
    const currentUser = auth.user?.username;
    // const [currentId, setCurrentId] = useState(1);

    function sendMessage() {
        const messageObj = {
            text: message,
            name: auth.user ? auth.user.username : "guest",
            id: `${socket.id}${Math.random()}`,
            socketId: socket.id,
        };

        socket.emit("sendMessage", messageObj);
    }

    useEffect(() => {
        socket.on("recieveMessage", (message) => {
            setMessages([...messages, message]);
        });
    }, [socket, messages]);

    return (
        <Flex justify="center" pt="60px">
            <Box w="1000px">
                <Box
                    h="600px"
                    bgColor={"gray.200"}
                    borderRadius="20px"
                    mb="30px"
                    p="80px"
                    overflow={"auto"}
                >
                    <List>
                        {messages.map((message) => (
                            <Flex
                                justify={
                                    message.name === currentUser
                                        ? "right"
                                        : "left"
                                }
                            >
                                <Flex
                                    borderRadius="20px"
                                    color="white"
                                    bgColor={
                                        message.name === currentUser
                                            ? "green.400"
                                            : "gray.600"
                                    }
                                    p="10px"
                                    px="20px"
                                    mb="10px"
                                >
                                    <ListItem key={message.id}>
                                        <Text>
                                            {message.name === currentUser
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

                <Flex>
                    <Input
                        name="message"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                    />
                </Flex>

                <MainButton onClick={sendMessage} text="send" />
            </Box>
        </Flex>
    );
}

export default SocketTest;
