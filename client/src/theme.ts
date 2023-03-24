import { extendTheme } from "@chakra-ui/react";

const config = {
    initialColorMode: "dark",
    useSystemColorMode: false,
};

const colors = {};

const theme = extendTheme({ config });
export default theme;