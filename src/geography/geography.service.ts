import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'

@Injectable()
export class GeographyService {
  constructor(private readonly prisma: PrismaService) {}

  async getProvinces() {
    return this.prisma.province.findMany()
  }

  async getDistricts(provinceNo: string) {
    if (provinceNo == undefined || provinceNo == null) {
      return []
    }
    return this.prisma.district.findMany({
      where: { provinceNo: provinceNo },
    })
  }

  async getSubdistricts(districtNo: string) {
    if (districtNo == undefined || districtNo == null) {
      return []
    }
    return this.prisma.subdistrict.findMany({
      where: { districtNo: districtNo },
    })
  }
}
