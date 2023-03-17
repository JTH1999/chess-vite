import wPawn from "../assets/pieces/w_pawn_svg_NoShadow.svg";
import bPawn from "../assets/pieces/b_pawn_svg_NoShadow.svg";
import wRook from "../assets/pieces/w_rook_svg_NoShadow.svg";
import bRook from "../assets/pieces/b_rook_svg_NoShadow.svg";
import wKnight from "../assets/pieces/w_knight_svg_NoShadow.svg";
import bKnight from "../assets/pieces/b_knight_svg_NoShadow.svg";
import wBishop from "../assets/pieces/w_bishop_svg_NoShadow.svg";
import bBishop from "../assets/pieces/b_bishop_svg_NoShadow.svg";
import wQueen from "../assets/pieces/w_queen_svg_NoShadow.svg";
import bQueen from "../assets/pieces/b_queen_svg_NoShadow.svg";
import wKing from "../assets/pieces/w_king_svg_NoShadow.svg";
import bKing from "../assets/pieces/b_king_svg_NoShadow.svg";

export const newGamePieces = [
    {
        name: "wp1",
        index: 0,
        type: "pawn",
        value: 1,
        colour: "white",
        currentRow: 2,
        currentCol: 1,
        moved: false,
        src: wPawn,
        availableMoves: ["13", "14"],
    },
    {
        name: "wp2",
        index: 1,
        type: "pawn",
        value: 1,
        colour: "white",
        currentRow: 2,
        currentCol: 2,
        moved: false,
        src: wPawn,
        availableMoves: ["23", "24"],
    },
    {
        name: "wp3",
        index: 2,
        type: "pawn",
        value: 1,
        colour: "white",
        currentRow: 2,
        currentCol: 3,
        moved: false,
        src: wPawn,
        availableMoves: ["33", "34"],
    },
    {
        name: "wp4",
        index: 3,
        type: "pawn",
        value: 1,
        colour: "white",
        currentRow: 2,
        currentCol: 4,
        moved: false,
        src: wPawn,
        availableMoves: ["43", "44"],
    },
    {
        name: "wp5",
        index: 4,
        type: "pawn",
        value: 1,
        colour: "white",
        currentRow: 2,
        currentCol: 5,
        moved: false,
        src: wPawn,
        availableMoves: ["53", "54"],
    },
    {
        name: "wp6",
        index: 5,
        type: "pawn",
        value: 1,
        colour: "white",
        currentRow: 2,
        currentCol: 6,
        moved: false,
        src: wPawn,
        availableMoves: ["63", "64"],
    },
    {
        name: "wp7",
        index: 6,
        type: "pawn",
        value: 1,
        colour: "white",
        currentRow: 2,
        currentCol: 7,
        moved: false,
        src: wPawn,
        availableMoves: ["73", "74"],
    },
    {
        name: "wp8",
        index: 7,
        type: "pawn",
        value: 1,
        colour: "white",
        currentRow: 2,
        currentCol: 8,
        moved: false,
        src: wPawn,
        availableMoves: ["83", "84"],
    },
    {
        name: "bp1",
        index: 8,
        type: "pawn",
        value: 1,
        colour: "black",
        currentRow: 7,
        currentCol: 1,
        moved: false,
        src: bPawn,
        availableMoves: ["16", "15"],
    },
    {
        name: "bp2",
        index: 9,
        type: "pawn",
        value: 1,
        colour: "black",
        currentRow: 7,
        currentCol: 2,
        moved: false,
        src: bPawn,
        availableMoves: ["26", "25"],
    },
    {
        name: "bp3",
        index: 10,
        type: "pawn",
        value: 1,
        colour: "black",
        currentRow: 7,
        currentCol: 3,
        moved: false,
        src: bPawn,
        availableMoves: ["36", "35"],
    },
    {
        name: "bp4",
        index: 11,
        type: "pawn",
        value: 1,
        colour: "black",
        currentRow: 7,
        currentCol: 4,
        moved: false,
        src: bPawn,
        availableMoves: ["46", "45"],
    },
    {
        index: 12,
        name: "bp5",
        type: "pawn",
        value: 1,
        colour: "black",
        currentRow: 7,
        currentCol: 5,
        moved: false,
        src: bPawn,
        availableMoves: ["56", "55"],
    },
    {
        name: "bp6",
        index: 13,
        type: "pawn",
        value: 1,
        colour: "black",
        currentRow: 7,
        currentCol: 6,
        moved: false,
        src: bPawn,
        availableMoves: ["66", "65"],
    },
    {
        name: "bp7",
        index: 14,
        type: "pawn",
        value: 1,
        colour: "black",
        currentRow: 7,
        currentCol: 7,
        moved: false,
        src: bPawn,
        availableMoves: ["76", "75"],
    },
    {
        name: "bp8",
        index: 15,
        type: "pawn",
        value: 1,
        colour: "black",
        currentRow: 7,
        currentCol: 8,
        moved: false,
        src: bPawn,
        availableMoves: ["86", "85"],
    },
    {
        name: "wr1",
        index: 16,
        type: "rook",
        value: 5,
        colour: "white",
        currentRow: 1,
        currentCol: 1,
        moved: false,
        src: wRook,
        availableMoves: [],
    },
    {
        name: "wr2",
        index: 17,
        type: "rook",
        value: 5,
        colour: "white",
        currentRow: 1,
        currentCol: 8,
        moved: false,
        src: wRook,
        availableMoves: [],
    },
    {
        name: "br1",
        index: 18,
        type: "rook",
        value: 5,
        colour: "black",
        currentRow: 8,
        currentCol: 1,
        moved: false,
        src: bRook,
        availableMoves: [],
    },
    {
        name: "br2",
        index: 19,
        type: "rook",
        value: 5,
        colour: "black",
        currentRow: 8,
        currentCol: 8,
        moved: false,
        src: bRook,
        availableMoves: [],
    },
    {
        name: "wn1",
        index: 20,
        type: "knight",
        value: 3,
        colour: "white",
        currentRow: 1,
        currentCol: 2,
        src: wKnight,
        availableMoves: ["13", "33"],
    },
    {
        name: "wn2",
        index: 21,
        type: "knight",
        value: 3,
        colour: "white",
        currentRow: 1,
        currentCol: 7,
        src: wKnight,
        availableMoves: ["63", "83"],
    },
    {
        name: "bn1",
        index: 22,
        type: "knight",
        value: 3,
        colour: "black",
        currentRow: 8,
        currentCol: 2,
        src: bKnight,
        availableMoves: ["16", "36"],
    },
    {
        name: "bn2",
        index: 23,
        type: "knight",
        value: 3,
        colour: "black",
        currentRow: 8,
        currentCol: 7,
        src: bKnight,
        availableMoves: ["66", "86"],
    },
    {
        name: "wb1",
        index: 24,
        type: "bishop",
        value: 3,
        colour: "white",
        currentRow: 1,
        currentCol: 3,
        src: wBishop,
        availableMoves: [],
    },
    {
        name: "wb2",
        index: 25,
        type: "bishop",
        value: 3,
        colour: "white",
        currentRow: 1,
        currentCol: 6,
        src: wBishop,
        availableMoves: [],
    },
    {
        name: "bb1",
        index: 26,
        type: "bishop",
        value: 3,
        colour: "black",
        currentRow: 8,
        currentCol: 3,
        src: bBishop,
        availableMoves: [],
    },
    {
        name: "bb2",
        index: 27,
        type: "bishop",
        value: 3,
        colour: "black",
        currentRow: 8,
        currentCol: 6,
        src: bBishop,
        availableMoves: [],
    },
    {
        name: "wq1",
        index: 28,
        type: "queen",
        value: 9,
        colour: "white",
        currentRow: 1,
        currentCol: 4,
        src: wQueen,
        availableMoves: [],
    },
    {
        name: "bq1",
        index: 29,
        type: "queen",
        value: 9,
        colour: "black",
        currentRow: 8,
        currentCol: 4,
        src: bQueen,
        availableMoves: [],
    },
    {
        name: "wk1",
        index: 30,
        type: "king",
        value: null,
        colour: "white",
        currentRow: 1,
        currentCol: 5,
        moved: false,
        src: wKing,
        availableMoves: [],
    },
    {
        name: "bk1",
        index: 31,
        type: "king",
        value: null,
        colour: "black",
        currentRow: 8,
        currentCol: 5,
        moved: false,
        src: bKing,
        availableMoves: [],
    },
];
