const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./db.js");
const passport = require("passport");
const cookieSession = require("cookie-session");
const { Server } = require("socket.io");
const { createServer } = require("http");

if (process.env.NODE_ENV !== "production") {
  // Load environment variables from .env file in non prod environments
  require("dotenv").config();
}

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

const userRouter = require("./routes/userRoutes");
const onlineRouter = require("./routes/onlineRoutes");

const app = express();
app.use(bodyParser.json());

//Add the client URL to the CORS policy

const whitelist = process.env.WHITELISTED_DOMAINS
  ? process.env.WHITELISTED_DOMAINS.split(",")
  : [];

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },

  credentials: true,
};

app.use(cors(corsOptions));

app.use(passport.initialize());



app.get("/", async function (req, res) {
  res.type("html").send(html);
});

//Start the server in port 8081
app.use("/users", userRouter);
// server.use("/online", onlineRouter);

const server = require('http').Server(app);

const io = require('socket.io')(server, {cors: corsOptions});


server.listen(process.env.PORT || 8081, function () {
  const port = server.address().port;

  console.log("App started at port:", port);
});

const html = `
<!DOCTYPE html>
<html>
  <head>
    <title>Hello from Render!</title>
    <script src="https://cdn.jsdelivr.net/npm/canvas-confetti@1.5.1/dist/confetti.browser.min.js"></script>
    <script>
      setTimeout(() => {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 },
          disableForReducedMotion: true
        });
      }, 500);
    </script>
    <style>
      @import url("https://p.typekit.net/p.css?s=1&k=vnd5zic&ht=tk&f=39475.39476.39477.39478.39479.39480.39481.39482&a=18673890&app=typekit&e=css");
      @font-face {
        font-family: "neo-sans";
        src: url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff2"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/d?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("woff"), url("https://use.typekit.net/af/00ac0a/00000000000000003b9b2033/27/a?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3") format("opentype");
        font-style: normal;
        font-weight: 700;
      }
      html {
        font-family: neo-sans;
        font-weight: 700;
        font-size: calc(62rem / 16);
      }
      body {
        background: white;
      }
      section {
        border-radius: 1em;
        padding: 1em;
        position: absolute;
        top: 50%;
        left: 50%;
        margin-right: -50%;
        transform: translate(-50%, -50%);
      }
    </style>
  </head>
  <body>
    <section>
      Hello from Render!
    </section>
  </body>
</html>
`;

let usernames = {};
let games = {};

function pressClock(id) {
  const game = games[id];
  // white to move has aready changed at time of calling function
  if (game.moves.length === 1) {
    game.currentMoveStart = Date.now();
    startClock(id);
  } else {
    const moveTime = Date.now() - game.currentMoveStart;
    if (game.whiteToMove) {
      game.blackTime -= moveTime;
    } else {
      game.whiteTime -= moveTime;
    }
    game.currentMoveStart = Date.now();
  }
}

function startClock(id) {
  const game = games[id];
  const statuses = ["draw", "checkmate", "stalemate", "forfeit", "resignation"];
  game.interval = setInterval(async () => {
    if (statuses.includes(game.status)) {
      clearInterval(game.interval);
      return;
    }
    if (game.whiteToMove) {
      io.in(game.roomCode).emit("currentTimes", {
        gameId: id,
        white: game.whiteTime - (Date.now() - game.currentMoveStart),
        black: game.blackTime,
      });
      if (game.whiteTime - (Date.now() - game.currentMoveStart) < 0) {
        game.whiteTime = 0;
        clearInterval(game.interval);
        io.in(game.roomCode).emit("outOfTime", {
          gameId: id,
          winner: usernames[game.black],
        });
        const updateGame = await db.game.update({
          where: {
            id: id,
          },
          data: {
            winner: "black",
            result: "time",
          },
        });
      }
    } else {
      io.in(game.roomCode).emit("currentTimes", {
        gameId: id,
        black: game.blackTime - (Date.now() - game.currentMoveStart),
        white: game.whiteTime,
      });
      if (game.blackTime - (Date.now() - game.currentMoveStart) < 0) {
        game.blackTime = 0;
        clearInterval(game.interval);
        io.in(game.roomCode).emit("outOfTime", {
          gameId: id,
          winner: usernames[game.white],
        });
        const updateGame = await db.game.update({
          where: {
            id: id,
          },
          data: {
            winner: "white",
            result: "time",
          },
        });
      }
    }
  }, 200);
}

