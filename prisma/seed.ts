/* eslint-disable @typescript-eslint/no-misused-promises */
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  // 1. Create admin user
  await prisma.user.create({
    data: {
      username: 'admin',
      email: 'admin@mail.com',
      password: 'hashedpass123',
      name: 'ADMIN',
      createBy: 'System',
      role: 'ADMIN',
    },
  })
}

main()
  .then(() => console.log('🌱 Seeding success'))
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
