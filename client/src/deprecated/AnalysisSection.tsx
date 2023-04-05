import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

import { Move, Piece } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { Box, Flex, Image } from "@chakra-ui/react";

export default function AnalysisSection({
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
    const move = analysisMode ? analysisMoveNumber : moves.length;
    const src = pieces[moves[move - 1]?.movedPieceIndex]?.src;
    const moveCol = pieces[moves[move - 1]?.movedPieceIndex]?.currentCol;
    const moveRow = pieces[moves[move - 1]?.movedPieceIndex]?.currentRow;

    function handleLeftClick() {
        if (move <= 1) {
            return;
        } else {
            setAnalysisMoveNumber(move - 1);
            setAnalysisMode(true);
            setPieces(moves[move - 2].pieces);
        }
    }

    function handleRightClick() {
        if (move == moves.length) {
            return;
        } else {
            setAnalysisMoveNumber(move + 1);
            setPieces(moves[move].pieces);
        }

        if (move + 1 == moves.length) {
            setAnalysisMode(false);
        }
    }

    return (
        <Flex
            className="analysis"
            flexDirection={"row"}
            pt="20px"
            w="100%"
            fontSize={"30px"}
            color="white"
            justify={"space-between"}
            alignItems="center"
            height="1.5rem"
        >
            <FontAwesomeIcon
                icon={faChevronLeft}
                className={move <= 1 ? "chevron disabled" : "chevron"}
                onClick={handleLeftClick}
            />
            {moves.length > 0 ? (
                <Flex
                    className="unselectable"
                    userSelect={"none"}
                    alignItems="center"
                >
                    {move + ".  "}

                    <Image
                        src={src}
                        className="analysis-piece"
                        h="25px"
                        px="6px"
                    />
                    {moves[move - 1].capturedPiece ? (
                        <>
                            {" "}
                            {" x "}
                            <Image
                                src={moves[move - 1].capturedPiece.src}
                                className="analysis-piece"
                                h="25px"
                                px="6px"
                            />
                        </>
                    ) : (
                        <></>
                    )}
                    {" " +
                        String.fromCharCode(moveCol + 64).toLowerCase() +
                        moveRow.toString()}
                </Flex>
            ) : (
                <></>
            )}

            <FontAwesomeIcon
                icon={faChevronRight}
                className={
                    move == moves.length ? "chevron disabled" : "chevron"
                }
                onClick={handleRightClick}
            />
        </Flex>
    );
}
