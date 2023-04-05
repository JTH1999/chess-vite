import { Flex } from "@chakra-ui/react";
import { AnalysisBoardRow } from "./AnalysisBoardRow";
import { Piece } from "../../../types";

export function AnalysisBoard({
  colour,
  pieces,
  boardHeight,
  previousPieceMovedFrom,
  previousPieceMovedTo,
}: {
  colour: string;
  pieces: Piece[];
  boardHeight: number;
  previousPieceMovedFrom: string;
  previousPieceMovedTo: string;
}) {
  const selectedPiece = null;

  const blackRows = [1, 2, 3, 4, 5, 6, 7, 8];
  const whiteRows = [8, 7, 6, 5, 4, 3, 2, 1];
  return (
    <>
      <Flex>
        <Flex
          className="board"
          flexDirection={"column"}
          justify="center"
          alignItems={"center"}
          overflow="hidden"
          borderRadius="12px"
          boxShadow="-10px -10px 30px 0px rgba(0, 0, 0, 0.1), 10px 10px 30px 0px rgba(0, 0, 0, 0.1);"
        >
          {colour === "white"
            ? whiteRows.map((row) => {
                return (
                  <AnalysisBoardRow
                    key={row}
                    row={row}
                    pieces={pieces}
                    selectedPiece={selectedPiece}
                    colour={colour}
                    boardHeight={boardHeight}
                    previousPieceMovedFrom={previousPieceMovedFrom}
                    previousPieceMovedTo={previousPieceMovedTo}
                  />
                );
              })
            : blackRows.map((row) => {
                return (
                  <AnalysisBoardRow
                    key={row}
                    row={row}
                    pieces={pieces}
                    selectedPiece={selectedPiece}
                    colour={colour}
                    boardHeight={boardHeight}
                    previousPieceMovedFrom={previousPieceMovedFrom}
                    previousPieceMovedTo={previousPieceMovedTo}
                  />
                );
              })}
        </Flex>
      </Flex>
    </>
  );
}
