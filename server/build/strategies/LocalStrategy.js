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
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db.js");
const bcrypt = require("bcryptjs");
//Called during login/sign up.
passport.use(new LocalStrategy(function verify(username, password, done) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield db.user.findUnique({
            where: { username },
        });
        if (!user) {
            return done(null, false, {
                message: "Incorrect username or password",
            });
        }
        const isCorrectPassword = yield bcrypt.compare(password, user.passwordHash);
        if (!isCorrectPassword)
            return done({ message: "Incorrect password" }, false);
        return done(null, user);
    });
}));
// called while after logging in / signing up to set user details in req.user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
