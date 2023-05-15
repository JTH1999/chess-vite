interface Piece {
  name: string;
  index: number;
  type: string;
  value: number | null;
  colour: string;
  currentRow: number;
  currentCol: number;
  moved?: boolean;
  src: string;
  availableMoves: string[];
}

interface Move {
  movedPieceIndex: number;
  pieces: Piece[];
  capturedPiece: Piece | null;
}

const {
  newGamePieces,
  wPawn,
  bPawn,
  wKnight,
  bKnight,
  wBishop,
  bBishop,
  wRook,
  bRook,
  wKing,
  bKing,
  wQueen,
  bQueen,
} = require("../data/newGamePieces");

const helpers = require("./helperFunctions");
const capturePiece = helpers.capturePiece;
const calculateAllAvailableMoves = helpers.calculateAllAvailableMoves;
const calculateOppositionLegalMoves = helpers.calculateOppositionLegalMoves;

const {
  WR1INDEX,
  WR2INDEX,
  BR1INDEX,
  BR2INDEX,
  WK1INDEX,
  BK1INDEX,
} = require("../data/pieceIndexes");

function moveLogic(
  selectedPiece: Piece,
  square: string,
  pieces: Piece[],
  whiteToMove: boolean,
  capturedPieces: Piece[],

  moves: Move[]
) {
  if (!selectedPiece.availableMoves.includes(square)) {
    return "invalid move";
  }

  const col = parseInt(square[0]);
  const row = parseInt(square[1]);
  let piece = null;
  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].currentRow === row && pieces[i].currentCol === col) {
      piece = pieces[i];
      break;
    }
  }

  let piecesCopy = JSON.parse(JSON.stringify(pieces));
  let newWhiteKingSquare =
    pieces[WK1INDEX].currentCol.toString() +
    pieces[WK1INDEX].currentRow.toString();
  let newBlackKingSquare =
    pieces[BK1INDEX].currentCol.toString() +
    pieces[BK1INDEX].currentRow.toString();
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

      capturedPiece = piecesCopy[moves[moves.length - 1].movedPieceIndex];
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

    // Promote
    if (selectedPiece.type === "pawn" && (row === 1 || row === 8)) {
      return {
        status: "promote",
        selectedPiece: selectedPiece,
        pieces: piecesCopy,
        moves: movesCopy,
        capturedPieces: capturedPiecesCopy,
        whiteToMove: whiteToMove,
      };
    }
  }

  const oppositionKingSquare =
    selectedPiece.colour === "white" ? newBlackKingSquare : newWhiteKingSquare;

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
    capturedPiecesCopy,
    movesCopy,
    inCheck
  );

  const isCheckmate = calculateOppositionLegalMovesResult.isCheckmate;
  const isStalemate = calculateOppositionLegalMovesResult.isStalemate;
  piecesCopy = calculateOppositionLegalMovesResult.pieces;

  if (isCheckmate) {
    return {
      status: "checkmate",
      pieces: piecesCopy,
      moves: movesCopy,
      capturedPieces: capturedPiecesCopy,
      whiteToMove: !whiteToMove,
      check: inCheck,
    };
  }

  if (isStalemate) {
    return {
      status: "stalemate",
      pieces: piecesCopy,
      moves: movesCopy,
      capturedPieces: capturedPiecesCopy,
      whiteToMove: !whiteToMove,
      check: inCheck,
    };
  }

  return {
    status: "unfinished",
    pieces: piecesCopy,
    moves: movesCopy,
    capturedPieces: capturedPiecesCopy,
    whiteToMove: !whiteToMove,
    check: inCheck,
  };
}

function promoteLogic(
  pieces: Piece[],
  selectedPiece: Piece,
  promoteTo: string,
  moves: Move[],
  capturedPieces: Piece[],
  whiteToMove: boolean
) {
  let piecesCopy = JSON.parse(JSON.stringify(pieces));
  if (selectedPiece === null) {
    throw new Error("selected piece is null when attempting to promote piece");
  }

  if (promoteTo == "queen") {
    piecesCopy[selectedPiece.index].type = "queen";
    piecesCopy[selectedPiece.index].src =
      piecesCopy[selectedPiece.index].colour == "white" ? wQueen : bQueen;
  } else if (promoteTo == "rook") {
    piecesCopy[selectedPiece.index].type = "rook";
    piecesCopy[selectedPiece.index].src =
      piecesCopy[selectedPiece.index].colour == "white" ? wRook : bRook;
  } else if (promoteTo == "knight") {
    piecesCopy[selectedPiece.index].type = "knight";
    piecesCopy[selectedPiece.index].src =
      piecesCopy[selectedPiece.index].colour == "white" ? wKnight : bKnight;
  } else if (promoteTo == "bishop") {
    piecesCopy[selectedPiece.index].type = "bishop";
    piecesCopy[selectedPiece.index].src =
      piecesCopy[selectedPiece.index].colour == "white" ? wBishop : bBishop;
  }

  let whiteKingSquare =
    pieces[WK1INDEX].currentCol.toString() +
    pieces[WK1INDEX].currentRow.toString();
  let blackKingSquare =
    pieces[BK1INDEX].currentCol.toString() +
    pieces[BK1INDEX].currentRow.toString();

  const oppositionKingSquare =
    selectedPiece.colour === "white" ? blackKingSquare : whiteKingSquare;

  let playerColour = selectedPiece.colour;
  let oppositionColour = playerColour === "white" ? "black" : "white";

  const calculateAllAvailableMovesResult = calculateAllAvailableMoves(
    piecesCopy,
    selectedPiece.colour,
    oppositionKingSquare,
    moves
  );
  piecesCopy = calculateAllAvailableMovesResult.pieces;
  const inCheck = calculateAllAvailableMovesResult.inCheck;

  // for each of opposition player's pieces, calculate legal moves.
  const calculateOppositionLegalMovesResult = calculateOppositionLegalMoves(
    piecesCopy,
    oppositionKingSquare,
    oppositionColour,
    capturedPieces,
    moves,
    inCheck
  );

  const isCheckmate = calculateOppositionLegalMovesResult.isCheckmate;
  const isStalemate = calculateOppositionLegalMovesResult.isStalemate;
  piecesCopy = calculateOppositionLegalMovesResult.pieces;

  if (isCheckmate) {
    return {
      status: "checkmate",
      pieces: piecesCopy,
      moves: moves,
      capturedPieces: capturedPieces,
      whiteToMove: !whiteToMove,
      check: inCheck,
    };
  }

  if (isStalemate) {
    return {
      status: "stalemate",
      pieces: piecesCopy,
      moves: moves,
      capturedPieces: capturedPieces,
      whiteToMove: !whiteToMove,
      check: inCheck,
    };
  }

  return {
    status: "unfinished",
    pieces: piecesCopy,
    moves: moves,
    capturedPieces: capturedPieces,
    whiteToMove: !whiteToMove,
    check: inCheck,
  };
}

module.exports = { moveLogic, promoteLogic };
export {};
