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
    whiteToMove,
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
                    boxShadow="-10px -10px 40px 0px rgba(73, 73, 73, 0.45), 10px 10px 30px 0px rgba(0, 0, 0, 0.4);"
                >
                    <OnlineEndScreen
                        whiteToMove={whiteToMove}
                        analysisMode={false}
                        winner={winner}
                        status={status}
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
                                  />
                              );
                          })}
                </Flex>
            </Flex>
        </>
    );
}
