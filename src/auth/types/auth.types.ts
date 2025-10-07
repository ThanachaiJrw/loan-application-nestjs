export interface JwtPayload {
  sub: string
  email: string
  name?: string
  role?: number
  iat?: number
  exp?: number
  jti?: string
}
