import {
  ClassSerializerInterceptor,
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common'
import { GeographyService } from './geography.service'
import { AuthGuard } from '@nestjs/passport'

@UseInterceptors(ClassSerializerInterceptor)
@Controller('geography')
@UseGuards(AuthGuard('jwt'))
export class GeographyController {
  constructor(private readonly geographyService: GeographyService) {}

  @Get('getSubdistricts/:districtNo')
  getSubdistricts(@Param('districtNo') districtNo: string) {
    return this.geographyService.getSubdistricts(districtNo)
  }

  @Get('getSubdistrictsQuery')
  getSubdistrictsQuery(@Query('districtNo') districtNo: string) {
    return this.geographyService.getSubdistricts(districtNo)
  }
}
