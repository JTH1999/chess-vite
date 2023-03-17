import { Flex, Image, Img } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { Move, Piece } from "../../../types";
import translucentCircle from "../../assets/TranslucentCircle.svg";
import translucentRing from "../../assets/TranslucentRing.svg";
import { handleClickLogic } from "./logic";

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
}) {
    let bgColor;
    if (row % 2 === 0) {
        bgColor = col % 2 !== 0 ? "rgb(234, 248, 232)" : "rgb(101, 180, 90)";
    } else {
        bgColor = col % 2 === 0 ? "rgb(234, 248, 232)" : "rgb(101, 180, 90)";
    }

    const square = col.toString() + row.toString();
    let piece: Piece | null = null;

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
                ? selectedPiece !== null &&
                  selectedPiece.currentCol === col &&
                  selectedPiece.currentRow === row
                    ? "teal.100"
                    : "green.50"
                : selectedPiece !== null &&
                  selectedPiece.currentCol === col &&
                  selectedPiece.currentRow === row
                ? "teal.400"
                : "green.400";
    } else {
        bgColor =
            col % 2 === 0
                ? selectedPiece !== null &&
                  selectedPiece.currentCol === col &&
                  selectedPiece.currentRow === row
                    ? "teal.100"
                    : "green.50"
                : selectedPiece !== null &&
                  selectedPiece.currentCol === col &&
                  selectedPiece.currentRow === row
                ? "teal.400"
                : "green.400";
    }

    return (
        <Flex
            className={
                selectedPiece !== null &&
                selectedPiece.currentCol.toString() +
                    selectedPiece.currentRow.toString() ===
                    square
                    ? "square selected"
                    : "square"
            }
            alignItems="center"
            justify={"center"}
            bgColor={bgColor}
            onClick={handleClick}
            // border="1px solid #999"
            float={"left"}
            height="100px"
            width="100px"
            marginRight={"-1px"}
            marginTop="-1px"
            userSelect={"none"}
        >
            <Image
                src={piece ? piece.src : undefined}
                zIndex="4"
                h="75px"
                cursor={"pointer"}
            />
            <Img
                src={
                    selectedPiece?.availableMoves.includes(square) && !piece
                        ? translucentCircle
                        : undefined
                }
                className="available-marker"
                w="40px"
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
                w="100px"
                zIndex={"3"}
                position="absolute"
            />
        </Flex>
    );
}
