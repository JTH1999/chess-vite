import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { AnalysisBoardRow } from "./AnalysisBoardRow";

export function AnalysisBoard({
    colour,
    pieces,
    boardHeight,
    previousPieceMovedFrom,
    previousPieceMovedTo,
}) {
    const [selectedPiece, setSelectedPiece] = useState(null);

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
                    // boxShadow="-10px -10px 40px 0px rgba(73, 73, 73, 0.45), 10px 10px 30px 0px rgba(0, 0, 0, 0.4);"
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
                                  <AnalysisBoardRow
                                      key={row}
                                      row={row}
                                      pieces={pieces}
                                      selectedPiece={selectedPiece}
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
