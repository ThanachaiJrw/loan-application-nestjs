import { Expose, Transform } from 'class-transformer'
import { maskIdCard, maskPhoneNumber } from 'src/common/utils/mask.util'

export class CustomerResponseDto {
  @Expose()
  customerNo: string

  @Expose()
  customerName: string

  @Expose()
  @Transform(({ value }: { value: string }) => maskIdCard(value), { toPlainOnly: true })
  idCard: string

  @Expose({ name: 'dob' })
  // @Transform(({ value }: { value: Date }) => (value ? value.toISOString().split('T')[0] : null))
  @Transform(
    ({ value }: { value: Date }) => {
      if (!value) return null
      const date = value instanceof Date ? value : new Date(value)
      return date.toISOString().split('T')[0]
    },
    { toPlainOnly: true },
  )
  birthDate: string

  @Expose()
  email: string

  @Expose()
  @Transform(({ value }: { value: string }) => maskPhoneNumber(value), { toPlainOnly: true })
  phone: string

  @Expose()
  address: string

  @Expose({ name: 'province' })
  provinceNo: string

  @Expose({ name: 'district' })
  districtNo: string

  @Expose({ name: 'subdistrict' })
  subdistrictNo: string

  @Expose({ name: 'postcode' })
  postcode: string
}
