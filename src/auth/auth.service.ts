/* eslint-disable @typescript-eslint/no-unused-vars */
import { Inject, Injectable, UnauthorizedException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { LoginDto } from './dto/login.dto'
import { JwtService } from '@nestjs/jwt'
import * as bcrypt from 'bcrypt'
import { ResponseUserDto } from 'src/user/dto/response-user.dto'
import Redis from 'ioredis'
import { JwtPayload } from './types/auth.types'
import { Role } from '@prisma/client'

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    @Inject('REDIS') private readonly redis: Redis,
  ) {}

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

  async isssueTokens(user: ResponseUserDto, exp?: number) {
    const payload: JwtPayload = {
      sub: user.username,
      email: user.email,
      name: user.name || '',
      role: user.role || '',
    }

    const accessToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_ACCESS_SECRET || 'accessSecret',
      expiresIn: process.env.JWT_ACCESS_EXPIRES || '900s', // 15 นาที
    })

    const refreshToken = this.jwtService.sign(payload, {
      secret: process.env.JWT_REFRESH_SECRET || 'refreshSecret',
      expiresIn: exp
        ? exp - Math.floor(Date.now() / 1000)
        : process.env.JWT_REFRESH_EXPIRES || '7d', // 7 วัน
    })

    const hash = await bcrypt.hash(refreshToken, 10)
    // Store the hashed refresh token in Redis with an expiration time
    const key = `refreshToken:${user.username}`
    await this.redis.set(key, hash, 'EX', this.refreshTtlSeconds())

    return { accessToken, refreshToken }
  }

  async refreshTokens(username: string, refreshToken: string) {
    const storedHash = await this.redis.get(`refreshToken:${username}`)
    if (!storedHash) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const isMatch = await bcrypt.compare(refreshToken, storedHash)
    if (!isMatch) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    const decoded = await this.jwtService.verifyAsync<JwtPayload>(refreshToken, {
      secret: process.env.JWT_REFRESH_SECRET,
    })

    if (!decoded) {
      throw new UnauthorizedException('Invalid refresh token')
    }

    return this.isssueTokens(
      {
        username: decoded.sub,
        email: decoded.email,
        name: decoded.name || '',
        role: decoded.role as Role,
      },
      decoded.exp,
    )
  }

  async logout(username: string) {
    await this.redis.del(`refreshToken:${username}`)
    return { message: 'Logged out successfully' }
  }

  private refreshTtlSeconds() {
    return 7 * 24 * 60 * 60
  }

  async resetPassword(username: string, newPassword: string) {
    const user = await this.prisma.user.findFirst({ where: { username } })
    if (!user) {
      throw new UnauthorizedException('User not found')
    }

    const hashPassword: string = await bcrypt.hash(newPassword, 10)
    await this.prisma.user.update({
      where: { username },
      data: { password: hashPassword },
    })

    // Invalidate existing refresh tokens
    await this.redis.del(`refreshToken:${username}`)

    return { message: 'Password reset successfully' }
  }
}
