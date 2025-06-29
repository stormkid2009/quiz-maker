//utils/api-helper.ts
import { z } from "zod";

/**
 * Generic interface for Prisma model operations.
 * @template T Type of the model record.
 * @property {(args?: { take?: number; skip?: number }) => Promise<T[]>} findMany - Finds multiple records with optional pagination.
 * @property {() => Promise<number>} count - Counts total records in the model.
 */
export type PrismaModel<T> = {
  findMany: (args?: { take?: number; skip?: number }) => Promise<T[]>;
  count: () => Promise<number>;
};

/**
 * Fetches a random document from the given Prisma model and validates it using the provided Zod schema.
 *
 * @template T Type of the document.
 * @param {PrismaModel<T>} collection - The Prisma model to query.
 * @param {z.ZodType<T>} schema - Zod schema for validating the document.
 * @returns {Promise<T|null>} The validated document or null if not found or on error.
 */
export async function getOneRandomDoc<T>(
  collection: PrismaModel<T>,
  schema: z.ZodType<T>
): Promise<T | null> {
  try {
    const count = await collection.count();

    if (count === 0) {
      console.warn("Collection is empty");
      return null;
    }

    const randomSkip = Math.floor(Math.random() * count);
    const results = await collection.findMany({
      skip: randomSkip,
      take: 1,
    });

    if (results.length === 0 || !results[0]) {
      console.warn("No document found after random skip");
      return null;
    }

    try {
      return schema.parse(results[0]);
    } catch (validationError) {
      if (validationError instanceof z.ZodError) {
        console.error("Validation failed for document:", {
          errors: validationError.errors,
          document: results[0],
        });
      }
      return null;
    }
  } catch (error) {
    console.error("Database operation failed:", {
      error,
      collection: collection.constructor.name,
    });
    return null;
  }
}
