import { Flex, Image } from "@chakra-ui/react";
import translucentCircle from "../../assets/TranslucentCircle.svg";
import translucentRing from "../../assets/TranslucentRing.svg";
import { Move, Piece } from "../../../types";
import { Socket } from "socket.io-client";

export default function OnlineSquare({
    row,
    col,
    pieces,
    selectedPiece,
    isYourMove,
    socket,
    setSelectedPiece,
    roomCode,
    setIsYourMove,
    colour,
    gameId,
}: {
    row: number;
    col: number;
    pieces: Piece[];
    selectedPiece: Piece | null | undefined;
    isYourMove: boolean;
    roomCode: string;
    colour: string;
}) {
    const square = col.toString() + row.toString();
    let piece: Piece | null = null;

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
                ? selectedPiece !== null &&
                  selectedPiece !== undefined &&
                  selectedPiece.currentCol === col &&
                  selectedPiece.currentRow === row
                    ? "teal.100"
                    : "green.50"
                : selectedPiece !== null &&
                  selectedPiece !== undefined &&
                  selectedPiece.currentCol === col &&
                  selectedPiece.currentRow === row
                ? "teal.400"
                : "green.400";
    } else {
        bgColor =
            col % 2 === 0
                ? selectedPiece !== null &&
                  selectedPiece !== undefined &&
                  selectedPiece.currentCol === col &&
                  selectedPiece.currentRow === row
                    ? "teal.100"
                    : "green.50"
                : selectedPiece !== null &&
                  selectedPiece !== undefined &&
                  selectedPiece.currentCol === col &&
                  selectedPiece.currentRow === row
                ? "teal.400"
                : "green.400";
    }

    function sendMove(selectedPiece: Piece, square: string) {
        const move = {
            selectedPiece: selectedPiece,
            square: square,
            roomCode: roomCode,
            gameId: gameId,
            colour: colour,
        };
        console.log(move);

        socket.emit("sendMove", move);
        setIsYourMove(false);
        setSelectedPiece(null);
    }

    function handleClick() {
        if (!isYourMove) {
            return;
        }

        // if (analysisMode) {
        //     return;
        // }
        // if there is a selected piece
        if (selectedPiece) {
            // if (promote) {
            //     return;
            // }

            // Clicking on another of your pieces switches the selected piece
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
            border="1px solid #999"
            float={"left"}
            height="100px"
            width="100px"
            marginRight={"-1px"}
            marginTop="-1px"
            userSelect={"none"}
        >
            <Image
                src={piece ? piece.src : undefined}
                zIndex="4"
                h="75px"
                cursor={"pointer"}
            />
            <Image
                src={
                    selectedPiece?.availableMoves.includes(square) && !piece
                        ? translucentCircle
                        : undefined
                }
                className="available-marker"
                w="40px"
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
                w="100px"
                zIndex={"3"}
                position="absolute"
            />
        </Flex>
    );
}
