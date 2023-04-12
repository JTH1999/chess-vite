import { Dispatch, SetStateAction } from "react";
import { Move, Piece } from "../../../types";
import Square from "./square/Square";
import { Flex } from "@chakra-ui/react";

export default function BoardRow({
  row,
  pieces,
  selectedPiece,
  boardHeight,
  colour,
  previousPieceMovedFrom,
  previousPieceMovedTo,
  handleSquareClick,
}: {
  row: number;
  pieces: Piece[];
  selectedPiece: Piece | null;
  boardHeight: number;
  colour: string;
  previousPieceMovedFrom: string;
  previousPieceMovedTo: string;
  handleSquareClick: (
    row: number,
    col: number,
    square: string,
    piece: Piece | null
  ) => void;
}) {
  const whiteCols = [1, 2, 3, 4, 5, 6, 7, 8];
  const blackCols = [8, 7, 6, 5, 4, 3, 2, 1];
  return (
    <Flex w={`${boardHeight}px`}>
      {colour === "white"
        ? whiteCols.map((col) => {
            return (
              <Square
                key={col}
                row={row}
                col={col}
                pieces={pieces}
                selectedPiece={selectedPiece}
                boardHeight={boardHeight}
                previousPieceMovedFrom={previousPieceMovedFrom}
                previousPieceMovedTo={previousPieceMovedTo}
                handleSquareClick={handleSquareClick}
              />
            );
          })
        : blackCols.map((col) => {
            return (
              <Square
                key={col}
                row={row}
                col={col}
                pieces={pieces}
                selectedPiece={selectedPiece}
                boardHeight={boardHeight}
                previousPieceMovedFrom={previousPieceMovedFrom}
                previousPieceMovedTo={previousPieceMovedTo}
                handleSquareClick={handleSquareClick}
              />
            );
          })}
    </Flex>
  );
}
