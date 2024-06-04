import { extendTheme } from "@chakra-ui/react";
import { switchAnatomy } from "@chakra-ui/anatomy";
import { createMultiStyleConfigHelpers } from "@chakra-ui/react";

const { definePartsStyle, defineMultiStyleConfig } =
  createMultiStyleConfigHelpers(switchAnatomy.keys);

const config = {
  initialColorMode: "system",
  useSystemColorMode: false,
};

const darkBody = "#1A202C"; // gray.800
const darkDarker = "#171923"; // gray.900
const darkBorder = "#2D3748"; // gray.700

const lightBody = "#FFFFFF"; // white
const lightDarker = "#EDF2F7"; // gray.100
const lightBorder = "#E2E8F0"; // gray.200

const colors = {
  dark: {
    body: darkBody,
    darker: darkDarker,
    border: darkBorder,
    text: "white",
  },
  light: {
    body: lightBody,
    darker: lightDarker,
    border: lightBorder,
    text: darkBody,
  },
  primary: "red.400",
};

const components = {
  Radio: {
    variants: {
      green: ({ colorScheme = "green" }) => ({
        control: {
          _checked: {
            color: "white",
            _hover: { borderColor: "green.500", backgroundColor: "green.500" },
            borderColor: `green.400`,
            backgroundColor: `green.400`,
          },
        },
      }),
      blue: ({ colorScheme = "blue" }) => ({
        control: {
          _checked: {
            color: "white",
            _hover: { borderColor: "blue.500", backgroundColor: "blue.500" },
            borderColor: `blue.400`,
            backgroundColor: `blue.400`,
          },
        },
      }),
      red: ({ colorScheme = "red" }) => ({
        control: {
          _checked: {
            color: "white",
            _hover: { borderColor: "red.500", backgroundColor: "red.500" },
            borderColor: `red.400`,
            backgroundColor: `red.400`,
          },
        },
      }),
      pink: ({ colorScheme = "pink" }) => ({
        control: {
          _checked: {
            color: "white",
            _hover: { borderColor: "pink.500", backgroundColor: "pink.500" },
            borderColor: `pink.400`,
            backgroundColor: `pink.400`,
            focusBorderColor: "transparent",
          },
        },
      }),
      purple: ({ colorScheme = "purple" }) => ({
        control: {
          _checked: {
            color: "white",
            _hover: {
              borderColor: "purple.500",
              backgroundColor: "purple.500",
            },
            borderColor: `purple.400`,
            backgroundColor: `purple.400`,
          },
        },
      }),
      yellow: ({ colorScheme = "yellow" }) => ({
        control: {
          _checked: {
            color: "white",
            _hover: {
              borderColor: "yellow.500",
              backgroundColor: "yellow.500",
            },
            borderColor: `yellow.400`,
            backgroundColor: `yellow.400`,
          },
        },
      }),
      //   primary: ({ colorScheme = "primary" }) => ({
      //     control: {
      //       _checked: {
      //         color: "white",
      //         borderColor: `${colors.primary}`,
      //         backgroundColor: `${colors.primary}`,
      //       },
      //     },
      //   }),
    },

    defaultProps: {
      variant: "green",
      colorScheme: "green",
    },
  },
  Switch: {
    variants: {
      green: ({ colorScheme = "green" }) => ({
        track: {
          _checked: {
            bg: "green.400",
          },
        },
      }),
      blue: ({ colorScheme = "blue" }) => ({
        track: {
          _checked: {
            bg: "blue.400",
          },
        },
      }),
      pink: ({ colorScheme = "pink" }) => ({
        track: {
          _checked: {
            bg: "pink.400",
          },
        },
      }),
      purple: ({ colorScheme = "purple" }) => ({
        track: {
          _checked: {
            bg: "purple.400",
          },
        },
      }),
      yellow: ({ colorScheme = "yellow" }) => ({
        track: {
          _checked: {
            bg: "yellow.400",
          },
        },
      }),
      red: ({ colorScheme = "red" }) => ({
        track: {
          _checked: {
            bg: "red.400",
          },
        },
      }),
    },
    defaultProps: {
      variant: "green",
      colorScheme: "green",
    },
  },
};

const theme = extendTheme({ config, colors, components });
export default theme;
