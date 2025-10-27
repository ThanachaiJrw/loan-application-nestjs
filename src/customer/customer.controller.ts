import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { CustomerService } from './customer.service'
import { User } from 'src/common/decorators/user.decorator'
import { CustomerRequestDto } from './dto/customer.request.dto'
import { ResponseUtils } from 'src/common/utils/response.utils'
import { ResponseMessage } from 'src/common/constants/response-message.constant'
import { AuthGuard } from '@nestjs/passport'
import { JwtPayload } from 'src/auth/types/auth.types'
import { PermissionsGuard } from 'src/auth/guards/permissions.guard'
import { Permissions } from 'src/common/decorators/permission.decorator'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('customer')
@Permissions('VIEW_LOAN', 'REVIEW_LOAN', 'APPROVE_LOAN', 'CREATE_LOAN')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('createCustomer')
  async createCustomer(@User() user: JwtPayload, @Body() body: CustomerRequestDto) {
    if (body == null || body == undefined) {
      throw new InternalServerErrorException('Request body is required')
    }
    return ResponseUtils.success(
      await this.customerService.createCustomer(body, user.sub),
      ResponseMessage.SUCCESS,
    )
  }

  @Get('findCustomerInfoByCusNo')
  async findCustomerInfoByCusNo(@Query('customerNo') customerNo: string) {
    if (customerNo == null || customerNo == undefined) {
      throw new InternalServerErrorException('customerNo is required')
    }
    return ResponseUtils.success(
      await this.customerService.findByCustomerNo(customerNo),
      ResponseMessage.OK,
    )
  }
}
