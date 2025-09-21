import { Expose } from 'class-transformer'

export class CustomerResponseDto {
  @Expose()
  customerNo: string
  @Expose()
  name: string
  @Expose()
  idCard: string
  @Expose()
  birthDate: Date
  @Expose()
  email: string
  @Expose()
  phone: string
  @Expose()
  address: string
  @Expose()
  provinceNo: string
  @Expose()
  districtNo: string
  @Expose()
  subdistrictNo: string
  @Expose()
  postalCode: string
}
