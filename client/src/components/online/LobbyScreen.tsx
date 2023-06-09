import {
  Box,
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
} from "@chakra-ui/react";

import { ChatIcon } from "@chakra-ui/icons";
import { Dispatch, SetStateAction, useEffect, useRef, useState, KeyboardEvent } from "react";
import { useNavigate } from "react-router-dom";
import pawnImage from "../../assets/pieces/w_pawn_svg_NoShadow.svg";
import MainButton from "../MainButton";
import { useAuth } from "../../hooks/useAuth";

import TransparentButton from "../TransparentButton";
import { Socket, io } from "socket.io-client";
import { useColour } from "../../hooks/useColour";
import { PleaseLogin } from "../PleaseLogin";
import { ClientToServerEvents, ServerToClientEvents } from "../../../types";
import { newGamePieces } from "../../data/newGamePieces";

export function LobbyScreen({
  socket,
  username,
  onOpen,
  isRoomCreated,
  setIsRoomCreated,
  roomJoined,
  players,
}: {
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  username: string;
  onOpen: any;
  isRoomCreated: boolean;
  setIsRoomCreated: Dispatch<SetStateAction<boolean>>;
  roomJoined: string;
  players: string[];
}) {
  const auth = useAuth();
  const navigate = useNavigate();
  const [joinRoomCode, setJoinRoomCode] = useState("");
  const [tabIndex, setTabIndex] = useState(-1);
  const buttonRef = useRef();
  const { colourScheme } = useColour();

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter") {
      joinRoom(joinRoomCode);
    }
  }

  function createRoom() {
    const createRoomRequest = {
      username: username,
      room: username,
    };

    socket.emit("joinRoom", createRoomRequest);
  }

  function joinRoom(roomCode: string) {
    if (!auth?.user.username) {
      throw new Error("Must be an authenticated user to join a room")
    }
    const joinRoomRequest = {
      username: auth?.user?.username,
      room: roomCode,
    };

    socket.emit("joinRoom", joinRoomRequest);
  }

  function leaveRoom(roomCode: string) {
    socket.emit("leaveRoom", roomCode);
  }

  function startMatch(roomCode: string) {
    socket.emit("startMatch", {roomCode: roomCode, pieces: newGamePieces});
  }

  function createNewRoom() {
    if (isRoomCreated) return;
    createRoom();
  }

  function closeCreatedRoom() {
    leaveRoom(username);
    setIsRoomCreated(false);
    setTabIndex(-1);
  }

  return (
    <Flex justify={"center"} alignItems="center" pt="60px">
      <Flex
        bgColor={colourScheme.darker}
        borderColor={colourScheme.border}
        borderWidth={"2px"}
        borderRadius="12px"
        w="500px"
        alignItems={"center"}
        flexDirection="column"
        p="30px"
      >
        {auth?.user ? (
          <>
            <Heading pb="20px">Play Online</Heading>
            <Text textAlign={"center"} pb="30px">
              Create a new online match room, or join another room using its
              code
            </Text>
            <Tabs
              w="100%"
              isFitted
              variant="enclosed"
              defaultIndex={-1}
              index={tabIndex}
            >
              <TabList mb="1em">
                <Tab
                  isDisabled={Boolean(roomJoined)}
                  fontWeight={"semibold"}
                  onClick={() => {
                    createNewRoom();
                    setTabIndex(0);
                  }}
                  _selected={{
                    color: colourScheme.primary,
                    borderColor: colourScheme.border,
                    borderBottomWidth: "0",
                  }}
                >
                  Create Room
                </Tab>
                <Tab
                  isDisabled={isRoomCreated}
                  fontWeight={"semibold"}
                  onClick={() => setTabIndex(1)}
                  _selected={{
                    color: colourScheme.primary,
                    borderColor: colourScheme.border,
                    borderBottomWidth: "0",
                  }}
                >
                  Join Room
                </Tab>
              </TabList>
              <TabPanels>
                <TabPanel textAlign={"center"}>
                  {/* <Box textAlign={"right"}>
                                        <IconButton
                                            aria-label="Close Room"
                                            icon={<CloseIcon />}
                                        />
                                    </Box> */}

                  <Heading fontSize={"20px"}>
                    Here is your unique room code
                  </Heading>
                  <Heading py="20px">{username}</Heading>
                  <Flex justify={"space-between"}>
                    <Text textAlign={"left"}>Players waiting:</Text>
                    {/* <IconButton
                      aria-label="Open chat"
                      icon={<ChatIcon />}
                      ref={buttonRef}
                      onClick={onOpen}
                    /> */}
                  </Flex>

                  <List>
                    {players.map((player) => (
                      <ListItem key={player}>
                        <PlayerWaiting username={player} avatar={""} />
                      </ListItem>
                    ))}
                  </List>

                  <Box pt="30px">
                    <MainButton
                      onClick={() => startMatch(username)}
                      text="Start Match"
                      disabled={players.length < 2}
                      w="100%"
                      mt="0"
                    />
                    <TransparentButton
                      onClick={closeCreatedRoom}
                      text="Close Room"
                      disabled={false}
                      w="100%"
                    />
                  </Box>
                </TabPanel>
                <TabPanel textAlign={"center"}>
                  {roomJoined ? (
                    <>
                      <Heading fontSize={"20px"}>You are in room:</Heading>
                      <Heading py="20px">{joinRoomCode}</Heading>
                      <Flex justify={"space-between"}>
                        <Text textAlign={"left"}>Players waiting:</Text>
                        {/* <IconButton
                          aria-label="Open chat"
                          icon={<ChatIcon />}
                          ref={buttonRef}
                          onClick={onOpen}
                        /> */}
                      </Flex>
                      <List>
                        {players.map((player) => (
                          <ListItem key={player}>
                            <PlayerWaiting username={player} avatar={"null"} />
                          </ListItem>
                        ))}
                      </List>
                      <Text pt="30px">Waiting for host to start the match</Text>
                      <TransparentButton
                        text="Leave room"
                        onClick={() => leaveRoom(joinRoomCode)}
                        disabled={false}
                        w="100%"
                      />
                    </>
                  ) : (
                    <>
                      <Heading fontSize={"20px"} pb="30px">
                        Enter the room code to join
                      </Heading>
                      <Input
                        placeholder="Enter code here"
                        value={joinRoomCode}
                        onChange={(e) => setJoinRoomCode(e.target.value)}
                        onKeyDown={handleKeyDown}
                        mb="10px"
                      />
                      <MainButton
                        onClick={() => joinRoom(joinRoomCode)}
                        text="Join"
                        disabled={false}
                        w="100%"
                        mt="0"
                      />
                    </>
                  )}
                </TabPanel>
              </TabPanels>
            </Tabs>
          </>
        ) : (
          <>
            <PleaseLogin text="You must be logged in to play online with another user. Please login to continue." />
          </>
          
        )}
      </Flex>
    </Flex>
  );
}

function PlayerWaiting({
  username,
  avatar,
}: {
  username: string;
  avatar: string;
}) {
  return (
    <Flex pt="30px">
      <Image src={pawnImage} width="20px" mr="20px" />
      <Text>{username}</Text>
    </Flex>
  );
}
