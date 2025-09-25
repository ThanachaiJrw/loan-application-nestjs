/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'
import { Reflector } from '@nestjs/core'
import { JwtPayload } from '../types/auth.types'
import { ROLES_KEY } from 'src/common/decorators/roles.decorator'
import { ResponseUtils } from 'src/common/utils/response.utils'

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const requiredRoles = this.reflector.get<string[]>(ROLES_KEY, context.getHandler())
    if (!requiredRoles) {
      return true
    }

    const request = context.switchToHttp().getRequest()
    const user: JwtPayload = request.user

    if (user.role === 'admin') return true
    if (!user || !user.role || !requiredRoles.includes(user.role)) {
      throw ResponseUtils.forbideden()
    }

    return true
  }
}
