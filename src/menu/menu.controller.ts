import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { Permissions } from 'src/common/decorators/permission.decorator'
import { MenuService } from './menu.service'
import { ResponseUtils } from 'src/common/utils/response.utils'
import { plainToInstance } from 'class-transformer'
import { ResponseMessage } from 'src/common/constants/response-message.constant'
import { ResponseUserDto } from 'src/user/dto/user.response.dto'
import { User } from 'src/common/decorators/user.decorator'
import { JwtPayload } from 'src/auth/types/auth.types'

@UseInterceptors(ClassSerializerInterceptor)
@Permissions('VIEW_LOAN', 'REVIEW_LOAN', 'APPROVE_LOAN', 'CREATE_LOAN')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
@Controller('menu')
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  @Get()
  async getMenu(@User() user: JwtPayload) {
    console.log('######################## get Menu user:', user)
    const username: string = user.sub
    if (!username) {
      return ResponseUtils.error('ไม่พบ User Role')
    } else {
      const res = await this.menuService.getMenuByRole(username)
      console.log('######################## get Menu res:', res)
      return ResponseUtils.success(plainToInstance(ResponseUserDto, res), ResponseMessage.SUCCESS)
    }
  }
}
