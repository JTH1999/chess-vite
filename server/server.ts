const express = require("express");
const cors = require("cors");
const bcrypt = require("bcyrpt");
const db = require("./db.ts");
const passport = require("passport")

const initailisePassport = require("./passport-config")
initailisePassport(passport);

const app = express();

app.use(cors());

app.use("/login", (req, res) => {
    res.send({
        token: "test123",
    });
});

app.listen(8080, () =>
    console.log("API is running on http://localhost:8080/login")
);

app.post("/register", async (req, res) => {
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

    const user = await register({req.body.username, req.body.password})
    if (!user) {
        return res.status(400).json({
            fieldErrors: null,
            fields: null,
            formError: `Something went wrong trying to create a new user.`,
        });
    }
});
type LoginForm = {
    username: string;
    password: string;
};

const sessionSecret = process.env.SESSION_SECRET;
if (!sessionSecret) {
    throw new Error("SESSION_SECRET must be set");
}

const storage = createCookieSessionStorage({
    cookie: {
        name: "chess_session",
        secure: true,
        secrets: [sessionSecret],
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 30,
        httpOnly: true,
    },
});

export async function createUserSession(userId: string, redirectTo: string) {
    const session = await storage.getSession();
    session.set("userId", userId);
    return redirect(redirectTo, {
        headers: {
            "Set-Cookie": await storage.commitSession(session),
        },
    });
}

function getUserSession(request: Request) {
    return storage.getSession(request.headers.get("Cookie"));
}

export async function getUserId(request: Request) {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") return null;
    return userId;
}

export async function requireUserId(
    request: Request,
    redirectTo: string = new URL(request.url).pathname
) {
    const session = await getUserSession(request);
    const userId = session.get("userId");
    if (!userId || typeof userId !== "string") {
        console.log("booboo");
        const searchParams = new URLSearchParams([["redirectTo", redirectTo]]);
        throw redirect(`/login?${searchParams}`);
    }
    return userId;
}

export async function login({ username, password }: LoginForm) {
    const user = await db.user.findUnique({
        where: { username },
    });

    if (!user) {
        return null;
    }

    const isCorrectPassword = await bcrypt.compare(password, user.passwordHash);
    if (!isCorrectPassword) return null;

    return { id: user.id, username };
}

export async function getUser(request: Request) {
    const userId = await getUserId(request);
    if (typeof userId !== "string") return null;
    try {
        const user = await db.user.findUnique({
            where: { id: userId },
            select: { id: true, username: true },
        });
        return user;
    } catch {
        throw logout(request);
    }
}

export async function logout(request: Request) {
    const session = await getUserSession(request);
    return redirect("/login", {
        headers: {
            "Set-Cookie": await storage.destroySession(session),
        },
    });
}

export async function register({ username, password }: LoginForm) {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await db.user.create({
        data: { username, passwordHash },
    });
    return { id: user.id, username };
}
