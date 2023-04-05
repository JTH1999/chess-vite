import { Flex } from "@chakra-ui/react";
import { Dispatch, SetStateAction, useState } from "react";
import { OnlineBoardRow } from "./OnlineBoardRow";
import OnlineEndScreen from "./OnlineEndScreen";
import OnlinePromoteScreen from "./OnlinePromoteScreen";
import { Move, Piece } from "../../../types";
import { Socket } from "socket.io-client";

export function OnlineBoard({
  colour,
  pieces,
  isYourMove,
  roomCode,
  gameId,
  status,
  winner,
  moves,
  whiteToMove,
  boardHeight,
  analysisMode,
  previousPieceMovedFrom,
  previousPieceMovedTo,
  socket,
  setIsYourMove,
  setAnalysisMode,
  setAnalysisMoveNumber,
  setPieces,
}: {
  colour: string;
  pieces: Piece[];
  isYourMove: boolean;
  roomCode: string;
  gameId: string;
  status: string;
  winner: string | string;
  moves: Move[];
  whiteToMove: boolean;
  boardHeight: number;
  analysisMode: boolean;
  previousPieceMovedFrom: string;
  previousPieceMovedTo: string;
  socket: Socket;
  setIsYourMove: Dispatch<SetStateAction<boolean>>;
  setAnalysisMode: Dispatch<SetStateAction<boolean>>;
  setAnalysisMoveNumber: Dispatch<SetStateAction<number>>;
  setPieces: Dispatch<SetStateAction<Piece[]>>;
}) {
  const [selectedPiece, setSelectedPiece] = useState<Piece | null>(null);

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
            roomCode={roomCode}
            socket={socket}
            setAnalysisMode={setAnalysisMode}
            setAnalysisMoveNumber={setAnalysisMoveNumber}
            setPieces={setPieces}
          />
          <OnlinePromoteScreen
            roomCode={roomCode}
            gameId={gameId}
            status={status}
            whiteToMove={whiteToMove}
            socket={socket}
          />
          {colour === "white"
            ? whiteRows.map((row) => {
                return (
                  <OnlineBoardRow
                    key={row}
                    row={row}
                    socket={socket}
                    pieces={pieces}
                    selectedPiece={selectedPiece}
                    colour={colour}
                    isYourMove={isYourMove}
                    roomCode={roomCode}
                    gameId={gameId}
                    boardHeight={boardHeight}
                    analysisMode={analysisMode}
                    previousPieceMovedFrom={previousPieceMovedFrom}
                    previousPieceMovedTo={previousPieceMovedTo}
                    setSelectedPiece={setSelectedPiece}
                    setIsYourMove={setIsYourMove}
                  />
                );
              })
            : blackRows.map((row) => {
                return (
                  <OnlineBoardRow
                    key={row}
                    row={row}
                    socket={socket}
                    pieces={pieces}
                    selectedPiece={selectedPiece}
                    colour={colour}
                    isYourMove={isYourMove}
                    roomCode={roomCode}
                    gameId={gameId}
                    boardHeight={boardHeight}
                    analysisMode={analysisMode}
                    previousPieceMovedFrom={previousPieceMovedFrom}
                    previousPieceMovedTo={previousPieceMovedTo}
                    setSelectedPiece={setSelectedPiece}
                    setIsYourMove={setIsYourMove}
                  />
                );
              })}
        </Flex>
      </Flex>
    </>
  );
}
