import 'dotenv/config';
import { prisma } from '../src/lib/prisma.js';

const user = await prisma.user.findUnique({ where: { email: 'admin@castme.vn' } });
console.log('FOUND_USER=', JSON.stringify(user, null, 2));
await prisma.$disconnect();
