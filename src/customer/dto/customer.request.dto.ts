import { IsNotEmpty } from 'class-validator'

export class CustomerRequestDto {
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  idCard: string
  // @IsNotEmpty()
  birthDate?: Date | null
  @IsNotEmpty()
  email: string
  @IsNotEmpty()
  phone: string
  @IsNotEmpty()
  address: string
  @IsNotEmpty()
  provinceNo: string
  @IsNotEmpty()
  districtNo: string
  @IsNotEmpty()
  subdistrictNo: string
  @IsNotEmpty()
  postalCode: string
}
