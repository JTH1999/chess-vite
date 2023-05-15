import { User } from "@prisma/client";
import { DoneCallback } from "passport";

const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy,
  ExtractJwt = require("passport-jwt").ExtractJwt;

const db = require("../db");

const opts: { jwtFromRequest: any; secretOrKey: string | undefined } = {
  jwtFromRequest: undefined,
  secretOrKey: undefined,
};
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;

// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
passport.use(
  new JwtStrategy(opts, async function (jwt_payload: any, done: DoneCallback) {
    // Check against the DB only if necessary.
    // This can be avoided if you don't want to fetch user details in each request.
    const user: User = await db.user.findUnique({
      where: { id: jwt_payload.id },
    });
    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
      // or you could create a new account
    }
  })
);
export {};
