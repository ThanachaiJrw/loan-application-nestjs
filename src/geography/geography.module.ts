import { PrismaService } from 'prisma/prisma.service'
import { GeographyService } from './geography.service'
import { Module } from '@nestjs/common'
import { GeographyController } from './geography.controller'

@Module({
  imports: [],
  controllers: [GeographyController],
  providers: [GeographyService, PrismaService],
})
export class GeographyModule {}
