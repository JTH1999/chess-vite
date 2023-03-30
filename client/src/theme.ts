import { extendTheme } from "@chakra-ui/react";

const config = {
    initialColorMode: "light",
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
};

const theme = extendTheme({ config, colors });
export default theme;
