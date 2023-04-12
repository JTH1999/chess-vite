import {
  Box,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Stack,
  Text,
  useBreakpointValue,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import MainButton from "../components/MainButton";
import TransparentButton from "../components/TransparentButton";
import { useAuth } from "../hooks/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChess,
  faWifi,
  faRobot,
  faMagnifyingGlass,
  faUsers,
  faGear,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useColour } from "../hooks/useColour";
import { IconProp } from "@fortawesome/fontawesome-svg-core";
import Board from "../components/board/Board";
import { newGamePieces } from "../data/newGamePieces";

export default function Home() {
  const [data, setData] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const { colourScheme, updateColourScheme, updateTheme } = useColour();

  // Styling
  const pagePx = ["40px", "40px", "60px", "100px", "100px", "240px"];
  const headingFontSize = ["45px", "30px", "40px", "45px", null, "60px"];
  const boardHeight = useBreakpointValue({
    base: 150,
    xs: 200,
    sm: 250,
    md: 300,
    lg: 350,
    xl: 400,
    xxl: 450,
  })!;

  return (
    <>
      {auth?.user.username ? (
        <Flex justify="center" direction="column" px={pagePx}>
          <Flex
            justify="center"
            py={["60px", "60px", "60px", "40px", "60px", "60px"]}
          >
            <Flex
              alignItems="start"
              textAlign="left"
              direction="column"
              w="100%"
            >
              <Heading
                as="h1"
                fontSize={headingFontSize}
                textAlign="left"
                mb="0"
                pb="0"
              >
                Hiya {auth.user.username} 👋
              </Heading>

              <Text
                fontWeight={"400"}
                mt="30px"
                fontSize={["20px", "24px"]}
                textAlign="left"
              >
                What would you like to do today?
              </Text>
            </Flex>
          </Flex>
          <Grid
            templateColumns={[
              "1fr 1fr",
              null,
              "1fr 1fr",
              "1fr 1fr",
              "1fr 1fr 1fr",
              null,
            ]}
            columnGap={["30px", "40px"]}
            rowGap={["40px", null, null, "60px"]}
          >
            <GridItem>
              <Flex justify="start">
                <GameCard
                  icon={faChess}
                  heading={"Local match"}
                  text="Play offline against a friend"
                  link="/local-match"
                  colourBackground={false}
                />
              </Flex>
            </GridItem>
            <GridItem>
              <GameCard
                icon={faRobot}
                heading={"Vs Computer"}
                text="Play against a very bad bot"
                link="/vs-computer"
                colourBackground={false}
              />
            </GridItem>
            <GridItem>
              <Flex justify={"end"}>
                <GameCard
                  icon={faWifi}
                  heading={"Online match"}
                  text="Play online against a friend"
                  link="/online-match"
                  colourBackground={false}
                />
              </Flex>
            </GridItem>
            <GridItem>
              <Flex justify="start">
                <GameCard
                  icon={faMagnifyingGlass}
                  heading={"Analysis"}
                  text="Analyse your previous matches"
                  link="/my-games"
                  colourBackground={false}
                />
              </Flex>
            </GridItem>
            <GridItem>
              <GameCard
                icon={faUsers}
                heading={"Friends"}
                text="View and add friends"
                link="/friends"
                colourBackground={false}
              />
            </GridItem>
            <GridItem>
              <Flex justify="end">
                <GameCard
                  icon={faUser}
                  heading={"My Profile"}
                  text="View and edit your profile"
                  link="/profile"
                  colourBackground={false}
                />
              </Flex>
            </GridItem>
          </Grid>
        </Flex>
      ) : (
        <Flex justify="center" direction="column">
          <Flex justify="center" px={pagePx} py="60px">
            <Flex
              alignItems="start"
              textAlign="right"
              direction="column"
              pr={["0", null, "60px"]}
            >
              <Heading
                as="h1"
                fontSize={headingFontSize}
                textAlign="left"
                mb="0"
                pb="0"
              >
                <Flex flexWrap={"wrap"}>
                  <Flex>Experience&nbsp;</Flex>
                  <Flex>the&nbsp;</Flex>
                  <Flex color={colourScheme.primary}>buggiest&nbsp;</Flex>
                  <Flex color={colourScheme.primary}>chess&nbsp;</Flex>
                  <Flex color={colourScheme.primary}>site&nbsp;</Flex>
                  <Flex>on&nbsp;</Flex>
                  <Flex>the&nbsp;</Flex>
                  <Flex>web&nbsp;</Flex>
                  <Flex>🐛</Flex>
                </Flex>
              </Heading>

              <Text
                fontWeight={"400"}
                mt="30px"
                fontSize={["18px", null, null, null, "20px", "22px"]}
                textAlign="left"
              >
                With incredible features like local matches and deselecting
                pieces, you'd be crazy to choose robust, popular sites like
                Chess.com
              </Text>
              <Flex w="100%">
                <HStack
                  w="100%"
                  alignItems={"center"}
                  mt="30px"
                  spacing={"20px"}
                >
                  <MainButton
                    text="Sign In"
                    onClick={() => navigate("/login")}
                    w="30%"
                    mt="0"
                    disabled={false}
                  />
                  <TransparentButton
                    text="Sign Up"
                    onClick={() => navigate("/login")}
                    w="30%"
                    disabled={false}
                  />
                </HStack>
              </Flex>
            </Flex>
            <Box display={["none", null, "block"]}>
              <Board
                pieces={newGamePieces}
                selectedPiece={null}
                colour={"white"}
                boardHeight={boardHeight}
                previousPieceMovedFrom={""}
                previousPieceMovedTo={""}
                handleSquareClick={() => {}}
              />
            </Box>
          </Flex>
          <Box
            bgColor={colourScheme.primary}
            py={["60px", "100px"]}
            px={pagePx}
          >
            <Grid templateColumns={"1fr 1fr 1fr"} columnGap={"20px"}>
              <GameCard
                icon={faChess}
                heading={"Local match"}
                text="Play offline against a friend"
                link="/local-match"
                colourBackground={true}
              />
              <GameCard
                icon={faRobot}
                heading={"Vs Computer"}
                text="Play against a very bad bot"
                link="/vs-computer"
                colourBackground={true}
              />
              <GameCard
                icon={faWifi}
                heading={"Online match"}
                text="Play online against a friend"
                link="/online-match"
                colourBackground={true}
              />
            </Grid>
          </Box>
        </Flex>
      )}
    </>
  );
}

