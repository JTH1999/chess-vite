import {
  Box,
  Flex,
  Heading,
  Text,
  Input,
  Button,
  Grid,
  GridItem,
  useBreakpointValue,
} from "@chakra-ui/react";
import { Children, ReactNode, useState } from "react";
import { Form, useLoaderData, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useColour } from "../hooks/useColour";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";
import { Game, Move } from "../../types";
import { PleaseLogin } from "../components/PleaseLogin";
import { newGamePieces } from "../data/newGamePieces";
import Board from "../components/board/Board";

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
  const startingPage =
    data.pagesCount > 5
      ? data.pagesCount - 1 - data.currentPage < 2
        ? data.pagesCount - 5
        : data.currentPage > 2
        ? data.currentPage - 2
        : 0
      : 0;
  for (
    let i = startingPage;
    i < Math.min(5, data.pagesCount) + startingPage;
    i++
  ) {
    pageValues.push(i);
  }

  const columnCount = useBreakpointValue({
    base: 4,
    xs: 4,
    sm: 4,
    md: 5,
    lg: 5,
    xl: 5,
    xxl: 5,
  })!;

  // Responsive styling
  const tableWidth = ["100%", null, null, null, "800px", "800px"];
  const headingFontSizes = ["12px", null, "14px", "18px", "20px"];
  const fontSizes = ["12px", "16px", "16px", "16px", "18px"];
  const columnGaps = ["10px", null, null, "20px", "30px", "40px"];
  const gridTemplateColumns =
    columnCount === 4 ? "2fr 1fr 1fr 1fr" : "4fr 2fr 2fr 2fr 2fr 2fr";
  const tablePadding = ["10px", null, "20px", "30px", "40px"];
  const rowPadding = ["5px", null, "10px", "20px"];
  const pagePx = ["10px", "20px", null, "30px"];

  function PaginationButton({
    children,
    value,
    jumpTo,
  }: {
    children: ReactNode;
    value: number;
    jumpTo: "start" | "end" | "previous" | "next" | "";
  }) {
    return (
      <Form>
        <Input type="hidden" name="page" value={value} />
        <Box
          as="button"
          py="5px"
          px="8px"
          bgColor="transparent"
          cursor="pointer"
          fontSize={fontSizes}
          transition="0.2s linear"
          type="submit"
          isDisabled={
            games.length === 0
              ? true
              : (jumpTo === "start" || jumpTo === "previous") &&
                data.currentPage === 0
              ? true
              : (jumpTo === "end" || jumpTo === "next") &&
                data.currentPage === data.pagesCount - 1
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
        </Box>
      </Form>
    );
  }

  function getPieces(moves: Move[]) {
    let pieces;
    let previousPieceMovedFrom = "";
    let previousPieceMovedTo = "";
    if (moves.length >= 1) {
      pieces = moves[moves.length - 1].pieces;

      const previousPieceIndex = moves[moves.length - 1].movedPieceIndex;
      let previousPiecePreviousPosition;
      if (moves.length === 1) {
        previousPiecePreviousPosition = newGamePieces[previousPieceIndex];
      } else {
        previousPiecePreviousPosition =
          moves[moves.length - 2].pieces[previousPieceIndex];
      }
      previousPieceMovedFrom =
        previousPiecePreviousPosition.currentCol.toString() +
        previousPiecePreviousPosition.currentRow.toString();
      const previousPieceCurrentPosition = pieces[previousPieceIndex];
      previousPieceMovedTo =
        previousPieceCurrentPosition.currentCol.toString() +
        previousPieceCurrentPosition.currentRow.toString();
    } else {
      pieces = newGamePieces;
    }
    return {
      pieces: pieces,
      previousPieceMovedFrom: previousPieceMovedFrom,
      previousPieceMovedTo: previousPieceMovedTo,
    };
  }

  return (
    <>
      {auth?.user.username ? (
        <Flex
          justify={"center"}
          flexDirection="column"
          alignItems="center"
          pt="60px"
          px={pagePx}
        >
          <Heading pb="30px">My Games</Heading>
          <Box
            bgColor={colourScheme.darker}
            borderRadius={"12px"}
            p={tablePadding}
            borderWidth="2px"
            borderColor={colourScheme.border}
          >
            <Box
              position="relative"
              borderBottomWidth={"1px"}
              borderBottomColor={colourScheme.border}
              fontSize={headingFontSizes}
              fontWeight={"bold"}
              px={rowPadding}
              py="8px"
              w={tableWidth}
            >
              <Grid templateColumns={gridTemplateColumns} gap={columnGaps}>
                <GridItem>Opponent</GridItem>
                <GridItem>Colour</GridItem>
                <GridItem>Result</GridItem>
                {columnCount === 4 ? (
                  <></>
                ) : (
                  <>
                    <GridItem>By</GridItem>
                    <GridItem>Moves</GridItem>
                  </>
                )}

                <GridItem>Date</GridItem>
              </Grid>
            </Box>
            {games.map((game) => {
              const boardPosition = getPieces(JSON.parse(game.moves));
              return (
                <Box
                  key={game.id}
                  cursor="pointer"
                  transition="0.3s ease"
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
                  px={rowPadding}
                  py="10px"
                  fontSize={fontSizes}
                  w={tableWidth}
                >
                  <Grid templateColumns={gridTemplateColumns} gap={columnGaps}>
                    <GridItem>
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
                    {columnCount === 4 ? (
                      <></>
                    ) : (
                      <>
                        <GridItem>{game.result}</GridItem>
                        <GridItem>{JSON.parse(game.moves).length}</GridItem>
                      </>
                    )}

                    <GridItem>
                      {new Date(
                        game.createdAt.slice(0, 10)
                      ).toLocaleDateString()}
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
                        pieces={boardPosition.pieces}
                        previousPieceMovedFrom={
                          boardPosition.previousPieceMovedFrom
                        }
                        previousPieceMovedTo={
                          boardPosition.previousPieceMovedTo
                        }
                        colour={
                          game.whiteUser.username === auth.user?.username
                            ? "White"
                            : "Black"
                        }
                        boardHeight={200}
                        selectedPiece={null}
                        handleSquareClick={() => {}}
                      />
                    </Flex>
                  </Flex>
                </Box>
              );
            })}
            <Flex justify="space-between" alignItems={"center"} pt="30px">
              <Text pl="10px" fontSize={fontSizes}>
                Displaying {games.length} of {data.gamesCount} results
              </Text>
              <Flex>
                <PaginationButton value={0} jumpTo={"start"}>
                  <FontAwesomeIcon icon={faAnglesLeft} />
                </PaginationButton>
                <PaginationButton
                  value={data.currentPage - 1}
                  jumpTo={"previous"}
                >
                  <FontAwesomeIcon icon={faAngleLeft} />
                </PaginationButton>
                <>
                  {pageValues.map((value, index) => (
                    <PaginationButton key={index} value={value} jumpTo={""}>
                      <Text>{(value + 1).toString()}</Text>
                    </PaginationButton>
                  ))}
                </>
                <PaginationButton value={data.currentPage + 1} jumpTo={"next"}>
                  <FontAwesomeIcon icon={faAngleRight} />
                </PaginationButton>
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
