import { Flex, Image } from "@chakra-ui/react";
import translucentCircle from "../../assets/TranslucentCircle.svg";
import translucentRing from "../../assets/TranslucentRing.svg";
import { Piece } from "../../../types";
import { useColour } from "../../hooks/useColour";

export default function AnalysisSquare({
  row,
  col,
  pieces,
  selectedPiece,
  boardHeight,
  previousPieceMovedFrom,
  previousPieceMovedTo,
}: {
  row: number;
  col: number;
  pieces: Piece[];
  selectedPiece: Piece | null | undefined;
  boardHeight: number;
  previousPieceMovedFrom: string;
  previousPieceMovedTo: string;
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

  return (
    <Flex
      alignItems="center"
      justify={"center"}
      bgColor={bgColor}
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
