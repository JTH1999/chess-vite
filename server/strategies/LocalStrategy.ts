import { User } from "@prisma/client";
import { DoneCallback } from "passport";

const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db");
const bcrypt = require("bcryptjs");

//Called during login/sign up.
passport.use(
  new LocalStrategy(async function verify(
    username: string,
    password: string,
    done: any
  ) {
    const user: User = await db.user.findUnique({
      where: { username },
    });

    if (!user) {
      return done(null, false, {
        message: "Incorrect username or password",
      });
    }

    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isCorrectPassword)
      return done({ message: "Incorrect password" }, false);

    return done(null, user);
  })
);

// called while after logging in / signing up to set user details in req.user
passport.serializeUser(function (user: User, done: any) {
  done(null, user.id);
});
export {};
