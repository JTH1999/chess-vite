import { Dispatch, SetStateAction } from "react";
import { Move, Piece } from "../../types";
import Square from "./square/Square";

export default function BoardRow({
    row,
    pieces,
    selectedPiece,
    whiteToMove,
    capturedPieces,
    whiteKingSquare,
    blackKingSquare,
    isCheck,
    promote,
    moves,
    analysisMode,
    boardHeight,
    colour,
    previousPieceMovedFrom,
    previousPieceMovedTo,
    flipBoard,
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
    setAnalysisMoveNumber,
    setColour,
}: {
    row: number;
    pieces: Piece[];
    selectedPiece: Piece | null;
    whiteToMove: boolean;
    capturedPieces: Piece[];
    whiteKingSquare: string;
    blackKingSquare: string;
    isCheck: boolean;
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
    setAnalysisMoveNumber: Dispatch<SetStateAction<number>>;
    setColour: Dispatch<SetStateAction<string>>;
}) {
    const whiteCols = [1, 2, 3, 4, 5, 6, 7, 8];
    const blackCols = [8, 7, 6, 5, 4, 3, 2, 1];
    return (
        <div>
            {colour === "white"
                ? whiteCols.map((col) => {
                      return (
                          <Square
                              key={col}
                              row={row}
                              col={col}
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
                              previousPieceMovedFrom={previousPieceMovedFrom}
                              previousPieceMovedTo={previousPieceMovedTo}
                              flipBoard={flipBoard}
                              setColour={setColour}
                          />
                      );
                  })
                : blackCols.map((col) => {
                      return (
                          <Square
                              key={col}
                              row={row}
                              col={col}
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
                              previousPieceMovedFrom={previousPieceMovedFrom}
                              previousPieceMovedTo={previousPieceMovedTo}
                              flipBoard={flipBoard}
                              setColour={setColour}
                          />
                      );
                  })}
            {/* <Square
                row={row}
                col={1}
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
            <Square
                row={row}
                col={2}
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
            <Square
                row={row}
                col={3}
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
            <Square
                row={row}
                col={4}
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
            <Square
                row={row}
                col={5}
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
            <Square
                row={row}
                col={6}
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
            <Square
                row={row}
                col={7}
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
            <Square
                row={row}
                col={8}
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
        </div>
    );
}
