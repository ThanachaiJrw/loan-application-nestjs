import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator'

export class CreateUserDto {
  @IsNotEmpty()
  username: string
  @IsEmail()
  email: string
  @MinLength(8)
  password: string
  @IsOptional()
  name?: string
  @IsOptional()
  roleId?: number
}
