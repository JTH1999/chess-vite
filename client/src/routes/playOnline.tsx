import {
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Socket, io } from "socket.io-client";
import { LobbyScreen } from "../components/online/LobbyScreen";
import { OnlineMatch } from "../components/online/OnlineMatch";
import { ClientToServerEvents, Message, Move, Piece, ServerToClientEvents } from "../../types";
import { PleaseLogin } from "../components/PleaseLogin";

export default function OnlineMatchRoute() {
  const auth = useAuth();
  const [status, setStatus] = useState("lobby");
  const { isOpen, onOpen, onClose } = useDisclosure();
  const buttonRef = useRef();
  const colour = useRef<"white" | "black">("white");
  const whiteToMove = useRef(false);
  const gameId = useRef("");
  const winner = useRef<string | null>(null);
  const [pieces, setPieces] = useState<Piece[]>([]);
  const [moves, setMoves] = useState<Move[]>([]);
  const [capturedPieces, setCapturedPieces] = useState<Piece[]>([]);
  const [isYourMove, setIsYourMove] = useState<boolean>(false);
  const [gameRoomCode, setGameRoomCode] = useState<string | null>(null);
  const [analysisMoveNumber, setAnalysisMoveNumber] = useState(0);
  const [messages, setMessages] = useState<Message[]>([]);
  const [players, setPlayers] = useState<string[]>([]);
  const [isRoomCreated, setIsRoomCreated] = useState(false);
  const [roomJoined, setRoomJoined] = useState("");
  const [socket, setSocket] = useState<Socket | null>(null);

  // using dummy room code for now. Will need to fetch this from server
  const username = auth?.user.username;

  useEffect(() => {
    const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io(import.meta.env.VITE_CHESS_API_ENDPOINT);
    setSocket(socket);

    socket.on(
      "roomCreated",
      (response) => {
        setIsRoomCreated(true);
        setPlayers(response.players);
      }
    );

    socket.on("roomJoined", (response) => {
      if (!isRoomCreated) {
        setRoomJoined(response.room);
      }

      setPlayers(response.players);
    });

    socket.on("playerLeft", (response) => {
      setPlayers(response.players);
      console.log("player left :(");
    });

    socket.on("exitedRoom", (response: { message: string }) => {
      console.log(response.message);
      setRoomJoined("");
    });

    socket.on(
      "goToBoard",
      (response) => {
        // if room code != saved room code, return
        console.log(response.gameId);
        colour.current = response.colour;
        gameId.current = response.gameId;
        whiteToMove.current = true;
        console.log(response.pieces);
        setStatus("match");
        setPieces(response.pieces);
        setIsYourMove(Boolean(response.colour === "white"));
        setGameRoomCode(response.roomCode);
        setCapturedPieces([]);
      }
    );

    socket.on(
      "moveComplete",
      (response) => {
        console.log(response.gameId);
        console.log(gameId);
        if (response.gameId !== gameId.current) {
          return;
        }
        setStatus(response.status);
        whiteToMove.current = response.whiteToMove;

        setPieces(response.pieces);
        const yourMove: boolean =
          (response.whiteToMove && colour.current === "white") ||
          (!response.whiteToMove && colour.current === "black");
        setIsYourMove(yourMove);
        setMoves(response.moves);
        setCapturedPieces(response.capturedPieces);
        setAnalysisMoveNumber(response.moves.length - 1);
      }
    );

    socket.on(
      "checkmate",
      (response) => {
        if (response.gameId !== gameId.current) {
          return;
        }
        setStatus("checkmate");
        whiteToMove.current = response.whiteToMove;
        winner.current = response.winner;
        setPieces(response.pieces);
        setIsYourMove(false);
        setMoves(response.moves);
        setCapturedPieces(response.capturedPieces);
        setAnalysisMoveNumber(response.moves.length - 1);
      }
    );

    socket.on(
      "stalemate",
      (response) => {
        if (response.gameId !== gameId.current) {
          return;
        }
        setStatus("stalemate");
        whiteToMove.current = response.whiteToMove;
        setPieces(response.pieces);
        setIsYourMove(false);
        setMoves(response.moves);
        setCapturedPieces(response.capturedPieces);
        setAnalysisMoveNumber(response.moves.length - 1);
      }
    );

    socket.on(
      "promotePiece",
      (response) => {
        if (response.gameId !== gameId.current) {
          return;
        }
        setStatus("promote");
        whiteToMove.current = response.whiteToMove;
        setPieces(response.pieces);
        setIsYourMove(true);
        setMoves(response.moves);
        setCapturedPieces(response.capturedPieces);
        setAnalysisMoveNumber(response.moves.length - 1);
      }
    );

    socket.on("draw", (response) => {
      if (response.gameId !== gameId.current) {
        return;
      }
      setStatus("draw");
      setIsYourMove(false);
    });

    socket.on(
      "resignation",
      (response) => {
        if (response.gameId !== gameId.current) {
          return;
        }
        setStatus("resignation");
        setIsYourMove(false);
        winner.current = response.winner;
      }
    );

    socket.on("outOfTime", (response) => {
      if (response.gameId !== gameId.current) {
        return;
      }
      winner.current = response.winner;
      setIsYourMove(false);
      setStatus("time");
    });

    socket.on("forfeit", (response: { gameId: string; winner: string }) => {
      if (response.gameId !== gameId.current) {
        return;
      }
      winner.current = response.winner;
      setIsYourMove(false);
      setStatus("forfeit");
    });

    socket.on(
      "gameEnded",
      (response) => {
        if (response.gameId !== gameId.current) {
          return;
        }
        winner.current = response.exitedPlayer; // Player is not the winner, just using existing variable
        setStatus("gameEnded");
        setIsYourMove(false);
      }
    );

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <>
      <>
        {auth?.user.username ? (
          <>
            {status === "lobby" ? (
              <LobbyScreen
                socket={socket!}
                username={username!}
                onOpen={onOpen}
                players={players}
                isRoomCreated={isRoomCreated}
                setIsRoomCreated={setIsRoomCreated}
                roomJoined={roomJoined}
              />
            ) : (
              <OnlineMatch
                colour={colour.current}
                pieces={pieces}
                isYourMove={isYourMove}
                socket={socket!}
                roomCode={gameRoomCode!}
                setIsYourMove={setIsYourMove}
                gameId={gameId.current}
                whiteToMove={whiteToMove.current}
                status={status}
                winner={winner.current}
                capturedPieces={capturedPieces}
                moves={moves}
                setPieces={setPieces}
                analysisMoveNumber={analysisMoveNumber}
                setAnalysisMoveNumber={setAnalysisMoveNumber}
                messages={messages}
                setMessages={setMessages}
                players={players}
              />
            )}
          </>
        ) : (
          <PleaseLogin
            text={"Please login or create an account to play online."}
          />
        )}
      </>
    </>
  );
}
