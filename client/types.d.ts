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

export interface ColourScheme {
  border: string;
  darker: string;
  body: string;
  text: string;
  name: string;
  primary: string;
  primaryDarker: string;
  primarySquare: string;
  primaryMovedLight: string;
  primaryMovedDark: string;
}

export interface User {
  username: null | string;
}

export type AuthContext = {
  user: User;
  validate: (
    username: string,
    password: string,
    setUsernameError: Dispatch<SetStateAction<string>>,
    setPasswordError: Dispatch<SetStateAction<string>>
  ) => boolean;
  signup: (
    username: string,
    password: string,
    setIsSubmitting: Dispatch<SetStateAction<boolean>>,
    setError: Dispatch<SetStateAction<string>>,
    genericErrorMessage: string
  ) => Promise<boolean | undefined>;
  signin: (
    username: string,
    password: string,
    setIsSubmitting: Dispatch<SetStateAction<boolean>>,
    setError: Dispatch<SetStateAction<string>>,
    genericErrorMessage: string
  ) => Promise<boolean>;
  signout: () => void;
  getUser: () => Promise<boolean>;
  getToken: () => string | null;
};

export interface Message {
  text: string;
  name: string;
  id: string;
  type: string;
}

export interface Game {
  id: string;
  moves: string;
  winner: string | null;
  result: string;
  createdAt: string;
  whiteUser: { username: string };
  blackUser: { username: string };
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

  startMatch: (data: { roomCode: string; pieces: Piece[] }) => void;

  sendMove: (data: {
    selectedPiece: Piece;
    square: string;
    roomCode: string;
    gameId: string;
    colour: string;
  }) => void;

  sendMessage: (data: {
    text: string;
    name: string;
    id: string;
    roomCode: string;
  }) => void;

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
