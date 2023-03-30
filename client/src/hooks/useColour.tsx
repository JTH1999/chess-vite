import { useColorMode, useTheme } from "@chakra-ui/react";
import { createContext, useContext, useEffect, useRef, useState } from "react";

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

export const colourContext = createContext({
    colourScheme: null,
    updateColourScheme: (colour: string) => {},
    updateTheme: () => {},
});

export function useColour() {
    return useContext(colourContext);
}

export function useColourWrapper() {
    const { colorMode, toggleColorMode } = useColorMode();

    const getColourScheme = () => {
        const colourSchemeString = localStorage.getItem("colourScheme");
        const colourScheme = colourSchemeString ? colourSchemeString : "green";
        return colourScheme;
    };

    const setColourSchemeStorage = (colourScheme: string) => {
        localStorage.setItem("colourScheme", colourScheme);
    };

    function getPrimaryColour() {
        const colour = getColourScheme();
        return colour === "blue"
            ? "blue.400"
            : colour === "purple"
            ? "purple.400"
            : colour === "pink"
            ? "pink.400"
            : colour === "red"
            ? "red.400"
            : colour === "yellow"
            ? "yellow.400"
            : "green.400";
    }

    // Firgured out the weird bug, this is running twice, once with initial (default) colour mode,
    // then with the actual. The actual one is not being saved to state for some reason.
    // Going to work around by initialising with local storage value rather than colorMode (hope it works)
    const dlTheme = localStorage.getItem("chakra-ui-color-mode");
    const scheme = {
        border: dlTheme === "light" ? colors.light.border : colors.dark.border,
        darker: dlTheme === "light" ? colors.light.darker : colors.dark.darker,
        body: dlTheme === "light" ? colors.light.body : colors.dark.body,
        text: dlTheme === "light" ? colors.light.text : colors.dark.text,
        primary: getPrimaryColour(),
    };

    const [colourScheme, setColourScheme] = useState(scheme);

    const updateColourScheme = (colourSchemeString: string) => {
        console.log("here " + colourSchemeString);
        setColourSchemeStorage(colourSchemeString);
        setColourScheme({ ...colourScheme, primary: getPrimaryColour() });
    };

    const updateTheme = () => {
        toggleColorMode();

        const updatedScheme = {
            border:
                colorMode === "light"
                    ? colors.dark.border
                    : colors.light.border,
            darker:
                colorMode === "light"
                    ? colors.dark.darker
                    : colors.light.darker,
            body: colorMode === "light" ? colors.dark.body : colors.light.body,
            text: colorMode === "light" ? colors.dark.text : colors.light.text,
            primary: getPrimaryColour(),
        };
        setColourScheme(updatedScheme);
    };

    // Subscribe to user on mount
    // Because this sets state in the callback it will cause any ...
    // ... component that utilizes this hook to re-render with the ...
    // ... latest auth object.
    // useEffect(() => {
    //     const unsubscribe = (colourScheme) => {
    //         if (colourScheme) {
    //             setColourScheme(colourScheme);
    //         } else {
    //             setColourScheme(colours);
    //         }
    //     };
    //     // Cleanup subscription on unmount
    //     return () => unsubscribe();
    // }, []);

    return {
        colourScheme,
        updateColourScheme,
        updateTheme,
    };
}

export function ProvideColour({ children }) {
    const colourWrapper = useColourWrapper();
    return (
        <colourContext.Provider value={colourWrapper}>
            {children}
        </colourContext.Provider>
    );
}
