import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
} from "@fortawesome/free-solid-svg-icons";

import { Move, Piece } from "../../types";
import { Dispatch, SetStateAction, useRef, useState } from "react";
import { Box, Button, Flex, Image, Text } from "@chakra-ui/react";
import { useColour } from "../hooks/useColour";
import { useDraggable } from "react-use-draggable-scroll";

export default function AnalysisSectionMobile({
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
  const [scroll, setScroll] = useState({
    isScrolling: false,
    clientX: 0,
    scrollX: 0,
  });
  const { colourScheme } = useColour();
  //   const ref =
  //     useRef<HTMLDivElement>() as React.MutableRefObject<HTMLInputElement>;
  //   const { events } = useDraggable(ref);

  function handleClick(index: number) {
    setAnalysisMoveNumber(index);
    if (!analysisMode) {
      setAnalysisMode(true);
    }
    if (analysisMoveNumber + 1 === moves.length - 1) {
      setAnalysisMode(false);
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

  const slider = useRef(null);

  let startX, scrollLeft;
  function startDragging(event) {
    setScroll({ ...scroll, isScrolling: true, clientX: event.clientX });
    // startX = event.pageX - slider.current?.offsetLeft;
    // scrollLeft = slider.current?.scrollLeft;
  }

  function stopDragging(event) {
    setScroll({ ...scroll, isScrolling: false });
  }

  function handleMouseMove(e) {
    const { isScrolling, clientX, scrollX } = scroll;
    if (isScrolling) {
      slider.current.scrollLeft = scrollX - e.clientX + clientX;
      setScroll({
        ...scroll,
        clientX: e.clientX,
        scrollX: scrollX - e.clientX + clientX,
      });
    }
    // e.preventDefault;
    // if (!mouseDown) {
    //   return;
    // }
    // const x = e.pageX - slider.current.offsetLeft;
    // const scroll = x - startX;
    // slider.current.scrollLeft = scrollLeft - scroll;
  }

  return (
    <Flex
      className="analysis"
      flexDirection={"row"}
      //   pt="20px"

      w="100%"
      fontSize={"16px"}
      justify={"space-between"}
      alignItems="center"
      h="40px"
      //   height="1.5rem"
      borderColor={colourScheme.border}
      borderWidth={"2px"}
      borderRadius="12px"
      bgColor={colourScheme.darker}
      //   overflow={"hidden"}
    >
      <Flex>
        <Button
          textAlign={"center"}
          display="block"
          bgColor="transparent"
          color={colourScheme.text}
          fontSize="16px"
          cursor="pointer"
          _hover={{ bgColor: colourScheme.primary }}
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
          color={colourScheme.text}
          fontSize="16px"
          cursor="pointer"
          _hover={{ bgColor: colourScheme.primary }}
          borderRadius="0"
          onClick={handleClickBack}
          isDisabled={analysisMoveNumber < 1}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </Button>
      </Flex>
      <Flex
        h="100%"
        overflowX={"scroll"}
        ref={slider}
        onMouseMove={(e) => handleMouseMove(e)}
        onMouseDown={(e) => startDragging(e)}
        onMouseUp={(e) => stopDragging(e)}
        onMouseLeave={(e) => stopDragging(e)}
      >
        {moves.map((move, index) => (
          <Flex py="4px" key={index} alignItems="center" flexShrink={"0"}>
            <Flex userSelect={"none"}>
              {index % 2 === 0 ? (
                <Flex mr="10px" textAlign={"center"} justify={"center"}>
                  <Text fontWeight={"semibold"} ml="20px">{`${
                    index / 2 + 1
                  }.`}</Text>
                </Flex>
              ) : (
                <></>
              )}
              <Flex
                alignItems="center"
                cursor="pointer"
                onClick={() => handleClick(index)}
                borderWidth={"2px"}
                px="6px"
                mx="4px"
                borderColor={
                  analysisMoveNumber === index
                    ? colourScheme.primary
                    : "transparent"
                }
                flexShrink={"0"}
                borderRadius={"4px"}
              >
                <Image
                  src={move.pieces[move.movedPieceIndex].src}
                  className="analysis-piece"
                  h="16px"
                  pr="6px"
                />
                {move.capturedPiece ? (
                  <>
                    <Text>&nbsp;x&nbsp;</Text>
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
                <Text>
                  &nbsp;
                  {String.fromCharCode(
                    move.pieces[move.movedPieceIndex].currentCol + 64
                  ).toLowerCase() +
                    move.pieces[move.movedPieceIndex].currentRow.toString()}
                </Text>
              </Flex>
            </Flex>
          </Flex>
        ))}
      </Flex>

      <Flex>
        <Button
          textAlign={"center"}
          display="block"
          bgColor="transparent"
          color={colourScheme.text}
          width="50%"
          border="0 solid white"
          fontSize="16px"
          cursor="pointer"
          _hover={{ bgColor: colourScheme.primary }}
          borderRadius="0"
          onClick={handleClickForward}
          isDisabled={
            analysisMoveNumber === moves.length - 1 || moves.length === 0
          }
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </Button>
        <Button
          textAlign={"center"}
          display="block"
          bgColor="transparent"
          color={colourScheme.text}
          width="50%"
          border="0 solid white"
          fontSize="16px"
          cursor="pointer"
          _hover={{ bgColor: colourScheme.primary }}
          borderRadius="0"
          onClick={handleClickEnd}
          isDisabled={
            analysisMoveNumber === moves.length - 1 || moves.length === 0
          }
        >
          <FontAwesomeIcon icon={faAnglesRight} />
        </Button>
      </Flex>
    </Flex>
  );
}
