import { ApiProperty } from '@nestjs/swagger'
import { Expose } from 'class-transformer'

export class MenuDto {
  @ApiProperty()
  @Expose({ name: 'menu_label' })
  menuLabel: string

  @ApiProperty()
  @Expose({ name: 'route' })
  route: string

  @ApiProperty({ required: false })
  @Expose({ name: 'icon' })
  icon?: string

  @ApiProperty({ type: () => [MenuDto], required: false })
  children?: MenuDto[]
}
