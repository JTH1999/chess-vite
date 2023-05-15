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
const passport = require("passport");
const JwtStrategy = require("passport-jwt").Strategy, ExtractJwt = require("passport-jwt").ExtractJwt;
const db = require("../db.js");
const opts = { jwtFromRequest: undefined, secretOrKey: undefined };
opts.jwtFromRequest = ExtractJwt.fromAuthHeaderAsBearerToken();
opts.secretOrKey = process.env.JWT_SECRET;
// Used by the authenticated requests to deserialize the user,
// i.e., to fetch user details from the JWT.
passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    return __awaiter(this, void 0, void 0, function* () {
        // Check against the DB only if necessary.
        // This can be avoided if you don't want to fetch user details in each request.
        const user = yield db.user.findUnique({
            where: { id: jwt_payload.id },
        });
        if (user) {
            return done(null, user);
        }
        else {
            return done(null, false);
            // or you could create a new account
        }
    });
}));
