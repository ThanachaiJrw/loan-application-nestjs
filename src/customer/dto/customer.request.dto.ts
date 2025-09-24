import { IsDateString, IsNotEmpty } from 'class-validator'

export class CustomerRequestDto {
  @IsNotEmpty()
  name: string
  @IsNotEmpty()
  idCard: string
  @IsNotEmpty()
  @IsDateString()
  birthDate: string
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
