// src/lib/prisma.ts
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Optional: Middleware for automatic createdAt/updatedAt
prisma.$use(async (params, next) => {
  if (params.action === 'create' || params.action === 'update') {
    const now = new Date();
    if (params.action === 'create') {
      params.args.data.createdAt = now;
    }
    params.args.data.updatedAt = now;
  }
  return next(params);
});

export default prisma;
