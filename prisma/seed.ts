/* eslint-disable @typescript-eslint/no-misused-promises */
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await prisma.sequence.upsert({
    where: { id: 'CUSTOMER' },
    update: {},
    create: {
      id: 'CUSTOMER',
      prefix: 'CM',
      nextVal: 1,
    },
  })

  await prisma.sequence.upsert({
    where: { id: 'LOAN' },
    update: {},
    create: {
      id: 'LOAN',
      prefix: 'LN',
      nextVal: 1,
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
