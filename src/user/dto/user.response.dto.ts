import { Exclude, Expose } from 'class-transformer'

export class ResponseUserDto {
  @Expose()
  username: string
  @Expose()
  email: string
  @Expose()
  name?: string
  @Expose()
  roleId?: number
}
