import { Flex } from "@chakra-ui/react";
import { Piece } from "../../types";
import Square from "./Square";

export default function BoardRow({
  row,
  pieces,
  colour,
  boardHeight,
  previousPieceMovedFrom,
  previousPieceMovedTo,
}: {
  row: number;
  pieces: Piece[];
  colour: string;
  boardHeight: number;
  previousPieceMovedFrom: string;
  previousPieceMovedTo: string;
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
                boardHeight={boardHeight}
                previousPieceMovedFrom={previousPieceMovedFrom}
                previousPieceMovedTo={previousPieceMovedTo}
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
                boardHeight={boardHeight}
                previousPieceMovedFrom={previousPieceMovedFrom}
                previousPieceMovedTo={previousPieceMovedTo}
              />
            );
          })}
    </Flex>
  );
}
