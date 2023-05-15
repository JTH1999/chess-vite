"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkAvailableMoves = exports.checkSquareForPiece = exports.checkCastleValid = exports.checkIfCheckmate = exports.checkIfCheck = exports.calculateSelectedPieceLegalMoves = exports.calculateOppositionLegalMoves = exports.calculateAllAvailableMoves = exports.calculateIfMoveLegal = exports.capturePiece = void 0;
const pieceIndexes = require("../data/pieceIndexes");
const WR1INDEX = pieceIndexes.WR1INDEX;
const WR2INDEX = pieceIndexes.WR2INDEX;
const BR1INDEX = pieceIndexes.BR1INDEX;
const BR2INDEX = pieceIndexes.BR2INDEX;
const WK1INDEX = pieceIndexes.WK1INDEX;
const BK1INDEX = pieceIndexes.BK1INDEX;
// returns index of captured piece
function capturePiece(piece, capturedPiecesCopy, piecesCopy) {
    capturedPiecesCopy.push(piece);
    piecesCopy[piece.index].currentCol = -1;
    piecesCopy[piece.index].currentRow = -1;
    return piece.index;
}
exports.capturePiece = capturePiece;
// Calculate every piece's available moves - return true if no check, false if check
function calculateIfMoveLegal(pieces, oppositionPieces, movingPlayerKingSquare, moves) {
    for (let i = 0; i < oppositionPieces.length; i++) {
        oppositionPieces[i].availableMoves = checkAvailableMoves(oppositionPieces[i], pieces, moves);
        if (oppositionPieces[i].availableMoves.includes(movingPlayerKingSquare)) {
            return false;
        }
    }
    return true;
}
exports.calculateIfMoveLegal = calculateIfMoveLegal;
// Check possible moves for all pieces.
// Returns an array [pieces, inCheck]
function calculateAllAvailableMoves(pieces, currentPlayerColour, oppositionKingSquare, moves) {
    let inCheck = false;
    for (let i = 0; i < pieces.length; i++) {
        pieces[i].availableMoves = checkAvailableMoves(pieces[i], pieces, moves);
        if (pieces[i].colour === currentPlayerColour &&
            pieces[i].availableMoves.includes(oppositionKingSquare)) {
            inCheck = true;
        }
    }
    return { pieces: pieces, inCheck: inCheck };
}
exports.calculateAllAvailableMoves = calculateAllAvailableMoves;
function calculateOppositionLegalMoves(pieces, oppositionKingSquare, oppositionColour, capturedPieces, moves, inCheck) {
    let hasLegalMoves = false;
    let isCheckmate = false;
    let isStalemate = false;
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].colour !== oppositionColour)
            continue;
        const legalMoves = calculateSelectedPieceLegalMoves(pieces[i], pieces, capturedPieces, moves, inCheck, oppositionKingSquare);
        if (legalMoves.length > 0) {
            hasLegalMoves = true;
        }
        pieces[i].availableMoves = legalMoves;
    }
    if (!hasLegalMoves && inCheck) {
        isCheckmate = true;
    }
    else if (!hasLegalMoves) {
        isStalemate = true;
    }
    return {
        pieces: pieces,
        isCheckmate: isCheckmate,
        isStalemate: isStalemate,
    };
}
exports.calculateOppositionLegalMoves = calculateOppositionLegalMoves;
function calculateSelectedPieceLegalMoves(selectedPiece, pieces, capturedPieces, moves, check, originalPlayerKingSquare) {
    let legalMoves = [];
    let oppositionPieces = [];
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].colour !== selectedPiece.colour) {
            oppositionPieces.push(pieces[i]);
        }
    }
    for (let i = 0; i < selectedPiece.availableMoves.length; i++) {
        const square = selectedPiece.availableMoves[i];
        let piecesCopy = JSON.parse(JSON.stringify(pieces));
        let oppositionPiecesCopy = JSON.parse(JSON.stringify(oppositionPieces));
        let movesCopy;
        let playerKingSquare = originalPlayerKingSquare;
        let capturedPiecesCopy = capturedPieces.slice(0);
        piecesCopy[selectedPiece.index].currentRow = parseInt(selectedPiece.availableMoves[i][1]);
        piecesCopy[selectedPiece.index].currentCol = parseInt(selectedPiece.availableMoves[i][0]);
        // castle
        if (selectedPiece.type === "king" &&
            !selectedPiece.moved &&
            square[1] ===
                piecesCopy[selectedPiece.index].currentRow.toString() &&
            (square[0] === (selectedPiece.currentCol + 2).toString() ||
                square[0] === (selectedPiece.currentCol - 2).toString())) {
            if (checkCastleValid(check, square, piecesCopy, moves, selectedPiece.index, playerKingSquare, oppositionPieces)) {
                legalMoves.push(square);
            }
        }
        else {
            // Not Castling
            let piece = checkSquareForPiece(piecesCopy, square, selectedPiece);
            if (piece) {
                const capturedPieceIndex = capturePiece(piece, capturedPiecesCopy, piecesCopy);
                const opPieceIndex = oppositionPiecesCopy.findIndex((piece) => piece.index === capturedPieceIndex);
                oppositionPiecesCopy[opPieceIndex] =
                    piecesCopy[capturedPieceIndex];
            }
            // En Passant
            if (selectedPiece.type === "pawn" &&
                !piece &&
                square[0] !== selectedPiece.currentCol.toString()) {
                const capturedPieceIndex = capturePiece(piecesCopy[moves[moves.length - 1].movedPieceIndex], capturedPiecesCopy, piecesCopy);
                const opPieceIndex = oppositionPiecesCopy.findIndex((piece) => piece.index === capturedPieceIndex);
                oppositionPiecesCopy[opPieceIndex] =
                    piecesCopy[capturedPieceIndex];
            }
            if (selectedPiece.type === "king") {
                playerKingSquare = square;
            }
            movesCopy = moves.slice(0);
            movesCopy.push({
                movedPieceIndex: selectedPiece.index,
                pieces: piecesCopy,
                capturedPiece: null,
            });
            // must finish move out of check
            if (!calculateIfMoveLegal(piecesCopy, oppositionPiecesCopy, playerKingSquare, movesCopy)) {
                continue;
            }
            legalMoves.push(square);
        }
    }
    return legalMoves;
}
exports.calculateSelectedPieceLegalMoves = calculateSelectedPieceLegalMoves;
function checkIfCheck(piecesCopy, selectedPieceIndex, blackKingSquare, whiteKingSquare) {
    for (let i = 0; i < piecesCopy.length; i++) {
        if ((piecesCopy[i].colour === piecesCopy[selectedPieceIndex].colour &&
            piecesCopy[i].colour === "white" &&
            piecesCopy[i].availableMoves.includes(blackKingSquare)) ||
            (piecesCopy[i].colour === piecesCopy[selectedPieceIndex].colour &&
                piecesCopy[i].colour === "black" &&
                piecesCopy[i].availableMoves.includes(whiteKingSquare))) {
            return true;
        }
    }
    return false;
}
exports.checkIfCheck = checkIfCheck;
function checkIfCheckmate(piecesCopy, selectedPieceIndex, blackKingSquare, whiteKingSquare, moves) {
    // loop through all possible moves and see if still in check after move
    // returns false if a possible move results in no check, true if still check after all moves
    for (let i = 0; i < piecesCopy.length; i++) {
        if (piecesCopy[i].colour !== piecesCopy[selectedPieceIndex].colour) {
            for (let j = 0; j < piecesCopy[i].availableMoves.length; j++) {
                let piecesCopyCopy = JSON.parse(JSON.stringify(piecesCopy));
                let piece = piecesCopyCopy[i];
                piece.currentRow = piecesCopy[i].availableMoves[j][1];
                piece.currentCol = piecesCopy[i].availableMoves[j][0];
                let newWhiteKingSquare = whiteKingSquare;
                let newBlackKingSquare = blackKingSquare;
                if (piece.type === "king") {
                    piece.colour === "white"
                        ? (newWhiteKingSquare = piecesCopy[i].availableMoves[j])
                        : (newBlackKingSquare =
                            piecesCopy[i].availableMoves[j]);
                }
                // if piece on that square, remove
                let tbrIndex = null;
                for (let k = 0; k < piecesCopyCopy.length; k++) {
                    if (piecesCopyCopy[k].currentRow === piece.currentRow &&
                        piecesCopyCopy[k].currentCol === piece.currentCol &&
                        k !== i) {
                        tbrIndex = k;
                        break;
                    }
                }
                if (tbrIndex !== null && tbrIndex >= 0) {
                    piecesCopyCopy[tbrIndex].currentRow = -1;
                    piecesCopyCopy[tbrIndex].currentCol = -1;
                }
                for (let z = 0; z < piecesCopyCopy.length; z++) {
                    piecesCopyCopy[z].availableMoves = checkAvailableMoves(piecesCopyCopy[z], piecesCopyCopy, moves);
                }
                const inCheck = checkIfCheck(piecesCopyCopy, selectedPieceIndex, newBlackKingSquare, newWhiteKingSquare);
                if (!inCheck) {
                    return false;
                }
            }
        }
    }
    return true;
}
exports.checkIfCheckmate = checkIfCheckmate;
function checkCastleValid(inCheck, square, pieces, moves, selectedPieceIndex, playerKingSquare, oppositionPieces) {
    if (inCheck) {
        return false;
    }
    const squareColumn = parseInt(square[0]);
    const playerColumn = parseInt(playerKingSquare[0]);
    const columnChange = (squareColumn - playerColumn) / 2;
    playerKingSquare =
        (playerColumn + columnChange).toString() + playerKingSquare[1];
    if (!calculateIfMoveLegal(pieces, oppositionPieces, playerKingSquare, moves)) {
        return false;
    }
    pieces[selectedPieceIndex].currentCol = squareColumn;
    pieces[selectedPieceIndex].moved = true;
    playerKingSquare = square;
    let movesCopy = moves.slice(0);
    movesCopy.push({
        movedPieceIndex: selectedPieceIndex,
        pieces: pieces,
        capturedPiece: null,
    });
    if (!calculateIfMoveLegal(pieces, oppositionPieces, playerKingSquare, moves)) {
        return false;
    }
    return true;
}
exports.checkCastleValid = checkCastleValid;
function checkSquareForPiece(pieces, square, selectedPiece) {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].currentRow.toString() === square[1] &&
            pieces[i].currentCol.toString() === square[0] &&
            pieces[i].colour !== selectedPiece.colour) {
            return pieces[i];
        }
    }
    return null;
}
exports.checkSquareForPiece = checkSquareForPiece;
// checks if a square contains a piece. Returns true if does, false if not.
function rookBishopCheckIfPiece(pieces, piece, direction, possibleMoves, i) {
    for (let j = 0; j < pieces.length; j++) {
        if ((direction === "left" &&
            pieces[j].currentRow === piece.currentRow &&
            pieces[j].currentCol === piece.currentCol - i) ||
            (direction === "right" &&
                pieces[j].currentRow === piece.currentRow &&
                pieces[j].currentCol === piece.currentCol + i) ||
            (direction === "up" &&
                pieces[j].currentRow === piece.currentRow + i &&
                pieces[j].currentCol === piece.currentCol) ||
            (direction === "down" &&
                pieces[j].currentRow === piece.currentRow - i &&
                pieces[j].currentCol === piece.currentCol) ||
            (direction === "upLeft" &&
                pieces[j].currentRow === piece.currentRow + i &&
                pieces[j].currentCol === piece.currentCol - i) ||
            (direction === "upRight" &&
                pieces[j].currentRow === piece.currentRow + i &&
                pieces[j].currentCol === piece.currentCol + i) ||
            (direction === "downLeft" &&
                pieces[j].currentRow === piece.currentRow - i &&
                pieces[j].currentCol === piece.currentCol - i) ||
            (direction === "downRight" &&
                pieces[j].currentRow === piece.currentRow - i &&
                pieces[j].currentCol === piece.currentCol + i)) {
            if (pieces[j].colour !== piece.colour) {
                const square = pieces[j].currentCol.toString() +
                    pieces[j].currentRow.toString();
                possibleMoves.push(square);
                return true;
            }
            else {
                return true;
            }
        }
    }
    return false;
}
function checkIfPiece(pieces, piece, square, possibleMoves) {
    for (let i = 0; i < pieces.length; i++) {
        if (pieces[i].currentRow === parseInt(square[1]) &&
            pieces[i].currentCol === parseInt(square[0])) {
            if (pieces[i].colour !== piece.colour) {
                possibleMoves.push(square);
                return true;
            }
            else {
                return true;
            }
        }
    }
    return false;
}
function checkIfPieceCastle(pieces, castleSquares) {
    for (let i = 0; i < pieces.length; i++) {
        for (let j = 0; j < castleSquares.length; j++) {
            if (pieces[i].currentRow === parseInt(castleSquares[j][1]) &&
                pieces[i].currentCol === parseInt(castleSquares[j][0])) {
                return true;
            }
        }
    }
    return false;
}
function checkAvailableMoves(piece, pieces, moves) {
    var _a, _b, _c, _d;
    let possibleMoves = [];
    if (piece.currentCol === -1)
        return possibleMoves;
    // Square name system is [column number][row number]
    if (piece.type === "pawn") {
        const rowMove = piece.colour === "white" ? 1 : -1;
        let twoAhead = "";
        const oneAhead = piece.currentCol.toString() +
            (piece.currentRow + 1 * rowMove).toString();
        possibleMoves.push(oneAhead);
        if (!piece.moved) {
            twoAhead =
                piece.currentCol.toString() +
                    (piece.currentRow + 2 * rowMove).toString();
            possibleMoves.push(twoAhead);
        }
        const diagonalLeft = (piece.currentCol - 1).toString() +
            (piece.currentRow + 1 * rowMove).toString();
        const diagonalRight = (piece.currentCol + 1).toString() +
            (piece.currentRow + 1 * rowMove).toString();
        // Loop through all pieces to see if any are in the in any of the possible slots
        // plus see if any opposition pieces are in the diagonals
        for (let i = 0; i < pieces.length; i++) {
            if (pieces[i] === piece) {
                continue;
            }
            const square = pieces[i].currentCol.toString() +
                pieces[i].currentRow.toString();
            const index = possibleMoves.indexOf(square);
            if (index > -1) {
                possibleMoves.splice(index, 1);
                if (parseInt(square[1]) === piece.currentRow + rowMove &&
                    !piece.moved) {
                    const twoAheadIndex = possibleMoves.indexOf(twoAhead);
                    if (twoAheadIndex > -1) {
                        possibleMoves.splice(twoAheadIndex, 1);
                    }
                }
            }
            if (pieces[i].colour !== piece.colour &&
                (square === diagonalLeft || square === diagonalRight)) {
                possibleMoves.push(square);
            }
        }
        // En passant
        if (moves.length > 3) {
            const previousPieceIndex = moves[moves.length - 1].movedPieceIndex;
            const previouslyMovedPiece = pieces[previousPieceIndex];
            const previousPieces = moves[moves.length - 2].pieces;
            const previousPiecePreviousSquare = previousPieces[previousPieceIndex].currentCol.toString() +
                previousPieces[previousPieceIndex].currentRow.toString();
            if (previouslyMovedPiece.type === "pawn" &&
                (previouslyMovedPiece.currentCol === piece.currentCol + 1 ||
                    previouslyMovedPiece.currentCol === piece.currentCol - 1) &&
                previouslyMovedPiece.currentRow === piece.currentRow &&
                (previouslyMovedPiece.currentRow ===
                    parseInt(previousPiecePreviousSquare[1]) + 2 ||
                    previouslyMovedPiece.currentRow ===
                        parseInt(previousPiecePreviousSquare[1]) - 2)) {
                const enPassantCol = previouslyMovedPiece.currentCol;
                const enPassantRow = previouslyMovedPiece.currentRow ===
                    parseInt(previousPiecePreviousSquare[1]) + 2
                    ? previouslyMovedPiece.currentRow - 1
                    : previouslyMovedPiece.currentRow + 1;
                const enPassantSquare = enPassantCol.toString() + enPassantRow.toString();
                possibleMoves.push(enPassantSquare);
            }
        }
    }
    else if (piece.type === "rook") {
        // row moves
        const rowsLeft = piece.currentCol - 1;
        const rowsRight = 8 - piece.currentCol;
        // col moves
        const colsUp = 8 - piece.currentRow;
        const colsDown = piece.currentRow - 1;
        // left
        for (let i = 1; i <= rowsLeft; i++) {
            const check = rookBishopCheckIfPiece(pieces, piece, "left", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol - i).toString() +
                    piece.currentRow.toString();
                possibleMoves.push(square);
            }
        }
        // right
        for (let i = 1; i <= rowsRight; i++) {
            const check = rookBishopCheckIfPiece(pieces, piece, "right", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol + i).toString() +
                    piece.currentRow.toString();
                possibleMoves.push(square);
            }
        }
        // up
        for (let i = 1; i <= colsUp; i++) {
            const check = rookBishopCheckIfPiece(pieces, piece, "up", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = piece.currentCol.toString() +
                    (piece.currentRow + i).toString();
                possibleMoves.push(square);
            }
        }
        // down
        for (let i = 1; i <= colsDown; i++) {
            const check = rookBishopCheckIfPiece(pieces, piece, "down", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = piece.currentCol.toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }
    }
    else if (piece.type === "knight") {
        // all 8 knight moves, even those outside of the board
        let allKnightMoves = [];
        allKnightMoves.push((piece.currentCol + 1).toString() +
            (piece.currentRow + 2).toString());
        allKnightMoves.push((piece.currentCol + 2).toString() +
            (piece.currentRow + 1).toString());
        allKnightMoves.push((piece.currentCol + 2).toString() +
            (piece.currentRow - 1).toString());
        allKnightMoves.push((piece.currentCol + 1).toString() +
            (piece.currentRow - 2).toString());
        allKnightMoves.push((piece.currentCol - 1).toString() +
            (piece.currentRow + 2).toString());
        allKnightMoves.push((piece.currentCol - 2).toString() +
            (piece.currentRow + 1).toString());
        allKnightMoves.push((piece.currentCol - 2).toString() +
            (piece.currentRow - 1).toString());
        allKnightMoves.push((piece.currentCol - 1).toString() +
            (piece.currentRow - 2).toString());
        // knight moves within the board
        let correctKnightMoves = [];
        for (let i = 0; i < allKnightMoves.length; i++) {
            if (parseInt(allKnightMoves[i][0]) >= 1 &&
                parseInt(allKnightMoves[i][1]) >= 1 &&
                parseInt(allKnightMoves[i][0]) <= 8 &&
                parseInt(allKnightMoves[i][1]) <= 8 &&
                allKnightMoves[i].length < 3) {
                correctKnightMoves.push(allKnightMoves[i]);
            }
        }
        // populate possible moves
        for (let i = 0; i < correctKnightMoves.length; i++) {
            if (!checkIfPiece(pieces, piece, correctKnightMoves[i], possibleMoves)) {
                possibleMoves.push(correctKnightMoves[i]);
            }
        }
    }
    else if (piece.type === "bishop") {
        // up left
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow + i <= 8 && piece.currentCol - i >= 1)) {
                break;
            }
            const check = rookBishopCheckIfPiece(pieces, piece, "upLeft", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol - i).toString() +
                    (piece.currentRow + i).toString();
                possibleMoves.push(square);
            }
        }
        // up right
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow + i <= 8 && piece.currentCol + i <= 8)) {
                break;
            }
            const check = rookBishopCheckIfPiece(pieces, piece, "upRight", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol + i).toString() +
                    (piece.currentRow + i).toString();
                possibleMoves.push(square);
            }
        }
        // down left
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow - i >= 1 && piece.currentCol - i >= 1)) {
                break;
            }
            const check = rookBishopCheckIfPiece(pieces, piece, "downLeft", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol - i).toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }
        // down right
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow - i >= 1 && piece.currentCol + i <= 8)) {
                break;
            }
            const check = rookBishopCheckIfPiece(pieces, piece, "downRight", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol + i).toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }
    }
    else if (piece.type === "queen") {
        if (piece.name === "wq1") {
        }
        // up left
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow + i <= 8 && piece.currentCol - i >= 1)) {
                break;
            }
            const check = rookBishopCheckIfPiece(pieces, piece, "upLeft", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol - i).toString() +
                    (piece.currentRow + i).toString();
                possibleMoves.push(square);
            }
        }
        // up right
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow + i <= 8 && piece.currentCol + i <= 8)) {
                break;
            }
            const check = rookBishopCheckIfPiece(pieces, piece, "upRight", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol + i).toString() +
                    (piece.currentRow + i).toString();
                possibleMoves.push(square);
            }
        }
        // down left
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow - i >= 1 && piece.currentCol - i >= 1)) {
                break;
            }
            const check = rookBishopCheckIfPiece(pieces, piece, "downLeft", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol - i).toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }
        // down right
        for (let i = 1; i <= 7; i++) {
            if (!(piece.currentRow - i >= 1 && piece.currentCol + i <= 8)) {
                break;
            }
            const check = rookBishopCheckIfPiece(pieces, piece, "downRight", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol + i).toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }
        // row moves
        const rowsLeft = piece.currentCol - 1;
        const rowsRight = 8 - piece.currentCol;
        // col moves
        const colsUp = 8 - piece.currentRow;
        const colsDown = piece.currentRow - 1;
        // left
        for (let i = 1; i <= rowsLeft; i++) {
            const check = rookBishopCheckIfPiece(pieces, piece, "left", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol - i).toString() +
                    piece.currentRow.toString();
                possibleMoves.push(square);
            }
        }
        // right
        for (let i = 1; i <= rowsRight; i++) {
            const check = rookBishopCheckIfPiece(pieces, piece, "right", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = (piece.currentCol + i).toString() +
                    piece.currentRow.toString();
                possibleMoves.push(square);
            }
        }
        // up
        for (let i = 1; i <= colsUp; i++) {
            const check = rookBishopCheckIfPiece(pieces, piece, "up", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = piece.currentCol.toString() +
                    (piece.currentRow + i).toString();
                possibleMoves.push(square);
            }
        }
        // down
        for (let i = 1; i <= colsDown; i++) {
            const check = rookBishopCheckIfPiece(pieces, piece, "down", possibleMoves, i);
            if (check) {
                break;
            }
            else {
                const square = piece.currentCol.toString() +
                    (piece.currentRow - i).toString();
                possibleMoves.push(square);
            }
        }
    }
    else if (piece.type === "king") {
        // all 8 knight moves, even those outside of the board
        let allKingMoves = [];
        allKingMoves.push(piece.currentCol.toString() + (piece.currentRow + 1).toString());
        allKingMoves.push((piece.currentCol + 1).toString() +
            (piece.currentRow + 1).toString());
        allKingMoves.push((piece.currentCol + 1).toString() + piece.currentRow.toString());
        allKingMoves.push((piece.currentCol + 1).toString() +
            (piece.currentRow - 1).toString());
        allKingMoves.push(piece.currentCol.toString() + (piece.currentRow - 1).toString());
        allKingMoves.push((piece.currentCol - 1).toString() +
            (piece.currentRow - 1).toString());
        allKingMoves.push((piece.currentCol - 1).toString() + piece.currentRow.toString());
        allKingMoves.push((piece.currentCol - 1).toString() +
            (piece.currentRow + 1).toString());
        // king moves within the board
        let correctKingMoves = [];
        for (let i = 0; i < allKingMoves.length; i++) {
            if (parseInt(allKingMoves[i][0]) >= 1 &&
                parseInt(allKingMoves[i][1]) >= 1 &&
                parseInt(allKingMoves[i][0]) <= 8 &&
                parseInt(allKingMoves[i][1]) <= 8) {
                correctKingMoves.push(allKingMoves[i]);
            }
        }
        // populate possible moves
        for (let i = 0; i < correctKingMoves.length; i++) {
            if (!checkIfPiece(pieces, piece, correctKingMoves[i], possibleMoves)) {
                possibleMoves.push(correctKingMoves[i]);
            }
        }
        // Castling
        if (!piece.moved) {
            // king side
            let kingSideSquares = [];
            kingSideSquares.push((piece.currentCol + 1).toString() + piece.currentRow.toString());
            kingSideSquares.push((piece.currentCol + 2).toString() + piece.currentRow.toString());
            if ((piece.colour === "white" && !((_a = pieces[WR2INDEX]) === null || _a === void 0 ? void 0 : _a.moved)) ||
                (piece.colour === "black" && !((_b = pieces[BR2INDEX]) === null || _b === void 0 ? void 0 : _b.moved))) {
                if (!checkIfPieceCastle(pieces, kingSideSquares)) {
                    possibleMoves.push(kingSideSquares[1]);
                }
            }
            // Queen side
            let queenSideSquares = [];
            queenSideSquares.push((piece.currentCol - 1).toString() + piece.currentRow.toString());
            queenSideSquares.push((piece.currentCol - 2).toString() + piece.currentRow.toString());
            queenSideSquares.push((piece.currentCol - 3).toString() + piece.currentRow.toString());
            if ((piece.colour === "white" && !((_c = pieces[WR1INDEX]) === null || _c === void 0 ? void 0 : _c.moved)) ||
                (piece.colour === "black" && !((_d = pieces[BR1INDEX]) === null || _d === void 0 ? void 0 : _d.moved))) {
                if (!checkIfPieceCastle(pieces, queenSideSquares)) {
                    possibleMoves.push(queenSideSquares[1]);
                }
            }
        }
    }
    return possibleMoves;
}
exports.checkAvailableMoves = checkAvailableMoves;
