import type { NextConfig } from 'next';
import { analyticsToken } from './lib/analytics.ts';

const analyticsEnabled = Boolean(analyticsToken(process.env.CLOUDFLARE_WEB_ANALYTICS_TOKEN));

const config: NextConfig = {
  output: 'standalone',
  poweredByHeader: false,
  images: { unoptimized: true },
  experimental: { cpus: 1 },
  deploymentId: process.env.APP_REVISION || 'local',
  outputFileTracingIncludes: { '/*': ['./content/**/*.md'] },
  async headers() {
    return [{ source: '/:path*', headers: [
      { key: 'X-Content-Type-Options', value: 'nosniff' },
      { key: 'X-Frame-Options', value: 'DENY' },
      { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
      { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
      { key: 'Content-Security-Policy', value: `default-src 'self'; script-src 'self' 'unsafe-inline'${analyticsEnabled ? ' https://static.cloudflareinsights.com/beacon.min.js' : ''}; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self'${analyticsEnabled ? ' https://cloudflareinsights.com' : ''}; frame-ancestors 'none'; object-src 'none'; base-uri 'self'; form-action 'none'` },
    ] }, { source: '/health', headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }] }, {
      source: '/:path*',
      has: [{ type: 'host', value: 'chaufferie-cil-staging\\.saletesincere\\.fr' }],
      headers: [{ key: 'X-Robots-Tag', value: 'noindex, nofollow, noarchive' }],
    }];
  },
};
export default config;
