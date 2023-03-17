import { Button } from "@chakra-ui/react";

export default function TransparentButton({
    text,
    onClick,
    disabled = false,
}: {
    text: string;
    onClick: any;
    disabled: any;
}) {
    return (
        <Button
            borderRadius={"12px"}
            bgColor="transparent"
            color={"white"}
            padding="20px"
            w="100%"
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
