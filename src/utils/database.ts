import prisma from "@/lib/prisma";

/**
 * Tests the database connection by issuing a ping command via Prisma.
 *
 * @async
 * @returns {Promise<boolean>} Resolves to true if the connection is successful; false otherwise.
 */
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
