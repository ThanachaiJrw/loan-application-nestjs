import { SetMetadata } from '@nestjs/common'

export const ADMIN = 'ADMIN'
export const MAKER = 'MAKER'
export const CHECKER = 'CHECKER'
export const APPROVER = 'APPROVER'

export const ROLES_KEY = 'ROLES'
export const Roles = (...roles: string[]) => SetMetadata(ROLES_KEY, roles)
