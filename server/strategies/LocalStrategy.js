const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const db = require("../db.js");
const bcrypt = require("bcryptjs");

//Called during login/sign up.
passport.use(
    new LocalStrategy(async function verify(username, password, done) {
        const user = await db.user.findUnique({
            where: { username },
        });

        if (!user) {
            return done(null, false, {
                message: "Incorrect username or password",
            });
        }

        const isCorrectPassword = await bcrypt.compare(
            password,
            user.passwordHash
        );
        if (!isCorrectPassword)
            return done(null, false, { message: "Incorrect password" });

        return done(null, user);
    })
);

//called while after logging in / signing up to set user details in req.user
passport.serializeUser(function (user, done) {
    done(null, user.id);
});
