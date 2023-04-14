import { useEffect, useState } from "react";
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
  Stack,
  Switch,
  Text,
  useBreakpointValue,
  useDisclosure,
} from "@chakra-ui/react";
import { AnalysisSection } from "../components/AnalysisSection";
import { useSyncExternalStore } from "react";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { HamburgerIcon } from "@chakra-ui/icons";
import { useAuth } from "../hooks/useAuth";
import MainButton from "../components/MainButton";
import { useLoaderData, useNavigate } from "react-router-dom";
import { useColour } from "../hooks/useColour";
import AnalysisSectionMobile from "../components/AnalysisSectionMobile";
import { handleClickLogic } from "../components/board/square/logic";
import PromoteScreen from "../components/PromoteScreen";
import CheckmateScreen from "../components/CheckmateScreen";
import { GameScreen } from "../components/GameScreen";

export async function loader() {
  const tokenString = localStorage.getItem("token");
  const userToken = tokenString ? JSON.parse(tokenString) : null;

  const avatarResponse = await fetch(
    import.meta.env.VITE_CHESS_API_ENDPOINT + "users/avatar",
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  if (!avatarResponse.ok) {
    return null;
  }
  const avatar = await avatarResponse.blob();

  return URL.createObjectURL(avatar);
}

export default function LocalMatchRoute() {
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
  const [player2Name, setPlayer2Name] = useState("Player 2");
  const [flipBoard, setFlipBoard] = useState(true);
  const [colour, setColour] = useState("white");
  const { colourScheme } = useColour();

  const screenHeight = height - 30;
  const screenWidth = width - 30;
  const possibleBoardHeight = screenHeight - 120;
  const boardHeight = useBreakpointValue({
    base: screenWidth,
    xs: screenWidth,
    sm: screenWidth,
    md: Math.min(600, possibleBoardHeight),
    lg: Math.min(700, possibleBoardHeight),
    xl: Math.min(800, possibleBoardHeight),
    xxl: Math.min(900, possibleBoardHeight),
  })!;

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
      flipBoard,
      false,
      null,
      () => {},
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
  }

  function MenuItems() {
    return (
      <>
        <MenuItem onClick={resetBoard}>New Game</MenuItem>
        <MenuItem>Save</MenuItem>
        <MenuItem onClick={onOpen}>Options</MenuItem>
      </>
    );
  }

  console.log(colour);

  return (
    <>
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent bgColor={colourScheme.body} p="20px">
          <ModalHeader textAlign={"center"}>Configure Local Match</ModalHeader>
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
              <Text fontSize={"18px"} pb="4px">
                Player 2
              </Text>
              <Input
                mb="20px"
                name="player2Input"
                value={player2Name}
                onChange={(e) => setPlayer2Name(e.target.value)}
              />

              <Text fontSize={"18px"} pb="8px">
                Select Player 1 Colour
              </Text>
              <RadioGroup
                mb="20px"
                isDisabled={moves.length > 0}
                onChange={setColours}
                defaultValue="white"
              >
                <Stack direction="row" spacing="20px">
                  <Radio value="white" variant={colourScheme.name}>
                    White
                  </Radio>
                  <Radio value="black" variant={colourScheme.name}>
                    Black
                  </Radio>
                  <Radio value="random" variant={colourScheme.name}>
                    Randomise
                  </Radio>
                </Stack>
              </RadioGroup>
              <Flex alignItems={"center"}>
                <Text fontSize={"18px"} pr="20px">
                  Flip Board
                </Text>
                <Switch
                  isChecked={flipBoard}
                  variant={colourScheme.name}
                  onChange={(e) => setFlipBoard(!flipBoard)}
                />
              </Flex>
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
      <GameScreen
        capturedPiecesTop={
          <CapturedPieces
            capturedPieces={capturedPieces}
            colour={colour}
            username={colour === player1Colour ? player2Name : player1Name}
            top={true}
            src={colour === player1Colour ? "" : avatarUrl}
          />
        }
        capturedPiecesBottom={
          <CapturedPieces
            username={colour === player1Colour ? player1Name : player2Name}
            capturedPieces={capturedPieces}
            colour={colour === "white" ? "black" : "white"}
            top={false}
            src={colour === player1Colour ? avatarUrl : null}
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
            flipBoard={flipBoard}
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
