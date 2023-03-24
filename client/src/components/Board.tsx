import BoardRow from "./BoardRow.js";
import PromoteScreen from "./PromoteScreen.js";
import CheckmateScreen from "./CheckmateScreen.js";
import { Move, Piece } from "../../types";
import { Dispatch, SetStateAction } from "react";
import { Flex } from "@chakra-ui/react";

export default function Board({
    pieces,
    selectedPiece,
    whiteToMove,
    capturedPieces,
    whiteKingSquare,
    blackKingSquare,
    isCheck,
    isCheckmate,
    isStalemate,
    promote,
    moves,
    analysisMode,
    boardHeight,
    setPieces,
    setSelectedPiece,
    setWhiteToMove,
    setCapturedPieces,
    setWhiteKingSquare,
    setBlackKingSquare,
    setIsCheck,
    setIsCheckmate,
    setIsStalemate,
    setPromote,
    setMoves,
    setAnalysisMode,
    setAnalysisMoveNumber,
    colour,
    previousPieceMovedFrom,
    previousPieceMovedTo,
    flipBoard,
    setColour,
}: {
    pieces: Piece[];
    selectedPiece: Piece | null;
    whiteToMove: boolean;
    capturedPieces: Piece[];
    whiteKingSquare: string;
    blackKingSquare: string;
    isCheck: boolean;
    isCheckmate: boolean;
    isStalemate: boolean;
    promote: boolean;
    moves: Move[];
    analysisMode: boolean;
    boardHeight: number;
    colour: string;
    previousPieceMovedFrom: string;
    previousPieceMovedTo: string;
    flipBoard: boolean;
    setPieces: Dispatch<SetStateAction<Piece[]>>;
    setSelectedPiece: Dispatch<SetStateAction<Piece | null>>;
    setWhiteToMove: Dispatch<SetStateAction<boolean>>;
    setCapturedPieces: Dispatch<SetStateAction<Piece[]>>;
    setWhiteKingSquare: Dispatch<SetStateAction<string>>;
    setBlackKingSquare: Dispatch<SetStateAction<string>>;
    setIsCheck: Dispatch<SetStateAction<boolean>>;
    setIsCheckmate: Dispatch<SetStateAction<boolean>>;
    setIsStalemate: Dispatch<SetStateAction<boolean>>;
    setPromote: Dispatch<SetStateAction<boolean>>;
    setMoves: Dispatch<SetStateAction<Move[]>>;
    setAnalysisMode: Dispatch<SetStateAction<boolean>>;
    setAnalysisMoveNumber: Dispatch<SetStateAction<number>>;
    setColour: Dispatch<SetStateAction<string>>;
}) {
    const blackRows = [1, 2, 3, 4, 5, 6, 7, 8];
    const whiteRows = [8, 7, 6, 5, 4, 3, 2, 1];
    return (
        <Flex>
            <Flex
                className="board"
                flexDirection={"column"}
                justify="center"
                alignItems={"center"}
                boxShadow="-10px -10px 40px 0px rgba(73, 73, 73, 0.45), 10px 10px 30px 0px rgba(0, 0, 0, 0.4);"
            >
                <CheckmateScreen
                    whiteToMove={whiteToMove}
                    isCheckmate={isCheckmate}
                    isStalemate={isStalemate}
                    setWhiteToMove={setWhiteToMove}
                    setCapturedPieces={setCapturedPieces}
                    setWhiteKingSquare={setWhiteKingSquare}
                    setBlackKingSquare={setBlackKingSquare}
                    setIsCheck={setIsCheck}
                    setIsCheckmate={setIsCheckmate}
                    setIsStalemate={setIsStalemate}
                    setPromote={setPromote}
                    setMoves={setMoves}
                    setPieces={setPieces}
                    setSelectedPiece={setSelectedPiece}
                    analysisMode={analysisMode}
                    setAnalysisMode={setAnalysisMode}
                    setAnalysisMoveNumber={setAnalysisMoveNumber}
                    moves={moves}
                />
                <PromoteScreen
                    pieces={pieces}
                    setPieces={setPieces}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    whiteToMove={whiteToMove}
                    setWhiteToMove={setWhiteToMove}
                    whiteKingSquare={whiteKingSquare}
                    blackKingSquare={blackKingSquare}
                    setIsCheck={setIsCheck}
                    setIsCheckmate={setIsCheckmate}
                    setIsStalemate={setIsStalemate}
                    promote={promote}
                    setPromote={setPromote}
                    moves={moves}
                    capturedPieces={capturedPieces}
                    flipBoard={flipBoard}
                    colour={colour}
                    setColour={setColour}
                />
                {colour === "white"
                    ? whiteRows.map((row) => {
                          return (
                              <BoardRow
                                  key={row}
                                  row={row}
                                  pieces={pieces}
                                  setPieces={setPieces}
                                  selectedPiece={selectedPiece}
                                  setSelectedPiece={setSelectedPiece}
                                  whiteToMove={whiteToMove}
                                  setWhiteToMove={setWhiteToMove}
                                  capturedPieces={capturedPieces}
                                  setCapturedPieces={setCapturedPieces}
                                  whiteKingSquare={whiteKingSquare}
                                  setWhiteKingSquare={setWhiteKingSquare}
                                  blackKingSquare={blackKingSquare}
                                  setBlackKingSquare={setBlackKingSquare}
                                  isCheck={isCheck}
                                  setIsCheck={setIsCheck}
                                  setIsCheckmate={setIsCheckmate}
                                  setIsStalemate={setIsStalemate}
                                  promote={promote}
                                  setPromote={setPromote}
                                  moves={moves}
                                  setMoves={setMoves}
                                  analysisMode={analysisMode}
                                  setAnalysisMoveNumber={setAnalysisMoveNumber}
                                  boardHeight={boardHeight}
                                  colour={colour}
                                  previousPieceMovedFrom={
                                      previousPieceMovedFrom
                                  }
                                  previousPieceMovedTo={previousPieceMovedTo}
                                  flipBoard={flipBoard}
                                  setColour={setColour}
                              />
                          );
                      })
                    : blackRows.map((row) => {
                          return (
                              <BoardRow
                                  key={row}
                                  row={row}
                                  pieces={pieces}
                                  setPieces={setPieces}
                                  selectedPiece={selectedPiece}
                                  setSelectedPiece={setSelectedPiece}
                                  whiteToMove={whiteToMove}
                                  setWhiteToMove={setWhiteToMove}
                                  capturedPieces={capturedPieces}
                                  setCapturedPieces={setCapturedPieces}
                                  whiteKingSquare={whiteKingSquare}
                                  setWhiteKingSquare={setWhiteKingSquare}
                                  blackKingSquare={blackKingSquare}
                                  setBlackKingSquare={setBlackKingSquare}
                                  isCheck={isCheck}
                                  setIsCheck={setIsCheck}
                                  setIsCheckmate={setIsCheckmate}
                                  setIsStalemate={setIsStalemate}
                                  promote={promote}
                                  setPromote={setPromote}
                                  moves={moves}
                                  setMoves={setMoves}
                                  analysisMode={analysisMode}
                                  setAnalysisMoveNumber={setAnalysisMoveNumber}
                                  boardHeight={boardHeight}
                                  colour={colour}
                                  previousPieceMovedFrom={
                                      previousPieceMovedFrom
                                  }
                                  previousPieceMovedTo={previousPieceMovedTo}
                                  flipBoard={flipBoard}
                                  setColour={setColour}
                              />
                          );
                      })}

                {/* <BoardRow
                    row={8}
                    pieces={pieces}
                    setPieces={setPieces}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    whiteToMove={whiteToMove}
                    setWhiteToMove={setWhiteToMove}
                    capturedPieces={capturedPieces}
                    setCapturedPieces={setCapturedPieces}
                    whiteKingSquare={whiteKingSquare}
                    setWhiteKingSquare={setWhiteKingSquare}
                    blackKingSquare={blackKingSquare}
                    setBlackKingSquare={setBlackKingSquare}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    setIsCheckmate={setIsCheckmate}
                    setIsStalemate={setIsStalemate}
                    promote={promote}
                    setPromote={setPromote}
                    moves={moves}
                    setMoves={setMoves}
                    analysisMode={analysisMode}
                    setAnalysisMoveNumber={setAnalysisMoveNumber}
                    boardHeight={boardHeight}
                />
                <BoardRow
                    row={7}
                    pieces={pieces}
                    setPieces={setPieces}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    whiteToMove={whiteToMove}
                    setWhiteToMove={setWhiteToMove}
                    capturedPieces={capturedPieces}
                    setCapturedPieces={setCapturedPieces}
                    whiteKingSquare={whiteKingSquare}
                    setWhiteKingSquare={setWhiteKingSquare}
                    blackKingSquare={blackKingSquare}
                    setBlackKingSquare={setBlackKingSquare}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    setIsCheckmate={setIsCheckmate}
                    setIsStalemate={setIsStalemate}
                    promote={promote}
                    setPromote={setPromote}
                    moves={moves}
                    setMoves={setMoves}
                    analysisMode={analysisMode}
                    setAnalysisMoveNumber={setAnalysisMoveNumber}
                    boardHeight={boardHeight}
                />
                <BoardRow
                    row={6}
                    pieces={pieces}
                    setPieces={setPieces}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    whiteToMove={whiteToMove}
                    setWhiteToMove={setWhiteToMove}
                    capturedPieces={capturedPieces}
                    setCapturedPieces={setCapturedPieces}
                    whiteKingSquare={whiteKingSquare}
                    setWhiteKingSquare={setWhiteKingSquare}
                    blackKingSquare={blackKingSquare}
                    setBlackKingSquare={setBlackKingSquare}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    setIsCheckmate={setIsCheckmate}
                    setIsStalemate={setIsStalemate}
                    promote={promote}
                    setPromote={setPromote}
                    moves={moves}
                    setMoves={setMoves}
                    analysisMode={analysisMode}
                    setAnalysisMoveNumber={setAnalysisMoveNumber}
                    boardHeight={boardHeight}
                />
                <BoardRow
                    row={5}
                    pieces={pieces}
                    setPieces={setPieces}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    whiteToMove={whiteToMove}
                    setWhiteToMove={setWhiteToMove}
                    capturedPieces={capturedPieces}
                    setCapturedPieces={setCapturedPieces}
                    whiteKingSquare={whiteKingSquare}
                    setWhiteKingSquare={setWhiteKingSquare}
                    blackKingSquare={blackKingSquare}
                    setBlackKingSquare={setBlackKingSquare}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    setIsCheckmate={setIsCheckmate}
                    setIsStalemate={setIsStalemate}
                    promote={promote}
                    setPromote={setPromote}
                    moves={moves}
                    setMoves={setMoves}
                    analysisMode={analysisMode}
                    setAnalysisMoveNumber={setAnalysisMoveNumber}
                    boardHeight={boardHeight}
                />
                <BoardRow
                    row={4}
                    pieces={pieces}
                    setPieces={setPieces}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    whiteToMove={whiteToMove}
                    setWhiteToMove={setWhiteToMove}
                    capturedPieces={capturedPieces}
                    setCapturedPieces={setCapturedPieces}
                    whiteKingSquare={whiteKingSquare}
                    setWhiteKingSquare={setWhiteKingSquare}
                    blackKingSquare={blackKingSquare}
                    setBlackKingSquare={setBlackKingSquare}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    setIsCheckmate={setIsCheckmate}
                    setIsStalemate={setIsStalemate}
                    promote={promote}
                    setPromote={setPromote}
                    moves={moves}
                    setMoves={setMoves}
                    analysisMode={analysisMode}
                    setAnalysisMoveNumber={setAnalysisMoveNumber}
                    boardHeight={boardHeight}
                />
                <BoardRow
                    row={3}
                    pieces={pieces}
                    setPieces={setPieces}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    whiteToMove={whiteToMove}
                    setWhiteToMove={setWhiteToMove}
                    capturedPieces={capturedPieces}
                    setCapturedPieces={setCapturedPieces}
                    whiteKingSquare={whiteKingSquare}
                    setWhiteKingSquare={setWhiteKingSquare}
                    blackKingSquare={blackKingSquare}
                    setBlackKingSquare={setBlackKingSquare}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    setIsCheckmate={setIsCheckmate}
                    setIsStalemate={setIsStalemate}
                    promote={promote}
                    setPromote={setPromote}
                    moves={moves}
                    setMoves={setMoves}
                    analysisMode={analysisMode}
                    setAnalysisMoveNumber={setAnalysisMoveNumber}
                    boardHeight={boardHeight}
                />
                <BoardRow
                    row={2}
                    pieces={pieces}
                    setPieces={setPieces}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    whiteToMove={whiteToMove}
                    setWhiteToMove={setWhiteToMove}
                    capturedPieces={capturedPieces}
                    setCapturedPieces={setCapturedPieces}
                    whiteKingSquare={whiteKingSquare}
                    setWhiteKingSquare={setWhiteKingSquare}
                    blackKingSquare={blackKingSquare}
                    setBlackKingSquare={setBlackKingSquare}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    setIsCheckmate={setIsCheckmate}
                    setIsStalemate={setIsStalemate}
                    promote={promote}
                    setPromote={setPromote}
                    moves={moves}
                    setMoves={setMoves}
                    analysisMode={analysisMode}
                    setAnalysisMoveNumber={setAnalysisMoveNumber}
                    boardHeight={boardHeight}
                />
                <BoardRow
                    row={1}
                    pieces={pieces}
                    setPieces={setPieces}
                    selectedPiece={selectedPiece}
                    setSelectedPiece={setSelectedPiece}
                    whiteToMove={whiteToMove}
                    setWhiteToMove={setWhiteToMove}
                    capturedPieces={capturedPieces}
                    setCapturedPieces={setCapturedPieces}
                    whiteKingSquare={whiteKingSquare}
                    setWhiteKingSquare={setWhiteKingSquare}
                    blackKingSquare={blackKingSquare}
                    setBlackKingSquare={setBlackKingSquare}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    setIsCheckmate={setIsCheckmate}
                    setIsStalemate={setIsStalemate}
                    promote={promote}
                    setPromote={setPromote}
                    moves={moves}
                    setMoves={setMoves}
                    analysisMode={analysisMode}
                    setAnalysisMoveNumber={setAnalysisMoveNumber}
                    boardHeight={boardHeight}
                /> */}
            </Flex>
        </Flex>
    );
}
