import { Box, Flex, Heading, HStack, Stack, Text } from "@chakra-ui/react";
import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import Board from "../components/boardImage/Board";
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

export default function Home() {
  const [data, setData] = useState(null);
  const auth = useAuth();
  const navigate = useNavigate();
  const { colourScheme, updateColourScheme, updateTheme } = useColour();

  return (
    <>
      {auth?.user.username ? (
        <Flex justify="center" direction="column">
          <Flex justify="center" px="240px" py="100px">
            <Flex
              alignItems="start"
              textAlign="left"
              direction="column"
              pr="200px"
              w="100%"
            >
              <Heading as="h1" fontSize={"60px"} textAlign="left" mb="0" pb="0">
                Hiya {auth.user.username} 👋
              </Heading>

              <Text
                fontWeight={"400"}
                mt="30px"
                fontSize={"24px"}
                textAlign="left"
              >
                What would you like to do today?
              </Text>
            </Flex>
          </Flex>
          <Flex
            // h="400px"
            justify="space-between"
            px="240"
          >
            <GameCard
              icon={faChess}
              heading={"Local match"}
              text="Play offline against a friend"
              link="/local-match"
              colourBackground={false}
            />
            <GameCard
              icon={faRobot}
              heading={"Vs Computer"}
              text="Play against a very bad bot"
              link="/vs-computer"
              colourBackground={false}
            />
            <GameCard
              icon={faWifi}
              heading={"Online match"}
              text="Play online against a friend"
              link="/online-match"
              colourBackground={false}
            />
          </Flex>
          <Flex
            // h="400px"
            justify="space-between"
            px="240"
            pt="120px"
          >
            <GameCard
              icon={faMagnifyingGlass}
              heading={"Analysis"}
              text="Analyse your previous matches"
              link="/my-games"
              colourBackground={false}
            />
            <GameCard
              icon={faUsers}
              heading={"Friends"}
              text="View and add friends"
              link="/friends"
              colourBackground={false}
            />
            <GameCard
              icon={faUser}
              heading={"My Profile"}
              text="View and edit your profile"
              link="/profile"
              colourBackground={false}
            />
          </Flex>
        </Flex>
      ) : (
        <Flex justify="center" direction="column">
          <Flex justify="center" px="240px" py="100px">
            <Flex
              alignItems="start"
              textAlign="right"
              direction="column"
              pr="200px"
            >
              <Heading as="h1" fontSize={"60px"} textAlign="left" mb="0" pb="0">
                Experience the{" "}
                <Box
                  color={colourScheme.primary}
                  fontSize={"60px"}
                  textAlign="left"
                  mb="0"
                  pb="0"
                >
                  buggiest chess site
                </Box>{" "}
                on the web 🐛
              </Heading>

              <Text
                fontWeight={"400"}
                mt="30px"
                fontSize={"24px"}
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
            <Flex>
              <Flex>
                <Board moves={[]} colour={"white"} boardHeight={450} />
              </Flex>
            </Flex>
          </Flex>
          <Flex
            bgColor={colourScheme.primary}
            // h="400px"
            justify="space-between"
            px="240"
            py="100px"
          >
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
          </Flex>
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
      w="400px"
      _hover={{
        color: colourBackground ? "gray.800" : colourScheme.primary,
      }}
      color={colourBackground ? "white" : colourScheme.text}
    >
      {colourBackground ? (
        <>
          <Flex w="100px" justify="center" transition="0.2s ease">
            {" "}
            <FontAwesomeIcon icon={icon} fontSize="80px" />
          </Flex>

          <Flex direction={"column"} ml="30px" transition="0.2s ease">
            <Heading fontSize="40px">{heading}</Heading>
            <Text fontSize="20px">{text}</Text>
          </Flex>
        </>
      ) : (
        <>
          <Flex w="100px" justify="center" color={colourScheme.primary}>
            {" "}
            <FontAwesomeIcon icon={icon} fontSize="80px" />
          </Flex>

          <Flex direction={"column"} ml="30px" transition="0.2s ease">
            <Heading fontSize="40px">{heading}</Heading>
            <Text fontSize="20px">{text}</Text>
          </Flex>
        </>
      )}
    </Flex>
  );
}
