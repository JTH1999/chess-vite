import { Flex } from "@chakra-ui/react";
import { useState } from "react";
import { OnlineBoardRow } from "./OnlineBoardRow";
import OnlineEndScreen from "./OnlineEndScreen";
import OnlinePromoteScreen from "./OnlinePromoteScreen";

export function OnlineBoard({
    colour,
    pieces,
    isYourMove,
    socket,
    roomCode,
    setIsYourMove,
    gameId,
    status,
    winner,
    moves,
    whiteToMove,
    boardHeight,
    analysisMode,
    previousPieceMovedFrom,
    previousPieceMovedTo,
    setAnalysisMode,
    setAnalysisMoveNumber,
    setPieces,
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
                    overflow="hidden"
                    borderRadius="12px"
                    boxShadow="-10px -10px 30px 0px rgba(0, 0, 0, 0.1), 10px 10px 30px 0px rgba(0, 0, 0, 0.1);"
                >
                    <OnlineEndScreen
                        whiteToMove={whiteToMove}
                        analysisMode={analysisMode}
                        winner={winner}
                        status={status}
                        moves={moves}
                        socket={socket}
                        roomCode={roomCode}
                        setAnalysisMode={setAnalysisMode}
                        setAnalysisMoveNumber={setAnalysisMoveNumber}
                        setPieces={setPieces}
                    />
                    <OnlinePromoteScreen
                        socket={socket}
                        roomCode={roomCode}
                        gameId={gameId}
                        status={status}
                        whiteToMove={whiteToMove}
                    />
                    {colour === "white"
                        ? whiteRows.map((row) => {
                              return (
                                  <OnlineBoardRow
                                      key={row}
                                      row={row}
                                      pieces={pieces}
                                      selectedPiece={selectedPiece}
                                      colour={colour}
                                      isYourMove={isYourMove}
                                      socket={socket}
                                      roomCode={roomCode}
                                      setIsYourMove={setIsYourMove}
                                      setSelectedPiece={setSelectedPiece}
                                      gameId={gameId}
                                      boardHeight={boardHeight}
                                      analysisMode={analysisMode}
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
                                  <OnlineBoardRow
                                      key={row}
                                      row={row}
                                      pieces={pieces}
                                      selectedPiece={selectedPiece}
                                      colour={colour}
                                      isYourMove={isYourMove}
                                      socket={socket}
                                      roomCode={roomCode}
                                      setIsYourMove={setIsYourMove}
                                      setSelectedPiece={setSelectedPiece}
                                      gameId={gameId}
                                      boardHeight={boardHeight}
                                      analysisMode={analysisMode}
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
