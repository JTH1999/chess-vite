import BoardRow from "./BoardRow.js";
import PromoteScreen from "../PromoteScreen.js";
import CheckmateScreen from "../CheckmateScreen.js";
import { Move, Piece } from "../../../types.js";
import { Dispatch, PropsWithChildren, ReactNode, SetStateAction } from "react";
import { Flex } from "@chakra-ui/react";

export default function Board({
  pieces,
  selectedPiece,
  boardHeight,
  colour,
  previousPieceMovedFrom,
  previousPieceMovedTo,
  handleSquareClick,
  children,
}: {
  pieces: Piece[];
  selectedPiece: Piece | null;
  boardHeight: number;
  colour: string;
  previousPieceMovedFrom: string;
  previousPieceMovedTo: string;
  children: PropsWithChildren;
  handleSquareClick: (
    row: number,
    col: number,
    square: string,
    piece: Piece | null
  ) => void;
}) {
  const blackRows = [1, 2, 3, 4, 5, 6, 7, 8];
  const whiteRows = [8, 7, 6, 5, 4, 3, 2, 1];
  return (
    <Flex
      flex="1 0 auto"
      className="board"
      flexDirection={"column"}
      justify="center"
      alignItems={"center"}
      overflow="hidden"
      borderRadius="12px"
      boxShadow="-10px -10px 30px 0px rgba(0, 0, 0, 0.1), 10px 10px 30px 0px rgba(0, 0, 0, 0.1);"
    >
      {children}
      {colour === "white"
        ? whiteRows.map((row) => {
            return (
              <BoardRow
                key={row}
                row={row}
                pieces={pieces}
                selectedPiece={selectedPiece}
                boardHeight={boardHeight}
                colour={colour}
                previousPieceMovedFrom={previousPieceMovedFrom}
                previousPieceMovedTo={previousPieceMovedTo}
                handleSquareClick={handleSquareClick}
              />
            );
          })
        : blackRows.map((row) => {
            return (
              <BoardRow
                key={row}
                row={row}
                pieces={pieces}
                colour={colour}
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
