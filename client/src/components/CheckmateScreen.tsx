import whiteCheckmate from "../assets/WhiteCheckmate.png";
import blackCheckmate from "../assets/BlackCheckmate.png";
import stalematePNG from "../assets/Stalemate.png";
import { newGamePieces } from "../data/newGamePieces";
import { Move, Piece } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { Box, Heading, Image, Text } from "@chakra-ui/react";
import MainButton from "./MainButton";

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
}) {
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
            bgColor={"white"}
            p="20px"
            pb="30px"
            borderRadius="16px"
            boxShadow={"0px 0px 20px 5px rgba(0, 0, 0, 0.2);"}
            width={"350px"}
            position="absolute"
            color="black"
            className="checkmate-screen"
        >
            <Heading
                className="checkmate-winner-text"
                fontSize={"30px"}
                fontWeight="bold"
                margin={"10px"}
            >
                {isStalemate
                    ? "Stalemate"
                    : whiteToMove
                    ? "Black Wins"
                    : "White Wins"}
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
            <MainButton onClick={resetBoard} text="New Game" />

            <MainButton onClick={enterAnalysisMode} text="Analyse" />
        </Box>
    );
}
