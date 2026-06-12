/** Canonical public app URL for certificate verification links. */
export function getAppBaseUrl(): string {
  const base =
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_FRONTEND_URL ||
    'https://proofaura.com'
  return base.replace(/\/$/, '')
}

export function buildPublicVerificationUrl(verificationId: string): string {
  const id = verificationId.trim()
  return `${getAppBaseUrl()}/verify/${encodeURIComponent(id)}`
}
