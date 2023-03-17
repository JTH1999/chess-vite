const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const db = require("./db.js");
const passport = require("passport");
const cookieSession = require("cookie-session");

if (process.env.NODE_ENV !== "production") {
    // Load environment variables from .env file in non prod environments
    require("dotenv").config();
}

require("./strategies/JwtStrategy");
require("./strategies/LocalStrategy");
require("./authenticate");

const userRouter = require("./routes/userRoutes");
const onlineRouter = require("./routes/onlineRoutes");

const app = express();
app.use(bodyParser.json());

//Add the client URL to the CORS policy

const whitelist = process.env.WHITELISTED_DOMAINS
    ? process.env.WHITELISTED_DOMAINS.split(",")
    : [];

const corsOptions = {
    origin: function (origin, callback) {
        if (!origin || whitelist.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            callback(new Error("Not allowed by CORS"));
        }
    },

    credentials: true,
};

app.use(cors(corsOptions));

app.use(passport.initialize());

app.use("/users", userRouter);
app.use("/online", onlineRouter);

app.get("/", async function (req, res) {
    const user = await db.user.findUnique({
        where: { username: "jack" },
    });
    res.send({ status: "success", userId: user.id, username: user.username });
});

//Start the server in port 8081

const server = app.listen(process.env.PORT || 8081, function () {
    const port = server.address().port;

    console.log("App started at port:", port);
});
