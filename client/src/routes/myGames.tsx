import {
    Box,
    Flex,
    Heading,
    List,
    ListItem,
    Table,
    TableCaption,
    TableContainer,
    Tbody,
    Td,
    Tfoot,
    Th,
    Thead,
    Tr,
} from "@chakra-ui/react";
import { useState } from "react";
import { useLoaderData, useNavigate } from "react-router-dom";
import Board from "../components/boardImage/Board";
import { useAuth } from "../hooks/useAuth";

export function MyGamesRoute() {
    const [gameHoverId, setGameHoverId] = useState(null);
    const data = useLoaderData();
    const games = data.games;
    const auth = useAuth();
    const navigate = useNavigate();
    const boardHeight = 200;

    return (
        <Flex
            justify={"center"}
            flexDirection="column"
            alignItems="center"
            pt="60px"
        >
            <Heading pb="30px">My Games</Heading>

            <Box
                bgColor={"gray.900"}
                borderRadius={"12px"}
                p="40px"
                borderWidth="2px"
                borderColor="gray.700"
            >
                <Table variant="simple" w="700px">
                    <TableCaption>{`${auth.user.username}'s matches`}</TableCaption>
                    <Thead bgColor={"gray.900"}>
                        <Tr>
                            <Th fontSize="18px">Opponent</Th>
                            <Th fontSize="18px">Colour</Th>
                            <Th fontSize="18px">Result</Th>
                            <Th fontSize="18px">Moves</Th>
                            <Th fontSize="18px">Date</Th>
                        </Tr>
                    </Thead>
                    <Tbody bgColor={"gray.900"} borderRadius={"12px"}>
                        {games.map((game) => (
                            <Tr
                                key={game.id}
                                cursor="pointer"
                                _hover={{ backgroundColor: "gray.800" }}
                                onClick={() => navigate(`/analysis/${game.id}`)}
                                onMouseOver={() => setGameHoverId(game.id)}
                                onMouseLeave={() => setGameHoverId(null)}
                                position="relative"
                            >
                                <Td>
                                    {game.whiteUser.username ===
                                    auth.user.username
                                        ? game.blackUser.username
                                        : game.whiteUser.username}
                                </Td>
                                <Td>
                                    {game.whiteUser.username ===
                                    auth.user.username
                                        ? "White"
                                        : "Black"}
                                </Td>
                                <Td>
                                    {game.result === "stalemate" ||
                                    game.result === "draw"
                                        ? "Draw"
                                        : game.result === "unfinished"
                                        ? "Unfinished"
                                        : game.winner === auth.user.username
                                        ? "Win"
                                        : "Loss"}
                                </Td>
                                <Td>{JSON.parse(game.moves).length}</Td>
                                <Td>
                                    {new Date(
                                        game.createdAt.slice(0, 10)
                                    ).toLocaleDateString()}
                                </Td>
                                <Flex
                                    position={"absolute"}
                                    // left="100%"
                                    top={`calc(50% - ${boardHeight / 2 + 8}px)`}
                                >
                                    <Flex
                                        position="relative"
                                        p="8px"
                                        bgColor={"gray.600"}
                                        display={
                                            gameHoverId === game.id
                                                ? "flex"
                                                : "none"
                                        }
                                        _after={{
                                            right: "100%",
                                            top: "50%",
                                            borderStyle: "solid",
                                            content: `""`,
                                            height: "0",
                                            width: "0",
                                            position: "absolute",
                                            pointerEvents: "none",
                                            borderColor: "transparent",
                                            borderRightColor: "gray.600",
                                            borderWidth: "20px",
                                            marginTop: "-20px",
                                        }}
                                    >
                                        <Board
                                            moves={JSON.parse(game.moves)}
                                            colour={
                                                game.whiteUser.username ===
                                                auth.user.username
                                                    ? "White"
                                                    : "Black"
                                            }
                                            boardHeight={200}
                                        />
                                    </Flex>
                                </Flex>
                            </Tr>
                        ))}
                    </Tbody>
                </Table>
            </Box>
        </Flex>
    );
}
