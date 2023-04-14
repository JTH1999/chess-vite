import { SyntheticEvent, useEffect, useLayoutEffect, useState } from "react";
import Board from "../components/board/Board";
import { newGamePieces, debugPieces } from "../data/newGamePieces";
import CapturedPieces from "../components/CapturedPieces";
import { Move, Piece } from "../../types";
import {
  Box,
  Button,
  chakra,
  Flex,
  IconButton,
  Input,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Radio,
  RadioGroup,
  Spinner,
  Stack,
  Switch,
  Text,
  Tooltip,
  useDisclosure,
} from "@chakra-ui/react";
import { AnalysisSection } from "../components/AnalysisSection";
import { useSyncExternalStore } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "../hooks/useAuth";
import MainButton from "../components/MainButton";
import { Form, useLoaderData, useNavigate } from "react-router-dom";
import optimusPrime from "../assets/botAvatars/optimusPrimeAvatar.png";
import walle from "../assets/botAvatars/walleAvatar.png";
import r2d2 from "../assets/botAvatars/r2d2Avatar.png";
import terminator from "../assets/botAvatars/terminatorAvatar.png";
import {
  calculateBotMove,
  handleClickLogic,
} from "../components/board/square/logic";
import { useColour } from "../hooks/useColour";
import CheckmateScreen from "../components/CheckmateScreen";
import PromoteScreen from "../components/PromoteScreen";
import { GameScreen } from "../components/GameScreen";

