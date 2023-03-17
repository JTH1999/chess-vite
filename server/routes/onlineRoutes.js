const express = require("express");
const { createServer } = require("http");
const { Server } = require("socket.io");
const router = express.Router();
const httpServer = createServer(router);
const io = new Server(httpServer, {
    cors: {
        origin: ["http://localhost:5173", "http://127.0.0.1:5173"],
    },
});

const PORT = 8082;

const http = require("http").Server(router);
const cors = require("cors");

let rooms = {};
let usernames = {};
let games = {};

io.on("connection", (socket) => {
    // const connectedRooms = [];
    console.log(`⚡: ${socket.id} user just connected!`);

    socket.on("sendMessage", (message) => {
        io.emit("recieveMessage", message);
    });

    socket.on("joinRoom", async (request) => {
        // const room = io.sockets.adapter.rooms[request.room];
        usernames[socket.id] = request.username;
        console.log("Join room request receieved: " + request.room);
        const sockets = await io.in(request.room).fetchSockets();
        const currentlyInRoom = [];
        if (sockets.length > 0) {
            if (sockets.length === 2) {
                console.log("This room is already full");
                return socket.emit("This room is already full.");
            }

            // rooms[request.room].push({
            //     username: request.username,
            //     socketId: socket.id,
            // });
            currentlyInRoom.push(usernames[sockets[0].id]);
            socket.join(request.room);
            currentlyInRoom.push(request.username);
            // connectedRooms.push(request.room);
            // connectedUsers[socket.id].rooms.push(request.room);

            // io rather than socket emits to all, including the sender
            return io.in(request.room).emit("roomJoined", {
                room: request.room,
                players: currentlyInRoom,
            });
        } else {
            currentlyInRoom.push(request.username);
            socket.join(request.room);
            return io.in(request.room).emit("roomCreated", {
                room: request.room,
                players: currentlyInRoom,
            });
        }
    });

    socket.on("leaveRoom", async (roomCode) => {
        socket.leave(roomCode);
        const currentlyInRoom = [];
        const sockets = await io.in(roomCode).fetchSockets();
        if (sockets.length !== 0) {
            currentlyInRoom.push(usernames[sockets[0].id]);
        }
        // const room = rooms[roomCode];
        // console.log(room);
        // const index = room.findIndex((i) => i.socketId === socket.id);
        // if (index > -1) {
        //     room.splice(index, 1);
        //     console.log(`${socket.id} removed from room: ${roomCode}`);
        //     if (room.length === 0) {
        //         delete rooms[roomCode];
        //     }
        // }
        socket.emit("exitedRoom", {
            message: `You have left room: ${roomCode}`,
        });
        return io.in(roomCode).emit("playerLeft", {
            room: roomCode,
            players: currentlyInRoom,
        });
    });

    socket.on("startMatch", async (roomCode) => {
        // Need to say which player is black / white
        // Need to provide initial pieces and available moves
        const randomNumber = Math.random();
        const sockets = await io.in(roomCode).fetchSockets();

        if (sockets.length !== 2)
            return console.log("Room does not contain two users");
        const hostSocketId = socket.id;
        let otherSocketId;
        for (const socket of sockets) {
            if (socket.id !== hostSocketId) {
                otherSocketId = socket.id;
            }
        }
        console.log("hostSocketId: " + hostSocketId);
        console.log(otherSocketId);
        const hostColour = randomNumber >= 0.5 ? "white" : "black";
        const otherColour = hostColour === "white" ? "black" : "white";
        const newGamePieces = require("../data/newGamePieces");
        let idString = randomNumber.toString().slice(2);
        while (idString in games) {
            idString = Math.random().toString().slice(2);
        }
        const game = {
            roomCode: roomCode,
            [hostColour]: hostSocketId,
            [otherColour]: otherSocketId,
            status: "active",
            pieces: newGamePieces,
            whiteToMove: true,
            moves: [],
            capturedPieces: [],
        };
        games[idString] = game;
        console.log("gameId: " + idString);

        socket.emit("goToBoard", {
            gameId: idString,
            status: "active",
            colour: hostColour,
            whiteToMove: true,
            pieces: newGamePieces,
            roomCode: roomCode,
        });
        socket.in(roomCode).emit("goToBoard", {
            gameId: idString,
            status: "active",
            colour: otherColour,
            whiteToMove: true,
            pieces: newGamePieces,
            roomCode: roomCode,
        });
    });

    socket.on("sendMove", (request) => {
        const id = request.gameId;
        const game = games[id];
        if (request.roomCode !== game.roomCode)
            return "roomCodes do not match up";
        const expectedColour = game.whiteToMove ? "white" : "black";
        const expectedSocketId = game[expectedColour];

        if (socket.id !== expectedSocketId)
            return console.log("Unexpected socket id");
        if (request.colour !== expectedColour) {
            console.log(
                "expected: " + expectedColour + ", received: " + request.colour
            );
            return console.log(
                "Supplied colour does not match expected colour"
            );
        }

        if (request.selectedPiece.colour !== expectedColour)
            return console.log("Piece colour does not match expected colour");

        const moveLogic = require("../chessLogic/logic").moveLogic;

        const logicResult = moveLogic(
            request.selectedPiece,
            request.square,
            game.pieces,
            game.whiteToMove,
            game.capturedPieces,
            game.moves
        );

        game.status = logicResult.status;
        game.pieces = logicResult.pieces;
        game.whiteToMove = logicResult.whiteToMove;
        game.capturedPieces = logicResult.capturedPieces;
        game.moves = logicResult.moves;
        if (logicResult.status === "promote") {
            game.selectedPiece = logicResult.selectedPiece;
            return socket.emit("promotePiece", logicResult);
        }

        if (logicResult.status === "checkmate") {
            const winnerId = logicResult.whiteToMove ? game.black : game.white;
            const winnerUsername = usernames[winnerId];
            logicResult.winner = winnerUsername;
            console.log(winnerUsername);
            return io.in(request.roomCode).emit("checkmate", logicResult);
        }

        if (logicResult.status === "stalemate") {
            return io.in(request.roomCode).emit("stalemate", logicResult);
        }

        return io.in(request.roomCode).emit("moveComplete", logicResult);
    });

    // ------------------------------------------------------------------------------
    // Promote Piece

    socket.on("promotePieceSelected", (request) => {
        console.log("made it here");
        const id = request.gameId;
        const game = games[id];
        if (request.roomCode !== game.roomCode)
            return "roomCodes do not match up";
        const expectedColour = game.whiteToMove ? "white" : "black";
        const expectedSocketId = game[expectedColour];
        if (socket.id !== expectedSocketId)
            return console.log("Unexpected socket id");

        const promoteLogic = require("../chessLogic/logic").promoteLogic;
        const logicResult = promoteLogic(
            game.pieces,
            game.selectedPiece,
            request.promoteTo,
            game.moves,
            game.capturedPieces,
            game.whiteToMove
        );

        game.status = logicResult.status;
        game.pieces = logicResult.pieces;
        game.whiteToMove = logicResult.whiteToMove;
        game.capturedPieces = logicResult.capturedPieces;
        game.moves = logicResult.moves;
        game.selectedPiece = null;

        if (logicResult.status === "checkmate") {
            const winnerId = logicResult.whiteToMove ? game.black : game.white;
            const winnerUsername = usernames[winnerId];
            logicResult.winner = winnerUsername;
            console.log(winnerUsername);
            return io.in(request.roomCode).emit("checkmate", logicResult);
        }

        if (logicResult.status === "stalemate") {
            return io.in(request.roomCode).emit("stalemate", logicResult);
        }

        return io.in(request.roomCode).emit("moveComplete", logicResult);
    });

    socket.on("disconnect", () => {
        console.log(`🔥: ${socket.id} just disconnected`);
        if (socket.id in usernames) {
            delete usernames[socket.id];
        }
    });
});

httpServer.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});

module.exports = router;
