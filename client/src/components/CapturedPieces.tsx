import { Box, Flex, Image, Text } from "@chakra-ui/react";
import { Piece } from "../../types";

export default function CapturedPieces({
    capturedPieces,
    colour,
}: {
    capturedPieces: Piece[];
    colour: string;
}) {
    // This is the pieces captured by the player
    const playerCapturedPieces = capturedPieces.filter(
        (capturedPiece) => capturedPiece.colour == colour
    );

    // Pieces captured by the opposition
    const oppositionCapturedPieces = capturedPieces.filter(
        (capturedPiece) => capturedPiece.colour != colour
    );

    let playerCapturedPiecesValue = 0;
    for (let i = 0; i < playerCapturedPieces.length; i++) {
        playerCapturedPiecesValue += playerCapturedPieces[i].value;
    }

    let oppositionCapturedPiecesValue = 0;
    for (let i = 0; i < oppositionCapturedPieces.length; i++) {
        oppositionCapturedPiecesValue += oppositionCapturedPieces[i].value;
    }

    const capturedPawns = playerCapturedPieces.filter(
        (capturedPiece) => capturedPiece.type == "pawn"
    );

    // let capturedPawnsImgs = <></>;
    // let zIndex = 9;
    // if (capturedPawns.length > 0) {
    //     capturedPawnsImgs = (
    //         <Flex
    //             alignItems={"center"}
    //             pr="14px"
    //             className="captured-piece-type"
    //         >
    //             {capturedPawns.map((capturedPiece, index) => (
    //                 <Image
    //                     key={capturedPiece.index}
    //                     src={capturedPiece.src}
    //                     className="captured-pieces"
    //                     zIndex={zIndex - index}
    //                     h="25px"
    //                     mr="-10px"
    //                     position={"relative"}
    //                 />
    //             ))}
    //         </Flex>
    //     );
    // }

    const capturedKnights = playerCapturedPieces.filter(
        (capturedPiece) => capturedPiece.type == "knight"
    );
    // let capturedKnightsImgs = <></>;
    // if (capturedKnights.length > 0) {
    //     capturedKnightsImgs = (
    //         <Flex className="captured-piece-type" alignItems={"center"}
    //         pr="14px">
    //             {capturedKnights.map((capturedPiece, index) => (
    //                 <Image
    //                     key={capturedPiece.index}
    //                     src={capturedPiece.src}
    //                     className="captured-pieces"
    //                     zIndex={zIndex - index}
    //                     h="25px"
    //                     mr="-10px"
    //                     position={"relative"}
    //                 />
    //             ))}
    //         </div>
    //     );
    // }

    const capturedBishops = playerCapturedPieces.filter(
        (capturedPiece) => capturedPiece.type == "bishop"
    );
    // let capturedBishopsImgs = <></>;
    // if (capturedBishops.length > 0) {
    //     capturedBishopsImgs = (
    //         <div className="captured-piece-type">
    //             {capturedBishops.map((capturedPiece, index) => (
    //                 <img
    //                     key={capturedPiece.index}
    //                     src={capturedPiece.src}
    //                     className="captured-pieces"
    //                     style={{ zIndex: zIndex - index }}
    //                 />
    //             ))}
    //         </div>
    //     );
    // }

    const capturedRooks = playerCapturedPieces.filter(
        (capturedPiece) => capturedPiece.type == "rook"
    );
    // let capturedRooksImgs = <></>;
    // if (capturedRooks.length > 0) {
    //     capturedRooksImgs = (
    //         <div className="captured-piece-type">
    //             {capturedRooks.map((capturedPiece, index) => (
    //                 <img
    //                     key={capturedPiece.index}
    //                     src={capturedPiece.src}
    //                     className="captured-pieces"
    //                     style={{ zIndex: zIndex - index }}
    //                 />
    //             ))}
    //         </div>
    //     );
    // }

    const capturedQueens = playerCapturedPieces.filter(
        (capturedPiece) => capturedPiece.type == "queen"
    );
    // let capturedQueensImgs = <></>;
    // if (capturedQueens.length > 0) {
    //     capturedQueensImgs = (
    //         <div className="captured-piece-type">
    //             {capturedQueens.map((capturedPiece, index) => (
    //                 <img
    //                     key={capturedPiece.index}
    //                     src={capturedPiece.src}
    //                     className="captured-pieces"
    //                     style={{ zIndex: zIndex - index }}
    //                 />
    //             ))}
    //         </div>
    //     );
    // }

    return (
        <Flex>
            <Flex
                className="captured-pieces-section"
                height="45px"
                py="10px"
                alignItems={"center"}
                fontSize="18px"
            >
                <CapturedPiecesGroup capturedPiecesGroup={capturedPawns} />
                <CapturedPiecesGroup capturedPiecesGroup={capturedKnights} />
                <CapturedPiecesGroup capturedPiecesGroup={capturedBishops} />
                <CapturedPiecesGroup capturedPiecesGroup={capturedRooks} />
                <CapturedPiecesGroup capturedPiecesGroup={capturedQueens} />
                <Flex>
                    <Text>
                        {playerCapturedPiecesValue >
                        oppositionCapturedPiecesValue
                            ? "+ " +
                              (
                                  playerCapturedPiecesValue -
                                  oppositionCapturedPiecesValue
                              ).toString()
                            : ""}
                    </Text>
                </Flex>
            </Flex>
        </Flex>
    );
}

function CapturedPiecesGroup({
    capturedPiecesGroup,
}: {
    capturedPiecesGroup: Piece[];
}) {
    let capturedPiecesGroupImages = <></>;
    let zIndex = 9;
    if (capturedPiecesGroup.length > 0) {
        capturedPiecesGroupImages = (
            <Flex
                className="captured-piece-type"
                alignItems={"center"}
                mr="14px"
            >
                {capturedPiecesGroup.map((capturedPiece, index) => (
                    <Image
                        key={capturedPiece.index}
                        src={capturedPiece.src}
                        className="captured-pieces"
                        zIndex={zIndex - index}
                        h="25px"
                        mr={capturedPiecesGroup.length > 1 ? "-10px" : "0"}
                        position={"relative"}
                    />
                ))}
            </Flex>
        );
    }

    return capturedPiecesGroupImages;
}
