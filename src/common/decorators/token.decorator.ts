/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-return */

import { createParamDecorator, ExecutionContext } from '@nestjs/common'
import { Request } from 'express'

export const Token = createParamDecorator(
  (data: unknown, ctx: ExecutionContext): string | undefined => {
    const request: Request = ctx.switchToHttp().getRequest()
    return request.headers.authorization?.replace('Bearer ', '')
  },
)
