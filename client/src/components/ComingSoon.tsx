import { Box, Flex, Heading, Image } from "@chakra-ui/react";
import bishopShadow from "../assets/pieces/JohnPablok Cburnett Chess set/PNGs/With Shadow/256px/w_bishop_png_shadow_256px.png";

export default function ComingSoon() {
  return (
    <Flex
      justify="center"
      textAlign={"center"}
      direction={"column"}
      alignItems="center"
    >
      <Heading pt="60px" pb="40px" fontSize={"80px"}>
        Coming Soon!
      </Heading>
      <Image w="600px" src={bishopShadow} />
    </Flex>
  );
}
