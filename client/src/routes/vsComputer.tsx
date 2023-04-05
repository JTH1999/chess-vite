import { useEffect, useLayoutEffect, useState } from "react";
import Board from "../components/Board";
import { newGamePieces, debugPieces } from "../data/newGamePieces";
import AnalysisSection from "../deprecated/AnalysisSection";
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
  Stack,
  Switch,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { AnalysisSectionV2 } from "../components/AnalysisSection";
import { useSyncExternalStore } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "../hooks/useAuth";
import MainButton from "../components/MainButton";
import { useLoaderData, useNavigate } from "react-router-dom";
import optimusPrime from "../assets/botAvatars/optimusPrimeAvatar.png";
import walle from "../assets/botAvatars/walleAvatar.png";
import r2d2 from "../assets/botAvatars/r2d2Avatar.png";
import terminator from "../assets/botAvatars/terminatorAvatar.png";
import { calculateBotMove } from "../components/square/logic";
import { useColour } from "../hooks/useColour";

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

  useEffect(() => {
    onOpen();
  }, []);

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

  function setColours(value: string) {
    if (value === "white" || value === "black") {
      setPlayer1Colour(value);
    } else if (value === "random") {
      const rand = Math.random();
      setPlayer1Colour(rand > 0.5 ? "white" : "black");
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

  useEffect(() => {
    if (
      (!whiteToMove && colour === "white") ||
      (whiteToMove && colour === "black")
    )
      setBotToMove(true);
  }, [whiteToMove]);

  useEffect(() => {
    if (botToMove && !isCheckmate && !isStalemate) {
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
      setBotToMove(false);
    }
  }, [botToMove]);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor={colourScheme.body} p="20px">
          <ModalHeader textAlign={"center"}>Configure Match</ModalHeader>
          <ModalCloseButton onClick={onClose} />
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
                  <Radio value="1">Easy</Radio>
                  <Radio value="2">Medium</Radio>
                  <Radio value="3">Hard</Radio>
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
                  <Radio value="white">White</Radio>
                  <Radio value="black">Black</Radio>
                  <Radio value="random">Randomise</Radio>
                </Stack>
              </RadioGroup>
            </Flex>
          </ModalBody>

          <ModalFooter>
            <MainButton
              onClick={onClose}
              text={moves.length > 0 ? "Save" : "Start Match"}
              disabled={false}
              w="100%"
              mt="0"
            />
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Flex justify={"center"} pt="8px">
        <Flex flexDirection={"column"}>
          <Flex h={`${screenHeight}px`} maxH={`${screenHeight}px`}>
            <Flex flexDirection={"column"}>
              <Flex justify={"space-between"} pb="10px">
                <CapturedPieces
                  capturedPieces={capturedPieces}
                  colour={colour}
                  username={bot.name}
                  src={bot.src}
                  top={true}
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
                      borderRadius={"8px"}
                      borderWidth="2px"
                      borderColor={colourScheme.border}
                      bgColor={colourScheme.darker}
                    />

                    <MenuList zIndex={"20"}>
                      <MenuItem>New Game</MenuItem>
                      <MenuItem>Save</MenuItem>
                      <MenuItem onClick={onOpen}>Options</MenuItem>
                    </MenuList>
                  </Menu>
                </Flex>
              </Flex>

              <Board
                pieces={pieces}
                setPieces={setPieces}
                selectedPiece={selectedPiece}
                setSelectedPiece={setSelectedPiece}
                whiteToMove={whiteToMove}
                setWhiteToMove={setWhiteToMove}
                capturedPieces={capturedPieces}
                setCapturedPieces={setCapturedPieces}
                whiteKingSquare={whiteKingSquare}
                setWhiteKingSquare={setWhiteKingSquare}
                blackKingSquare={blackKingSquare}
                setBlackKingSquare={setBlackKingSquare}
                isCheck={isCheck}
                setIsCheck={setIsCheck}
                isCheckmate={isCheckmate}
                setIsCheckmate={setIsCheckmate}
                isStalemate={isStalemate}
                setIsStalemate={setIsStalemate}
                promote={promote}
                setPromote={setPromote}
                moves={moves}
                setMoves={setMoves}
                analysisMode={analysisMode}
                setAnalysisMode={setAnalysisMode}
                setAnalysisMoveNumber={setAnalysisMoveNumber}
                boardHeight={boardHeight}
                colour={colour}
                previousPieceMovedFrom={previousPieceMovedFrom}
                previousPieceMovedTo={previousPieceMovedTo}
                flipBoard={false}
                setColour={setColour}
              />
              <Flex justify={"space-between"} pt="10px">
                <CapturedPieces
                  username={player1Name}
                  capturedPieces={capturedPieces}
                  colour={colour === "white" ? "black" : "white"}
                  src={avatarUrl}
                  top={false}
                />
              </Flex>
            </Flex>

            <Flex
              w="400px"
              flexDirection={"column"}
              ml="50px"
              height={"inherit"}
            >
              <Box h="100%">
                <AnalysisSectionV2
                  moves={moves}
                  pieces={pieces}
                  setPieces={setPieces}
                  setAnalysisMode={setAnalysisMode}
                  analysisMode={analysisMode}
                  analysisMoveNumber={analysisMoveNumber}
                  setAnalysisMoveNumber={setAnalysisMoveNumber}
                />
              </Box>
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
