import wRook from "../../assets/pieces/w_rook_svg_NoShadow.svg";
import bRook from "../../assets/pieces/b_rook_svg_NoShadow.svg";
import wKnight from "../../assets/pieces/w_knight_svg_NoShadow.svg";
import bKnight from "../../assets/pieces/b_knight_svg_NoShadow.svg";
import wBishop from "../../assets/pieces/w_bishop_svg_NoShadow.svg";
import bBishop from "../../assets/pieces/b_bishop_svg_NoShadow.svg";
import wQueen from "../../assets/pieces/w_queen_svg_NoShadow.svg";
import bQueen from "../../assets/pieces/b_queen_svg_NoShadow.svg";
import { Flex, Image } from "@chakra-ui/react";
import { useColour } from "../../hooks/useColour";
import { Socket } from "socket.io-client";

export default function PromoteScreen({
  socket,
  roomCode,
  gameId,
  status,
  whiteToMove,
}: {
  socket: Socket;
  roomCode: string;
  gameId: string;
  status: string;
  whiteToMove: boolean;
}) {
  const { colourScheme } = useColour();

  function handleClick(pieceType: string) {
    const request = {
      roomCode: roomCode,
      gameId: gameId,
      promoteTo: pieceType,
    };
    socket.emit("promotePieceSelected", request);
  }

  return (
    <Flex
      display={status === "promote" ? "flex" : "none"}
      flexDirection="column"
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
