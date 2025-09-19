import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class GeographyService {
  constructor(private readonly prisma: PrismaService) {}

  async getProvinces() {
    return this.prisma.province.findMany()
  }

  async getDistricts(provinceNo: string) {
    return this.prisma.district.findMany({
      where: { province_no: provinceNo },
    })
  }

  async getSubdistricts(districtNo: string) {
    return this.prisma.subdistrict.findMany({
      where: { district_no: districtNo },
    })
  }
}
