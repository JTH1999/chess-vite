import { useColorMode, useTheme } from "@chakra-ui/react";
import { ColourScheme } from "../../types";
import {
  ReactNode,
  createContext,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";

const colours = {
  dark: {
    body: "gray.800",
    darker: "gray.900",
    border: "gray.700",
    text: "white",
  },
  light: {
    body: "white",
    darker: "gray.100",
    border: "gray.200",
    text: "gray.800",
  },
};

const typedColourContext: {
  colourScheme: ColourScheme;
  updateColourScheme: (colour: string) => void;
  updateTheme: () => void;
} = {
  colourScheme: {
    border: "",
    darker: "",
    body: "",
    text: "",
    primary: "",
    primaryDarker: "",
    primarySquare: "",
    primaryMovedLight: "",
    primaryMovedDark: "",
  },
  updateColourScheme: (colour: string) => {},
  updateTheme: () => {},
};

export const colourContext = createContext(typedColourContext);

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
    const primary =
      colour === "blue"
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
    const primaryDarker =
      colour === "blue"
        ? "blue.500"
        : colour === "purple"
        ? "purple.500"
        : colour === "pink"
        ? "pink.500"
        : colour === "red"
        ? "red.500"
        : colour === "yellow"
        ? "yellow.500"
        : "green.500";

    const primarySquare =
      colour === "blue"
        ? "blue.50"
        : colour === "purple"
        ? "purple.50"
        : colour === "pink"
        ? "pink.50"
        : colour === "red"
        ? "red.50"
        : colour === "yellow"
        ? "yellow.50"
        : "green.50";

    const primaryMovedLight =
      colour === "blue"
        ? "green.200"
        : colour === "purple"
        ? "pink.200"
        : colour === "pink"
        ? "purple.200"
        : colour === "red"
        ? "orange.200"
        : colour === "yellow"
        ? "orange.200"
        : "blue.200";

    const primaryMovedDark =
      colour === "blue"
        ? "green.400"
        : colour === "purple"
        ? "pink.400"
        : colour === "pink"
        ? "purple.400"
        : colour === "red"
        ? "orange.300"
        : colour === "yellow"
        ? "orange.400"
        : "blue.400";
    return {
      primary,
      primaryDarker,
      primarySquare,
      primaryMovedLight,
      primaryMovedDark,
    };
  }

  // Firgured out the weird bug, this is running twice, once with initial (default) colour mode,
  // then with the actual. The actual one is not being saved to state for some reason.
  // Going to work around by initialising with local storage value rather than colorMode (hope it works)
  const dlTheme = localStorage.getItem("chakra-ui-color-mode");
  const {
    primary,
    primaryDarker,
    primarySquare,
    primaryMovedLight,
    primaryMovedDark,
  } = getPrimaryColour();
  const scheme = {
    border: dlTheme === "light" ? colours.light.border : colours.dark.border,
    darker: dlTheme === "light" ? colours.light.darker : colours.dark.darker,
    body: dlTheme === "light" ? colours.light.body : colours.dark.body,
    text: dlTheme === "light" ? colours.light.text : colours.dark.text,
    primary: primary,
    primaryDarker: primaryDarker,
    primarySquare: primarySquare,
    primaryMovedLight: primaryMovedLight,
    primaryMovedDark: primaryMovedDark,
  };

  const [colourScheme, setColourScheme] = useState(scheme);

  const updateColourScheme = (colourSchemeString: string) => {
    console.log("here " + colourSchemeString);
    setColourSchemeStorage(colourSchemeString);
    const {
      primary,
      primaryDarker,
      primarySquare,
      primaryMovedLight,
      primaryMovedDark,
    } = getPrimaryColour();
    setColourScheme({
      ...colourScheme,
      primary: primary,
      primaryDarker: primaryDarker,
      primarySquare: primarySquare,
      primaryMovedLight: primaryMovedLight,
      primaryMovedDark: primaryMovedDark,
    });
  };

  const updateTheme = () => {
    toggleColorMode();

    const {
      primary,
      primaryDarker,
      primarySquare,
      primaryMovedLight,
      primaryMovedDark,
    } = getPrimaryColour();
    const updatedScheme = {
      border:
        colorMode === "light" ? colours.dark.border : colours.light.border,
      darker:
        colorMode === "light" ? colours.dark.darker : colours.light.darker,
      body: colorMode === "light" ? colours.dark.body : colours.light.body,
      text: colorMode === "light" ? colours.dark.text : colours.light.text,
      primary: primary,
      primaryDarker: primaryDarker,
      primarySquare: primarySquare,
      primaryMovedLight: primaryMovedLight,
      primaryMovedDark: primaryMovedDark,
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

export function ProvideColour({ children }: { children: ReactNode }) {
  const colourWrapper = useColourWrapper();
  return (
    <colourContext.Provider value={colourWrapper}>
      {children}
    </colourContext.Provider>
  );
}
