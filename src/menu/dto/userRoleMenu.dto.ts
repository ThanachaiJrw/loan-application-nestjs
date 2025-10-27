export class UserRoleMenuDto {
  username: string
  name: string
  role_id: number
  role_name: string
  permission_id: number
  permission_name: string
  menu_id: number
  menu_label: string
  icon: string
  parent_id: number | null
  route: string
}
