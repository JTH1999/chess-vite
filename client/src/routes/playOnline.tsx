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
import { CloseIcon, ChatIcon } from "@chakra-ui/icons";
import { useCallback, useEffect, useRef, useState } from "react";
import { useBeforeUnload, useNavigate } from "react-router-dom";
import pawnImage from "../assets/pieces/w_pawn_svg_NoShadow.svg";
import ComingSoon from "../components/ComingSoon";
import MainButton from "../components/MainButton";
import { authContext, useAuth } from "../hooks/useAuth";
import { io } from "socket.io-client";
import TransparentButton from "../components/TransparentButton";
import { ChatDrawer } from "../components/ChatDrawer";
import { LobbyScreen } from "../components/online/LobbyScreen";
import { OnlineBoard } from "../components/online/OnlineBoard";
import { calculateSelectedPieceLegalMoves } from "../components/square/helperFunctions";
import { OnlineMatch } from "../components/online/OnlineMatch";

// const socket = io("http://localhost:8082");

export default function OnlineMatchRoute() {
    const auth = useAuth();
    const [status, setStatus] = useState("lobby");
    const { isOpen, onOpen, onClose } = useDisclosure();
    const buttonRef = useRef();
    const colour = useRef(null);
    const whiteToMove = useRef(false);
    const winner = useRef(null);
    const [pieces, setPieces] = useState([]);
    const [moves, setMoves] = useState([]);
    const [capturedPieces, setCapturedPieces] = useState([]);
    const [isYourMove, setIsYourMove] = useState<Boolean>(false);
    const [gameRoomCode, setGameRoomCode] = useState(null);
    const [gameId, setGameId] = useState("");
    const [analysisMoveNumber, setAnalysisMoveNumber] = useState(0);
    const [messages, setMessages] = useState<
        { text: string; name: string; id: string; socketId: string }[]
    >([]);
    const [players, setPlayers] = useState([]);
    const [isRoomCreated, setIsRoomCreated] = useState(false);
    const [roomJoined, setRoomJoined] = useState("");
    const [socket, setSocket] = useState(null);

    // using dummy room code for now. Will need to fetch this from server
    const username = auth.user?.username;

    // Leave room if navigating away before finishing
    // useBeforeUnload(
    //     useCallback(() => {
    //         console.log("here");
    //         if (roomJoined) {
    //             console.log("here");
    //             socket.emit("leaveRoom", roomJoined);
    //         }
    //     }, [])
    // );

    useEffect(() => {
        const socket = io("http://localhost:8082");
        setSocket(socket);

        socket.on("roomCreated", (response) => {
            setIsRoomCreated(true);
            setPlayers(response.players);
        });

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

        socket.on("exitedRoom", (response) => {
            console.log(response.message);
            setRoomJoined("");
        });

        socket.on("goToBoard", (response) => {
            colour.current = response.colour;
            whiteToMove.current = true;
            setStatus("match");
            setPieces(response.pieces);
            setIsYourMove(Boolean(response.colour === "white"));
            setGameRoomCode(response.roomCode);
            setGameId(response.gameId);
            setCapturedPieces([]);
        });

        socket.on("moveComplete", (response) => {
            setStatus(response.status);
            whiteToMove.current = response.whiteToMove;

            setPieces(response.pieces);
            console.log("inside colour: " + colour.current);
            const yourMove: boolean =
                (response.whiteToMove && colour.current === "white") ||
                (!response.whiteToMove && colour.current === "black");
            setIsYourMove(yourMove);
            setMoves(response.moves);
            setCapturedPieces(response.capturedPieces);
            setAnalysisMoveNumber(response.moves.length - 1);
        });

        socket.on("checkmate", (response) => {
            setStatus("checkmate");
            whiteToMove.current = response.whiteToMove;
            winner.current = response.winner;
            setPieces(response.pieces);
            setIsYourMove(false);
            setMoves(response.moves);
            setCapturedPieces(response.capturedPieces);
            setAnalysisMoveNumber(response.moves.length - 1);
        });

        socket.on("stalemate", (response) => {
            setStatus("stalemate");
            whiteToMove.current = response.whiteToMove;
            setPieces(response.pieces);
            setIsYourMove(false);
            setMoves(response.moves);
            setCapturedPieces(response.capturedPieces);
            setAnalysisMoveNumber(response.moves.length - 1);
        });

        socket.on("promotePiece", (response) => {
            setStatus("promote");
            whiteToMove.current = response.whiteToMove;
            setPieces(response.pieces);
            setIsYourMove(true);
            setMoves(response.moves);
            setCapturedPieces(response.capturedPieces);
            setAnalysisMoveNumber(response.moves.length - 1);
        });

        socket.on("draw", () => {
            setStatus("draw");
            setIsYourMove(false);
        });

        socket.on("resignation", (response) => {
            setStatus("resignation");
            setIsYourMove(false);
            winner.current = response.winner;
        });

        socket.on("outOfTime", (response) => {
            winner.current = response.winner;
            setIsYourMove(false);
            setStatus("time");
        });

        socket.on("forfeit", (response) => {
            console.log("forfeit recveived");
            winner.current = response.winner;
            setIsYourMove(false);
            setStatus("forfeit");
            console.log("forfeit recveived");
        });

        return () => {
            socket.disconnect();
        };
    }, []);

    return (
        <>
            {/* <ChatDrawer
                buttonRef={buttonRef}
                username={username}
                socket={socket}
                isOpen={isOpen}
                onClose={onClose}
                messages={messages}
                setMessages={setMessages}
            /> */}
            {status === "lobby" ? (
                <LobbyScreen
                    socket={socket}
                    username={username}
                    onOpen={onOpen}
                    players={players}
                    isRoomCreated={isRoomCreated}
                    setIsRoomCreated={setIsRoomCreated}
                    roomJoined={roomJoined}
                    setSocket={setSocket}
                />
            ) : (
                <OnlineMatch
                    colour={colour.current}
                    pieces={pieces}
                    isYourMove={isYourMove}
                    socket={socket}
                    roomCode={gameRoomCode}
                    setIsYourMove={setIsYourMove}
                    gameId={gameId}
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
    );
}
