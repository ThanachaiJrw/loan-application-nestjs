import { Injectable, InternalServerErrorException } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CustomerRequestDto } from './dto/customer.request.dto'
import { Customer, Prisma, Sequence } from '@prisma/client'
import * as bcrypt from 'bcrypt'
import { CustomerResponseDto } from './dto/customer.response.dto'
import { plainToInstance } from 'class-transformer'

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(req: CustomerRequestDto, username: string): Promise<Customer> {
    return await this.prisma.$transaction(async (prisma) => {
      const customerNo = await this.generateCustomerNo(prisma)
      if (customerNo == null || customerNo == undefined) {
        throw new InternalServerErrorException('Failed to generate customer number')
      }
      const hashID: string = await bcrypt.hash(req.idCard, 10)
      return await prisma.customer.create({
        data: {
          customerNo: customerNo,
          customerName: req.name,
          idCard: hashID,
          dob: req.birthDate ? new Date(req.birthDate) : null,
          phone: req.phone,
          email: req.email,
          address: req.address,
          province: req.provinceNo,
          district: req.districtNo,
          subdistrict: req.subdistrictNo,
          postcode: req.postalCode, //forget
          createBy: username,
          createDt: new Date(),
        },
      })
    })
  }

  private async generateCustomerNo(prisma: Prisma.TransactionClient): Promise<string | null> {
    const seq: Sequence | null = await this.prisma.sequence.findFirst({
      where: { id: 'CUSTOMER' },
    })

    if (seq && typeof seq.nextVal === 'number' && typeof seq.prefix === 'string') {
      const nextVal = seq.nextVal.toString().padStart(5, '0')
      const newCode: string = `${seq.prefix}-${nextVal}`
      await prisma.sequence.update({
        where: { id: 'CUSTOMER' },
        data: { nextVal: seq.nextVal + 1 },
      })
      return newCode
    }
    return null
  }

  async findByCustomerNo(customerNo: string): Promise<CustomerResponseDto | null> {
    if (customerNo == null || customerNo == undefined) {
      throw new InternalServerErrorException('customerNo is required')
    }

    const res: Customer | null = await this.prisma.customer.findUnique({
      where: { customerNo: customerNo },
    })
    if (!res) {
      return null
    }

    const responseDto = plainToInstance(CustomerResponseDto, res, { excludeExtraneousValues: true })

    return responseDto
  }
}
