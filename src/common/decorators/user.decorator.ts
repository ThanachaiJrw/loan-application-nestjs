import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'
import { JwtPayload } from 'src/auth/types/auth.types'

export const User = createParamDecorator(
  (data: keyof JwtPayload | undefined, ctx: ExecutionContext): any => {
    const request: Request = ctx.switchToHttp().getRequest()
    const user = request.user as JwtPayload
    if (data && user) {
      return user[data]
    }
    return user
  },
)
