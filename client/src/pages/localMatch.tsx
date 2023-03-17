import { useState } from "react";
import Board from "../components/Board";
import { newGamePieces } from "../data/newGamePieces";
import AnalysisSection from "../components/AnalysisSection";
import CapturedPieces from "../components/CapturedPieces";
import { Move, Piece } from "../../types";
import { Box, chakra } from "@chakra-ui/react";

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
    const [analysisMoveNumber, setAnalysisMoveNumber] = useState<number>(1);

    return (
        <Box>
            <p className="toMove-text">
                {whiteToMove ? "White" : "Black"} to move
                {isCheck ? " - check" : ""}
            </p>
            <CapturedPieces capturedPieces={capturedPieces} colour="white" />
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
            <CapturedPieces capturedPieces={capturedPieces} colour="black" />
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
    );
}
