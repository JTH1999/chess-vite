import { Flex, Image } from "@chakra-ui/react";
import { colourContext, useColour } from "../hooks/useColour";
import defaultAvatar from "../assets/defaultAvatar.png";
import { PropsWithChildren, ReactNode } from "react";

export function Avatar({
  children,
  src,
  height,
}: {
  children: ReactNode;
  src: string;
  height: string;
}) {
  const { colourScheme } = useColour();

  return (
    <Flex
      w={height}
      h={height}
      position="relative"
      borderRadius={"12px"}
      overflow="hidden"
      borderWidth="2px"
      borderColor={colourScheme.border}
      bgColor={colourScheme.darker}
    >
      <Image src={src ? src : defaultAvatar} h={"100%"} fit="cover" />
      {children}
    </Flex>
  );
}