export default function VsComputerRoute() {
  const auth = useAuth();
  const avatarUrl = useLoaderData() as string;
  const [whiteToMove, setWhiteToMove] = useState<boolean>(true);
  const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);
  const [whiteKingSquare, setWhiteKingSquare] = useState<string>("51");
  const [blackKingSquare, setBlackKingSquare] = useState<string>("58");
  const [isCheck, setIsCheck] = useState<boolean>(false);
  const [isCheckmate, setIsCheckmate] = useState<boolean>(false);
  const [isStalemate, setIsStalemate] = useState<boolean>(false);
  const [promote, setPromote] = useState<boolean>(false);
  const [moves, setMoves] = useState<Move[]>([]);
  const [pieces, setPieces] = useState<Piece[]>(newGamePieces);
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);
  const [analysisMode, setAnalysisMode] = useState<boolean>(false);
  const [analysisMoveNumber, setAnalysisMoveNumber] = useState<number>(0);
  const { height, width } = useWindowDimensions();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [player1Colour, setPlayer1Colour] = useState("white");
  const [player1Name, setPlayer1Name] = useState(
    auth?.user.username ? auth.user.username : "Player 1"
  );
  const [colour, setColour] = useState("white");
  const [bot, setBot] = useState(generateBot());
  const [botToMove, setBotToMove] = useState(false);
  const [botDifficulty, setBotDifficulty] = useState("2");
  const navigate = useNavigate();
  const { colourScheme } = useColour();

  const screenHeight = height - 30;
  const boardHeight = screenHeight - 120;

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

  useEffect(() => {
    onOpen();
  }, []);

  function setColours(value: string) {
    if (value === "white" || value === "black") {
      setColour(value);
      if (value === "black") {
        setBotToMove(true);
      } else {
        setBotToMove(false);
      }
    } else if (value === "random") {
      const rand = Math.random();
      const randomColour = rand > 0.5 ? "white" : "black";
      setColour(randomColour);
      if (randomColour === "black") {
        setBotToMove(true);
      } else {
        setBotToMove(false);
      }
    } else {
      throw new Error("Value should be white, black or random.");
    }
  }

  function generateBot() {
    const random = Math.random();
    let bot = { name: "", src: "" };
    const bots = [
      { name: "Wall-E", src: walle },
      { name: "Terminator", src: terminator },
      { name: "R2D2", src: r2d2 },
      { name: "Optimus Prime", src: optimusPrime },
    ];
    if (random < 1 / 4) {
      bot = bots[0];
    } else if (random < 1 / 2) {
      bot = bots[1];
    } else if (random < 3 / 4) {
      bot = bots[2];
    } else {
      bot = bots[3];
    }

    return bot;
  }

  // useEffect(() => {
  //   if (
  //     (!whiteToMove && colour === "white") ||
  //     (whiteToMove && colour === "black")
  //   )
  //     setBotToMove(true);
  // }, [whiteToMove]);

  // useEffect(() => {
  //   if (botToMove && !isCheckmate && !isStalemate) {
  //     async function calc() {
  //       await calculateBotMove(
  //         pieces,
  //         whiteToMove,
  //         capturedPieces,
  //         whiteKingSquare,
  //         blackKingSquare,
  //         isCheck,
  //         promote,
  //         moves,
  //         analysisMode,
  //         colour,
  //         false,
  //         botDifficulty,
  //         setBotToMove,
  //         setColour,
  //         setPieces,
  //         setSelectedPiece,
  //         setWhiteToMove,
  //         setCapturedPieces,
  //         setWhiteKingSquare,
  //         setBlackKingSquare,
  //         setIsCheck,
  //         setIsCheckmate,
  //         setIsStalemate,
  //         setPromote,
  //         setMoves,
  //         setAnalysisMoveNumber
  //       );
  //       setBotToMove(false);
  //     }

  //     calc();
  //   }
  // }, [botToMove]);

  function handleSquareClick(
    row: number,
    col: number,
    square: string,
    piece: Piece | null
  ) {
    handleClickLogic(
      row,
      col,
      square,
      piece,
      pieces,
      selectedPiece,
      whiteToMove,
      capturedPieces,
      whiteKingSquare,
      blackKingSquare,
      isCheck,
      promote,
      moves,
      analysisMode,
      colour,
      false,
      true,
      botDifficulty,
      setBotToMove,
      setColour,
      setPieces,
      setSelectedPiece,
      setWhiteToMove,
      setCapturedPieces,
      setWhiteKingSquare,
      setBlackKingSquare,
      setIsCheck,
      setIsCheckmate,
      setIsStalemate,
      setPromote,
      setMoves,
      setAnalysisMoveNumber
    );
  }

  function resetBoard() {
    setWhiteToMove(true);
    setCapturedPieces([]);
    setWhiteKingSquare("51");
    setBlackKingSquare("58");
    setIsCheck(false);
    setIsCheckmate(false);
    setIsStalemate(false);
    setPromote(false);
    setMoves([]);
    setPieces(newGamePieces);
    setSelectedPiece(null);
    setAnalysisMode(false);
    setAnalysisMoveNumber(0);
    onOpen();
  }

  function handleSubmit(e: SyntheticEvent) {
    e.preventDefault();
    const target = e.target as typeof e.target & {
      player1Input: { value: string };
      botDifficulty: { value: string };
      playerColour: { value: string };
    };

    onClose();
    setPlayer1Name(target.player1Input.value);
    setBotDifficulty(target.botDifficulty.value);
    setColours(target.playerColour.value);
    if (botToMove) {
      calculateBotMove(
        pieces,
        whiteToMove,
        capturedPieces,
        whiteKingSquare,
        blackKingSquare,
        isCheck,
        promote,
        moves,
        analysisMode,
        colour,
        false,
        botDifficulty,
        setBotToMove,
        setColour,
        setPieces,
        setSelectedPiece,
        setWhiteToMove,
        setCapturedPieces,
        setWhiteKingSquare,
        setBlackKingSquare,
        setIsCheck,
        setIsCheckmate,
        setIsStalemate,
        setPromote,
        setMoves,
        setAnalysisMoveNumber
      );
    }
  }

  function OptionsModal() {
    return (
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor={colourScheme.body} p="20px">
          <ModalHeader textAlign={"center"}>Configure Match</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <Flex direction="column">
                <Text fontSize={"18px"} pb="4px">
                  Player 1
                </Text>
                <Input
                  mb="20px"
                  name="player1Input"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                />
                <Text fontSize={"18px"} pb="8px">
                  Select Bot Difficulty
                </Text>
                <RadioGroup
                  colorScheme="green"
                  mb="20px"
                  isDisabled={moves.length > 0}
                  onChange={setBotDifficulty}
                  defaultValue="2"
                >
                  <Stack direction="row" spacing="20px">
                    <Radio
                      value="1"
                      variant={colourScheme.name}
                      name="botDifficulty"
                    >
                      Easy
                    </Radio>
                    <Radio
                      value="2"
                      variant={colourScheme.name}
                      name="botDifficulty"
                    >
                      Medium
                    </Radio>
                    <Radio
                      value="3"
                      variant={colourScheme.name}
                      name="botDifficulty"
                    >
                      Hard
                    </Radio>
                  </Stack>
                </RadioGroup>

                <Text fontSize={"18px"} pb="8px">
                  Select Your Colour
                </Text>
                <RadioGroup
                  colorScheme="green"
                  mb="20px"
                  isDisabled={moves.length > 0}
                  onChange={setColours}
                  defaultValue="white"
                >
                  <Stack direction="row" spacing="20px">
                    <Radio
                      value="white"
                      variant={colourScheme.name}
                      name="playerColour"
                    >
                      White
                    </Radio>
                    <Radio
                      value="black"
                      variant={colourScheme.name}
                      name="playerColour"
                    >
                      Black
                    </Radio>
                    <Radio
                      value="random"
                      variant={colourScheme.name}
                      name="playerColour"
                    >
                      Randomise
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <MainButton
                // onClick={onClose}
                text={moves.length > 0 ? "Save" : "Start Match"}
                disabled={false}
                w="100%"
                mt="0"
                type="submit"
              />
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
    );
  }

  function MenuItems() {
    return (
      <>
        <MenuItem onClick={resetBoard}>New Game</MenuItem>
        <Tooltip
          label={
            auth?.user.username
              ? "Save your game for later"
              : "You must be logged in to save your game"
          }
        >
          <MenuItem isDisabled={!auth?.user.username}>Save</MenuItem>
        </Tooltip>

        <MenuItem onClick={onOpen}>Options</MenuItem>
      </>
    );
  }

  console.log(botDifficulty);
  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor={colourScheme.body} p="20px">
          <ModalHeader textAlign={"center"}>Configure Match</ModalHeader>
          <ModalCloseButton onClick={onClose} />
          <Form onSubmit={handleSubmit}>
            <ModalBody>
              <Flex direction="column">
                <Text fontSize={"18px"} pb="4px">
                  Player 1
                </Text>
                <Input
                  mb="20px"
                  name="player1Input"
                  value={player1Name}
                  onChange={(e) => setPlayer1Name(e.target.value)}
                />
                <Text fontSize={"18px"} pb="8px">
                  Select Bot Difficulty
                </Text>
                <RadioGroup
                  colorScheme="green"
                  mb="20px"
                  isDisabled={moves.length > 0}
                  onChange={setBotDifficulty}
                  defaultValue="2"
                >
                  <Stack direction="row" spacing="20px">
                    <Radio
                      value="1"
                      variant={colourScheme.name}
                      name="botDifficulty"
                    >
                      Easy
                    </Radio>
                    <Radio
                      value="2"
                      variant={colourScheme.name}
                      name="botDifficulty"
                    >
                      Medium
                    </Radio>
                    <Radio
                      value="3"
                      variant={colourScheme.name}
                      name="botDifficulty"
                    >
                      Hard
                    </Radio>
                  </Stack>
                </RadioGroup>

                <Text fontSize={"18px"} pb="8px">
                  Select Your Colour
                </Text>
                <RadioGroup
                  colorScheme="green"
                  mb="20px"
                  isDisabled={moves.length > 0}
                  onChange={setColours}
                  defaultValue="white"
                >
                  <Stack direction="row" spacing="20px">
                    <Radio
                      value="white"
                      variant={colourScheme.name}
                      name="playerColour"
                    >
                      White
                    </Radio>
                    <Radio
                      value="black"
                      variant={colourScheme.name}
                      name="playerColour"
                    >
                      Black
                    </Radio>
                    <Radio
                      value="random"
                      variant={colourScheme.name}
                      name="playerColour"
                    >
                      Randomise
                    </Radio>
                  </Stack>
                </RadioGroup>
              </Flex>
            </ModalBody>

            <ModalFooter>
              <MainButton
                // onClick={onClose}
                text={moves.length > 0 ? "Save" : "Start Match"}
                disabled={false}
                w="100%"
                mt="0"
                type="submit"
              />
            </ModalFooter>
          </Form>
        </ModalContent>
      </Modal>
      <GameScreen
        capturedPiecesTop={
          <CapturedPieces
            capturedPieces={capturedPieces}
            colour={colour}
            username={bot.name}
            src={bot.src}
            top={true}
          />
        }
        capturedPiecesBottom={
          <CapturedPieces
            username={player1Name}
            capturedPieces={capturedPieces}
            colour={colour === "white" ? "black" : "white"}
            src={avatarUrl}
            top={false}
          />
        }
        menuItems={<MenuItems />}
        endScreen={
          <CheckmateScreen
            whiteToMove={whiteToMove}
            isCheckmate={isCheckmate}
            isStalemate={isStalemate}
            setWhiteToMove={setWhiteToMove}
            setCapturedPieces={setCapturedPieces}
            setWhiteKingSquare={setWhiteKingSquare}
            setBlackKingSquare={setBlackKingSquare}
            setIsCheck={setIsCheck}
            setIsCheckmate={setIsCheckmate}
            setIsStalemate={setIsStalemate}
            setPromote={setPromote}
            setMoves={setMoves}
            setPieces={setPieces}
            setSelectedPiece={setSelectedPiece}
            analysisMode={analysisMode}
            setAnalysisMode={setAnalysisMode}
            setAnalysisMoveNumber={setAnalysisMoveNumber}
            moves={moves}
            resetBoard={resetBoard}
          />
        }
        promoteScreen={
          <PromoteScreen
            pieces={pieces}
            setPieces={setPieces}
            selectedPiece={selectedPiece}
            setSelectedPiece={setSelectedPiece}
            whiteToMove={whiteToMove}
            setWhiteToMove={setWhiteToMove}
            whiteKingSquare={whiteKingSquare}
            blackKingSquare={blackKingSquare}
            setIsCheck={setIsCheck}
            setIsCheckmate={setIsCheckmate}
            setIsStalemate={setIsStalemate}
            promote={promote}
            setPromote={setPromote}
            moves={moves}
            capturedPieces={capturedPieces}
            flipBoard={false}
            colour={colour}
            setColour={setColour}
          />
        }
        analysisSection={
          <Box h="100%">
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
    </>
  );
}
