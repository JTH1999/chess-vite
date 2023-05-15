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

export interface GamesObject {
  [key: string]: Game;
}

export interface Game {
  roomCode: string;
  white: string;
  black: string;
  status: string | null;
  pieces: Piece[];
  whiteToMove: boolean;
  moves: Move[];
  whiteUserId: string;
  blackUserId: string;
  capturedPieces: Piece[];
  whiteTime: number;
  blackTime: number;
  currentMoveStart: number;
  interval: any;
  selectedPiece: null | Piece;
  winner: string;
}

export interface UsernamesObject {
  [key: string]: string;
}

export interface ServerToClientEvents {
  recieveMessage: (data: any) => void;

  roomJoined: (data: { room: string; players: string[] }) => void;

  roomCreated: (data: { room: string; players: string[] }) => void;

  roomFull: () => void;

  playerLeft: (data: { room: string; players: string[] }) => void;

  exitedRoom: (data: { message: string }) => void;

  goToBoard: (data: {
    gameId: string;
    status: string;
    colour: "black" | "white";
    whiteToMove: boolean;
    pieces: Piece[];
    roomCode: string;
  }) => void;

  currentTimes: (data: {
    gameId: string;
    white: number;
    black: number;
  }) => void;

  outOfTime: (data: { gameId: string; winner: string }) => void;

  promotePiece: (data: {
    gameId: string;
    status: string;
    pieces: Piece[];
    moves: Move[];
    capturedPieces: Piece[];
    whiteToMove: boolean;
    selectedPiece: Piece;
  }) => void;

  checkmate: (data: {
    gameId: string;
    status: string;
    pieces: Piece[];
    moves: Move[];
    capturedPieces: Piece[];
    whiteToMove: boolean;
    check: boolean;
    winner: string;
  }) => void;

  stalemate: (data: {
    gameId: string;
    status: string;
    pieces: Piece[];
    moves: Move[];
    capturedPieces: Piece[];
    whiteToMove: boolean;
    check: boolean;
  }) => void;

  moveComplete: (data: {
    gameId: string;
    status: string;
    pieces: Piece[];
    moves: Move[];
    capturedPieces: Piece[];
    whiteToMove: boolean;
    check: boolean;
  }) => void;

  drawOfferReceived: (data: {
    gameId: string;
    roomCode: string;
    type: string;
    text: string;
    id: string;
  }) => void;

  draw: (data: { gameId: string }) => void;

  drawOfferRejected: (data: { gameId: string }) => void;

  gameEnded: (data: {
    gameId: string;
    roomCode: string;
    exitedPlayer: string;
  }) => void;

  resignation: (data: {
    gameId: string;
    roomCode: string;
    winner: string;
  }) => void;

  forfeit: (data: { gameId: string; winner: "black" | "white" }) => void;
}

export interface ClientToServerEvents {
  joinRoom: (data: { username: string; room: string }) => void;

  leaveRoom: (roomCode: string) => void;

  startMatch: (roomCode: string) => void;

  sendMove: (data: {
    selectedPiece: Piece;
    square: string;
    roomCode: string;
    gameId: string;
    colour: string;
  }) => void;

  sendMessage: (data: { text: string; name: string; id: string }) => void;

  sendDrawOffer: (data: {
    gameId: string;
    roomCode: string;
    id: string;
  }) => void;

  drawOfferResponse: (data: {
    gameId: string;
    roomCode: string;
    accepted: boolean;
  }) => void;

  resign: (data: { gameId: string; roomCode: string }) => void;

  promotePieceSelected: (data: {
    roomCode: string;
    gameId: string;
    promoteTo: string;
  }) => void;
}
