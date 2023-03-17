import { Box, Flex, Heading } from "@chakra-ui/react";
import CapturedPieces from "../CapturedPieces";
import { OnlineBoard } from "./OnlineBoard";

export function OnlineMatch({
    colour,
    pieces,
    capturedPieces,
    isYourMove,
    socket,
    roomCode,
    setIsYourMove,
    gameId,
    whiteToMove,
    status,
    winner,
}) {
    console.log(
        capturedPieces,
        colour,
        pieces,
        isYourMove,
        roomCode,
        gameId,
        whiteToMove,
        status,
        winner
    );
    return (
        <Flex justify={"center"} pt="20px">
            <Flex flexDirection={"column"}>
                <CapturedPieces
                    capturedPieces={capturedPieces}
                    colour={colour}
                />
                <Flex>
                    <OnlineBoard
                        colour={colour}
                        pieces={pieces}
                        isYourMove={isYourMove}
                        socket={socket}
                        roomCode={roomCode}
                        setIsYourMove={setIsYourMove}
                        gameId={gameId}
                        whiteToMove={whiteToMove}
                        status={status}
                        winner={winner}
                    />
                    <Box
                        bgColor={"gray.900"}
                        borderColor="gray.700"
                        borderWidth="2px"
                        p="50px"
                        ml="50px"
                        // borderRadius={"12px"}
                    >
                        <Heading>Analysis Section</Heading>
                    </Box>
                </Flex>
                <CapturedPieces
                    capturedPieces={capturedPieces}
                    colour={colour === "white" ? "black" : "white"}
                />
            </Flex>
        </Flex>
    );
}
