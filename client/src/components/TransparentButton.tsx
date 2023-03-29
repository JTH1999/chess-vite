import { Button } from "@chakra-ui/react";

export default function TransparentButton({
    text,
    onClick,
    disabled = false,
    w = "100%",
}: {
    text: string;
    onClick: any;
    disabled: any;
    w: string;
}) {
    return (
        <Button
            borderRadius={"12px"}
            bgColor="transparent"
            color={"white"}
            padding="20px"
            w={w}
            mt="20px"
            borderWidth="2px"
            borderColor={"gray.700"}
            boxShadow={"0px 5px 10px rgba(0, 0, 0, 0.15)"}
            fontSize="16px"
            cursor="pointer"
            onClick={onClick}
            _hover={{ borderColor: "gray.600" }}
            disabled={disabled}
        >
            {text}
        </Button>
    );
}
