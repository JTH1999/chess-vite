import { Box, Button, Flex, Text, useColorMode } from "@chakra-ui/react";
import {
    FontAwesomeIcon,
    FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { Link, useNavigate } from "react-router-dom";
import { useColour } from "../hooks/useColour";

export default function MenuButton({
    text,
    url,
    icon = null,
}: {
    text: string;
    url: string;
}) {
    const { colorMode, toggleColorMode } = useColorMode();
    const navigate = useNavigate();
    const { colourScheme, updateColourScheme, updateTheme } = useColour();
    function handleClick() {
        navigate(url);
    }
    return (
        <Button
            textAlign={"left"}
            pl="30px"
            display="block"
            w="100%"
            bgColor="transparent"
            color={colourScheme.text}
            width="100%"
            border="0 solid white"
            fontSize="16px"
            cursor="pointer"
            _hover={{ bgColor: colourScheme.primary, color: "white" }}
            borderRadius="0"
            onClick={handleClick}
        >
            <Flex alignItems={"center"}>
                {icon ? <FontAwesomeIcon icon={icon} /> : <></>}
                <Text ml={icon ? "10px" : "0"} w="50%">
                    {text}
                </Text>
            </Flex>
        </Button>
    );
}
