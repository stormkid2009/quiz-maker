// src/lib/prisma.ts
/**
 * Prisma client setup and middleware for automatic timestamp management.
 *
 * Provides a singleton PrismaClient instance and configures middleware
 * to set createdAt and updatedAt fields on create and update operations.
 */
import { PrismaClient } from "@prisma/client";

/**
 * Prisma client instance for database interactions throughout the application.
 */
const prisma = new PrismaClient();

/**
 * Prisma middleware to automatically set timestamp fields on create/update.
 *
 * @param params - Prisma middleware parameters including action and args.
 * @param next - Next resolver in the middleware chain.
 * @returns Result of the next operation.
 * @async
 */
prisma.$use(async (params, next) => {
  if (params.action === "create" || params.action === "update") {
    const now = new Date();
    if (params.action === "create") {
      params.args.data.createdAt = now;
    }
    params.args.data.updatedAt = now;
  }
  return next(params);
});

export default prisma;
