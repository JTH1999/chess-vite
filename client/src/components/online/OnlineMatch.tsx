import { CheckIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  CheckboxIcon,
  Flex,
  Heading,
  IconButton,
  Input,
  List,
  ListItem,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
  Tooltip,
} from "@chakra-ui/react";
import {
  Dispatch,
  KeyboardEvent,
  KeyboardEventHandler,
  SetStateAction,
  useEffect,
  useRef,
  useState,
} from "react";
import { newGamePieces } from "../../data/newGamePieces";
import { useAuth } from "../../hooks/useAuth";
import { useColour } from "../../hooks/useColour";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { AnalysisSection } from "../AnalysisSection";
import CapturedPieces from "../CapturedPieces";
import { ClientToServerEvents, Message, Move, Piece, ServerToClientEvents } from "../../../types";
import { Socket } from "socket.io-client";
import Board from "../board/Board";
import OnlinePromoteScreen from "./OnlinePromoteScreen";
import OnlineEndScreen from "./OnlineEndScreen";
import { GameScreen } from "../GameScreen";

export function OnlineMatch({
  colour,
  pieces,
  capturedPieces,
  isYourMove,
  socket,
  roomCode,
  gameId,
  whiteToMove,
  status,
  winner,
  moves,
  analysisMoveNumber,
  messages,
  players,
  setMessages,
  setPieces,
  setIsYourMove,
  setAnalysisMoveNumber,
}: {
  colour: string;
  pieces: Piece[];
  capturedPieces: Piece[];
  isYourMove: boolean;
  roomCode: string;
  gameId: string;
  status: string;
  winner: string | null;
  moves: Move[];
  whiteToMove: boolean;
  messages: Message[];
  socket: Socket<ServerToClientEvents, ClientToServerEvents>;
  analysisMoveNumber: number;
  players: string[];
  setIsYourMove: Dispatch<SetStateAction<boolean>>;
  setAnalysisMoveNumber: Dispatch<SetStateAction<number>>;
  setPieces: Dispatch<SetStateAction<Piece[]>>;
  setMessages: Dispatch<SetStateAction<Message[]>>;
}) {
  const { height, width } = useWindowDimensions();
  const [analysisMode, setAnalysisMode] = useState(false);
  const [message, setMessage] = useState("");
  const [serverMessages, setServerMessages] = useState([]);
  const [drawOffer, setDrawOffer] = useState(false);
  const [whiteTime, setWhiteTime] = useState(1800000);
  const [blackTime, setBlackTime] = useState(1800000);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const auth = useAuth();
  const { colourScheme } = useColour();
  const username = auth!.user.username!;
  let opposition = "";
  for (const player of players) {
    if (player !== username) {
      opposition = player;
      break;
    }
  }

  let previousPieceMovedFrom = "";
  let previousPieceMovedTo = "";

  if (moves.length >= 1) {
    const previousPieceIndex = moves[analysisMoveNumber].movedPieceIndex;
    let previousPiecePreviousPosition;
    if (analysisMoveNumber === 0) {
      previousPiecePreviousPosition = newGamePieces[previousPieceIndex];
    } else {
      previousPiecePreviousPosition =
        moves[analysisMoveNumber - 1].pieces[previousPieceIndex];
    }
    previousPieceMovedFrom =
      previousPiecePreviousPosition.currentCol.toString() +
      previousPiecePreviousPosition.currentRow.toString();
    const previousPieceCurrentPosition = pieces[previousPieceIndex];
    previousPieceMovedTo =
      previousPieceCurrentPosition.currentCol.toString() +
      previousPieceCurrentPosition.currentRow.toString();
  }

  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behaviour: "smooth" });
  }, [messages]);

  function handleKeyDown(e: KeyboardEvent<HTMLElement>) {
    if (e.key === "Enter") {
      sendMessage();
      setMessage("");
    }
  }

  function sendMove(selectedPiece: Piece, square: string) {
    const move = {
      selectedPiece: selectedPiece,
      square: square,
      roomCode: roomCode,
      gameId: gameId,
      colour: colour,
    };

    socket.emit("sendMove", move);
    setIsYourMove(false);
    setSelectedPiece(null);
  }

  function handleSquareClick(
    row: number,
    col: number,
    square: string,
    piece: Piece | null
  ) {
    if (!isYourMove) {
      return;
    }

    if (analysisMode) {
      return;
    }
    // if there is a selected piece
    if (selectedPiece) {
      if (
        piece?.colour === selectedPiece.colour &&
        piece?.name !== selectedPiece.name
      ) {
        let selectedPieceCopy = { ...piece };

        setSelectedPiece(selectedPieceCopy);
        return;
      }

      if (selectedPiece.availableMoves.includes(square)) {
        sendMove(selectedPiece, square);
      } else if (
        selectedPiece.currentCol.toString() +
          selectedPiece.currentRow.toString() ===
        square
      ) {
        setSelectedPiece(null);
      }
      // if no piece selected yet
    } else if (piece) {
      if (piece.colour === colour) {
        let selectedPieceCopy = { ...piece };
        setSelectedPiece(selectedPieceCopy);
      }
    }
  }

  function sendMessage() {
    const messageObj = {
      text: message,
      name: username,
      id: `${socket.id}${Math.random()}`,
    };

    socket.emit("sendMessage", messageObj);
    setMessage("");
  }

  function sendDrawOffer() {
    socket.emit("sendDrawOffer", {
      gameId: gameId,
      roomCode: roomCode,
      id: `${socket.id}${Math.random()}`,
    });
    const message = {
      text: `You offered ${opposition} a draw.`,
      name: username,
      type: "draw offer response",
      id: `${socket.id}${Math.random()}`,
    };
    setMessages([...messages, message]);
  }

  function acceptDrawOffer(messageIndex: number) {
    const messagesCopy = [...messages];
    console.log(messagesCopy);
    messagesCopy[messageIndex].type = "draw offer response";
    messagesCopy[messageIndex].text = "You accepted the draw offer.";
    console.log(messagesCopy);
    setMessages(messagesCopy);
    socket.emit("drawOfferResponse", {
      gameId: gameId,
      roomCode: roomCode,
      accepted: true,
    });
  }

  function rejectDrawOffer(messageIndex: number) {
    const messagesCopy = [...messages];
    messagesCopy[messageIndex].type = "draw offer response";
    messagesCopy[messageIndex].text = "You rejected the draw offer.";
    setMessages(messagesCopy);
    socket.emit("drawOfferResponse", {
      gameId: gameId,
      roomCode: roomCode,
      accepted: false,
    });
  }

  function resign() {
    socket.emit("resign", {
      gameId: gameId,
      roomCode: roomCode,
    });
  }

  function msToTime(time: number) {
    function pad(s: number) {
      return ("00" + s).slice(-2);
    }
    let ms = time % 1000;
    time = (time - ms) / 1000;
    let s = time % 60;
    time = (time - s) / 60;
    let mins = time % 60;
    return `${pad(mins)}:${pad(s)}`;
  }

  useEffect(() => {
    socket.on("currentTimes", (times) => {
      if (times.gameId !== gameId) {
        return;
      }
      setWhiteTime(times.white);
      setBlackTime(times.black);
    });
  }, [socket]);

  useEffect(() => {
    socket.on("recieveMessage", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("drawOfferReceived", (message) => {
      setMessages([...messages, message]);
    });

    socket.on("drawOfferRejected", () => {
      const message = {
        text: `${opposition} rejected your draw offer.`,
        type: "draw offer response",
        name: username,
        id: `${socket.id}${Math.random()}`,
      };
      setMessages([...messages, message]);
    });
  }, [socket, messages]);

  // Captured Pieces section height is 50px,
  // +20px for spacing, +extra 20 for top and bottom
  // Will need to make this more responsive and dynamic at some point
  const screenHeight = height - 30;
  const boardHeight = screenHeight - 120;
  return (
    <>
      <GameScreen
        modal={<></>}
        capturedPiecesTop={
          <CapturedPieces
            capturedPieces={capturedPieces}
            colour={colour}
            username={opposition}
            top={true}
            src={null}
          />
        }
        capturedPiecesBottom={
          <CapturedPieces
            username={username}
            capturedPieces={capturedPieces}
            colour={colour === "white" ? "black" : "white"}
            top={false}
            src={null}
          />
        }
        menuItems={
          <>
            <MenuItem onClick={sendDrawOffer}>Offer Draw</MenuItem>
            <MenuItem onClick={resign}>
              {moves.length > 0 ? "Resign" : "Exit"}
            </MenuItem>
          </>
        }
        endScreen={
          <OnlineEndScreen
            whiteToMove={whiteToMove}
            analysisMode={analysisMode}
            winner={winner}
            status={status}
            moves={moves}
            roomCode={roomCode}
            socket={socket}
            setAnalysisMode={setAnalysisMode}
            setAnalysisMoveNumber={setAnalysisMoveNumber}
            setPieces={setPieces}
          />
        }
        promoteScreen={
          <OnlinePromoteScreen
            roomCode={roomCode}
            gameId={gameId}
            status={status}
            whiteToMove={whiteToMove}
            socket={socket}
          />
        }
        analysisSection={
          <>
            <Box h="60%" flexShrink={"0"}>
              <AnalysisSection
                moves={moves}
                pieces={pieces}
                setPieces={setPieces}
                setAnalysisMode={setAnalysisMode}
                analysisMode={analysisMode}
                analysisMoveNumber={analysisMoveNumber}
                setAnalysisMoveNumber={setAnalysisMoveNumber}
              />
            </Box>
            <Flex
              bgColor={colourScheme.darker}
              borderColor={colourScheme.border}
              borderWidth="2px"
              borderRadius="12px"
              borderTopWidth={"0"}
              flex="1 1 auto"
              flexDirection={"column"}
              overflow="hidden"
            >
              <Box
                flex="1 1 auto"
                bgColor={"transparent"}
                m="10px"
                mr="0"
                pr="10px"
                overflow={"auto"}
              >
                <List spacing="2px">
                  {messages.map((message, index: number) => (
                    <ListItem key={message.id}>
                      {message.type === "draw offer" ||
                      message.type === "draw offer response" ? (
                        <>
                          <Text textAlign="center" pb="6px">
                            {message.text}
                          </Text>
                          {message.type === "draw offer" ? (
                            <Flex justify="center" pb="4px">
                              <Flex w="25%" justify="space-between">
                                <Tooltip
                                  hasArrow
                                  label="Accept"
                                  borderRadius={"6px"}
                                >
                                  <IconButton
                                    aria-label="accept"
                                    icon={<CheckIcon />}
                                    _hover={{
                                      backgroundColor: colourScheme.primary,
                                    }}
                                    onClick={() => acceptDrawOffer(index)}
                                  />
                                </Tooltip>

                                <Tooltip
                                  hasArrow
                                  label="Reject"
                                  borderRadius={"6px"}
                                >
                                  <IconButton
                                    aria-label="reject"
                                    icon={<CloseIcon />}
                                    _hover={{
                                      backgroundColor: colourScheme.primary,
                                    }}
                                    onClick={() => rejectDrawOffer(index)}
                                  />
                                </Tooltip>
                              </Flex>
                            </Flex>
                          ) : (
                            <></>
                          )}
                        </>
                      ) : (
                        <>
                          <Flex
                            justify={
                              message.name === username ? "right" : "left"
                            }
                          >
                            <Flex
                              borderRadius="20px"
                              borderBottomRightRadius={
                                message.name === username ? "0" : "20px"
                              }
                              borderBottomLeftRadius={
                                message.name === username ? "20px" : "0px"
                              }
                              color="white"
                              bgColor={
                                message.name === username
                                  ? colourScheme.primary
                                  : "gray.600"
                              }
                              p="2px"
                              px="15px"
                            >
                              <Text>
                                {message.name === username
                                  ? ""
                                  : message.name + ": "}
                                {message.text}
                              </Text>
                            </Flex>
                          </Flex>
                        </>
                      )}
                    </ListItem>
                  ))}
                  <Box ref={bottomRef} h="0px"></Box>
                </List>
              </Box>
              <Flex flex="0 0">
                <Input
                  borderRadius={"0"}
                  placeholder="Enter message here"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyDown={handleKeyDown}
                  borderWidth="0"
                  borderTopWidth="2px"
                  borderTopColor={colourScheme.border}
                />
                <Button
                  bgColor={colourScheme.primary}
                  color="white"
                  borderRadius={"0"}
                  onClick={sendMessage}
                >
                  Send
                </Button>
              </Flex>
            </Flex>
          </>
        }
        topClock={
          <Flex
            borderWidth={"2px"}
            borderColor={
              isYourMove ? colourScheme.border : colourScheme.primary
            }
            bgColor={colourScheme.darker}
            borderRadius="12px"
            px="20px"
            justify="center"
            alignItems="center"
            ml="10px"
          >
            <Text
              fontSize={"24px"}
              fontWeight={"bold"}
              color={colourScheme.text}
            >
              {colour === "white" ? msToTime(blackTime) : msToTime(whiteTime)}
            </Text>
          </Flex>
        }
        bottomClock={
          <Flex
            borderWidth={"2px"}
            borderRadius={"12px"}
            borderColor={
              isYourMove ? colourScheme.primary : colourScheme.border
            }
            bgColor={colourScheme.darker}
            justify="center"
            alignItems="center"
            px="20px"
          >
            <Text
              fontSize={"24px"}
              fontWeight={"bold"}
              color={colourScheme.text}
            >
              {colour === "white" ? msToTime(whiteTime) : msToTime(blackTime)}
            </Text>
          </Flex>
        }
        moves={moves}
        pieces={pieces}
        analysisMode={analysisMode}
        analysisMoveNumber={analysisMoveNumber}
        previousPieceMovedFrom={previousPieceMovedFrom}
        previousPieceMovedTo={previousPieceMovedTo}
        colour={colour}
        selectedPiece={selectedPiece}
        handleSquareClick={handleSquareClick}
        setPieces={setPieces}
        setAnalysisMode={setAnalysisMode}
        setAnalysisMoveNumber={setAnalysisMoveNumber}
      />

      {/* <Flex justify={"center"} pt="8px">
        <Flex flexDirection={"column"}>
          <Flex h={`${screenHeight}px`}>
            <Flex flexDirection={"column"}>
              <Flex justify={"space-between"} pb="10px">
                <CapturedPieces
                  capturedPieces={capturedPieces}
                  colour={colour}
                  username={opposition}
                  top={true}
                  src={null}
                />
                <Flex>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<HamburgerIcon />}
                      variant="outline"
                      size="lg"
                      h="50px"
                      w="50px"
                      borderRadius={"12px"}
                      borderWidth="2px"
                      borderColor={colourScheme.border}
                      mr="10px"
                      bgColor={colourScheme.darker}
                    />

                    <MenuList zIndex={"20"}>
                      <MenuItem onClick={sendDrawOffer}>Offer Draw</MenuItem>
                      <MenuItem onClick={resign}>
                        {moves.length > 0 ? "Resign" : "Exit"}
                      </MenuItem>
                    </MenuList>
                  </Menu>
                  <Flex
                    borderWidth={"2px"}
                    borderColor={
                      isYourMove ? colourScheme.border : colourScheme.primary
                    }
                    bgColor={colourScheme.darker}
                    borderRadius="12px"
                    px="20px"
                    justify="center"
                    alignItems="center"
                  >
                    <Text
                      fontSize={"24px"}
                      fontWeight={"bold"}
                      color={colourScheme.text}
                    >
                      {colour === "white"
                        ? msToTime(blackTime)
                        : msToTime(whiteTime)}
                    </Text>
                  </Flex>
                </Flex>
              </Flex>

              <Board
                colour={colour}
                pieces={pieces}
                selectedPiece={selectedPiece}
                boardHeight={boardHeight}
                previousPieceMovedFrom={previousPieceMovedFrom}
                previousPieceMovedTo={previousPieceMovedTo}
                handleSquareClick={handleSquareClick}
              >
                <OnlineEndScreen
                  whiteToMove={whiteToMove}
                  analysisMode={analysisMode}
                  winner={winner}
                  status={status}
                  moves={moves}
                  roomCode={roomCode}
                  socket={socket}
                  setAnalysisMode={setAnalysisMode}
                  setAnalysisMoveNumber={setAnalysisMoveNumber}
                  setPieces={setPieces}
                />
                <OnlinePromoteScreen
                  roomCode={roomCode}
                  gameId={gameId}
                  status={status}
                  whiteToMove={whiteToMove}
                  socket={socket}
                />
              </Board>
              <Flex justify={"space-between"} pt="10px">
                <CapturedPieces
                  username={username}
                  capturedPieces={capturedPieces}
                  colour={colour === "white" ? "black" : "white"}
                  top={false}
                  src={null}
                />
                <Flex
                  borderWidth={"2px"}
                  borderRadius={"12px"}
                  borderColor={
                    isYourMove ? colourScheme.primary : colourScheme.border
                  }
                  bgColor={colourScheme.darker}
                  justify="center"
                  alignItems="center"
                  px="20px"
                >
                  <Text
                    fontSize={"24px"}
                    fontWeight={"bold"}
                    color={colourScheme.text}
                  >
                    {colour === "white"
                      ? msToTime(whiteTime)
                      : msToTime(blackTime)}
                  </Text>
                </Flex>
              </Flex>
            </Flex>

            <Flex
              w="400px"
              flexDirection={"column"}
              ml="50px"
              height={"inherit"}
            >
              <Box h="60%" flexShrink={"0"}>
                <AnalysisSection
                  moves={moves}
                  pieces={pieces}
                  setPieces={setPieces}
                  setAnalysisMode={setAnalysisMode}
                  analysisMode={analysisMode}
                  analysisMoveNumber={analysisMoveNumber}
                  setAnalysisMoveNumber={setAnalysisMoveNumber}
                />
              </Box>
              <Flex
                bgColor={colourScheme.darker}
                borderColor={colourScheme.border}
                borderWidth="2px"
                borderRadius="12px"
                borderTopWidth={"0"}
                flex="1 1 auto"
                flexDirection={"column"}
                overflow="hidden"
              >
                <Box
                  flex="1 1 auto"
                  bgColor={"transparent"}
                  m="10px"
                  mr="0"
                  pr="10px"
                  overflow={"auto"}
                >
                  <List spacing="2px">
                    {messages.map((message, index: number) => (
                      <ListItem key={message.id}>
                        {message.type === "draw offer" ||
                        message.type === "draw offer response" ? (
                          <>
                            <Text textAlign="center" pb="6px">
                              {message.text}
                            </Text>
                            {message.type === "draw offer" ? (
                              <Flex justify="center" pb="4px">
                                <Flex w="25%" justify="space-between">
                                  <Tooltip
                                    hasArrow
                                    label="Accept"
                                    borderRadius={"6px"}
                                  >
                                    <IconButton
                                      aria-label="accept"
                                      icon={<CheckIcon />}
                                      _hover={{
                                        backgroundColor: colourScheme.primary,
                                      }}
                                      onClick={() => acceptDrawOffer(index)}
                                    />
                                  </Tooltip>

                                  <Tooltip
                                    hasArrow
                                    label="Reject"
                                    borderRadius={"6px"}
                                  >
                                    <IconButton
                                      aria-label="reject"
                                      icon={<CloseIcon />}
                                      _hover={{
                                        backgroundColor: colourScheme.primary,
                                      }}
                                      onClick={() => rejectDrawOffer(index)}
                                    />
                                  </Tooltip>
                                </Flex>
                              </Flex>
                            ) : (
                              <></>
                            )}
                          </>
                        ) : (
                          <>
                            <Flex
                              justify={
                                message.name === username ? "right" : "left"
                              }
                            >
                              <Flex
                                borderRadius="20px"
                                borderBottomRightRadius={
                                  message.name === username ? "0" : "20px"
                                }
                                borderBottomLeftRadius={
                                  message.name === username ? "20px" : "0px"
                                }
                                color="white"
                                bgColor={
                                  message.name === username
                                    ? colourScheme.primary
                                    : "gray.600"
                                }
                                p="2px"
                                px="15px"
                              >
                                <Text>
                                  {message.name === username
                                    ? ""
                                    : message.name + ": "}
                                  {message.text}
                                </Text>
                              </Flex>
                            </Flex>
                          </>
                        )}
                      </ListItem>
                    ))}
                    <Box ref={bottomRef} h="0px"></Box>
                  </List>
                </Box>
                <Flex flex="0 0">
                  <Input
                    borderRadius={"0"}
                    placeholder="Enter message here"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyDown={handleKeyDown}
                    borderWidth="0"
                    borderTopWidth="2px"
                    borderTopColor={colourScheme.border}
                  />
                  <Button
                    bgColor={colourScheme.primary}
                    color="white"
                    borderRadius={"0"}
                    onClick={sendMessage}
                  >
                    Send
                  </Button>
                </Flex>
              </Flex>
            </Flex>
          </Flex>
        </Flex>
      </Flex> */}
    </>
  );
}
