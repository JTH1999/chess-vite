import { CheckIcon, CloseIcon, HamburgerIcon } from "@chakra-ui/icons";
import {
    Box,
    Button,
    CheckboxIcon,
    Flex,
    Heading,
    IconButton,
    Input,
    List,
    ListItem,
    Menu,
    MenuButton,
    MenuItem,
    MenuList,
    Text,
    Tooltip,
} from "@chakra-ui/react";
import { useEffect, useRef, useState } from "react";
import { newGamePieces } from "../../data/newGamePieces";
import { useAuth } from "../../hooks/useAuth";
import useWindowDimensions from "../../hooks/useWindowDimensions";
import { AnalysisSectionV2 } from "../AnalysisSectionV2";
import CapturedPieces from "../CapturedPieces";
import { AnalysisBoard } from "./AnalysisBoard";

export function AnalysisScreen({
    colour,
    pieces,
    capturedPieces,
    setPieces,
    moves,
    analysisMoveNumber,
    setAnalysisMoveNumber,
    players,
}) {
    const [analysisMode, setAnalsysisMode] = useState(true);
    const { height, width } = useWindowDimensions();
    const auth = useAuth();
    const username = auth.user.username;
    let opposition: string;
    for (const player of players) {
        if (player !== username) {
            opposition = player;
            break;
        }
    }

    let previousPieceMovedFrom = "";
    let previousPieceMovedTo = "";

    if (moves.length >= 1) {
        const previousPieceIndex = moves[moves.length - 1].movedPieceIndex;
        let previousPiecePreviousPosition;
        if (moves.length === 1) {
            previousPiecePreviousPosition = newGamePieces[previousPieceIndex];
        } else {
            previousPiecePreviousPosition =
                moves[moves.length - 2].pieces[previousPieceIndex];
        }
        previousPieceMovedFrom =
            previousPiecePreviousPosition.currentCol.toString() +
            previousPiecePreviousPosition.currentRow.toString();
        const previousPieceCurrentPosition = pieces[previousPieceIndex];
        previousPieceMovedTo =
            previousPieceCurrentPosition.currentCol.toString() +
            previousPieceCurrentPosition.currentRow.toString();
    }

    // Captured Pieces section height is 50px,
    // +20px for spacing, +extra 20 for top and bottom
    // Will need to make this more responsive and dynamic at some point
    const screenHeight = height - 20;
    const boardHeight = screenHeight - 120;
    return (
        <Flex justify={"center"} pt="8px">
            <Flex flexDirection={"column"}>
                <Flex h={`${screenHeight}px`} maxH={`${screenHeight}px`}>
                    <Flex flexDirection={"column"}>
                        <Flex justify={"space-between"} pb="10px">
                            <CapturedPieces
                                capturedPieces={capturedPieces}
                                colour={colour}
                                username={opposition}
                                top={true}
                            />
                            <Flex>
                                <Menu>
                                    <MenuButton
                                        as={IconButton}
                                        aria-label="Options"
                                        icon={<HamburgerIcon />}
                                        variant="outline"
                                        size="lg"
                                        h="50px"
                                        w="50px"
                                        borderRadius={"0"}
                                        borderWidth="2px"
                                        borderColor={"gray.700"}
                                        mr="10px"
                                        bgColor="gray.900"
                                    />

                                    <MenuList zIndex={"20"}>
                                        <MenuItem>Reset Board</MenuItem>
                                        <MenuItem>Flip Board</MenuItem>
                                    </MenuList>
                                </Menu>
                            </Flex>
                        </Flex>

                        <AnalysisBoard
                            colour={colour}
                            pieces={pieces}
                            boardHeight={boardHeight}
                            previousPieceMovedFrom={previousPieceMovedFrom}
                            previousPieceMovedTo={previousPieceMovedTo}
                        />
                        <Flex justify={"space-between"} pt="10px">
                            <CapturedPieces
                                username={username}
                                capturedPieces={capturedPieces}
                                colour={colour === "white" ? "black" : "white"}
                                top={false}
                            />
                        </Flex>
                    </Flex>

                    <Flex
                        w="400px"
                        flexDirection={"column"}
                        ml="50px"
                        height={"inherit"}
                    >
                        <Box h="100%">
                            <AnalysisSectionV2
                                moves={moves}
                                pieces={pieces}
                                setPieces={setPieces}
                                setAnalysisMode={setAnalsysisMode}
                                analysisMode={true}
                                analysisMoveNumber={analysisMoveNumber}
                                setAnalysisMoveNumber={setAnalysisMoveNumber}
                            />
                        </Box>
                    </Flex>
                </Flex>
            </Flex>
        </Flex>
    );
}
