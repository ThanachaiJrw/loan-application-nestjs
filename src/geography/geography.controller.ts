import { Controller, Get, Param, Query, UseGuards } from '@nestjs/common'
import { GeographyService } from './geography.service'
import { AuthGuard } from '@nestjs/passport'
import { ResponseUtils } from 'src/common/utils/response.utils'

@Controller('geography')
@UseGuards(AuthGuard('jwt'))
export class GeographyController {
  constructor(private readonly geographyService: GeographyService) {}
  @Get('getProvinces')
  getProvinces() {
    return this.geographyService.getProvinces()
  }

  @Get('getDistricts/:provinceNo')
  getDistricts(@Param('provinceNo') provinceNo: string) {
    if (provinceNo == undefined || provinceNo == null) {
      ResponseUtils.error('provinceNo is required')
    }
    return this.geographyService.getDistricts(provinceNo)
  }

  @Get('getSubdistricts/:districtNo')
  getSubdistricts(@Param('districtNo') districtNo: string) {
    if (districtNo == undefined || districtNo == null) {
      ResponseUtils.error('districtNo is required')
    }
    return this.geographyService.getSubdistricts(districtNo)
  }

  @Get('getSubdistrictsQuery')
  getSubdistrictsQuery(@Query('districtNo') districtNo: string) {
    if (districtNo == undefined || districtNo == null) {
      ResponseUtils.error('districtNo is required')
    }
    return this.geographyService.getSubdistricts(districtNo)
  }
}
