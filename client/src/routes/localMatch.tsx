import { useState } from "react";
import Board from "../components/Board";
import { newGamePieces } from "../data/newGamePieces";
import AnalysisSection from "../components/AnalysisSection";
import CapturedPieces from "../components/CapturedPieces";
import { Move, Piece } from "../../types";
import { Box, chakra, Flex, Text } from "@chakra-ui/react";
import { AnalysisSectionV2 } from "../components/AnalysisSectionV2";

export default function LocalMatchRoute() {
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

    const boardHeight = 800;

    return (
        <Flex p="60px" pt="20px" direction="column" alignItems={"center"}>
            <Text fontSize={"18px"}>
                {whiteToMove ? "White" : "Black"} to move
                {isCheck ? " - check" : ""}
            </Text>
            <Flex>
                <Flex direction="column">
                    <CapturedPieces
                        capturedPieces={capturedPieces}
                        colour="white"
                    />
                    <Flex>
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
                        />
                        <AnalysisSectionV2
                            moves={moves}
                            pieces={pieces}
                            setPieces={setPieces}
                            setAnalysisMode={setAnalysisMode}
                            analysisMode={analysisMode}
                            analysisMoveNumber={analysisMoveNumber}
                            setAnalysisMoveNumber={setAnalysisMoveNumber}
                        />
                    </Flex>

                    <CapturedPieces
                        capturedPieces={capturedPieces}
                        colour="black"
                    />
                </Flex>
            </Flex>
        </Flex>
    );
}
