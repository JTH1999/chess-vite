import whiteCheckmate from "../../assets/WhiteCheckmate.png";
import blackCheckmate from "../../assets/BlackCheckmate.png";
import stalematePNG from "../../assets/Stalemate.png";
import { newGamePieces } from "../../data/newGamePieces";
import { Move, Piece } from "../../../types";
import { Dispatch, SetStateAction } from "react";
import { Box, Flex, Heading, IconButton, Image, Text } from "@chakra-ui/react";
import MainButton from "../MainButton";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { CloseIcon } from "@chakra-ui/icons";
import { useColour } from "../../hooks/useColour";
import { Socket } from "socket.io-client";

export default function OnlineEndScreen({
  status,
  winner,
  analysisMode,
  whiteToMove,
  moves,
  socket,
  roomCode,
  setAnalysisMode,
  setAnalysisMoveNumber,
  setPieces,
}: {
  status: string;
  winner: string | null;
  analysisMode: boolean;
  whiteToMove: boolean;
  moves: Move[];
  socket: Socket;
  roomCode: string;
  setPieces: Dispatch<SetStateAction<Piece[]>>;
  setAnalysisMode: Dispatch<SetStateAction<boolean>>;
  setAnalysisMoveNumber: Dispatch<SetStateAction<number>>;
}) {
  const navigate = useNavigate();
  const auth = useAuth();
  const { colourScheme } = useColour();
  const username = auth?.user.username;
  const statuses = [
    "checkmate",
    "stalemate",
    "draw",
    "resignation",
    "forfeit",
    "time",
  ];

  function enterAnalysisMode() {
    setAnalysisMode(true);
    setAnalysisMoveNumber(0);
    setPieces(moves[0].pieces);
  }

  function handleHomeClick(roomCode: string) {
    navigate("/");
  }

  return (
    <Box
      display={statuses.includes(status) && !analysisMode ? "flex" : "none"}
      flexDirection="column"
      justifyContent={"center"}
      alignItems={"center"}
      zIndex="5"
      bgColor={colourScheme.body}
      p="40px"
      pt="20px"
      borderRadius="16px"
      boxShadow={"0px 0px 20px 5px rgba(0, 0, 0, 0.2);"}
      width={"400px"}
      position="absolute"
      className="checkmate-screen"
    >
      <Flex justify="end" w="100%" mb="-20px">
        <IconButton
          onClick={() => setAnalysisMode(true)}
          aria-label="Close"
          bgColor="transparent"
          icon={<CloseIcon />}
        />
      </Flex>
      <Heading
        textAlign={"center"}
        className="checkmate-winner-text"
        fontSize={"30px"}
        fontWeight="bold"
        margin={"10px"}
      >
        {status === "stalemate"
          ? "Stalemate"
          : status === "draw"
          ? "Draw"
          : `${winner} Wins!`}
      </Heading>
      <Text
        className="checkmate-text"
        fontSize={"20px"}
        fontWeight="700"
        margin={"10px"}
        mt="0"
      >
        {status === "checkmate"
          ? "Checkmate"
          : status === "resignation"
          ? "By resignation"
          : status === "time"
          ? "Out of time"
          : status === "forfeit"
          ? "By forfeit"
          : ""}
      </Text>
      <Image
        src={
          status === "stalemate" || status === "draw"
            ? stalematePNG
            : whiteToMove
            ? blackCheckmate
            : whiteCheckmate
        }
        className="checkmate-screen-pieces"
        w="100%"
        mt={"20px"}
      />
      <MainButton
        onClick={handleHomeClick}
        text="Home"
        mt="20px"
        disabled={false}
        w="100%"
      />

      <MainButton
        onClick={enterAnalysisMode}
        text="Analyse"
        mt="20px"
        disabled={false}
        w="100%"
      />
    </Box>
  );
}
