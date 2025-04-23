//utils/api-helper.ts
import { z } from "zod";
import { NextResponse } from "next/server";

// Define the Prisma model interface
export type PrismaModel<T> = {
  findMany: (args?: { take?: number; skip?: number }) => Promise<T[]>;
  count: () => Promise<number>;
};

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
          document: results[0]
        });
      }
      return null;
    }
  } catch (error) {
    console.error("Database operation failed:", {
      error,
      collection: collection.constructor.name
    });
    return null;
  }
}

// Optional: Utility for creating error responses
export function createErrorResponse(
  message: string, 
  details?: unknown, 
  status: number = 500
) {
  return NextResponse.json(
    {
      success: false,
      error: message,
      ...(details && { details: JSON.parse(JSON.stringify(details)) })
    },
    { status }
  );
}