io.on("connection", (socket) => {
  console.log(`⚡: ${socket.id} user just connected!`);

  // Send message
  socket.on("sendMessage", (message) => {
    io.emit("recieveMessage", message);
  });

  // ------------------------------------------------------------------------------
  // Join Room
  socket.on("joinRoom", async (request) => {
    usernames[socket.id] = request.username;
    console.log("Join room request receieved: " + request.room);
    const sockets = await io.in(request.room).fetchSockets();
    const currentlyInRoom = [];
    if (sockets.length > 0) {
      if (sockets.length === 2) {
        console.log("This room is already full");
        return socket.emit("This room is already full.");
      }

      currentlyInRoom.push(usernames[sockets[0].id]);
      socket.join(request.room);
      currentlyInRoom.push(request.username);

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

  // ------------------------------------------------------------------------------
  // Leave room
  socket.on("leaveRoom", async (roomCode) => {
    socket.leave(roomCode);
    const currentlyInRoom = [];
    const sockets = await io.in(roomCode).fetchSockets();
    if (sockets.length !== 0) {
      currentlyInRoom.push(usernames[sockets[0].id]);
    }
    socket.emit("exitedRoom", {
      message: `You have left room: ${roomCode}`,
    });
    return io.in(roomCode).emit("playerLeft", {
      room: roomCode,
      players: currentlyInRoom,
    });
  });

  // ------------------------------------------------------------------------------
  // Start match
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
    const hostColour = randomNumber >= 0.5 ? "white" : "black";
    const otherColour = hostColour === "white" ? "black" : "white";
    const newGamePieces = require("./data/newGamePieces");

    // Need to get user ids of players, know which is white and which is black
    const hostUser = await db.user.findUnique({
      where: {
        username: usernames[hostSocketId],
      },
      select: {
        id: true,
      },
    });

    const otherUser = await db.user.findUnique({
      where: {
        username: usernames[otherSocketId],
      },
      select: {
        id: true,
      },
    });

    const whiteUserId = hostColour === "white" ? hostUser.id : otherUser.id;
    const blackUserId = hostColour === "black" ? hostUser.id : otherUser.id;
    const createGame = await db.game.create({
      data: {
        whiteId: whiteUserId,
        blackId: blackUserId,
        moves: JSON.stringify([]),
        winner: null,
        result: "unfinished",
      },
    });
    const game = {
      roomCode: roomCode,
      [hostColour]: hostSocketId,
      [otherColour]: otherSocketId,
      status: "unfinished",
      pieces: newGamePieces,
      whiteToMove: true,
      moves: [],
      whiteUserId: hostColour === "white" ? hostUser.id : otherUser.id,
      blackUserId: hostColour === "black" ? hostUser.id : otherUser.id,
      capturedPieces: [],
      whiteTime: 1800000,
      blackTime: 1800000,
    };
    games[createGame.id] = game;

    socket.emit("goToBoard", {
      gameId: createGame.id,
      status: "unfinished",
      colour: hostColour,
      whiteToMove: true,
      pieces: newGamePieces,
      roomCode: roomCode,
    });
    socket.in(roomCode).emit("goToBoard", {
      gameId: createGame.id,
      status: "unfinished",
      colour: otherColour,
      whiteToMove: true,
      pieces: newGamePieces,
      roomCode: roomCode,
    });
  });

  // ------------------------------------------------------------------------------
  // Send move
  socket.on("sendMove", async (request) => {
    const id = request.gameId;
    const game = games[id];
    if (request.roomCode !== game.roomCode) return "roomCodes do not match up";
    const expectedColour = game.whiteToMove ? "white" : "black";
    const expectedSocketId = game[expectedColour];

    if (socket.id !== expectedSocketId)
      return console.log("Unexpected socket id");
    if (request.colour !== expectedColour) {
      console.log(
        "expected: " + expectedColour + ", received: " + request.colour
      );
      return console.log("Supplied colour does not match expected colour");
    }

    if (request.selectedPiece.colour !== expectedColour)
      return console.log("Piece colour does not match expected colour");

    const moveLogic = require("./chessLogic/logic").moveLogic;

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

    const winner =
      logicResult.status === "checkmate"
        ? logicResult.whiteToMove
          ? "black"
          : "white"
        : null;
    const result =
      logicResult.status === "checkmate"
        ? "checkmate"
        : logicResult.status === "stalemate"
        ? "stalemate"
        : "unfinished";
    const updateGame = await db.game.update({
      where: {
        id: id,
      },
      data: {
        moves: JSON.stringify(game.moves),
        winner: winner,
        result: result,
      },
    });

    if (logicResult.status === "promote") {
      game.selectedPiece = logicResult.selectedPiece;
      return socket.emit("promotePiece", { ...logicResult, gameId: id });
    }

    pressClock(id);

    if (logicResult.status === "checkmate") {
      const winnerId = logicResult.whiteToMove ? game.black : game.white;
      const winnerUsername = usernames[winnerId];
      logicResult.winner = winnerUsername;

      return io
        .in(request.roomCode)
        .emit("checkmate", { ...logicResult, gameId: id });
    }

    if (logicResult.status === "stalemate") {
      return io
        .in(request.roomCode)
        .emit("stalemate", { ...logicResult, gameId: id });
    }

    return io
      .in(request.roomCode)
      .emit("moveComplete", { ...logicResult, gameId: id });
  });

  // ------------------------------------------------------------------------------
  // Promote Piece
  socket.on("promotePieceSelected", async (request) => {
    const id = request.gameId;
    const game = games[id];
    if (request.roomCode !== game.roomCode) return "roomCodes do not match up";
    const expectedColour = game.whiteToMove ? "white" : "black";
    const expectedSocketId = game[expectedColour];
    if (socket.id !== expectedSocketId)
      return console.log("Unexpected socket id");

    const promoteLogic = require("./chessLogic/logic").promoteLogic;
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

    const winner =
      logicResult.status === "checkmate"
        ? logicResult.whiteToMove
          ? "black"
          : "white"
        : null;
    const result =
      logicResult.status === "checkmate"
        ? "checkmate"
        : logicResult.status === "stalemate"
        ? "stalemate"
        : "unfinished";
    const updateGame = await db.game.update({
      where: {
        id: id,
      },
      data: {
        moves: JSON.stringify(game.moves),
        winner: winner,
        result: result,
      },
    });

    if (logicResult.status === "checkmate") {
      const winnerId = logicResult.whiteToMove ? game.black : game.white;
      const winnerUsername = usernames[winnerId];
      logicResult.winner = winnerUsername;

      return io
        .in(request.roomCode)
        .emit("checkmate", { ...logicResult, gameId: id });
    }

    if (logicResult.status === "stalemate") {
      return io
        .in(request.roomCode)
        .emit("stalemate", { ...logicResult, gameId: id });
    }

    return io
      .in(request.roomCode)
      .emit("moveComplete", { ...logicResult, gameId: id });
  });

  // ------------------------------------------------------------------------------
  // Send draw offer
  socket.on("sendDrawOffer", (request) => {
    const id = request.gameId;
    const game = games[id];
    if (request.roomCode !== game.roomCode) return "roomCodes do not match up";

    const requesterUsername = usernames[socket.id];
    return socket.in(request.roomCode).emit("drawOfferReceived", {
      gameId: id,
      roomCode: request.roomCode,
      type: "draw offer",
      text: `${requesterUsername} Has offered a draw. Do you accept?`,
      id: `${socket.id}${Math.random()}`,
    });
  });

  // ------------------------------------------------------------------------------
  // Draw offer response
  socket.on("drawOfferResponse", async (request) => {
    const id = request.gameId;
    const game = games[id];
    if (request.roomCode !== game.roomCode) return "roomCodes do not match up";

    if (request.accepted) {
      console.log("accepted");
      game.status = "draw";
      io.in(game.roomCode).emit("draw", { gameId: id });
      const updateGame = await db.game.update({
        where: {
          id: id,
        },
        data: {
          result: "draw",
        },
      });
      return;
    }
    return socket.in(game.roomCode).emit("drawOfferRejected", { gameId: id });
  });

  // ------------------------------------------------------------------------------
  // resignation
  socket.on("resign", async (request) => {
    const id = request.gameId;
    const game = games[id];
    if (request.roomCode !== game.roomCode) {
      return "roomCodes do not match up";
    }
    const loserUsername = usernames[socket.id];
    if (game.moves.length === 0) {
      game.status = null;
      io.in(game.roomCode).emit("gameEnded", {
        gameId: id,
        roomCode: request.roomCode,
        exitedPlayer: loserUsername,
      });
      const deleteGame = await db.game.delete({
        where: {
          id: id,
        },
      });
      return;
    }

    const winnerColour = game.white === socket.id ? "black" : "white";
    const winnerId = game[winnerColour];
    const winnerUsername = usernames[winnerId];
    game.winner = winnerColour;
    game.status = "resignation";
    const moveTime = Date.now() - game.currentMoveStart;
    game.whiteToMove
      ? (game.whiteTime -= Date.now() - game.currentMoveStart)
      : (game.blackTime -= Date.now() - game.currentMoveStart);
    io.in(game.roomCode).emit("resignation", {
      gameId: id,
      roomCode: request.roomCode,
      winner: winnerUsername,
    });
    const updateGame = await db.game.update({
      where: {
        id: id,
      },
      data: {
        winner: winnerColour,
        result: "resignation",
      },
    });
    return;
  });

  socket.on("disconnecting", async (reason) => {
    for (const room of socket.rooms) {
      const currentlyInRoom = [];
      const sockets = await io.in(room).fetchSockets();
      if (sockets.length !== 0) {
        currentlyInRoom.push(usernames[sockets[0].id]);
      }
      io.in(room).emit("playerLeft", {
        room: room,
        players: currentlyInRoom,
      });
      const tbd = [];
      for (const gameId in games) {
        const game = games[gameId];

        if (
          (game.black === socket.id || game.white === socket.id) &&
          game.status === "unfinished" &&
          game.roomCode === room
        ) {
          tbd.push(gameId);
          game.status = "forfeit";
          const winner = game.white === socket.id ? "black" : "white";

          io.in(room).emit("forfeit", {
            winner: winner,
            gameId: gameId,
          });

          // add to database, send forfeit result, remove game from games;
          const updateGame = await db.game.update({
            where: {
              id: gameId,
            },
            data: {
              winner: winner,
              result: "forfeit",
            },
          });
        }
      }

      for (const gameId in tbd) {
        delete games[gameId];
      }
    }
  });

  socket.on("disconnect", () => {
    console.log(`🔥: ${socket.id} just disconnected`);
    if (socket.id in usernames) {
      delete usernames[socket.id];
    }
  });
});


