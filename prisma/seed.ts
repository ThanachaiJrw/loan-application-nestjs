/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-misused-promises */
// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  await Promise.all([
    prisma.role.upsert({
      where: { roleName: 'MAKER' },
      update: {},
      create: { roleName: 'MAKER', roleDesc: 'Maker Loan Application' },
    }),
    prisma.role.upsert({
      where: { roleName: 'CHECKER' },
      update: {},
      create: { roleName: 'CHECKER', roleDesc: 'Checker Loan Application' },
    }),
    prisma.role.upsert({
      where: { roleName: 'APPROVER' },
      update: {},
      create: { roleName: 'APPROVER', roleDesc: 'Approver Loan Application' },
    }),
    prisma.role.upsert({
      where: { roleName: 'ADMIN' },
      update: {},
      create: { roleName: 'ADMIN', roleDesc: 'Admin System' },
    }),
  ])

  await Promise.all([
    prisma.permission.upsert({
      where: { permissionName: 'CREATE_CUSTOMER' },
      update: {},
      create: { permissionName: 'CREATE_CUSTOMER', permissionDesc: 'Create Customer' },
    }),
    prisma.permission.upsert({
      where: { permissionName: 'CREATE_LOAN' },
      update: {},
      create: { permissionName: 'CREATE_LOAN', permissionDesc: 'Create Loan Application' },
    }),
    prisma.permission.upsert({
      where: { permissionName: 'REVIEW_LOAN' },
      update: {},
      create: { permissionName: 'REVIEW_LOAN', permissionDesc: 'Review Loan Application' },
    }),
    prisma.permission.upsert({
      where: { permissionName: 'APPROVE_LOAN' },
      update: {},
      create: { permissionName: 'APPROVE_LOAN', permissionDesc: 'Approve Loan Application' },
    }),
    prisma.permission.upsert({
      where: { permissionName: 'VIEW_LOAN' },
      update: {},
      create: { permissionName: 'VIEW_LOAN', permissionDesc: 'View Loan Application' },
    }),
    prisma.permission.upsert({
      where: { permissionName: 'MANAGE_USER' },
      update: {},
      create: { permissionName: 'MANAGE_USER', permissionDesc: 'Manage User' },
    }),
  ])

  const rolePermissionMap = {
    MAKER: ['CREATE_CUSTOMER', 'CREATE_LOAN', 'VIEW_LOAN'],
    CHECKER: ['REVIEW_LOAN', 'VIEW_LOAN'],
    APPROVER: ['APPROVE_LOAN', 'VIEW_LOAN'],
    ADMIN: ['MANAGE_USER'],
  }

  for (const [roleName, perms] of Object.entries(rolePermissionMap)) {
    const role = await prisma.role.findUnique({ where: { roleName } })
    const permissions = await prisma.permission.findMany({
      where: { permissionName: { in: perms } },
    })
    console.log(`Seeding permissions for role: ${roleName}`)
    await prisma.role.update({
      where: { roleId: role?.roleId },
      data: {
        permissions: {
          set: permissions.map((p) => ({ permissionId: p.permissionId })),
        },
      },
    })
  }
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
