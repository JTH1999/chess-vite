import { Flex, Heading, Text } from "@chakra-ui/react";
import MainButton from "./MainButton";
import { useNavigate } from "react-router-dom";
import { useColour } from "../hooks/useColour";

export function PleaseLogin({ text }: { text: string }) {
  const navigate = useNavigate();
  const { colourScheme } = useColour();

  return (
    <Flex justify={"center"} pt="120px" px={"10px"}>
      
      <Flex
        borderColor={colourScheme.border}
        borderWidth={"2px"}
        borderRadius={"12px"}
        bgColor={colourScheme.darker}
        direction="column"
        p="50px"
        
        
        textAlign={"center"}
        h="auto"
      >
        <Heading pb="20px">Please Log In</Heading>
        <Text textAlign={"center"} pb="30px">
          {text}
        </Text>
        <MainButton
          onClick={() => navigate("/login")}
          text="Sign in"
          disabled={false}
          w="100%"
          mt="0"
        />
      </Flex>
    </Flex>
  );
}