function GameCard({
  icon,
  heading,
  text,
  link,
  colourBackground,
}: {
  icon: IconProp;
  heading: string;
  text: string;
  link: string;
  colourBackground: boolean;
}) {
  const navigate = useNavigate();
  const { colourScheme } = useColour();
  return (
    <Flex
      cursor="pointer"
      onClick={() => navigate(link)}
      _hover={{
        color: colourBackground ? "gray.800" : colourScheme.primary,
      }}
      color={colourBackground ? "white" : colourScheme.text}
    >
      {colourBackground ? (
        <>
          {/* <Flex
            // w="100px"
            justify="center"
            transition="0.2s ease"
            fontSize={"80px"}
          >
            <FontAwesomeIcon icon={icon} />
          </Flex> */}

          <Flex direction={"column"} transition="0.2s ease" textAlign="center">
            <Flex
              // w="100px"
              justify="center"
              // transition="0.2s ease"
              fontSize={["50px", "80px"]}
              mb="10px"
            >
              <FontAwesomeIcon icon={icon} />
            </Flex>
            <Heading
              mb="6px"
              fontSize={["20px", null, null, null, null, "40px"]}
            >
              {heading}
            </Heading>
            <Text
              fontSize={["16px", null, null, "20px", null, "20px"]}
              display={["none", "block"]}
            >
              {text}
            </Text>
          </Flex>
        </>
      ) : (
        <>
          {/* <Flex
            w="100px"
            justify="center"
            color={colourScheme.primary}
            fontSize={["60px", "80px"]}
          >
            <FontAwesomeIcon icon={icon} />
          </Flex> */}

          <Flex
            flex="1"
            direction={"column"}
            // ml="30px"
            transition="0.2s ease"
            textAlign={"center"}
          >
            <Flex
              // w="100px"
              justify="center"
              color={colourScheme.primary}
              fontSize={["50px", "80px"]}
              mb="10px"
            >
              <FontAwesomeIcon icon={icon} />
            </Flex>

            <Heading
              mb="6px"
              fontSize={["18px", null, null, "32px", null, "40px"]}
            >
              {heading}
            </Heading>
            <Text fontSize={["16px", null, null, "20px", null, "20px"]}>
              {text}
            </Text>
          </Flex>
        </>
      )}
    </Flex>
  );
}
