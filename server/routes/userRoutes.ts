import { User } from "@prisma/client";
import { Request, Response } from "express";

const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const fs = require("fs");
const { Request, Response, NextFunction } = require("express");

const {
  getToken,
  COOKIE_OPTIONS,
  getRefreshToken,
  verifyUser,
} = require("../authenticate");
const { error } = require("console");

router.post("/signup", async (req: Request, res: Response) => {
  let valid = true;
  const errors = {
    usernameError: "",
    passwordError: "",
    generalError: "",
  };

  if (!req.body.username) {
    errors.usernameError = "request body does not contain a username";
    valid = false;
  }

  if (!req.body.password) {
    errors.passwordError = "request body does not contain a password";
    valid = false;
  }

  if (!valid) {
    return res.status(400).json(errors);
  }

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
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const token = getToken({ id: user.id });
    res.send({ success: true, username: user.username, token });
  }
);

router.get("/getUser", verifyUser, (req: Request, res: Response) => {
  const user = req.user as User;
  const token = getToken({ id: user.id });
  res.send({ username: user.username, token });
});

router.get("/logout", verifyUser, async (req: Request, res: Response) => {
  return res.send({ success: true });
});

router.get("/games", verifyUser, async (req: Request, res: Response) => {
  const user = req.user as User;
  const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
  const toDisplay = 12;

  const gamesCount = await db.game.count({
    where: {
      OR: [
        {
          whiteId: user.id,
        },
        {
          blackId: user.id,
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
          whiteId: user.id,
        },
        {
          blackId: user.id,
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

router.get(
  "/games/:gameId",
  verifyUser,
  async (req: Request, res: Response) => {
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
  }
);

router.get("/stats", verifyUser, async (req: Request, res: Response) => {
  const user = req.user as User;
  const gamesCount = await db.game.count({
    where: {
      OR: [
        {
          whiteId: user.id,
        },
        {
          blackId: user.id,
        },
      ],
    },
  });

  const whiteWins = await db.game.count({
    where: { AND: [{ whiteId: user.id }, { winner: "white" }] },
  });

  const blackWins = await db.game.count({
    where: { AND: [{ blackId: user.id }, { winner: "black" }] },
  });

  const whiteLosses = await db.game.count({
    where: { AND: [{ whiteId: user.id }, { winner: "black" }] },
  });

  const blackLosses = await db.game.count({
    where: { AND: [{ blackId: user.id }, { winner: "white" }] },
  });

  const unfinished = await db.game.count({
    where: {
      AND: [
        {
          OR: [
            {
              whiteId: user.id,
            },
            {
              blackId: user.id,
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

router.get("/avatar", verifyUser, async (req: Request, res: Response) => {
  const user = req.user as User;
  const avatarUrl = await db.user.findUnique({
    where: {
      id: user.id,
    },
    select: {
      avatar: true,
    },
  });

  fs.readFile(
    `userAvatars/${avatarUrl.avatar}`,
    async (error: any, data: any) => {
      if (!error && data) {
        return res.sendFile(avatarUrl.avatar, { root: "./userAvatars" });
      } else {
        const updateFilename = await db.user.update({
          where: {
            id: user.id,
          },
          data: {
            avatar: "defaultAvatar.png",
          },
        });

        return res.sendFile("defaultAvatar.png", { root: "./userAvatars" });
      }
    }
  );
});

router.post(
  "/updateAvatar",
  verifyUser,
  bodyParser.raw({ type: ["image/png", "image/jpeg"], limit: "5mb" }),
  async (req: Request, res: Response) => {
    const user = req.user as User;
    const userId = user.id;
    try {
      const filename = `${userId}.png`;
      fs.writeFile(`userAvatars/${filename}`, req.body, (error: any) => {
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

      return res.sendFile(filename, { root: "./userAvatars" });
    } catch (error) {
      res.sendStatus(500);
    }
  }
);

router.get("/test", async (req: Request, res: Response) => {
  const users = await db.user.findMany({ select: { username: true } });
  res.send(users);
});

module.exports = router;
export {};
