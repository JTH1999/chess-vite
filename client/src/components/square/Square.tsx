import { Flex, Image, Img } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useEffect } from "react";
import { Move, Piece } from "../../../types";
import translucentCircle from "../../assets/TranslucentCircle.svg";
import translucentRing from "../../assets/TranslucentRing.svg";
import { calculateBotMove, handleClickLogic } from "./logic";

export default function Square({
    row,
    col,
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
    boardHeight,
    previousPieceMovedFrom,
    previousPieceMovedTo,
    colour,
    flipBoard,
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
    setAnalysisMoveNumber,
    matchType = "local",
}: {
    row: number;
    col: number;
    pieces: Piece[];
    selectedPiece: Piece | null;
    whiteToMove: boolean;
    capturedPieces: Piece[];
    whiteKingSquare: string;
    blackKingSquare: string;
    isCheck: boolean;
    promote: boolean;
    moves: Move[];
    analysisMode: boolean;
    boardHeight: number;
    previousPieceMovedFrom: string;
    previousPieceMovedTo: string;
    colour: string;
    flipBoard: boolean;
    setColour: Dispatch<SetStateAction<string>>;
    setPieces: Dispatch<SetStateAction<Piece[]>>;
    setSelectedPiece: Dispatch<SetStateAction<Piece | null>>;
    setWhiteToMove: Dispatch<SetStateAction<boolean>>;
    setCapturedPieces: Dispatch<SetStateAction<Piece[]>>;
    setWhiteKingSquare: Dispatch<SetStateAction<string>>;
    setBlackKingSquare: Dispatch<SetStateAction<string>>;
    setIsCheck: Dispatch<SetStateAction<boolean>>;
    setIsCheckmate: Dispatch<SetStateAction<boolean>>;
    setIsStalemate: Dispatch<SetStateAction<boolean>>;
    setPromote: Dispatch<SetStateAction<boolean>>;
    setMoves: Dispatch<SetStateAction<Move[]>>;
    setAnalysisMoveNumber: Dispatch<SetStateAction<number>>;
    matchType: string;
}) {
    let bgColor;

    const square = col.toString() + row.toString();
    let piece: Piece | null = null;
    const height = boardHeight / 8;

    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].currentRow === row && pieces[i].currentCol === col) {
            piece = pieces[i];
            break;
        }
    }

    function handleClick() {
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

    if (row % 2 === 0) {
        bgColor =
            col % 2 !== 0
                ? (selectedPiece !== null &&
                      selectedPiece.currentCol === col &&
                      selectedPiece.currentRow === row) ||
                  square === previousPieceMovedFrom ||
                  square === previousPieceMovedTo
                    ? "teal.200"
                    : "green.50"
                : (selectedPiece !== null &&
                      selectedPiece.currentCol === col &&
                      selectedPiece.currentRow === row) ||
                  square === previousPieceMovedFrom ||
                  square === previousPieceMovedTo
                ? "teal.400"
                : "green.400";
    } else {
        bgColor =
            col % 2 === 0
                ? (selectedPiece !== null &&
                      selectedPiece.currentCol === col &&
                      selectedPiece.currentRow === row) ||
                  square === previousPieceMovedFrom ||
                  square === previousPieceMovedTo
                    ? "teal.200"
                    : "green.50"
                : (selectedPiece !== null &&
                      selectedPiece.currentCol === col &&
                      selectedPiece.currentRow === row) ||
                  square === previousPieceMovedFrom ||
                  square === previousPieceMovedTo
                ? "teal.400"
                : "green.400";
    }

    return (
        <Flex
            alignItems="center"
            justify={"center"}
            bgColor={bgColor}
            onClick={handleClick}
            float={"left"}
            height={`${height}px`}
            width={`${height}px`}
            userSelect={"none"}
        >
            <Image
                src={piece ? piece.src : undefined}
                zIndex="4"
                h={`${height * 0.8}px`}
                cursor={"pointer"}
            />
            <Img
                src={
                    selectedPiece?.availableMoves.includes(square) && !piece
                        ? translucentCircle
                        : undefined
                }
                className="available-marker"
                w={`${height * 0.4}px`}
                zIndex={"20"}
                position="absolute"
            />
            <Img
                src={
                    selectedPiece?.availableMoves.includes(square) && piece
                        ? translucentRing
                        : undefined
                }
                className="available-marker-piece"
                w={`${height}px`}
                zIndex={"3"}
                position="absolute"
            />
        </Flex>
    );
}
