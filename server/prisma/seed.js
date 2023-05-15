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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db = new client_1.PrismaClient();
function seed() {
    return __awaiter(this, void 0, void 0, function* () {
        const passwordHash = yield bcryptjs_1.default.hash("Password", 10);
        const jack = yield db.user.create({
            data: {
                username: "JT-Harmer",
                passwordHash: passwordHash,
            },
        });
        const magnus = yield db.user.create({
            data: {
                username: "MagnusCarlsen",
                passwordHash: yield bcryptjs_1.default.hash("Champ", 10),
            },
        });
        const pod = yield db.user.create({
            data: {
                username: "Pod",
                passwordHash: yield bcryptjs_1.default.hash("Octopus", 10),
            },
        });
    });
}
seed();
