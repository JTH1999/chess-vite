import { Button } from "@chakra-ui/react";
import { useColour } from "../hooks/useColour";

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
  const { colourScheme } = useColour();
  return (
    <Button
      borderRadius={"12px"}
      bgColor="transparent"
      color={colourScheme.text}
      padding="20px"
      w={w}
      mt="20px"
      borderWidth="2px"
      borderColor={colourScheme.border}
      // boxShadow={"0px 5px 10px rgba(0, 0, 0, 0.1)"}
      fontSize="16px"
      cursor="pointer"
      onClick={onClick}
      transition="0.3s ease"
      _hover={{ borderColor: colourScheme.primary }}
      disabled={disabled}
    >
      {text}
    </Button>
  );
}
