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
