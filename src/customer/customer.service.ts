import { Injectable } from '@nestjs/common'
import { PrismaService } from 'prisma/prisma.service'
import { CustomerRequestDto } from './dto/customer.request.dto'
import { Customer, Sequence } from '@prisma/client'

@Injectable()
export class CustomerService {
  constructor(private readonly prisma: PrismaService) {}

  async createCustomer(req: CustomerRequestDto, username: string): Promise<Customer> {
    const customerNo = await this.generateCustomerNo()
    if (customerNo == null || customerNo == undefined) {
      throw new Error('Failed to generate customer number')
    }
    return await this.prisma.customer.create({
      data: {
        customerNo: customerNo,
        customerName: req.name,
        idCard: req.idCard,
        dob: req.birthDate || new Date(),
        phone: req.phone,
        email: req.email,
        address: req.address,
        province: req.provinceNo,
        district: req.districtNo,
        subdistrict: req.subdistrictNo,
        // postcode: req.postalCode, //forget
        createBy: username,
        createDt: new Date(),
      },
    })
  }

  private async generateCustomerNo(): Promise<string | null> {
    const seq: Sequence | null = await this.prisma.sequence.findFirst({
      where: { id: 'CUSTOMER' },
    })

    if (seq && typeof seq.nextVal === 'number' && typeof seq.prefix === 'string') {
      const nextVal = seq.nextVal.toString().padStart(5, '0')
      const newCode: string = `${seq.prefix}-${nextVal}`
      await this.prisma.sequence.update({
        where: { id: 'CUSTOMER' },
        data: { nextVal: seq.nextVal + 1 },
      })
      return newCode
    }
    return null
  }

  findByCustomerNo(customerNo: string): Promise<Customer | null> {
    return this.prisma.customer.findUnique({
      where: { customerNo: customerNo },
    })
  }
}
