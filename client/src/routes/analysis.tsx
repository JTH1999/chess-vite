import { useLoaderData } from "react-router-dom";
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
import { newGamePieces } from "../data/newGamePieces";
import { useAuth } from "../hooks/useAuth";
import useWindowDimensions from "../hooks/useWindowDimensions";
import { AnalysisSectionV2 } from "../components/AnalysisSectionV2";
import CapturedPieces from "../components/CapturedPieces";
import { AnalysisBoard } from "../components/analysis/AnalysisBoard";
import { Move, Piece } from "../../types";

export function AnalysisRoute() {
    const data = useLoaderData() as {
        success: string;
        game: {
            id: string;
            moves: string;
            winner: string;
            result: string;
            createdAt: Date;
            whiteUser: { username: string };
            blackUser: { username: string };
        };
    };

    const game = data.game;
    const auth = useAuth();
    const moves = useRef(JSON.parse(game.moves));
    const [pieces, setPieces] = useState(moves.current[0].pieces);
    const [analysisMode, setAnalsysisMode] = useState(true);
    const [analysisMoveNumber, setAnalysisMoveNumber] = useState(0);
    const { height, width } = useWindowDimensions();
    const username = auth.user.username;
    const colour = game.whiteUser.username === "username" ? "white" : "black";
    const opposition =
        colour === "white" ? game.blackUser.username : game.whiteUser.username;
    const capturedPieces: Piece[] = [];
    for (const piece of pieces) {
        if (piece.currentCol === -1) {
            capturedPieces.push(piece);
        }
    }

    let previousPieceMovedFrom = "";
    let previousPieceMovedTo = "";

    if (moves.current.length >= 1) {
        const previousPieceIndex =
            moves.current[analysisMoveNumber].movedPieceIndex;
        let previousPiecePreviousPosition;
        if (analysisMoveNumber === 0) {
            previousPiecePreviousPosition = newGamePieces[previousPieceIndex];
        } else {
            previousPiecePreviousPosition =
                moves.current[analysisMoveNumber - 1].pieces[
                    previousPieceIndex
                ];
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
    const screenHeight = height - 30;
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
                                moves={moves.current}
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
