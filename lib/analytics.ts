/** Public Cloudflare Web Analytics site token, configured at build time. */
export function analyticsToken(value: string | undefined): string | null {
  if (value === undefined || value === '') return null;
  if (!/^[a-f0-9]{32}$/i.test(value)) {
    throw new Error('CLOUDFLARE_WEB_ANALYTICS_TOKEN doit être le token public de site à 32 caractères hexadécimaux.');
  }
  return value;
}
