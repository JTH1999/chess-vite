import whiteCheckmate from "../assets/WhiteCheckmate.png";
import blackCheckmate from "../assets/BlackCheckmate.png";
import stalematePNG from "../assets/Stalemate.png";
import { newGamePieces } from "../data/newGamePieces";
import { Move, Piece } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { Box, Flex, Heading, IconButton, Image, Text } from "@chakra-ui/react";
import MainButton from "./MainButton";
import { useColour } from "../hooks/useColour";
import { CloseIcon } from "@chakra-ui/icons";

export default function CheckmateScreen({
  isCheckmate,
  isStalemate,
  whiteToMove,
  analysisMode,
  moves,
  setWhiteToMove,
  setCapturedPieces,
  setWhiteKingSquare,
  setBlackKingSquare,
  setIsCheck,
  setIsCheckmate,
  setIsStalemate,
  setPromote,
  setMoves,
  setPieces,
  setSelectedPiece,
  setAnalysisMode,
  setAnalysisMoveNumber,
  resetBoard,
}: {
  isCheckmate: boolean;
  isStalemate: boolean;
  analysisMode: boolean;
  whiteToMove: boolean;
  moves: Move[];
  setWhiteToMove: Dispatch<SetStateAction<boolean>>;
  setCapturedPieces: Dispatch<SetStateAction<Piece[]>>;
  setWhiteKingSquare: Dispatch<SetStateAction<string>>;
  setBlackKingSquare: Dispatch<SetStateAction<string>>;
  setIsCheck: Dispatch<SetStateAction<boolean>>;
  setIsCheckmate: Dispatch<SetStateAction<boolean>>;
  setIsStalemate: Dispatch<SetStateAction<boolean>>;
  setPromote: Dispatch<SetStateAction<boolean>>;
  setMoves: Dispatch<SetStateAction<Move[]>>;
  setPieces: Dispatch<SetStateAction<Piece[]>>;
  setSelectedPiece: Dispatch<SetStateAction<Piece | null>>;
  setAnalysisMode: Dispatch<SetStateAction<boolean>>;
  setAnalysisMoveNumber: Dispatch<SetStateAction<number>>;
  resetBoard: () => void;
}) {
  const { colourScheme } = useColour();

  function enterAnalysisMode() {
    setAnalysisMode(true);
    setAnalysisMoveNumber(0);
    setPieces(moves[0].pieces);
  }
  return (
    <Box
      display={
        (isCheckmate && !analysisMode) || (isStalemate && !analysisMode)
          ? "flex"
          : "none"
      }
      flexDirection="column"
      justifyContent={"center"}
      alignItems={"center"}
      zIndex="5"
      bgColor={colourScheme.body}
      p="20px"
      pb="30px"
      borderRadius="16px"
      boxShadow={"0px 0px 20px 5px rgba(0, 0, 0, 0.2);"}
      width={"350px"}
      position="absolute"
    >
      <Flex justify="end" w="100%" mb="-20px">
        <IconButton
          onClick={() => setAnalysisMode(true)}
          aria-label="Close"
          bgColor="transparent"
          icon={<CloseIcon />}
        />
      </Flex>

      <Heading fontSize={"30px"} fontWeight="bold" margin={"10px"}>
        {isStalemate ? "Stalemate" : whiteToMove ? "Black Wins" : "White Wins"}
      </Heading>
      <Text
        className="checkmate-text"
        fontSize={"20px"}
        fontWeight="700"
        margin={"10px"}
        mt="0"
      >
        {isCheckmate ? "Checkmate" : ""}
      </Text>
      <Image
        src={
          isStalemate
            ? stalematePNG
            : whiteToMove
            ? blackCheckmate
            : whiteCheckmate
        }
        className="checkmate-screen-pieces"
        mt={"20px"}
      />
      <MainButton
        onClick={resetBoard}
        text="New Game"
        mt="20px"
        disabled={false}
        w="100%"
      />

      <MainButton
        onClick={enterAnalysisMode}
        text="Analyse"
        mt="20px"
        disabled={false}
        w="100%"
      />
    </Box>
  );
}
