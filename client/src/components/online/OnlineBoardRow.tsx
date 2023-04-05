import { Dispatch, SetStateAction } from "react";
import { Piece } from "../../../types";
import OnlineSquare from "./OnlineSquare";
import { Socket } from "socket.io-client";

export function OnlineBoardRow({
  row,
  pieces,
  selectedPiece,
  colour,
  isYourMove,
  socket,
  roomCode,
  gameId,
  boardHeight,
  analysisMode,
  previousPieceMovedFrom,
  previousPieceMovedTo,
  setSelectedPiece,
  setIsYourMove,
}: {
  row: number;
  pieces: Piece[];
  selectedPiece: Piece | null | undefined;
  colour: string;
  isYourMove: boolean;
  socket: Socket;
  roomCode: string;
  gameId: string;
  boardHeight: number;
  analysisMode: boolean;
  previousPieceMovedFrom: string;
  previousPieceMovedTo: string;
  setSelectedPiece: Dispatch<SetStateAction<Piece | null>>;
  setIsYourMove: Dispatch<SetStateAction<boolean>>;
}) {
  const whiteCols = [1, 2, 3, 4, 5, 6, 7, 8];
  const blackCols = [8, 7, 6, 5, 4, 3, 2, 1];
  return (
    <div>
      {colour === "white"
        ? whiteCols.map((col) => {
            return (
              <OnlineSquare
                key={col}
                row={row}
                col={col}
                pieces={pieces}
                selectedPiece={selectedPiece}
                isYourMove={isYourMove}
                socket={socket}
                roomCode={roomCode}
                setIsYourMove={setIsYourMove}
                setSelectedPiece={setSelectedPiece}
                colour={colour}
                gameId={gameId}
                boardHeight={boardHeight}
                analysisMode={analysisMode}
                previousPieceMovedFrom={previousPieceMovedFrom}
                previousPieceMovedTo={previousPieceMovedTo}
              />
            );
          })
        : blackCols.map((col) => {
            return (
              <OnlineSquare
                key={col}
                row={row}
                col={col}
                pieces={pieces}
                selectedPiece={selectedPiece}
                isYourMove={isYourMove}
                socket={socket}
                roomCode={roomCode}
                setIsYourMove={setIsYourMove}
                setSelectedPiece={setSelectedPiece}
                colour={colour}
                gameId={gameId}
                boardHeight={boardHeight}
                analysisMode={analysisMode}
                previousPieceMovedFrom={previousPieceMovedFrom}
                previousPieceMovedTo={previousPieceMovedTo}
              />
            );
          })}
    </div>
  );
}
