import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Heading,
  IconButton,
  Image,
  Input,
  List,
  ListItem,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  useDisclosure,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Socket, io } from "socket.io-client";
import { LobbyScreen } from "../components/online/LobbyScreen";
import { OnlineMatch } from "../components/online/OnlineMatch";
import { Message, Move, Piece } from "../../types";
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
    const socket = io("http://localhost:8082");
    setSocket(socket);

    socket.on(
      "roomCreated",
      (response: { room: string; players: string[] }) => {
        setIsRoomCreated(true);
        setPlayers(response.players);
      }
    );

    socket.on("roomJoined", (response: { room: string; players: string[] }) => {
      if (!isRoomCreated) {
        setRoomJoined(response.room);
      }

      setPlayers(response.players);
    });

    socket.on("playerLeft", (response: { room: string; players: string[] }) => {
      setPlayers(response.players);
      console.log("player left :(");
    });

    socket.on("exitedRoom", (response: { message: string }) => {
      console.log(response.message);
      setRoomJoined("");
    });

    socket.on(
      "goToBoard",
      (response: {
        gameId: string;
        status: string;
        colour: "white" | "black";
        whiteToMove: boolean;
        pieces: Piece[];
        roomCode: string;
      }) => {
        // if room code != saved room code, return
        console.log(response.gameId);
        colour.current = response.colour;
        gameId.current = response.gameId;
        whiteToMove.current = true;
        setStatus("match");
        setPieces(response.pieces);
        setIsYourMove(Boolean(response.colour === "white"));
        setGameRoomCode(response.roomCode);
        setCapturedPieces([]);
      }
    );

    socket.on(
      "moveComplete",
      (response: {
        gameId: string;
        status: string;
        whiteToMove: boolean;
        pieces: Piece[];
        moves: Move[];
        capturedPieces: Piece[];
        check: boolean;
      }) => {
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
      (response: {
        gameId: string;
        status: string;
        pieces: Piece[];
        moves: Move[];
        capturedPieces: Piece[];
        whiteToMove: boolean;
        check: boolean;
        winner: string;
      }) => {
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
      (response: {
        gameId: string;
        status: string;
        pieces: Piece[];
        moves: Move[];
        capturedPieces: Piece[];
        whiteToMove: boolean;
        check: boolean;
      }) => {
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
      (response: {
        gameId: string;
        status: string;
        selectedPiece: Piece[];
        pieces: Piece[];
        moves: Move[];
        capturedPieces: Piece[];
        whiteToMove: boolean;
      }) => {
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

    socket.on("draw", (response: { gameId: string }) => {
      if (response.gameId !== gameId.current) {
        return;
      }
      setStatus("draw");
      setIsYourMove(false);
    });

    socket.on(
      "resignation",
      (response: { gameId: string; roomCode: string; winner: string }) => {
        if (response.gameId !== gameId.current) {
          return;
        }
        setStatus("resignation");
        setIsYourMove(false);
        winner.current = response.winner;
      }
    );

    socket.on("outOfTime", (response: { gameId: string; winner: string }) => {
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
      (response: {
        gameId: string;
        roomCode: string;
        exitedPlayer: string;
      }) => {
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
