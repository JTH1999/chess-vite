import { Flex, Image, Img } from "@chakra-ui/react";
import { Move, Piece } from "../../../../types";
import translucentCircle from "../../../assets/TranslucentCircle.svg";
import translucentRing from "../../../assets/TranslucentRing.svg";
import { useColour } from "../../../hooks/useColour";

export default function Square({
  row,
  col,
  pieces,
  selectedPiece,
  boardHeight,
  previousPieceMovedFrom,
  previousPieceMovedTo,
  handleSquareClick,
}: {
  row: number;
  col: number;
  pieces: Piece[];
  selectedPiece: Piece | null;
  boardHeight: number;
  previousPieceMovedFrom: string;
  previousPieceMovedTo: string;
  handleSquareClick: (
    row: number,
    col: number,
    square: string,
    piece: Piece | null
  ) => void;
}) {
  const { colourScheme } = useColour();

  let bgColor;

  const square = col.toString() + row.toString();
  let piece: Piece | null = null;
  const height = boardHeight / 8;

  for (let i = 0; i < pieces.length; i++) {
    if (pieces[i].currentRow === row && pieces[i].currentCol === col) {
      piece = pieces[i];
      break;
    }
  }

  function handleClick() {
    handleSquareClick(row, col, square, piece);
  }

  if (row % 2 === 0) {
    bgColor =
      col % 2 !== 0
        ? (selectedPiece !== null &&
            selectedPiece.currentCol === col &&
            selectedPiece.currentRow === row) ||
          square === previousPieceMovedFrom ||
          square === previousPieceMovedTo
          ? colourScheme.primaryMovedLight
          : colourScheme.primarySquare
        : (selectedPiece !== null &&
            selectedPiece.currentCol === col &&
            selectedPiece.currentRow === row) ||
          square === previousPieceMovedFrom ||
          square === previousPieceMovedTo
        ? colourScheme.primaryMovedDark
        : colourScheme.primary;
  } else {
    bgColor =
      col % 2 === 0
        ? (selectedPiece !== null &&
            selectedPiece.currentCol === col &&
            selectedPiece.currentRow === row) ||
          square === previousPieceMovedFrom ||
          square === previousPieceMovedTo
          ? colourScheme.primaryMovedLight
          : colourScheme.primarySquare
        : (selectedPiece !== null &&
            selectedPiece.currentCol === col &&
            selectedPiece.currentRow === row) ||
          square === previousPieceMovedFrom ||
          square === previousPieceMovedTo
        ? colourScheme.primaryMovedDark
        : colourScheme.primary;
  }

  return (
    <Flex
      alignItems="center"
      justify={"center"}
      bgColor={bgColor}
      onClick={handleClick}
      height={`${height}px`}
      width={`${height}px`}
      userSelect={"none"}
      position={"relative"}
    >
      <Image
        src={piece ? piece.src : undefined}
        zIndex="4"
        h={`${height * 0.8}px`}
        cursor={"pointer"}
      />
      <Img
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
      <Img
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
