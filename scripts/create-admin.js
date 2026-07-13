require('dotenv/config');
const bcrypt = require('bcryptjs');
const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const email = 'admin@castme.vn';
  const existing = await prisma.user.findUnique({ where: { email } });

  if (existing) {
    console.log('admin_exists');
    return;
  }

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  await prisma.user.create({
    data: {
      name: 'Admin CASTME',
      email,
      password: passwordHash,
      role: 'ADMIN',
    },
  });

  console.log('admin_created');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
