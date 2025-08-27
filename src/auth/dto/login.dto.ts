import { IsNotEmpty, IsString, MinLength } from 'class-validator'

export class LoginDto {
  @IsString()
  @IsNotEmpty({ message: 'Username cannot be empty' })
  username: string
  @IsString()
  @IsNotEmpty({ message: 'Password cannot be empty' })
  @MinLength(8, { message: 'Password must be at least 8 characters long' })
  password: string
}
