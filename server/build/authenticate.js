"use strict";
var _a, _b;
Object.defineProperty(exports, "__esModule", { value: true });
const passport = require("passport");
const jwt = require("jsonwebtoken");
const dev = process.env.NODE_ENV !== "production";
const refreshTokenExpiry = (_a = process.env.REFRESH_TOKEN_EXPIRY) !== null && _a !== void 0 ? _a : "60 * 60 * 24 * 30";
const sessionExpiry = (_b = process.env.SESSION_EXPIRY) !== null && _b !== void 0 ? _b : "60 * 60 * 4";
exports.COOKIE_OPTIONS = {
    httpOnly: false,
    // Since localhost is not having https protocol,
    // secure cookies do not work correctly (in postman)
    secure: true,
    signed: true,
    maxAge: eval(refreshTokenExpiry) * 1000,
    SameSite: "none",
};
exports.getToken = (user) => {
    return jwt.sign(user, process.env.JWT_SECRET, {
        expiresIn: eval(sessionExpiry),
    });
};
exports.getRefreshToken = (user) => {
    const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
        expiresIn: eval(refreshTokenExpiry),
    });
    return refreshToken;
};
exports.verifyUser = passport.authenticate("jwt", { session: false });
