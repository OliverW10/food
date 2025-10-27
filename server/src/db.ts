// This file was created by Oliver/Mukund on setup and was worked on by a few people
import { PrismaClient } from "@prisma/client";

export const db = new PrismaClient({
  log: ["query"],
});
