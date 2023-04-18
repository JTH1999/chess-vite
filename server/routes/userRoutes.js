const express = require("express");
const router = express.Router();
// const User = require("../models/user")
const db = require("../db.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
// const multer = require("multer")
const bodyParser = require("body-parser");
const fs = require("fs");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../authenticate");
const { error } = require("console");

router.post("/signup", async (req, res, next) => {
  const errors = {
    usernameError: "",
    passwordError: "",
    generalError: "",
  };
  let valid = true;
  const userExists = await db.user.findFirst({
    where: { username: req.body.username },
  });
  if (userExists) {
    errors.usernameError = `User with username ${req.body.username} already exists`;
    return res.status(400).json(errors);
  }

  if (req.body.username.length < 4) {
    errors.usernameError = "Username must be at least 4 characters";
    valid = false;
  }
  if (req.body.password.length < 4) {
    errors.passwordError = "Password must be at least 4 characters";
    valid = false;
  }

  if (!valid) {
    return res.status(400).json(errors);
  }

  const passwordHash = await bcrypt.hash(req.body.password, 10);

  const user = await db.user.create({
    data: { username: req.body.username, passwordHash: passwordHash },
  });
  if (!user) {
    errors.generalError = `Something went wrong trying to create new user`;
    return res.status(400).json(errors);
  }

  const token = getToken({ id: user.id });

  res.send({ success: true, token });
});

router.post(
  "/login",
  passport.authenticate("local"),
  async (req, res, next) => {
    const token = getToken({ id: req.user.id });

    res.send({ success: true, username: req.user.username, token });
  }
);

router.get("/getUser", verifyUser, (req, res, next) => {
  const token = getToken({ id: req.user.id });
  res.send({ username: req.user.username, token });
});

router.get("/logout", verifyUser, async (req, res, next) => {
  return res.send({ success: true });
});

router.get("/games", verifyUser, async (req, res, next) => {
  const page = req.query.page ? parseInt(req.query.page) : 0;
  const toDisplay = 12;

  const gamesCount = await db.game.count({
    where: {
      OR: [
        {
          whiteId: req.user.id,
        },
        {
          blackId: req.user.id,
        },
      ],
    },
  });

  const pagesCount = Math.ceil(gamesCount / toDisplay);

  const games = await db.game.findMany({
    skip: page * toDisplay,
    take: toDisplay,
    where: {
      OR: [
        {
          whiteId: req.user.id,
        },
        {
          blackId: req.user.id,
        },
      ],
    },
    select: {
      id: true,
      moves: true,
      winner: true,
      result: true,
      createdAt: true,
      whiteUser: {
        select: {
          username: true,
        },
      },
      blackUser: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
  return res.send({
    success: true,
    games: games,
    gamesCount: gamesCount,
    pagesCount: pagesCount,
    currentPage: page,
  });
});

router.get("/games/:gameId", verifyUser, async (req, res, next) => {
  const gameId = req.params.gameId;
  const game = await db.game.findUnique({
    where: {
      id: gameId,
    },
    select: {
      id: true,
      moves: true,
      winner: true,
      result: true,
      createdAt: true,
      whiteUser: {
        select: {
          username: true,
        },
      },
      blackUser: {
        select: {
          username: true,
        },
      },
    },
  });
  return res.send({ success: true, game: game });
});

router.get("/stats", verifyUser, async (req, res, next) => {
  const gamesCount = await db.game.count({
    where: {
      OR: [
        {
          whiteId: req.user.id,
        },
        {
          blackId: req.user.id,
        },
      ],
    },
  });

  const whiteWins = await db.game.count({
    where: { AND: [{ whiteId: req.user.id }, { winner: "white" }] },
  });

  const blackWins = await db.game.count({
    where: { AND: [{ blackId: req.user.id }, { winner: "black" }] },
  });

  const whiteLosses = await db.game.count({
    where: { AND: [{ whiteId: req.user.id }, { winner: "black" }] },
  });

  const blackLosses = await db.game.count({
    where: { AND: [{ blackId: req.user.id }, { winner: "white" }] },
  });

  const unfinished = await db.game.count({
    where: {
      AND: [
        {
          OR: [
            {
              whiteId: req.user.id,
            },
            {
              blackId: req.user.id,
            },
          ],
        },
        {
          result: {
            equals: "unfinished",
          },
        },
      ],
    },
  });

  const draws =
    gamesCount - whiteWins - blackWins - whiteLosses - blackLosses - unfinished;

  return res.send({
    games: gamesCount,
    wins: whiteWins + blackWins,
    losses: whiteLosses + blackLosses,
    draws: draws,
    unfinished: unfinished,
  });
});

router.get("/avatar", verifyUser, async (req, res, next) => {
  const avatarUrl = await db.user.findUnique({
    where: {
      id: req.user.id,
    },
    select: {
      avatar: true,
    },
  });
  return res.sendFile(avatarUrl.avatar, {root: "./userAvatars"});
});

router.post(
  "/updateAvatar",
  verifyUser,
  bodyParser.raw({ type: ["image/png", "image/jpeg"], limit: "5mb" }),
  async (req, res, next) => {
    const userId = req.user.id;
    try {
      console.log(req.body);
      const filename = `${userId}.png`;
      fs.writeFile(`userAvatars/${filename}`, req.body, (error) => {
        if (error) {
          throw error;
        }
      });
      const updateFilename = await db.user.update({
        where: {
          id: userId,
        },
        data: {
          avatar: filename,
        },
      });
      
      return res.sendFile(filename, {root: "./userAvatars"});
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

router.get("/test", async (req, res, next) => {
  const users = await db.user.findMany({select: {username: true}});
  res.send(users);
})

module.exports = router;
