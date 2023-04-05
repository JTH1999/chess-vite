import { Flex, Image } from "@chakra-ui/react";
import translucentCircle from "../../assets/TranslucentCircle.svg";
import translucentRing from "../../assets/TranslucentRing.svg";
import { Piece } from "../../../types";
import { Socket } from "socket.io-client";
import { useColour } from "../../hooks/useColour";
import { Dispatch, SetStateAction } from "react";

export default function OnlineSquare({
  row,
  col,
  pieces,
  selectedPiece,
  isYourMove,
  socket,
  roomCode,
  colour,
  gameId,
  boardHeight,
  analysisMode,
  previousPieceMovedFrom,
  previousPieceMovedTo,
  setSelectedPiece,
  setIsYourMove,
}: {
  row: number;
  col: number;
  pieces: Piece[];
  selectedPiece: Piece | null | undefined;
  isYourMove: boolean;
  socket: Socket;
  roomCode: string;
  colour: string;
  gameId: string;
  boardHeight: number;
  analysisMode: boolean;
  previousPieceMovedFrom: string;
  previousPieceMovedTo: string;
  setSelectedPiece: Dispatch<SetStateAction<Piece | null>>;
  setIsYourMove: Dispatch<SetStateAction<boolean>>;
}) {
  const { colourScheme } = useColour();
  const square = col.toString() + row.toString();
  let piece: Piece | null = null;
  const height = boardHeight / 8;

  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].currentRow === row && pieces[i].currentCol === col) {
      piece = pieces[i];
      break;
    }
  }

  let bgColor;
  if (row % 2 === 0) {
    bgColor =
      col % 2 !== 0
        ? (selectedPiece !== null &&
            selectedPiece !== undefined &&
            selectedPiece.currentCol === col &&
            selectedPiece.currentRow === row) ||
          square === previousPieceMovedFrom ||
          square === previousPieceMovedTo
          ? "teal.200"
          : colourScheme.primarySquare
        : (selectedPiece !== null &&
            selectedPiece !== undefined &&
            selectedPiece.currentCol === col &&
            selectedPiece.currentRow === row) ||
          square === previousPieceMovedFrom ||
          square === previousPieceMovedTo
        ? "teal.400"
        : colourScheme.primary;
  } else {
    bgColor =
      col % 2 === 0
        ? (selectedPiece !== null &&
            selectedPiece !== undefined &&
            selectedPiece.currentCol === col &&
            selectedPiece.currentRow === row) ||
          square === previousPieceMovedFrom ||
          square === previousPieceMovedTo
          ? "teal.200"
          : colourScheme.primarySquare
        : (selectedPiece !== null &&
            selectedPiece !== undefined &&
            selectedPiece.currentCol === col &&
            selectedPiece.currentRow === row) ||
          square === previousPieceMovedFrom ||
          square === previousPieceMovedTo
        ? "teal.400"
        : colourScheme.primary;
  }

  function sendMove(selectedPiece: Piece, square: string) {
    const move = {
      selectedPiece: selectedPiece,
      square: square,
      roomCode: roomCode,
      gameId: gameId,
      colour: colour,
    };

    socket.emit("sendMove", move);
    setIsYourMove(false);
    setSelectedPiece(null);
  }

  function handleClick() {
    if (!isYourMove) {
      return;
    }

    if (analysisMode) {
      return;
    }
    // if there is a selected piece
    if (selectedPiece) {
      if (
        piece?.colour === selectedPiece.colour &&
        piece?.name !== selectedPiece.name
      ) {
        let selectedPieceCopy = { ...piece };

        setSelectedPiece(selectedPieceCopy);
        return;
      }

      if (selectedPiece.availableMoves.includes(square)) {
        sendMove(selectedPiece, square);
      } else if (
        selectedPiece.currentCol.toString() +
          selectedPiece.currentRow.toString() ===
        square
      ) {
        setSelectedPiece(null);
      }
      // if no piece selected yet
    } else if (piece) {
      if (piece.colour === colour) {
        let selectedPieceCopy = { ...piece };
        setSelectedPiece(selectedPieceCopy);
      }
    }
  }

  return (
    <Flex
      alignItems="center"
      justify={"center"}
      bgColor={bgColor}
      onClick={handleClick}
      float={"left"}
      height={`${height}px`}
      width={`${height}px`}
      userSelect={"none"}
    >
      <Image
        src={piece ? piece.src : undefined}
        zIndex="4"
        h={`${height * 0.8}px`}
        cursor={"pointer"}
      />
      <Image
        src={
          selectedPiece?.availableMoves.includes(square) && !piece
            ? translucentCircle
            : undefined
        }
        className="available-marker"
        w={`${height * 0.4}px`}
        zIndex={"20"}
        position="absolute"
      />
      <Image
        src={
          selectedPiece?.availableMoves.includes(square) && piece
            ? translucentRing
            : undefined
        }
        className="available-marker-piece"
        w={`${height}px`}
        zIndex={"3"}
        position="absolute"
      />
    </Flex>
  );
}
