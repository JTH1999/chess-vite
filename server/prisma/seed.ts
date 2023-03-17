import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const db = new PrismaClient();

async function seed() {
    const passwordHash = await bcrypt.hash("Password", 10);
    const jack = await db.user.create({
        data: {
            username: "jack",
            passwordHash: passwordHash,
        },
    });
}

seed();
