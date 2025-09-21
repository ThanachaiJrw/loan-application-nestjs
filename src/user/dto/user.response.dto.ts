import { Role } from '@prisma/client'
import { Exclude, Expose } from 'class-transformer'

export class ResponseUserDto {
  @Expose()
  username: string
  @Expose()
  email: string
  @Expose()
  name?: string
  @Expose()
  role?: Role
}
