/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common'
import * as bcrypt from 'bcrypt'
import { User } from '@prisma/client'
import { PrismaService } from 'prisma/prisma.service'
import { UpdateUserDto } from './dto/update-user.dto'
import { CreateUserDto } from './dto/create-user.dto'

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async createUser(createUserDto: CreateUserDto): Promise<User> {
    try {
      // 1. ตรวจสอบ username ซ้ำ
      const existingUser = await this.prisma.user.findUnique({
        where: { username: createUserDto.username },
      })
      if (existingUser) {
        throw new BadRequestException('Username already exists')
      }

      // 2. ดึง default role
      const defaultRole = await this.prisma.role.findUnique({
        where: { roleName: 'MAKER' },
      })

      if (!defaultRole) {
        throw new InternalServerErrorException('Default role not found')
      }

      // 3. เลือก roleId: ใช้จาก DTO ถ้ามี ไม่งั้นใช้ default
      const roleId: number = createUserDto.roleId ?? defaultRole.roleId

      // 4. แฮชรหัสผ่าน
      const hashPassword = await bcrypt.hash(createUserDto.password, 10)

      // 5. สร้าง user ใหม่
      const newUser: User = await this.prisma.user.create({
        data: {
          username: createUserDto.username,
          email: createUserDto.email,
          password: hashPassword,
          name: createUserDto.name || '',
          role: {
            connect: { roleId },
          },
          createBy: 'admin-api',
        },
        include: { role: true },
      })

      // 6. return โดยซ่อน password
      return { ...newUser, password: '' }
    } catch (error) {
      // 7. หากเกิดข้อผิดพลาดอื่น ๆ
      if (error instanceof BadRequestException || error instanceof InternalServerErrorException) {
        throw error
      }
      throw new InternalServerErrorException('Failed to create user')
    }
  }

  findAll() {
    return `This action returns all user`
  }

  findOne(id: number) {
    return `This action returns a #${id} user`
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  update(id: number, updateUserDto: UpdateUserDto) {
    return `This action updates a #${id} user`
  }

  remove(id: number) {
    return `This action removes a #${id} user`
  }
}
