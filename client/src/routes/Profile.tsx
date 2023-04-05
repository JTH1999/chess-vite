import {
  Flex,
  Heading,
  Image,
  Input,
  Text,
  useColorMode,
} from "@chakra-ui/react";
import { Link, useLoaderData } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useColour } from "../hooks/useColour";
const defaultAvatar =
  "https://drive.google.com/file/d/1O3yZkHETWKc-TqKKr3ptGTp7ZbRTnMDy/view";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCamera } from "@fortawesome/free-solid-svg-icons";
import { ChangeEvent, useRef, useState } from "react";
import { Avatar } from "../components/Avatar";
import { PleaseLogin } from "../components/PleaseLogin";

export async function loader({ request }: { request: Request }) {
  const tokenString = localStorage.getItem("token");
  const userToken = tokenString ? JSON.parse(tokenString) : null;
  const statsResponse = await fetch(
    import.meta.env.VITE_CHESS_API_ENDPOINT + "users/stats",
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    }
  );

  if (!statsResponse.ok) {
    throw new Error(
      "Could not retrieve user statistics. Please ensure you are logged in."
    );
  }
  const stats = await statsResponse.json();

  const avatarResponse = await fetch(
    import.meta.env.VITE_CHESS_API_ENDPOINT + "users/avatar",
    {
      method: "GET",
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${userToken}`,
      },
    }
  );
  if (!avatarResponse.ok) {
    throw new Error(
      "Could not retrieve avatar. Please ensure you are logged in."
    );
  }
  const avatar = await avatarResponse.blob();

  return {
    stats: stats,
    avatar: avatar,
  };
}

export function ProfileRoute() {
  const auth = useAuth();
  const tokenString = localStorage.getItem("token");
  const userToken = tokenString ? JSON.parse(tokenString) : null;
  const data = useLoaderData() as {
    stats: {
      games: number;
      wins: number;
      losses: number;
      draws: number;
      unfinished: number;
    };
    avatar: Blob;
  };
  console.log(data);
  const stats = data.stats;
  const avatarImg = URL.createObjectURL(data.avatar);
  const [avatar, setAvatar] = useState(avatarImg);
  const { colourScheme } = useColour();
  const hiddenFileInput = useRef<HTMLInputElement>(null);

  const statsSpacing = "60px";

  function handleClick() {
    hiddenFileInput.current!.click();
  }

  function handleChange(event: ChangeEvent<HTMLInputElement>) {
    const fileUploaded = event.target.files?.[0];
    if (fileUploaded) {
      handleFile(fileUploaded);
    }
  }

  async function handleFile(file: Blob) {
    const formData = new FormData();

    formData.append("avatar", file);

    const response = await fetch(
      import.meta.env.VITE_CHESS_API_ENDPOINT + "users/updateAvatar",
      {
        method: "POST",
        body: file,
        credentials: "include",
        headers: {
          Authorization: `Bearer ${userToken}`,
          "Content-Type": "image/png",
        },
      }
    );
    const avatar = await response.blob();
    const avatarImg = URL.createObjectURL(avatar);

    setAvatar(avatarImg);
  }

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
              <Flex mb="60px">
                <Flex mr="60px">
                  <Avatar height="160px" src={avatar}>
                    <Flex
                      zIndex={20}
                      position="absolute"
                      bottom="0%"
                      h="30px"
                      w="100%"
                      bgColor="blackAlpha.600"
                      cursor="pointer"
                      transition="0.3s ease"
                      _hover={{ backgroundColor: "blackAlpha.700" }}
                      justify="center"
                      alignItems={"center"}
                      fontWeight={"semibold"}
                      color={"white"}
                      onClick={handleClick}
                    >
                      <Flex>
                        <Flex mr="10px" alignItems={"center"}>
                          <FontAwesomeIcon icon={faCamera} fontSize={"20px"} />
                        </Flex>
                        <Text>Add</Text>
                      </Flex>
                    </Flex>
                    <Input
                      type="file"
                      accept="image/png, image/jpeg"
                      display="none"
                      ref={hiddenFileInput}
                      onChange={handleChange}
                    />
                  </Avatar>
                </Flex>

                <Flex direction="column" justify={"space-between"}>
                  <Heading
                    as="h1"
                    fontSize={"80px"}
                    textAlign="left"
                    mb="0"
                    pb="0"
                  >
                    {auth?.user.username}
                  </Heading>

                  <Text
                    fontWeight={"400"}
                    mt="30px"
                    fontSize={"24px"}
                    textAlign="left"
                  >
                    Edit your profile and view your statistics
                  </Text>
                </Flex>
              </Flex>
              <Heading
                as="h1"
                fontSize={"60px"}
                textAlign="left"
                mb="0"
                pb="30px"
              >
                Statistics
              </Heading>
              <Flex>
                <Flex direction={"column"} mr={statsSpacing}>
                  <Heading as="h3" fontSize={"40px"} textAlign="left">
                    Played
                  </Heading>
                  <Heading
                    as="h3"
                    fontSize={"120px"}
                    textAlign="left"
                    color={colourScheme.primary}
                  >
                    {stats.games}
                  </Heading>
                </Flex>
                <Flex direction={"column"} mr={statsSpacing}>
                  <Heading as="h3" fontSize={"40px"} textAlign="left">
                    Won
                  </Heading>
                  <Heading
                    as="h3"
                    fontSize={"120px"}
                    textAlign="left"
                    color={colourScheme.primary}
                  >
                    {stats.wins}
                  </Heading>
                </Flex>
                <Flex direction={"column"} mr={statsSpacing}>
                  <Heading as="h3" fontSize={"40px"} textAlign="left">
                    Lost
                  </Heading>
                  <Heading
                    as="h3"
                    fontSize={"120px"}
                    textAlign="left"
                    color={colourScheme.primary}
                  >
                    {stats.losses}
                  </Heading>
                </Flex>
                <Flex direction={"column"} mr={statsSpacing}>
                  <Heading as="h3" fontSize={"40px"} textAlign="left">
                    Drawn
                  </Heading>
                  <Heading
                    as="h3"
                    fontSize={"120px"}
                    textAlign="left"
                    color={colourScheme.primary}
                  >
                    {stats.draws}
                  </Heading>
                </Flex>
                <Flex direction={"column"} mr={statsSpacing}>
                  <Heading as="h3" fontSize={"40px"} textAlign="left">
                    Unfinished
                  </Heading>
                  <Heading
                    as="h3"
                    fontSize={"120px"}
                    textAlign="left"
                    color={colourScheme.primary}
                  >
                    {stats.unfinished}
                  </Heading>
                </Flex>
              </Flex>
              <Link to={"/my-games"}>
                <Heading
                  as="h3"
                  fontSize={"40px"}
                  textAlign="left"
                  pt="60px"
                  _hover={{
                    color: colourScheme.primary,
                    textDecor: "underline",
                  }}
                >
                  Analyse your previous games
                </Heading>
              </Link>
            </Flex>
          </Flex>
        </Flex>
      ) : (
        <PleaseLogin text="Please login to view and edit your profile." />
      )}
    </>
  );
}
