export const maskIdCard = (idCard: string): string => {
  if (!idCard || idCard.length < 4) return '****'
  const suffix = idCard.slice(-3, -1)
  const lastChar = idCard.slice(-1)
  return `X-XXXX-XXXXX-${suffix}-${lastChar}`
}

export const maskPhoneNumber = (phone: string | null): string => {
  if (!phone || phone.length < 9) return '****'
  return `${phone.slice(0, 3)}-XXXX-X${phone.slice(7)}`
}
