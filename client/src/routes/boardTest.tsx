import { OnlineBoard } from "../components/online/OnlineBoard";
import { newGamePieces } from "../data/newGamePieces";

export function BoardTest() {
    console.log(newGamePieces);
    return (
        <OnlineBoard
            colour={"black"}
            pieces={newGamePieces}
            selectedPiece={null}
        />
    );
}
