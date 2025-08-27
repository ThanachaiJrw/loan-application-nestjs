/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Strategy } from 'passport-local'
import { PassportStrategy } from '@nestjs/passport'
import { AuthService } from '../auth.service'
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { ResponseUserDto } from 'src/user/dto/response-user.dto'

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(private authService: AuthService) {
    super()
  }
  async validate(username: string, passwordPlain: string): Promise<ResponseUserDto> {
    const user = await this.authService.validateUser(username, passwordPlain)
    if (!user) {
      throw new UnauthorizedException('Invalid credentials')
    }
    return user
  }
}
