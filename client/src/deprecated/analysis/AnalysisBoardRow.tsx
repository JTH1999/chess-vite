import { Flex } from "@chakra-ui/react";
import { Piece } from "../../../types";
import AnalysisSquare from "./AnalysisSquare";

export function AnalysisBoardRow({
  row,
  pieces,
  selectedPiece,
  boardHeight,
  previousPieceMovedFrom,
  previousPieceMovedTo,
  colour,
}: {
  row: number;
  pieces: Piece[];
  selectedPiece: Piece | null | undefined;
  boardHeight: number;
  previousPieceMovedFrom: string;
  previousPieceMovedTo: string;
  colour: string;
}) {
  const whiteCols = [1, 2, 3, 4, 5, 6, 7, 8];
  const blackCols = [8, 7, 6, 5, 4, 3, 2, 1];
  return (
    <Flex w={`${boardHeight}px`}>
      {colour === "white"
        ? whiteCols.map((col) => {
            return (
              <AnalysisSquare
                key={col}
                row={row}
                col={col}
                pieces={pieces}
                selectedPiece={selectedPiece}
                boardHeight={boardHeight}
                previousPieceMovedFrom={previousPieceMovedFrom}
                previousPieceMovedTo={previousPieceMovedTo}
              />
            );
          })
        : blackCols.map((col) => {
            return (
              <AnalysisSquare
                key={col}
                row={row}
                col={col}
                pieces={pieces}
                selectedPiece={selectedPiece}
                boardHeight={boardHeight}
                previousPieceMovedFrom={previousPieceMovedFrom}
                previousPieceMovedTo={previousPieceMovedTo}
              />
            );
          })}
    </Flex>
  );
}
