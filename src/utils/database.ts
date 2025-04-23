import prisma from "@/lib/prisma";

export async function testDatabaseConnection(): Promise<boolean> {
    try {
        await prisma.$runCommandRaw({ ping: 1 });
        console.log("✅ Database connection successful");
        return true;
    } catch (error) {
        console.error("❌ Database connection error:", error);
        return false;
    }
}