/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { AuthGuard } from '@nestjs/passport'
import { ResponseUserDto } from 'src/user/dto/response-user.dto'
import { ResponseUtils } from 'src/common/utils/response.utils'
import { ResponseMessage } from 'src/common/constants/response-message.constant'
import { JwtPayload } from './types/auth.types'
import { User } from 'src/common/decorators/user.decorator'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req: ResponseUserDto, @Body() loginDto: LoginDto) {
    const response = await this.authService.isssueTokens(req)
    return ResponseUtils.success(response, ResponseMessage.LOGIN)
  }

  @Post('refresh-token')
  async refreshTokens(@Body() body: { username: string; refreshToken: string }) {
    return this.authService.refreshTokens(body.username, body.refreshToken)
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('logout')
  async logout(@User('sub') username: string) {
    if (username) {
      await this.authService.logout(username)
      return ResponseUtils.success(null, ResponseMessage.SUCCESS)
    } else {
      return ResponseUtils.error('Invalid user')
    }
  }

  // @UseGuards(AdminAuthGuard)
  @Post('reset-password')
  async resetPassword(
    @Body('username') username: string,
    @Body('newPassword') newPassword: string,
  ) {
    return this.authService.resetPassword(username, newPassword)
  }
}
