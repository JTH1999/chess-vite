import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function seed() {
    const passwordHash = await bcrypt.hash("Password", 10);
    const jack = await db.user.create({
        data: {
            username: "JT-Harmer",
            passwordHash: passwordHash,
        },
    });

    const magnus = await db.user.create({
        data: {
            username: "MagnusCarlsen",
            passwordHash: await bcrypt.hash("Champ", 10),
        },
    });

    const pod = await db.user.create({
        data: {
            username: "Pod",
            passwordHash: await bcrypt.hash("Octopus", 10),
        },
    });
}

seed();
