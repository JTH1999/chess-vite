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

export interface LoginBadResponse {
    fieldErrors: null | {
        username: null | string;
        password: null | string;
    };
    fields: null | {
        username: string;
        password: string;
    };
    formError: null | string;
}
