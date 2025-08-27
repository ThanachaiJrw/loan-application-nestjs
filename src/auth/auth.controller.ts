/* eslint-disable @typescript-eslint/no-unused-vars */
import { Body, Controller, Post, Request, UseGuards } from '@nestjs/common'
import { AuthService } from './auth.service'
import { LoginDto } from './dto/login.dto'
import { AuthGuard } from '@nestjs/passport'
import { ResponseUserDto } from 'src/user/dto/response-user.dto'
import { ResponseUtils } from 'src/common/utils/response.utils'
import { ResponseMessage } from 'src/common/constants/response-message.constant'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  login(@Request() req: ResponseUserDto, @Body() loginDto: LoginDto) {
    // return this.authService.login(req)
    return ResponseUtils.success(this.authService.login(req), ResponseMessage.SUCCESS)
  }
}
