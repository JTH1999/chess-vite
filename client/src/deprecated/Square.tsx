import { Flex, Image } from "@chakra-ui/react";
import { Piece } from "../../types";
import { useColour } from "../hooks/useColour";

export default function Square({
  row,
  col,
  pieces,
  boardHeight,
  previousPieceMovedFrom,
  previousPieceMovedTo,
}: {
  row: number;
  col: number;
  pieces: Piece[];
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
        ? square === previousPieceMovedFrom || square === previousPieceMovedTo
          ? "teal.200"
          : colourScheme.primarySquare
        : square === previousPieceMovedFrom || square === previousPieceMovedTo
        ? "teal.400"
        : colourScheme.primary;
  } else {
    bgColor =
      col % 2 === 0
        ? square === previousPieceMovedFrom || square === previousPieceMovedTo
          ? "teal.200"
          : colourScheme.primarySquare
        : square === previousPieceMovedFrom || square === previousPieceMovedTo
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
    </Flex>
  );
}
