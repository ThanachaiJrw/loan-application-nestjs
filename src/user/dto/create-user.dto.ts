import { Role } from '@prisma/client'
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, MinLength } from 'class-validator'

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
  @IsEnum(Role)
  role?: Role
}
