export interface Piece {
    name: string;
    index: number;
    type: string;
    value: number | null;
    colour: string;
    currentRow: number;
    currentCol: number;
    moved?: boolean;
    src: string;
    availableMoves: string[];
}

export interface Move {
    movedPieceIndex: number;
    pieces: Piece[];
    capturedPiece: Piece | null;
}
