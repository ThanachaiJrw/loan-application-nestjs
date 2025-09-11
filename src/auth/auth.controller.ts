/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { AuthGuard } from '@nestjs/passport'
import { ResponseUserDto } from 'src/user/dto/response-user.dto'
import { ResponseUtils } from 'src/common/utils/response.utils'
import { ResponseMessage } from 'src/common/constants/response-message.constant'
import { JwtPayload } from './types/auth.types'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: ResponseUserDto, @Body() loginDto: LoginDto) {
    // return this.authService.login(req)
    return ResponseUtils.success(this.authService.isssueTokens(req), ResponseMessage.SUCCESS)
  }

  @Post('refresh')
  async refreshTokens(@Body() body: { username: string; refreshToken: string }) {
    return this.authService.refreshTokens(body.username, body.refreshToken)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@Request() req: JwtPayload) {
    const username = req.sub
    if (username) {
      await this.authService.logout(username)
      return ResponseUtils.success(null, ResponseMessage.SUCCESS)
    } else {
      return ResponseUtils.error('Invalid user')
    }
  }
}
