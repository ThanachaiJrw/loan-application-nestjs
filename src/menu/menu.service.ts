import { Inject, Injectable } from '@nestjs/common'
import Redis from 'ioredis'
import { PrismaService } from 'prisma/prisma.service'
import { MenuDto } from './dto/menu.dto'
import { UserRoleMenuDto } from './dto/userRoleMenu.dto'

@Injectable()
export class MenuService {
  constructor(
    private prisma: PrismaService,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

  async getMenuByRole(username: string): Promise<MenuDto[]> {
    const cacheKey = `menu_tree:${username}`

    // for test
    // const cached = await this.redis.get(cacheKey)

    // if (cached) {
    //   return JSON.parse(cached) as MenuDto[]
    // }

    const res: UserRoleMenuDto[] = await this.prisma.$queryRaw`
        SELECT
        u.username,
        u.name,
        r.role_id, r.role_name,
        p.permission_id, p.permission_name,
        m.menu_id, m.menu_label,m.icon , m.parent_id,m.route
        FROM loan_users u
        LEFT JOIN roles r ON u."roleId" = r.role_id
        LEFT JOIN "_RolePermissions" rp ON r.role_id = rp."B"
        LEFT JOIN permissions p ON rp."A" = p.permission_id
        LEFT JOIN "_MenuPermissions" mp ON p.permission_id = mp."B"
        LEFT JOIN menus m ON mp."A" = m.menu_id
        WHERE u.username = ${username};
    `

    const menuTree: MenuDto[] = this.buildMenuTree(res)

    await this.redis.set(cacheKey, JSON.stringify(menuTree), 'EX', 600) //10 Min
    // console.log('#################### getMenuByRole menuTree :', menuTree)
    return menuTree
  }

  // ตัวนี้บัคแสดงผลซ้ำ
  private buildMenuTree(menus: UserRoleMenuDto[]): MenuDto[] {
    const map = new Map<number, MenuDto>()
    const roots: MenuDto[] = []

    // สร้าง map ของเมนูไม่ให้ซ้ำ
    menus.forEach((menu) => {
      if (!menu.menu_id) return
      if (!map.has(menu.menu_id)) {
        map.set(menu.menu_id, {
          label: menu.menu_label,
          route: menu.route,
          icon: menu.icon,
          children: [],
        })
      }
    })

    // loop สร้างความสัมพันธ์ parent-child
    menus.forEach((menu) => {
      const child = map.get(menu.menu_id)
      if (!child) return

      if (menu.parent_id) {
        const parent = map.get(menu.parent_id)
        if (parent && parent.children) {
          // ✅ เช็คก่อนว่า child ถูก add ไปหรือยัง
          if (!parent.children.some((c) => c.label === child.label)) {
            parent.children.push(child)
          }
        }
      } else {
        // ✅ เช็คก่อนว่า root มีอยู่หรือยัง
        if (!roots.some((r) => r.label === child.label)) {
          roots.push(child)
        }
      }
    })

    return roots
  }
}
