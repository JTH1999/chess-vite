import BoardRow from "./BoardRow.js";
import PromoteScreen from "./PromoteScreen.js";
import CheckmateScreen from "./CheckmateScreen.js";
import { Move, Piece } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { Flex } from "@chakra-ui/react";
import { newGamePieces } from "../../data/newGamePieces.js";

export default function Board({
    moves,
    colour,
    boardHeight,
}: {
    moves: Move[];
    colour: string;
    boardHeight: number;
}) {
    const blackRows = [1, 2, 3, 4, 5, 6, 7, 8];
    const whiteRows = [8, 7, 6, 5, 4, 3, 2, 1];

    let pieces: Piece[];
    let previousPieceMovedFrom = "";
    let previousPieceMovedTo = "";

    if (moves.length >= 1) {
        pieces = moves[moves.length - 1].pieces;

        const previousPieceIndex = moves[moves.length - 1].movedPieceIndex;
        let previousPiecePreviousPosition;
        if (moves.length === 1) {
            previousPiecePreviousPosition = newGamePieces[previousPieceIndex];
        } else {
            previousPiecePreviousPosition =
                moves[moves.length - 2].pieces[previousPieceIndex];
        }
        previousPieceMovedFrom =
            previousPiecePreviousPosition.currentCol.toString() +
            previousPiecePreviousPosition.currentRow.toString();
        const previousPieceCurrentPosition = pieces[previousPieceIndex];
        previousPieceMovedTo =
            previousPieceCurrentPosition.currentCol.toString() +
            previousPieceCurrentPosition.currentRow.toString();
    } else {
        pieces = newGamePieces;
    }
    return (
        <>
            <Flex>
                <Flex
                    className="board"
                    flexDirection={"column"}
                    justify="center"
                    alignItems={"center"}

                    // boxShadow="-10px -10px 40px 0px rgba(73, 73, 73, 0.45), 10px 10px 30px 0px rgba(0, 0, 0, 0.4);"
                >
                    {colour === "white"
                        ? whiteRows.map((row) => {
                              return (
                                  <BoardRow
                                      key={row}
                                      row={row}
                                      pieces={pieces}
                                      colour={colour}
                                      boardHeight={boardHeight}
                                      previousPieceMovedFrom={
                                          previousPieceMovedFrom
                                      }
                                      previousPieceMovedTo={
                                          previousPieceMovedTo
                                      }
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
                                      boardHeight={boardHeight}
                                      previousPieceMovedFrom={
                                          previousPieceMovedFrom
                                      }
                                      previousPieceMovedTo={
                                          previousPieceMovedTo
                                      }
                                  />
                              );
                          })}
                </Flex>
            </Flex>
        </>
    );
}
