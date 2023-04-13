import {
  Box,
  Flex,
  IconButton,
  Menu,
  MenuButton,
  MenuList,
  Modal,
  ModalContent,
  ModalOverlay,
  useBreakpointValue,
} from "@chakra-ui/react";
import AnalysisSectionMobile from "./AnalysisSectionMobile";

import Board from "./board/Board";
import { HamburgerIcon, SettingsIcon } from "@chakra-ui/icons";
import { useColour } from "../hooks/useColour";
import {
  Dispatch,
  ElementType,
  FC,
  ReactElement,
  ReactNode,
  SetStateAction,
} from "react";
import { Move, Piece } from "../../types";
import useWindowDimensions from "../hooks/useWindowDimensions";

export function GameScreen({
  modal,
  capturedPiecesTop,
  capturedPiecesBottom,
  menuItems,
  endScreen,
  promoteScreen,
  analysisSection,
  topClock,
  bottomClock,
  moves,
  pieces,
  analysisMode,
  analysisMoveNumber,
  previousPieceMovedFrom,
  previousPieceMovedTo,
  colour,
  selectedPiece,
  handleSquareClick,
  setPieces,
  setAnalysisMode,
  setAnalysisMoveNumber,
}: {
  modal: ReactNode;
  capturedPiecesTop: ReactNode;
  capturedPiecesBottom: ReactNode;
  menuItems: ReactNode;
  endScreen: ReactNode;
  promoteScreen: ReactNode;
  analysisSection: ReactNode;
  topClock: ReactNode;
  bottomClock: ReactNode;
  moves: Move[];
  pieces: Piece[];
  analysisMode: boolean;
  analysisMoveNumber: number;
  previousPieceMovedFrom: string;
  previousPieceMovedTo: string;
  colour: string;
  selectedPiece: Piece | null;
  handleSquareClick: (
    row: number,
    col: number,
    square: string,
    piece: Piece | null
  ) => void;
  setPieces: Dispatch<SetStateAction<Piece[]>>;
  setAnalysisMode: Dispatch<SetStateAction<boolean>>;
  setAnalysisMoveNumber: Dispatch<SetStateAction<number>>;
}) {
  const { height, width } = useWindowDimensions();
  const { colourScheme } = useColour();

  const screenHeight = height - 30;
  const screenWidth = width - 20;
  const possibleBoardHeight = screenHeight - 120;
  const boardHeight = useBreakpointValue({
    base: screenWidth,
    xs: screenWidth,
    sm: screenWidth - 30,
    md: Math.min(600, possibleBoardHeight),
    lg: Math.min(700, possibleBoardHeight),
    xl: Math.min(800, possibleBoardHeight),
    xxl: Math.min(900, possibleBoardHeight),
  })!;

  return (
    <>
      {modal}
      <Flex justify={"center"} mt={["60px", null, null, "8px"]}>
        <Flex
          flexDirection={"column"}
          w={["100%", null, null, null, "90%", "80%"]}
          px={["10px", null, null, "30px", null, "100px"]}
        >
          <Box mb="10px" display={["block", null, "none"]}>
            <AnalysisSectionMobile
              moves={moves}
              pieces={pieces}
              setPieces={setPieces}
              setAnalysisMode={setAnalysisMode}
              analysisMode={analysisMode}
              analysisMoveNumber={analysisMoveNumber}
              setAnalysisMoveNumber={setAnalysisMoveNumber}
            ></AnalysisSectionMobile>
          </Box>
          <Flex h={`${boardHeight + 2 * 50 + 2 * 10}px`} w="100%">
            <Flex flexDirection={"column"}>
              <Flex justify={"space-between"} pb="10px">
                {capturedPiecesTop}

                <Flex>
                  <Menu>
                    <MenuButton
                      as={IconButton}
                      aria-label="Options"
                      icon={<SettingsIcon />}
                      variant="outline"
                      size="lg"
                      h="50px"
                      w="50px"
                      borderRadius={"8px"}
                      borderWidth="2px"
                      borderColor={colourScheme.border}
                      bgColor={colourScheme.darker}
                    />

                    <MenuList zIndex={"20"}>{menuItems}</MenuList>
                  </Menu>
                  {topClock}
                </Flex>
              </Flex>

              <Box>
                <Board
                  pieces={pieces}
                  selectedPiece={selectedPiece}
                  boardHeight={boardHeight}
                  colour={colour}
                  previousPieceMovedFrom={previousPieceMovedFrom}
                  previousPieceMovedTo={previousPieceMovedTo}
                  handleSquareClick={handleSquareClick}
                >
                  {endScreen}
                  {promoteScreen}
                </Board>
              </Box>

              <Flex justify={"space-between"} pt="10px">
                {capturedPiecesBottom}
                {bottomClock}
              </Flex>
            </Flex>

            <Flex
              // w={[null, null, null, "300px", "300px", "400px"]}
              w="100%"
              flexDirection={"column"}
              ml="30px"
              height={"inherit"}
              display={["none", "none", "flex", "flex", "flex", "flex"]}
            >
              {analysisSection}
            </Flex>
          </Flex>
        </Flex>
      </Flex>
    </>
  );
}
