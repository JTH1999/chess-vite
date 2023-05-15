import { User } from "@prisma/client";

const passport = require("passport");
const jwt = require("jsonwebtoken");
const dev = process.env.NODE_ENV !== "production";
const refreshTokenExpiry: string =
  process.env.REFRESH_TOKEN_EXPIRY ?? "60 * 60 * 24 * 30";
const sessionExpiry: string = process.env.SESSION_EXPIRY ?? "60 * 60 * 4";

exports.COOKIE_OPTIONS = {
  httpOnly: false,
  // Since localhost is not having https protocol,
  // secure cookies do not work correctly (in postman)
  secure: true,
  signed: true,
  maxAge: eval(refreshTokenExpiry) * 1000,
  SameSite: "none",
};

exports.getToken = (user: any) => {
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: eval(sessionExpiry),
  });
};

exports.getRefreshToken = (user: any) => {
  const refreshToken = jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: eval(refreshTokenExpiry),
  });
  return refreshToken;
};

exports.verifyUser = passport.authenticate("jwt", { session: false });
export {};
