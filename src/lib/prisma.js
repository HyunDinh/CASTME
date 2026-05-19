// src/lib/prisma.js
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';

const globalForPrisma = globalThis;

// Khởi tạo Pool kết nối từ thư viện 'pg' thuần
const pool = new pg.Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);

export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
    adapter: adapter, // <--- Đây là cách Prisma 7 nhận chuỗi kết nối tại Runtime
  });

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;