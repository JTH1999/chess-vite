import {
  Box,
  Flex,
  Heading,
  List,
  ListItem,
  Table,
  TableCaption,
  TableContainer,
  Text,
  Tbody,
  Td,
  Tfoot,
  Th,
  Thead,
  Tr,
  Input,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { Children, ReactNode, useState } from "react";
import { Form, useLoaderData, useNavigate } from "react-router-dom";
import Board from "../components/boardImage/Board";
import { useAuth } from "../hooks/useAuth";
import { useColour } from "../hooks/useColour";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAnglesLeft, faAnglesRight } from "@fortawesome/free-solid-svg-icons";
import { Game } from "../../types";
import { PleaseLogin } from "../components/PleaseLogin";

export async function loader({ request }: { request: Request }) {
  const tokenString = localStorage.getItem("token");
  const userToken = tokenString ? JSON.parse(tokenString) : null;
  const url = new URL(request.url);
  const page = url.searchParams.get("page");
  const pageNumber = !page ? "" : "?page=" + parseInt(page).toString();
  return await fetch(
    import.meta.env.VITE_CHESS_API_ENDPOINT + "users/games" + pageNumber,
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
}

export function MyGamesRoute() {
  const [gameHoverId, setGameHoverId] = useState("");
  const data = useLoaderData() as {
    success: boolean;
    games: Game[];
    gamesCount: number;
    pagesCount: number;
    currentPage: number;
  };
  const games = data.games;
  const auth = useAuth();
  const navigate = useNavigate();
  const { colourScheme } = useColour();
  const boardHeight = 200;

  const pageValues = [];
  for (let i = 0; i < data.pagesCount; i++) {
    pageValues.push(i);
  }

  function PaginationButton({
    children,
    value,
    jumpTo,
  }: {
    children: ReactNode;
    value: number;
    jumpTo: "start" | "end" | "";
  }) {
    return (
      <Form>
        <Input type="hidden" name="page" value={value} />
        <Button
          py="5px"
          px="12px"
          bgColor="transparent"
          cursor="pointer"
          fontSize={"18px"}
          transition="0.2s linear"
          type="submit"
          isDisabled={
            games.length === 0
              ? true
              : jumpTo === "start" && data.currentPage === 0
              ? true
              : jumpTo === "end" && data.currentPage === data.pagesCount - 1
              ? true
              : false
          }
          color={
            data.currentPage === value && !jumpTo
              ? colourScheme.primary
              : colourScheme.text
          }
          _hover={{ color: colourScheme.primary }}
        >
          {children}
        </Button>
      </Form>
    );
  }

  return (
    <>
      {auth?.user.username ? (
        <Flex
          justify={"center"}
          flexDirection="column"
          alignItems="center"
          pt="60px"
        >
          <Heading pb="30px">My Games</Heading>
          <Box
            bgColor={colourScheme.darker}
            borderRadius={"12px"}
            p="40px"
            borderWidth="2px"
            borderColor={colourScheme.border}
          >
            <Box
              position="relative"
              borderBottomWidth={"1px"}
              borderBottomColor={colourScheme.border}
              fontSize={"24px"}
              fontWeight={"bold"}
              px="20px"
              py="8px"
            >
              <Grid templateColumns={"4fr 2fr 2fr 2fr 2fr 2fr"} gap="40px">
                <GridItem>Opponent</GridItem>
                <GridItem>Colour</GridItem>
                <GridItem>Result</GridItem>
                <GridItem>By</GridItem>
                <GridItem>Moves</GridItem>
                <GridItem>Date</GridItem>
              </Grid>
            </Box>
            {games.map((game) => (
              <Box
                key={game.id}
                cursor="pointer"
                transition="0.3s ease"
                borderRadius="12px"
                _hover={{
                  backgroundColor: colourScheme.border,
                }}
                onClick={() => {
                  if (JSON.parse(game.moves).length > 0)
                    navigate(`/analysis/${game.id}`);
                }}
                onMouseOver={() => setGameHoverId(game.id)}
                onMouseLeave={() => setGameHoverId("")}
                position="relative"
                borderBottomWidth={"1px"}
                borderBottomColor={colourScheme.border}
                px="20px"
                py="10px"
              >
                <Grid templateColumns={"4fr 2fr 2fr 2fr 2fr 2fr"} gap="40px">
                  <GridItem w="100%">
                    <Box>
                      {game.whiteUser.username === auth.user.username
                        ? game.blackUser.username
                        : game.whiteUser.username}
                    </Box>
                  </GridItem>
                  <GridItem>
                    {game.whiteUser.username === auth.user?.username
                      ? "White"
                      : "Black"}
                  </GridItem>
                  <GridItem>
                    {game.result === "stalemate" || game.result === "draw"
                      ? "Draw"
                      : game.result === "unfinished"
                      ? "Unfinished"
                      : (game.winner === "black" &&
                          game.blackUser.username === auth.user?.username) ||
                        (game.winner === "white" &&
                          game.whiteUser.username === auth.user?.username)
                      ? "Win"
                      : "Loss"}
                  </GridItem>
                  <GridItem>{game.result}</GridItem>
                  <GridItem>{JSON.parse(game.moves).length}</GridItem>
                  <GridItem>
                    {new Date(game.createdAt.slice(0, 10)).toLocaleDateString()}
                  </GridItem>
                </Grid>
                <Flex
                  position={"absolute"}
                  // right="-35%"
                  left="99%"
                  top={`calc(50% - ${boardHeight / 2 + 8}px)`}
                >
                  <Flex
                    position="relative"
                    p="8px"
                    bgColor={colourScheme.border}
                    borderRadius="12px"
                    display={gameHoverId === game.id ? "flex" : "none"}
                  >
                    <Board
                      moves={JSON.parse(game.moves)}
                      colour={
                        game.whiteUser.username === auth.user?.username
                          ? "White"
                          : "Black"
                      }
                      boardHeight={200}
                    />
                  </Flex>
                </Flex>
              </Box>
            ))}
            <Flex justify="space-between" alignItems={"center"} pt="30px">
              <Text pl="10px">
                Displaying {games.length} of {data.gamesCount} results
              </Text>
              <Flex>
                <PaginationButton value={0} jumpTo={"start"}>
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </PaginationButton>
                <>
                  {pageValues.map((value, index) => (
                    <PaginationButton key={index} value={value} jumpTo={""}>
                      <Text>{(value + 1).toString()}</Text>
                    </PaginationButton>
                  ))}
                </>
                <PaginationButton value={data.pagesCount - 1} jumpTo={"end"}>
                  <FontAwesomeIcon icon={faAnglesRight} />
                </PaginationButton>
              </Flex>
            </Flex>
          </Box>
        </Flex>
      ) : (
        <PleaseLogin text={"You must be logged in to view your games."} />
      )}
    </>
  );
}
