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
    name: "",
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

    const name = colour ? colour : "green";
    return {
      name,
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
  let dlTheme = localStorage.getItem("chakra-ui-color-mode")
  dlTheme = dlTheme ? dlTheme : colorMode

  const {
    name,
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
    name: name,
    primary: primary,
    primaryDarker: primaryDarker,
    primarySquare: primarySquare,
    primaryMovedLight: primaryMovedLight,
    primaryMovedDark: primaryMovedDark,
  };

  const [colourScheme, setColourScheme] = useState(scheme);

  const updateColourScheme = (colourSchemeString: string) => {
    setColourSchemeStorage(colourSchemeString);
    const {
      name,
      primary,
      primaryDarker,
      primarySquare,
      primaryMovedLight,
      primaryMovedDark,
    } = getPrimaryColour();
    setColourScheme({
      ...colourScheme,
      name: name,
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
      name,
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
      name: name,
      primary: primary,
      primaryDarker: primaryDarker,
      primarySquare: primarySquare,
      primaryMovedLight: primaryMovedLight,
      primaryMovedDark: primaryMovedDark,
    };
    setColourScheme(updatedScheme);
  };

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
