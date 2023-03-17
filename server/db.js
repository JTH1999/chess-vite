const prismaClient = require("@prisma/client").PrismaClient;

let db;

// declare global {
//     var __db: PrismaClient | undefined;
// }

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
if (process.env.NODE_ENV === "production") {
    db = new prismaClient();
} else {
    if (!global.__db) {
        global.__db = new prismaClient();
    }
    db = global.__db;
}

module.exports = db;
