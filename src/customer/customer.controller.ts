import {
  Body,
  ClassSerializerInterceptor,
  Controller,
  Get,
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

@UseInterceptors(ClassSerializerInterceptor)
@Controller('customer')
@UseGuards(AuthGuard('jwt'))
export class CustomerController {
  constructor(private readonly customerService: CustomerService) {}

  @Post('createCustomer')
  async createCustomer(@User() user: JwtPayload, @Body() body: CustomerRequestDto) {
    if (body == null || body == undefined) {
      throw new Error('Request body is required')
    }
    return ResponseUtils.success(
      await this.customerService.createCustomer(body, user.sub),
      ResponseMessage.SUCCESS,
    )
  }

  @Get('findCustomerInfoByCusNo')
  async findCustomerInfoByCusNo(@Query('customerNo') customerNo: string) {
    if (customerNo == null || customerNo == undefined) {
      throw new Error('customerNo is required')
    }
    return ResponseUtils.success(
      await this.customerService.findByCustomerNo(customerNo),
      ResponseMessage.SUCCESS,
    )
  }
}
