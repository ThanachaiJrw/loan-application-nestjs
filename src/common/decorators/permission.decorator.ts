import { SetMetadata } from '@nestjs/common'

export const PERMISSION_KEY = 'PERMISSIONS'
export const Permissions = (...permission: string[]) => SetMetadata(PERMISSION_KEY, permission)
