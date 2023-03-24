import { Dispatch, SetStateAction } from "react";
import { Move, Piece } from "../../../types";

import {
    capturePiece,
    checkIfCheck,
    checkIfCheckmate,
    calculateIfMoveLegal,
    calculateSelectedPieceLegalMoves,
    calculateAllAvailableMoves,
    calculateOppositionLegalMoves,
} from "./helperFunctions";

import {
    WR1INDEX,
    WR2INDEX,
    BR1INDEX,
    BR2INDEX,
    WK1INDEX,
    BK1INDEX,
} from "../../data/pieceIndexes";

export function handleClickLogic(
    row: number,
    col: number,
    square: string,
    piece: Piece | null,
    pieces: Piece[],
    selectedPiece: Piece | null,
    whiteToMove: boolean,
    capturedPieces: Piece[],
    whiteKingSquare: string,
    blackKingSquare: string,
    isCheck: boolean,
    promote: boolean,
    moves: Move[],
    analysisMode: boolean,
    colour: string,
    flipBoard: boolean,
    setColour: Dispatch<SetStateAction<string>>,
    setPieces: Dispatch<SetStateAction<Piece[]>>,
    setSelectedPiece: Dispatch<SetStateAction<Piece | null>>,
    setWhiteToMove: Dispatch<SetStateAction<boolean>>,
    setCapturedPieces: Dispatch<SetStateAction<Piece[]>>,
    setWhiteKingSquare: Dispatch<SetStateAction<string>>,
    setBlackKingSquare: Dispatch<SetStateAction<string>>,
    setIsCheck: Dispatch<SetStateAction<boolean>>,
    setIsCheckmate: Dispatch<SetStateAction<boolean>>,
    setIsStalemate: Dispatch<SetStateAction<boolean>>,
    setPromote: Dispatch<SetStateAction<boolean>>,
    setMoves: Dispatch<SetStateAction<Move[]>>,
    setAnalysisMoveNumber: Dispatch<SetStateAction<number>>
) {
    if (analysisMode) {
        return;
    }
    // if there is a selected piece
    if (selectedPiece) {
        if (promote) {
            return;
        }

        // Clicking on another of your pieces switches the selected piece
        if (
            piece?.colour === selectedPiece.colour &&
            piece?.name !== selectedPiece.name
        ) {
            let selectedPieceCopy = { ...piece };

            setSelectedPiece(selectedPieceCopy);
            return;
        }

        if (selectedPiece.availableMoves.includes(square)) {
            let piecesCopy = JSON.parse(JSON.stringify(pieces));
            let newWhiteKingSquare = whiteKingSquare;
            let newBlackKingSquare = blackKingSquare;
            let capturedPiecesCopy = capturedPieces.slice(0);
            let movesCopy = moves.slice(0);
            let capturedPiece = null;
            let playerColour = selectedPiece.colour;
            let oppositionColour = playerColour === "white" ? "black" : "white";

            // castle
            if (
                selectedPiece.type === "king" &&
                !selectedPiece.moved &&
                square[1] === selectedPiece.currentRow.toString() &&
                (square[0] === (selectedPiece.currentCol + 2).toString() ||
                    square[0] === (selectedPiece.currentCol - 2).toString())
            ) {
                piecesCopy[selectedPiece.index].currentCol = col;
                piecesCopy[selectedPiece.index].currentRow = row;
                piecesCopy[selectedPiece.index].moved = true;

                if (square === "71") {
                    newWhiteKingSquare = square;
                    piecesCopy[WR2INDEX].currentRow = row;
                    piecesCopy[WR2INDEX].currentCol = col - 1;
                    piecesCopy[WR2INDEX].moved = true;
                } else if (square === "31") {
                    newWhiteKingSquare = square;
                    piecesCopy[WR1INDEX].currentRow = row;
                    piecesCopy[WR1INDEX].currentCol = col + 1;
                    piecesCopy[WR1INDEX].moved = true;
                } else if (square === "78") {
                    newBlackKingSquare = square;
                    piecesCopy[BR2INDEX].currentRow = row;
                    piecesCopy[BR2INDEX].currentCol = col - 1;
                    piecesCopy[BR2INDEX].moved = true;
                } else if (square === "38") {
                    newBlackKingSquare = square;
                    piecesCopy[BR1INDEX].currentRow = row;
                    piecesCopy[BR1INDEX].currentCol = col + 1;
                    piecesCopy[BR1INDEX].moved = true;
                }

                movesCopy.push({
                    movedPieceIndex: selectedPiece.index,
                    pieces: piecesCopy,
                    capturedPiece: null,
                });
            } else {
                // Not Castling
                piecesCopy[selectedPiece.index].currentCol = col;
                piecesCopy[selectedPiece.index].currentRow = row;
                piecesCopy[selectedPiece.index].moved = true;

                if (piece) {
                    capturePiece(piece, capturedPiecesCopy, piecesCopy);
                    capturedPiece = piece;
                }

                // En Passant
                if (
                    selectedPiece.type === "pawn" &&
                    !piece &&
                    square[0] !== selectedPiece.currentCol.toString()
                ) {
                    capturePiece(
                        piecesCopy[moves[moves.length - 1].movedPieceIndex],
                        capturedPiecesCopy,
                        piecesCopy
                    );

                    capturedPiece =
                        piecesCopy[moves[moves.length - 1].movedPieceIndex];
                }

                if (selectedPiece.type === "king") {
                    selectedPiece.colour === "white"
                        ? (newWhiteKingSquare = square)
                        : (newBlackKingSquare = square);
                }

                movesCopy.push({
                    movedPieceIndex: selectedPiece.index,
                    pieces: piecesCopy,
                    capturedPiece: capturedPiece,
                });

                // if promoting pawn, set promote to true and return,
                // following logic then handled by other function
                if (selectedPiece.type === "pawn" && (row === 1 || row === 8)) {
                    setPromote(true);
                    setPieces(piecesCopy);
                    setCapturedPieces(capturedPiecesCopy);
                    setMoves(movesCopy);
                    return;
                }
            }

            const oppositionKingSquare =
                selectedPiece.colour === "white"
                    ? newBlackKingSquare
                    : newWhiteKingSquare;

            const calculateAllAvailableMovesResult = calculateAllAvailableMoves(
                piecesCopy,
                selectedPiece.colour,
                oppositionKingSquare,
                movesCopy
            );

            piecesCopy = calculateAllAvailableMovesResult.pieces;
            const inCheck = calculateAllAvailableMovesResult.inCheck;

            // for each of opposition player's pieces, calculate legal moves.
            const calculateOppositionLegalMovesResult =
                calculateOppositionLegalMoves(
                    piecesCopy,
                    oppositionKingSquare,
                    oppositionColour,
                    capturedPiecesCopy,
                    movesCopy,
                    inCheck
                );

            const isCheckmate = calculateOppositionLegalMovesResult.isCheckmate;
            const isStalemate = calculateOppositionLegalMovesResult.isStalemate;
            piecesCopy = calculateOppositionLegalMovesResult.pieces;

            if (selectedPiece.type === "king") {
                selectedPiece.colour === "white"
                    ? setWhiteKingSquare(square)
                    : setBlackKingSquare(square);
            }
            setIsCheck(isCheck);
            setIsCheckmate(isCheckmate);
            setIsStalemate(isStalemate);
            setPieces(piecesCopy);
            setMoves(movesCopy);
            setSelectedPiece(null);
            setWhiteToMove(!whiteToMove);
            setCapturedPieces(capturedPiecesCopy);
            setAnalysisMoveNumber(movesCopy.length - 1);
            if (flipBoard) {
                setColour(colour === "white" ? "black" : "white");
            }
        } else if (
            selectedPiece.currentCol.toString() +
                selectedPiece.currentRow.toString() ===
            square
        ) {
            setSelectedPiece(null);
        }
        // if no piece selected yet
    } else if (piece) {
        if (
            (whiteToMove && piece.colour === "white") ||
            (!whiteToMove && piece.colour === "black")
        ) {
            let selectedPieceCopy = { ...piece };
            setSelectedPiece(selectedPieceCopy);
        }
    }
}
