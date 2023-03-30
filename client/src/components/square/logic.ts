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
import { faMaximize } from "@fortawesome/free-solid-svg-icons";
import {
    blackBishopPST,
    blackKingPST,
    blackKnightPST,
    blackPawnPST,
    blackRookPST,
    queenPST,
    whiteBishopPST,
    whiteKingPST,
    whiteKnightPST,
    whitePawnPST,
    whiteRookPST,
} from "../../data/pieceSquareTables";

export async function handleClickLogic(
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

export function calculateBotMove(
    pieces: Piece[],
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
    botDifficulty: string,
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
    let count = 0;
    const depth = parseInt(botDifficulty);
    const minimaxResult = minimax(
        pieces,
        moves,
        depth,
        true,
        colour,
        count,
        -10000000,
        10000000
    );
    console.log("Count: " + minimaxResult.count.toString());

    const col = parseInt(minimaxResult.square[0]);
    const row = parseInt(minimaxResult.square[1]);

    let piece = null;

    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].currentRow === row && pieces[i].currentCol === col) {
            piece = pieces[i];
            break;
        }
    }

    handleClickLogic(
        row,
        col,
        minimaxResult.square,
        piece,
        pieces,
        minimaxResult.piece,
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

function evaluatePosition(pieces: Piece[], colour: string) {
    // White positive, black negative
    const pieceValues = {
        pawn: 100,
        knight: 320,
        bishop: 330,
        rook: 500,
        queen: 900,
        king: 20000,
    };

    let evaluation = 0;
    let pieceTable;

    for (const piece of pieces) {
        if (piece.type === "pawn" && piece.colour === "white") {
            pieceTable = whitePawnPST;
        } else if (piece.type === "pawn" && piece.colour === "black") {
            pieceTable = blackPawnPST;
        } else if (piece.type === "knight" && piece.colour === "white") {
            pieceTable = whiteKnightPST;
        } else if (piece.type === "knight" && piece.colour === "black") {
            pieceTable = blackKnightPST;
        } else if (piece.type === "bishop" && piece.colour === "white") {
            pieceTable = whiteBishopPST;
        } else if (piece.type === "bishop" && piece.colour === "black") {
            pieceTable = blackBishopPST;
        } else if (piece.type === "rook" && piece.colour === "white") {
            pieceTable = whiteRookPST;
        } else if (piece.type === "rook" && piece.colour === "black") {
            pieceTable = blackRookPST;
        } else if (piece.type === "queen") {
            pieceTable = queenPST;
        } else if (piece.type === "king" && piece.colour === "white") {
            pieceTable = whiteKingPST;
        } else if (piece.type === "king" && piece.colour === "black") {
            pieceTable = blackKingPST;
        }

        if (piece.currentRow != -1) {
            const pieceTableRow = piece.currentRow - 1;
            const pieceTableValue =
                pieceTable[pieceTableRow][piece.currentCol - 1];
            evaluation +=
                piece.colour === "white" ? pieceTableValue : -pieceTableValue;

            evaluation +=
                piece.colour === "white"
                    ? pieceValues[piece.type]
                    : -pieceValues[piece.type];
        }
    }

    return colour === "white" ? -evaluation : evaluation;
}

function minimax(
    pieces: Piece[],
    moves: Move[],
    depth: number,
    maximisingPlayer: boolean,
    playerColour: string,
    count: number,
    alpha: number,
    beta: number
) {
    // or game over - add in later
    if (depth === 0) {
        count++;
        return {
            value: evaluatePosition(pieces, playerColour),
            piece: null,
            square: "",
            count: count + 1,
            alpha: alpha,
            beta: beta,
        };
    }

    // player colour refers to the main player's colour, ie not the bot
    // colour refers to the current player in the minimax algorithm
    const colour = moves.length % 2 === 0 ? "white" : "black";
    const currentPlayerPieces = [];
    for (const piece of pieces) {
        if (piece.colour === colour) {
            currentPlayerPieces.push(piece);
        }
    }
    // need to get just the current player's pieces

    if (maximisingPlayer) {
        let maxEval: {
            value: number;
            piece: Piece | null;
            square: string;
            count: number;
            alpha: number;
            beta: number;
        } = {
            value: -10000000,
            piece: null,
            square: "null",
            count: count,
            alpha: alpha,
            beta: beta,
        };
        loop1: for (const piece of currentPlayerPieces.slice().reverse()) {
            loop2: for (const square of piece.availableMoves) {
                if (depth === 3) {
                    console.log(
                        piece.name +
                            "================================================================================================================"
                    );
                }
                const pieceCopy = JSON.parse(JSON.stringify(piece));
                const position = calculatePosition(
                    square,
                    pieces,
                    pieceCopy,
                    moves
                );
                const evaluation = minimax(
                    position.pieces,
                    position.moves,
                    depth - 1,
                    false,
                    playerColour,
                    count,
                    alpha,
                    beta
                );
                count = evaluation.count;

                if (evaluation.value > maxEval.value) {
                    maxEval.value = evaluation.value;
                    maxEval.piece = piece;
                    maxEval.square = square;
                }

                alpha = Math.max(alpha, evaluation.value);
                console.log(
                    `Depth ${depth} - piece: ${piece.name}, square: ${square}, evaluation: ${evaluation.value}, alpha: ${alpha}, beta: ${beta}`
                );
                if (beta <= alpha) {
                    console.log("here " + beta + " " + alpha);
                    break loop1;
                }
                // beta = evaluation.beta;
            }
        }
        maxEval.count = count;

        return maxEval;
    } else {
        let minEval: {
            value: number;
            piece: Piece | null;
            square: string;
            count: number;
            alpha: number;
            beta: number;
        } = {
            value: 10000000,
            piece: null,
            square: "null",
            count: count,
            alpha: alpha,
            beta: beta,
        };
        loop1: for (const piece of currentPlayerPieces) {
            loop2: for (const square of piece.availableMoves
                .slice()
                .reverse()) {
                const pieceCopy = JSON.parse(JSON.stringify(piece));
                const position = calculatePosition(
                    square,
                    pieces,
                    pieceCopy,
                    moves
                );

                const evaluation = minimax(
                    position.pieces,
                    position.moves,
                    depth - 1,
                    true,
                    playerColour,
                    count,
                    alpha,
                    beta
                );

                count = evaluation.count;

                if (evaluation.value < minEval.value) {
                    minEval.value = evaluation.value;
                    minEval.piece = piece;
                    minEval.square = square;
                }
                beta = Math.min(beta, evaluation.value);
                console.log(
                    `Depth ${depth} - piece: ${piece.name}, square: ${square}, evaluation: ${evaluation.value}, alpha: ${alpha}, beta: ${beta}`
                );
                if (beta <= alpha) {
                    break loop1;
                }
                // alpha = evaluation.alpha;
            }
        }
        minEval.count = count;
        return minEval;
    }
}

function calculatePosition(
    square: string,
    pieces: Piece[],
    selectedPiece: Piece,
    moves: Move[]
) {
    let piecesCopy = JSON.parse(JSON.stringify(pieces));
    let newWhiteKingSquare =
        pieces[WK1INDEX].currentCol.toString() +
        pieces[WK1INDEX].currentRow.toString();
    let newBlackKingSquare =
        pieces[BK1INDEX].currentCol.toString() +
        pieces[BK1INDEX].currentRow.toString();
    // let capturedPiecesCopy = capturedPieces.slice(0);
    let movesCopy = moves.slice(0);
    let capturedPiece = null;
    let playerColour = selectedPiece.colour;
    let oppositionColour = playerColour === "white" ? "black" : "white";

    let piece = null;

    for (let i = 0; i < pieces.length; i++) {
        if (
            pieces[i].currentRow === parseInt(square[1]) &&
            pieces[i].currentCol === parseInt(square[0])
        ) {
            piece = pieces[i];
            break;
        }
    }

    // castle
    if (
        selectedPiece.type === "king" &&
        !selectedPiece.moved &&
        square[1] === selectedPiece.currentRow.toString() &&
        (square[0] === (selectedPiece.currentCol + 2).toString() ||
            square[0] === (selectedPiece.currentCol - 2).toString())
    ) {
        piecesCopy[selectedPiece.index].currentCol = parseInt(square[0]);
        piecesCopy[selectedPiece.index].currentRow = parseInt(square[1]);
        piecesCopy[selectedPiece.index].moved = true;

        if (square === "71") {
            newWhiteKingSquare = square;
            piecesCopy[WR2INDEX].currentRow = parseInt(square[1]);
            piecesCopy[WR2INDEX].currentCol = parseInt(square[0]) - 1;
            piecesCopy[WR2INDEX].moved = true;
        } else if (square === "31") {
            newWhiteKingSquare = square;
            piecesCopy[WR1INDEX].currentRow = parseInt(square[1]);
            piecesCopy[WR1INDEX].currentCol = parseInt(square[0]) + 1;
            piecesCopy[WR1INDEX].moved = true;
        } else if (square === "78") {
            newBlackKingSquare = square;
            piecesCopy[BR2INDEX].currentRow = parseInt(square[1]);
            piecesCopy[BR2INDEX].currentCol = parseInt(square[0]) - 1;
            piecesCopy[BR2INDEX].moved = true;
        } else if (square === "38") {
            newBlackKingSquare = square;
            piecesCopy[BR1INDEX].currentRow = parseInt(square[1]);
            piecesCopy[BR1INDEX].currentCol = parseInt(square[0]) + 1;
            piecesCopy[BR1INDEX].moved = true;
        }

        movesCopy.push({
            movedPieceIndex: selectedPiece.index,
            pieces: piecesCopy,
            capturedPiece: null,
        });
    } else {
        // Not Castling
        piecesCopy[selectedPiece.index].currentCol = parseInt(square[0]);
        piecesCopy[selectedPiece.index].currentRow = parseInt(square[1]);
        piecesCopy[selectedPiece.index].moved = true;

        if (piece) {
            // capturePiece(piece, capturedPiecesCopy, piecesCopy);
            capturedPiece = piece;
            piecesCopy[piece.index].currentCol = -1;
            piecesCopy[piece.index].currentRow = -1;
        }

        // En Passant
        if (
            selectedPiece.type === "pawn" &&
            !piece &&
            square[0] !== selectedPiece.currentCol.toString()
        ) {
            // capturePiece(
            //     piecesCopy[moves[moves.length - 1].movedPieceIndex],
            //     capturedPiecesCopy,
            //     piecesCopy
            // );

            capturedPiece = piecesCopy[moves[moves.length - 1].movedPieceIndex];
            piecesCopy[moves[moves.length - 1].movedPieceIndex].currentCol = -1;
            piecesCopy[moves[moves.length - 1].movedPieceIndex].currentRow = -1;
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
        // if (selectedPiece.type === "pawn" && (row === 1 || row === 8)) {
        //     setPromote(true);
        //     setPieces(piecesCopy);
        //     setCapturedPieces(capturedPiecesCopy);
        //     setMoves(movesCopy);
        //     return;
        // }
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
    const calculateOppositionLegalMovesResult = calculateOppositionLegalMoves(
        piecesCopy,
        oppositionKingSquare,
        oppositionColour,
        [],
        movesCopy,
        inCheck
    );

    const isCheckmate = calculateOppositionLegalMovesResult.isCheckmate;
    const isStalemate = calculateOppositionLegalMovesResult.isStalemate;
    piecesCopy = calculateOppositionLegalMovesResult.pieces;

    return {
        isCheckmate: isCheckmate,
        isStalemate: isStalemate,
        pieces: piecesCopy,
        moves: movesCopy,
    };
}
