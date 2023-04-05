import wRook from "../assets/pieces/w_rook_svg_NoShadow.svg";
import bRook from "../assets/pieces/b_rook_svg_NoShadow.svg";
import wKnight from "../assets/pieces/w_knight_svg_NoShadow.svg";
import bKnight from "../assets/pieces/b_knight_svg_NoShadow.svg";
import wBishop from "../assets/pieces/w_bishop_svg_NoShadow.svg";
import bBishop from "../assets/pieces/b_bishop_svg_NoShadow.svg";
import wQueen from "../assets/pieces/w_queen_svg_NoShadow.svg";
import bQueen from "../assets/pieces/b_queen_svg_NoShadow.svg";

import {
  calculateAllAvailableMoves,
  calculateOppositionLegalMoves,
} from "./square/helperFunctions.js";
import { Move, Piece } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { useColour } from "../hooks/useColour";

export default function PromoteScreen({
  pieces,
  promote,
  whiteKingSquare,
  blackKingSquare,
  whiteToMove,
  selectedPiece,
  moves,
  capturedPieces,
  flipBoard,
  colour,
  setColour,
  setIsCheck,
  setPromote,
  setIsCheckmate,
  setIsStalemate,
  setPieces,
  setWhiteToMove,
  setSelectedPiece,
}: {
  pieces: Piece[];
  promote: boolean;
  whiteKingSquare: string;
  blackKingSquare: string;
  whiteToMove: boolean;
  selectedPiece: Piece | null;
  moves: Move[];
  capturedPieces: Piece[];
  colour: string;
  flipBoard: boolean;
  setColour: Dispatch<SetStateAction<string>>;
  setIsCheck: Dispatch<SetStateAction<boolean>>;
  setPromote: Dispatch<SetStateAction<boolean>>;
  setIsCheckmate: Dispatch<SetStateAction<boolean>>;
  setIsStalemate: Dispatch<SetStateAction<boolean>>;
  setPieces: Dispatch<SetStateAction<Piece[]>>;
  setWhiteToMove: Dispatch<SetStateAction<boolean>>;
  setSelectedPiece: Dispatch<SetStateAction<Piece | null>>;
}) {
  const { colourScheme } = useColour();
  function handleClick(pieceType: string) {
    let piecesCopy = JSON.parse(JSON.stringify(pieces));
    if (selectedPiece === null) {
      throw new Error(
        "selected piece is null when attempting to promote piece"
      );
    }

    if (pieceType == "queen") {
      piecesCopy[selectedPiece.index].type = "queen";
      piecesCopy[selectedPiece.index].src =
        piecesCopy[selectedPiece.index].colour == "white" ? wQueen : bQueen;
    } else if (pieceType == "rook") {
      piecesCopy[selectedPiece.index].type = "rook";
      piecesCopy[selectedPiece.index].src =
        piecesCopy[selectedPiece.index].colour == "white" ? wRook : bRook;
    } else if (pieceType == "knight") {
      piecesCopy[selectedPiece.index].type = "knight";
      piecesCopy[selectedPiece.index].src =
        piecesCopy[selectedPiece.index].colour == "white" ? wKnight : bKnight;
    } else if (pieceType == "bishop") {
      piecesCopy[selectedPiece.index].type = "bishop";
      piecesCopy[selectedPiece.index].src =
        piecesCopy[selectedPiece.index].colour == "white" ? wBishop : bBishop;
    }

    const oppositionKingSquare =
      selectedPiece.colour === "white" ? blackKingSquare : whiteKingSquare;

    let playerColour = selectedPiece.colour;
    let oppositionColour = playerColour === "white" ? "black" : "white";

    const calculateAllAvailableMovesResult = calculateAllAvailableMoves(
      piecesCopy,
      selectedPiece.colour,
      oppositionKingSquare,
      moves
    );
    piecesCopy = calculateAllAvailableMovesResult.pieces;
    const inCheck = calculateAllAvailableMovesResult.inCheck;

    // for each of opposition player's pieces, calculate legal moves.
    const calculateOppositionLegalMovesResult = calculateOppositionLegalMoves(
      piecesCopy,
      oppositionKingSquare,
      oppositionColour,
      capturedPieces,
      moves,
      inCheck
    );

    const isCheckmate = calculateOppositionLegalMovesResult.isCheckmate;
    const isStalemate = calculateOppositionLegalMovesResult.isStalemate;
    piecesCopy = calculateOppositionLegalMovesResult.pieces;

    setIsCheck(inCheck);
    setIsCheckmate(isCheckmate);
    setIsStalemate(isStalemate);
    setPieces(piecesCopy);
    setSelectedPiece(null);
    setWhiteToMove(!whiteToMove);
    setPromote(false);
    if (flipBoard) {
      setColour(colour === "white" ? "black" : "white");
    }
  }

  return (
    <Flex
      display={promote ? "flex" : "none"}
      flexDirection="column"
      className="promote"
      zIndex={5}
      bgColor={colourScheme.body}
      p="20px"
      borderRadius={"16px"}
      boxShadow={"0px 0px 20px 5px rgba(0, 0, 0, 0.2);"}
      position="absolute"
    >
      <Flex justify={"space-between"}>
        <PromoteItem
          pieceType={"queen"}
          whiteSrc={wQueen}
          blackSrc={bQueen}
          handleClick={handleClick}
          whiteToMove={whiteToMove}
        />
        <PromoteItem
          pieceType={"bishop"}
          whiteSrc={wBishop}
          blackSrc={bBishop}
          handleClick={handleClick}
          whiteToMove={whiteToMove}
        />
      </Flex>
      <Flex justify={"space-between"}>
        <PromoteItem
          pieceType={"knight"}
          whiteSrc={wKnight}
          blackSrc={bKnight}
          handleClick={handleClick}
          whiteToMove={whiteToMove}
        />
        <PromoteItem
          pieceType={"rook"}
          whiteSrc={wRook}
          blackSrc={bRook}
          handleClick={handleClick}
          whiteToMove={whiteToMove}
        />
      </Flex>
    </Flex>
  );
}

function PromoteItem({
  pieceType,
  whiteSrc,
  blackSrc,
  handleClick,
  whiteToMove,
}: {
  pieceType: string;
  whiteSrc: string;
  blackSrc: string;
  whiteToMove: boolean;
  handleClick: (pieceType: string) => void;
}) {
  return (
    <Flex justify={"center"} w="100px" m="16px">
      <Image
        h="100px"
        cursor="pointer"
        src={whiteToMove ? whiteSrc : blackSrc}
        onClick={() => handleClick(pieceType)}
      />
    </Flex>
  );
}
