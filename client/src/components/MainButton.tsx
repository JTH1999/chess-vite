import { Button } from "@chakra-ui/react";

export default function MainButton({
    text,
    onClick,
    disabled = false,
    w = "100%",
    mt = "0px",
}: {
    text: string;
    onClick: any;
    disabled: boolean | undefined;
    w: string;
    mt: string;
}) {
    return (
        <Button
            borderRadius={"12px"}
            bgColor="green.400"
            color={"white"}
            padding="20px"
            w={w}
            mt={mt}
            border="0 solid white"
            boxShadow={"0px 5px 10px rgba(0, 0, 0, 0.15)"}
            fontSize="16px"
            cursor="pointer"
            isDisabled={disabled}
            onClick={onClick}
            _hover={{ bgColor: "green.500" }}
        >
            {text}
        </Button>
    );
}
