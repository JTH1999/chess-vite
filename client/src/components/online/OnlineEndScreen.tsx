import whiteCheckmate from "../../assets/WhiteCheckmate.png";
import blackCheckmate from "../../assets/BlackCheckmate.png";
import stalematePNG from "../../assets/Stalemate.png";
import { newGamePieces } from "../../data/newGamePieces";
import { Move, Piece } from "../../../types";
import { Dispatch, SetStateAction } from "react";
import { Box, Heading, Image, Text } from "@chakra-ui/react";
import MainButton from "../MainButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

export default function OnlineEndScreen({
    status,
    winner,
    analysisMode,
    whiteToMove,
}: // moves,
// setWhiteToMove,
// setCapturedPieces,
// setWhiteKingSquare,
// setBlackKingSquare,
// setIsCheck,
// setIsCheckmate,
// setIsStalemate,
// setPromote,
// setMoves,
// setPieces,
// setSelectedPiece,
// setAnalysisMode,
// setAnalysisMoveNumber,
{
    status: string;
    winner: string;
    analysisMode: boolean;
    whiteToMove: boolean;

    // setWhiteToMove: Dispatch<SetStateAction<boolean>>;
    // setCapturedPieces: Dispatch<SetStateAction<Piece[]>>;
    // setWhiteKingSquare: Dispatch<SetStateAction<string>>;
    // setBlackKingSquare: Dispatch<SetStateAction<string>>;
    // setIsCheck: Dispatch<SetStateAction<boolean>>;
    // setIsCheckmate: Dispatch<SetStateAction<boolean>>;
    // setIsStalemate: Dispatch<SetStateAction<boolean>>;
    // setPromote: Dispatch<SetStateAction<boolean>>;
    // setMoves: Dispatch<SetStateAction<Move[]>>;
    // setPieces: Dispatch<SetStateAction<Piece[]>>;
    // setSelectedPiece: Dispatch<SetStateAction<Piece | null>>;
    // setAnalysisMode: Dispatch<SetStateAction<boolean>>;
    // setAnalysisMoveNumber: Dispatch<SetStateAction<number>>;
}) {
    const navigate = useNavigate();
    const auth = useAuth();
    const username = auth.user.username;

    // function enterAnalysisMode() {
    //     setAnalysisMode(true);
    //     setAnalysisMoveNumber(1);
    //     setPieces(moves[0].pieces);
    // }
    return (
        <Box
            display={
                (status === "checkmate" && !analysisMode) ||
                (status === "stalemate" && !analysisMode)
                    ? "flex"
                    : "none"
            }
            flexDirection="column"
            justifyContent={"center"}
            alignItems={"center"}
            zIndex="5"
            bgColor={"gray.900"}
            p="40px"
            pb="30px"
            borderRadius="16px"
            boxShadow={"0px 0px 20px 5px rgba(0, 0, 0, 0.2);"}
            width={"350px"}
            position="absolute"
            color="white"
            className="checkmate-screen"
        >
            <Heading
                className="checkmate-winner-text"
                fontSize={"30px"}
                fontWeight="bold"
                margin={"10px"}
            >
                {status === "stalemate" ? "Stalemate" : `${winner} Wins!`}
            </Heading>
            <Text
                className="checkmate-text"
                fontSize={"20px"}
                fontWeight="700"
                margin={"10px"}
                mt="0"
            >
                {status === "checkmate" ? "Checkmate" : ""}
            </Text>
            <Image
                src={
                    status === "stalemate"
                        ? stalematePNG
                        : whiteToMove
                        ? blackCheckmate
                        : whiteCheckmate
                }
                className="checkmate-screen-pieces"
                w="100%"
                mt={"20px"}
            />
            <MainButton onClick={() => navigate("/")} text="Home" />

            <MainButton onClick={null} text="Analyse" />
        </Box>
    );
}
