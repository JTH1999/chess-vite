import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Piece } from "../../types";
import { useColour } from "../hooks/useColour";
import { Avatar } from "./Avatar";

export default function CapturedPieces({
  username,
  capturedPieces,
  colour,
  top,
  src = null,
}: {
  username: string | null;
  capturedPieces: Piece[];
  colour: string;
  top: boolean;
  src: string | null;
}) {
  const { colourScheme } = useColour();
  // This is the pieces captured by the player
  const playerCapturedPieces = capturedPieces.filter(
    (capturedPiece) => capturedPiece.colour == colour
  );

  // Pieces captured by the opposition
  const oppositionCapturedPieces = capturedPieces.filter(
    (capturedPiece) => capturedPiece.colour != colour
  );

  let playerCapturedPiecesValue = 0;
  for (let i = 0; i < playerCapturedPieces.length; i++) {
    playerCapturedPiecesValue += playerCapturedPieces[i].value!;
  }

  let oppositionCapturedPiecesValue = 0;
  for (let i = 0; i < oppositionCapturedPieces.length; i++) {
    oppositionCapturedPiecesValue += oppositionCapturedPieces[i].value!;
  }

  const capturedPawns = playerCapturedPieces.filter(
    (capturedPiece) => capturedPiece.type == "pawn"
  );

  const capturedKnights = playerCapturedPieces.filter(
    (capturedPiece) => capturedPiece.type == "knight"
  );

  const capturedBishops = playerCapturedPieces.filter(
    (capturedPiece) => capturedPiece.type == "bishop"
  );

  const capturedRooks = playerCapturedPieces.filter(
    (capturedPiece) => capturedPiece.type == "rook"
  );

  const capturedQueens = playerCapturedPieces.filter(
    (capturedPiece) => capturedPiece.type == "queen"
  );

  return (
    <Flex alignItems={"end"}>
      <Flex mr="10px">
        <Avatar height="50px" src={src ? src : ""} children={undefined} />
      </Flex>

      <Flex flexDirection="column">
        <Flex></Flex>
        <Text fontSize={"18px"} fontWeight="semibold" mb="-1px">
          {username}
        </Text>
        <Flex
          className="captured-pieces-section"
          height="24px"
          alignItems={"end"}
          fontSize="16px"
        >
          <CapturedPiecesGroup capturedPiecesGroup={capturedPawns} />
          <CapturedPiecesGroup capturedPiecesGroup={capturedKnights} />
          <CapturedPiecesGroup capturedPiecesGroup={capturedBishops} />
          <CapturedPiecesGroup capturedPiecesGroup={capturedRooks} />
          <CapturedPiecesGroup capturedPiecesGroup={capturedQueens} />
          <Flex>
            <Text p="0" m="0">
              {playerCapturedPiecesValue > oppositionCapturedPiecesValue
                ? "+ " +
                  (
                    playerCapturedPiecesValue - oppositionCapturedPiecesValue
                  ).toString()
                : ""}
            </Text>
          </Flex>
        </Flex>
      </Flex>
    </Flex>
  );
}

function CapturedPiecesGroup({
  capturedPiecesGroup,
}: {
  capturedPiecesGroup: Piece[];
}) {
  let capturedPiecesGroupImages = <></>;
  let zIndex = 9;
  if (capturedPiecesGroup.length > 0) {
    capturedPiecesGroupImages = (
      <Flex className="captured-piece-type" alignItems={"center"} mr="14px">
        {capturedPiecesGroup.map((capturedPiece, index) => (
          <Image
            key={capturedPiece.index}
            src={capturedPiece.src}
            className="captured-pieces"
            zIndex={zIndex - index}
            h="20px"
            mr={capturedPiecesGroup.length > 1 ? "-8px" : "0"}
            position={"relative"}
          />
        ))}
      </Flex>
    );
  }

  return capturedPiecesGroupImages;
}
