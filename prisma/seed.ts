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

  // 2. Create config values
  await prisma.config.createMany({
    data: [
      { des_type: 'STATUS', des_code: '100', des_name: 'PENDING', status: 'A', createBy: 'admin' },
      { des_type: 'STATUS', des_code: '200', des_name: 'APPROVED', status: 'A', createBy: 'admin' },
      { des_type: 'STATUS', des_code: '999', des_name: 'REJECTED', status: 'A', createBy: 'admin' },
    ],
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
