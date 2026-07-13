import 'dotenv/config';
import bcrypt from 'bcryptjs';
import { prisma } from '../src/lib/prisma.js';

const email = 'admin@castme.vn';
const password = 'Admin@123';

const existing = await prisma.user.findUnique({ where: { email } });
if (existing) {
  console.log('EXISTING', JSON.stringify(existing, null, 2));
} else {
  const hashed = await bcrypt.hash(password, 10);
  const created = await prisma.user.create({
    data: {
      name: 'Admin',
      email,
      password: hashed,
      role: 'ADMIN',
      balance: 0,
      hearts: 0,
      connects: 0,
    },
  });
  console.log('CREATED', JSON.stringify(created, null, 2));
}

await prisma.$disconnect();
