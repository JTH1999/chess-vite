import { Button } from "@chakra-ui/react";
import { useColour } from "../hooks/useColour";

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
  const { colourScheme } = useColour();
  return (
    <Button
      borderRadius={"12px"}
      bgColor={colourScheme.primary}
      color={"white"}
      padding="20px"
      w={w}
      mt={mt}
      border="0 solid white"
      // boxShadow={"0px 5px 10px rgba(0, 0, 0, 0.11)"}
      fontSize="16px"
      cursor="pointer"
      isDisabled={disabled}
      onClick={onClick}
      transition="0.3s ease"
      _hover={{ bgColor: colourScheme.primaryDarker }}
    >
      {text}
    </Button>
  );
}
