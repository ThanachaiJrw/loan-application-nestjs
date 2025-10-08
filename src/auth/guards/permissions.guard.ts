/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtPayload } from '../types/auth.types'
import { ResponseUtils } from 'src/common/utils/response.utils'
import { PERMISSION_KEY } from 'src/common/decorators/permission.decorator'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class PermissionsGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private prisma: PrismaService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const requiredPermission = this.reflector.getAllAndOverride<string[]>(PERMISSION_KEY, [
      context.getHandler(),
      context.getClass(),
    ])
    if (!requiredPermission) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user: JwtPayload = request.user

    const dbUser = await this.prisma.user.findUnique({
      where: { username: user.sub },
      include: {
        role: {
          include: {
            permissions: true,
          },
        },
      },
    })

    if (!dbUser || !dbUser.role) {
      throw ResponseUtils.forbideden()
    }
    if (dbUser.roleId === 1) return true //admin bypass

    const userPermissions = dbUser.role.permissions.map((perm) => perm.permissionName)
    const hasPermission = requiredPermission.every((perm) => userPermissions.includes(perm))

    if (!hasPermission) {
      throw ResponseUtils.forbideden()
    }

    return true
  }
}
