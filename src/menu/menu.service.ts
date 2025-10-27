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
    const cached = await this.redis.get(cacheKey)

    if (cached) {
      return JSON.parse(cached) as MenuDto[]
    }

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
    console.log('#################### getMenuByRole menuTree :', menuTree)
    return menuTree
  }

  private buildMenuTree(menus: UserRoleMenuDto[]): MenuDto[] {
    const map = new Map<number, MenuDto>()
    const roots: MenuDto[] = []
    menus.forEach((menu) => {
      map.set(menu.menu_id, {
        menuLabel: menu.menu_label,
        route: menu.route,
        icon: menu.icon,
        children: [],
      })
    })
    console.log('#################### buildMenuTree map :', map)

    menus.forEach((menu) => {
      const child = map.get(menu.menu_id)
      if (!child) return

      if (menu.parent_id) {
        const parent = map.get(menu.parent_id)
        if (parent && parent != undefined && parent.children != undefined) {
          parent.children.push(child)
        }
      } else {
        roots.push(child)
      }
    })
    console.log('#################### buildMenuTree roots :', roots)
    return roots
  }
}
