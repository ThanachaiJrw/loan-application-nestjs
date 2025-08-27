/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { ResponseUserDto } from 'src/user/dto/response-user.dto'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
  ) {}

  login(req: ResponseUserDto) {
    return {
      access_token: this.jwtService.sign({
        username: req.username,
        email: req.email,
        name: req.name,
        role: req.role,
      }),
    }
  }

  async validateUser(username: string, passwordPlain: string): Promise<ResponseUserDto | null> {
    const user = await this.prisma.user.findFirst({ where: { username } })
    if (user && user.password) {
      const isMatch = await bcrypt.compare(passwordPlain, user.password)
      if (isMatch) {
        const { password, createBy, createdDt, ...result } = user
        return result
      }
    }
    return null
  }
}
