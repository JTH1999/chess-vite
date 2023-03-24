const express = require("express");
const router = express.Router();
// const User = require("../models/user")
const db = require("../db.js");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const {
    getToken,
    COOKIE_OPTIONS,
    getRefreshToken,
    verifyUser,
} = require("../authenticate");

router.post("/signup", async (req, res, next) => {
    const userExists = await db.user.findFirst({
        where: { username: req.body.username },
    });
    if (userExists) {
        return res.status(400).json({
            fieldErrors: null,
            fields: null,
            formError: `User with username ${req.body.username} already exists`,
        });
    }
    const passwordHash = await bcrypt.hash(req.body.password, 10);

    const user = await db.user.create({
        data: { username: req.body.username, passwordHash: passwordHash },
    });
    if (!user) {
        return res.status(400).json({
            fieldErrors: null,
            fields: null,
            formError: `Something went wrong trying to create new user`,
        });
    }

    const token = getToken({ id: user.id });
    // const refreshToken = getRefreshToken({ id: user.id });
    // const session = await db.session.create({
    //     data: {
    //         refreshToken: refreshToken,
    //         userId: user.id,
    //     },
    // });

    // res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
    // req.session.refreshToken = refreshToken;
    res.send({ success: true, token });
});

router.post(
    "/login",
    passport.authenticate("local"),
    async (req, res, next) => {
        const token = getToken({ id: req.user.id });
        // const refreshToken = getRefreshToken({ id: req.user.id });
        // const session = await db.session.create({
        //     data: {
        //         refreshToken: refreshToken,
        //         userId: req.user.id,
        //     },
        // });
        // if (!session) {
        //     return res.status(400).json({
        //         fieldErrors: null,
        //         fields: null,
        //         formError: `Error trying to log in`,
        //     });
        // }

        // res.cookie("refreshToken", refreshToken, COOKIE_OPTIONS);
        // res.cookie("refreshToken", refreshToken, {
        //     httpOnly: true,
        //     ameSite: "none",
        //     secure: false,
        // });
        // console.log(refreshToken);
        // req.session.refreshToken = refreshToken;
        // console.log("login rt: " + refreshToken);
        res.send({ success: true, username: req.user.username, token });
    }
);

// router.post("/refreshToken", async (req, res, next) => {
//     // const { signedCookies = {} } = req;
//     // const { refreshToken } = signedCookies;
//     const refreshToken = req.body.token;
//     console.log(req.headers.authorization);
//     // const cookies = req.cookies;
//     // console.log(cookies);
//     // const refreshToken = cookies.session;
//     // const refreshToken = req.headers.cookie.session;
//     // console.log("rT: " + refreshToken);

//     // if (refreshToken) {
//         try {
//             const payload = jwt.verify(
//                 refreshToken,
//                 process.env.REFRESH_TOKEN_SECRET
//             );
//             const userId = payload.id;
//             console.log(userId);
//             const user = await db.user.findUnique({
//                 where: { id: userId },
//             });
//             console.log(user);
//             if (user) {
//                 const sessionRefreshToken = await db.session.findUnique({
//                     where: {
//                         refreshToken: refreshToken,
//                     },
//                 });

//                 if (
//                     !sessionRefreshToken ||
//                     sessionRefreshToken.userId !== userId
//                 ) {
//                     console.log(!sessionRefreshToken);
//                     console.log(sessionRefreshToken.userId !== userId);
//                     res.statusCode = 401;
//                     res.send("Unauthorized");
//                     console.log(0);
//                 } else {
//                     const token = getToken({ id: userId });
//                     // If the refresh token exists, then create new one and replace it.
//                     const newRefreshToken = getRefreshToken({
//                         id: userId,
//                     });

//                     const deleteRefreshToken = await db.session.delete({
//                         where: {
//                             refreshToken: refreshToken,
//                         },
//                     });
//                     const newSession = await db.session.create({
//                         data: {
//                             refreshToken: newRefreshToken,
//                             userId: userId,
//                         },
//                     });

//                     if (!newSession) {
//                         console.log(1);
//                         return res.status(400).json({
//                             fieldErrors: null,
//                             fields: null,
//                             formError: `Error creating new refresh token`,
//                         });
//                     }
//                     // console.log("success");
//                     // res.cookie("refreshToken", newRefreshToken, COOKIE_OPTIONS);
//                     res.send({ success: true, token, refreshToken });
//                 }
//             } else {
//                 console.log(2);
//                 res.statusCode = 401;
//                 res.send("Unauthorized");
//             }
//         } catch (err) {
//             console.log(3);
//             res.statusCode = 401;
//             res.send("Unauthorized");
//         }
//     } else {
//         console.log(4);
//         res.statusCode = 401;
//         res.send("Unauthorized");
//     }
// });

router.get("/getUser", verifyUser, (req, res, next) => {
    const token = getToken({ id: req.user.id });
    res.send({ username: req.user.username, token });
});

router.get("/logout", verifyUser, async (req, res, next) => {
    // const { signedCookies = {} } = req;
    // const { refreshToken } = signedCookies;

    // const deleteRefreshTokens = await db.session.deleteMany({
    //     where: { userId: req.user.id },
    // });

    // const count = await db.session.count({
    //     where: { userId: req.user.id },
    // });
    // if (count !== 0) {
    //     return res.status(400).json({
    //         error: `Non-zero refresh token count`,
    //     });
    // }

    // res.clearCookie("refreshToken", COOKIE_OPTIONS);
    return res.send({ success: true });
});

router.get("/games", verifyUser, async (req, res, next) => {
    const games = await db.game.findMany({
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
    return res.send({ success: true, games: games });
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

router.delete("/clearSessions", async (req, res) => {
    const deleteAll = await db.session.deleteMany({});
    console.log(deleteAll);
    return res.status(200).json({ message: "done" });
});

module.exports = router;
