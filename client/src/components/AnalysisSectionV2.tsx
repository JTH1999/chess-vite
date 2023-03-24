import {
    Box,
    Button,
    Flex,
    Grid,
    GridItem,
    Heading,
    Image,
    Text,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
    faAnglesLeft,
    faAngleLeft,
    faAnglesRight,
    faAngleRight,
} from "@fortawesome/free-solid-svg-icons";
import { Move, Piece } from "../../types";
import { Dispatch, SetStateAction, useEffect, useRef } from "react";
import MenuButton from "./MenuButton";
import { ChevronLeftIcon } from "@chakra-ui/icons";

export function AnalysisSectionV2({
    moves,
    pieces,
    setPieces,
    setAnalysisMode,
    analysisMode,
    analysisMoveNumber,
    setAnalysisMoveNumber,
}: {
    moves: Move[];
    pieces: Piece[];
    setPieces: Dispatch<SetStateAction<Piece[]>>;
    setAnalysisMode: Dispatch<SetStateAction<boolean>>;
    analysisMode: boolean;
    analysisMoveNumber: number;
    setAnalysisMoveNumber: Dispatch<SetStateAction<number>>;
}) {
    const evenIndexMoves = moves.filter((move, index) => {
        index % 2 === 0;
    });

    const bottomRef = useRef(null);
    useEffect(() => {
        bottomRef.current?.scrollIntoView({ behaviour: "smooth" });
    }, [moves]);

    function handleClick(index: number) {
        setAnalysisMoveNumber(index);
        if (!analysisMode) {
            setAnalysisMode(true);
        }
        setPieces(moves[index].pieces);
    }

    function handleClickStart() {
        setAnalysisMoveNumber(0);
        if (!analysisMode) {
            setAnalysisMode(true);
        }
        setPieces(moves[0].pieces);
    }

    function handleClickBack() {
        if (analysisMoveNumber < 1) {
            return;
        }
        setAnalysisMoveNumber(analysisMoveNumber - 1);
        if (!analysisMode) {
            setAnalysisMode(true);
        }
        setPieces(moves[analysisMoveNumber - 1].pieces);
    }
    function handleClickForward() {
        if (analysisMoveNumber == moves.length - 1) {
            return;
        }
        setAnalysisMoveNumber(analysisMoveNumber + 1);
        if (analysisMoveNumber + 1 === moves.length - 1) {
            setAnalysisMode(false);
        }
        setPieces(moves[analysisMoveNumber + 1].pieces);
    }
    function handleClickEnd() {
        if (analysisMoveNumber == moves.length - 1) {
            return;
        }
        setAnalysisMoveNumber(moves.length - 1);
        if (analysisMode) {
            setAnalysisMode(false);
        }
        setPieces(moves[moves.length - 1].pieces);
    }

    return (
        <Flex
            bgColor={"gray.900"}
            borderColor="gray.700"
            borderWidth="2px"
            ml="50px"
            w="400px"
            flexFlow={"column"}
            height={"792px"}
            // height="inherit"
            // overflow="hidden"

            // position="relative"
            // borderRadius={"12px"}
        >
            {/* <Flex>
                <Grid templateColumns={"repeat(1,1fr)"}>
                    {evenIndexMoves.map((move, index) => {
                        <GridItem
                    })}
                </Grid>
            </Flex> */}
            <Box
                overflow={"auto"}
                style={{ overflowAnchor: "none" }}
                flex="1 1 auto"
            >
                <Grid
                    templateColumns="repeat(2,1fr)"
                    columnGap={"0px"}
                    rowGap={"6px"}
                    w="100%"
                    pt="50px"

                    // h="80%"
                >
                    {moves.map((move, index) => (
                        <GridItem
                            py="4px"
                            w="100%"
                            key={index}
                            alignItems="center"
                            verticalAlign={"bottom"}
                            bgColor={
                                index % 4 === 0 || index % 4 === 1
                                    ? "#1f2129"
                                    : "transparent"
                            }
                            pl="30px"
                        >
                            <Flex userSelect={"none"}>
                                {index % 2 === 0 ? (
                                    <Box w="30px">
                                        <Text>{`${index / 2 + 1}.`}</Text>
                                    </Box>
                                ) : (
                                    <></>
                                )}
                                <Flex
                                    alignItems="center"
                                    cursor="pointer"
                                    onClick={() => handleClick(index)}
                                    borderWidth={"2px"}
                                    px="6px"
                                    borderColor={
                                        analysisMoveNumber === index
                                            ? "green.400"
                                            : "transparent"
                                    }
                                    borderRadius={"4px"}
                                >
                                    <Image
                                        src={
                                            move.pieces[move.movedPieceIndex]
                                                .src
                                        }
                                        className="analysis-piece"
                                        h="16px"
                                        pr="6px"
                                    />
                                    {move.capturedPiece ? (
                                        <>
                                            {" "}
                                            {" x "}
                                            <Image
                                                src={move.capturedPiece.src}
                                                className="analysis-piece"
                                                h="16px"
                                                px="6px"
                                            />
                                        </>
                                    ) : (
                                        <></>
                                    )}
                                    {" " +
                                        String.fromCharCode(
                                            move.pieces[move.movedPieceIndex]
                                                .currentCol + 64
                                        ).toLowerCase() +
                                        move.pieces[
                                            move.movedPieceIndex
                                        ].currentRow.toString()}
                                </Flex>
                            </Flex>
                        </GridItem>
                    ))}
                    {moves.length % 2 !== 0 ? (
                        <GridItem
                            w="100%"
                            alignItems="end"
                            verticalAlign={"bottom"}
                            ref={bottomRef}
                            bgColor={
                                moves.length % 4 === 0 || moves.length % 4 === 1
                                    ? "#1f2129"
                                    : "transparent"
                            }
                        ></GridItem>
                    ) : (
                        <></>
                    )}
                </Grid>
            </Box>

            <Box flex="0 0" w="100%">
                <Flex borderTopWidth={"2px"} borderTopColor="gray.700">
                    <Button
                        textAlign={"center"}
                        display="block"
                        bgColor="transparent"
                        color={"white"}
                        width="100%"
                        fontSize="16px"
                        cursor="pointer"
                        _hover={{ bgColor: "green.500" }}
                        borderRadius="0"
                        onClick={handleClickStart}
                        isDisabled={analysisMoveNumber < 1}
                    >
                        <FontAwesomeIcon icon={faAnglesLeft} />
                    </Button>
                    <Button
                        textAlign={"center"}
                        display="block"
                        bgColor="transparent"
                        color={"white"}
                        width="100%"
                        fontSize="16px"
                        cursor="pointer"
                        _hover={{ bgColor: "green.500" }}
                        borderRadius="0"
                        onClick={handleClickBack}
                        isDisabled={analysisMoveNumber < 1}
                    >
                        <FontAwesomeIcon icon={faAngleLeft} />
                    </Button>
                    <Button
                        textAlign={"center"}
                        display="block"
                        bgColor="transparent"
                        color={"white"}
                        width="100%"
                        border="0 solid white"
                        fontSize="16px"
                        cursor="pointer"
                        _hover={{ bgColor: "green.500" }}
                        borderRadius="0"
                        onClick={handleClickForward}
                        isDisabled={
                            analysisMoveNumber === moves.length - 1 ||
                            moves.length === 0
                        }
                    >
                        <FontAwesomeIcon icon={faAngleRight} />
                    </Button>
                    <Button
                        textAlign={"center"}
                        display="block"
                        bgColor="transparent"
                        color={"white"}
                        width="100%"
                        border="0 solid white"
                        fontSize="16px"
                        cursor="pointer"
                        _hover={{ bgColor: "green.500" }}
                        borderRadius="0"
                        onClick={handleClickEnd}
                        isDisabled={
                            analysisMoveNumber === moves.length - 1 ||
                            moves.length === 0
                        }
                    >
                        <FontAwesomeIcon icon={faAnglesRight} />
                    </Button>
                </Flex>
            </Box>
        </Flex>
    );
}