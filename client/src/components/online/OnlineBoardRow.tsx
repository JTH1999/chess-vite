import { Piece } from "../../../types";
import OnlineSquare from "./OnlineSquare";

export function OnlineBoardRow({
    row,
    pieces,
    selectedPiece,
    colour,
    isYourMove,
    socket,
    setSelectedPiece,
    roomCode,
    setIsYourMove,
    gameId,
}: {
    row: number;
    pieces: Piece[];
    selectedPiece: Piece | null | undefined;
    colour: string;
    isYourMove: boolean;
    roomCode: string;
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
                          />
                      );
                  })}
        </div>
    );
}
