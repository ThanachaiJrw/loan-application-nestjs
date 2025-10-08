export interface JwtPayload {
  sub: string
  email: string
  name?: string
  roleId?: number
  iat?: number
  exp?: number
  jti?: string
}
