import { Box, Button, Flex } from "@chakra-ui/react";
import { Link, useNavigate } from "react-router-dom";

export default function MenuButton({
    text,
    url,
}: {
    text: string;
    url: string;
}) {
    const navigate = useNavigate();
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
            color={"white"}
            width="100%"
            border="0 solid white"
            fontSize="16px"
            cursor="pointer"
            _hover={{ bgColor: "green.500" }}
            borderRadius="0"
            onClick={handleClick}
        >
            {text}
        </Button>
    );
}
