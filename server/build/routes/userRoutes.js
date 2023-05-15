"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const router = express.Router();
const db = require("../db.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const fs = require("fs");
const { Request, Response, NextFunction } = require("express");
const { getToken, COOKIE_OPTIONS, getRefreshToken, verifyUser, } = require("../authenticate");
const { error } = require("console");
router.post("/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
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
    const userExists = yield db.user.findFirst({
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
    const passwordHash = yield bcrypt.hash(req.body.password, 10);
    const user = yield db.user.create({
        data: { username: req.body.username, passwordHash: passwordHash },
    });
    if (!user) {
        errors.generalError = `Something went wrong trying to create new user`;
        return res.status(400).json(errors);
    }
    const token = getToken({ id: user.id });
    res.send({ success: true, token });
}));
router.post("/login", passport.authenticate("local"), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const token = getToken({ id: user.id });
    res.send({ success: true, username: user.username, token });
}));
router.get("/getUser", verifyUser, (req, res) => {
    const user = req.user;
    const token = getToken({ id: user.id });
    res.send({ username: user.username, token });
});
router.get("/logout", verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.send({ success: true });
}));
router.get("/games", verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const page = req.query.page ? parseInt(req.query.page.toString()) : 0;
    const toDisplay = 12;
    const gamesCount = yield db.game.count({
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
    const games = yield db.game.findMany({
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
}));
router.get("/games/:gameId", verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const gameId = req.params.gameId;
    const game = yield db.game.findUnique({
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
}));
router.get("/stats", verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const gamesCount = yield db.game.count({
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
    const whiteWins = yield db.game.count({
        where: { AND: [{ whiteId: user.id }, { winner: "white" }] },
    });
    const blackWins = yield db.game.count({
        where: { AND: [{ blackId: user.id }, { winner: "black" }] },
    });
    const whiteLosses = yield db.game.count({
        where: { AND: [{ whiteId: user.id }, { winner: "black" }] },
    });
    const blackLosses = yield db.game.count({
        where: { AND: [{ blackId: user.id }, { winner: "white" }] },
    });
    const unfinished = yield db.game.count({
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
    const draws = gamesCount - whiteWins - blackWins - whiteLosses - blackLosses - unfinished;
    return res.send({
        games: gamesCount,
        wins: whiteWins + blackWins,
        losses: whiteLosses + blackLosses,
        draws: draws,
        unfinished: unfinished,
    });
}));
router.get("/avatar", verifyUser, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const avatarUrl = yield db.user.findUnique({
        where: {
            id: user.id,
        },
        select: {
            avatar: true,
        },
    });
    return res.sendFile(avatarUrl.avatar, { root: "./userAvatars" });
}));
router.post("/updateAvatar", verifyUser, bodyParser.raw({ type: ["image/png", "image/jpeg"], limit: "5mb" }), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = req.user;
    const userId = user.id;
    try {
        console.log(req.body);
        const filename = `${userId}.png`;
        fs.writeFile(`userAvatars/${filename}`, req.body, (error) => {
            if (error) {
                throw error;
            }
        });
        const updateFilename = yield db.user.update({
            where: {
                id: userId,
            },
            data: {
                avatar: filename,
            },
        });
        return res.sendFile(filename, { root: "./userAvatars" });
    }
    catch (error) {
        res.sendStatus(500);
    }
}));
router.get("/test", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield db.user.findMany({ select: { username: true } });
    res.send(users);
}));
module.exports = router;
