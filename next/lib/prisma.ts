import { PrismaClient } from "@/app/generated/prisma/client";

let prisma: PrismaClient;
if (process.env.NODE_ENV === "production") {
    // In production, we use the Prisma client directly
    prisma = new PrismaClient();
} else {
    // In development, we use the Prisma client with a custom logger
    if (!(global as any).prisma) {
        (global as any).prisma = new PrismaClient();
    }
    prisma = (global as any).prisma;
}
export default prisma;