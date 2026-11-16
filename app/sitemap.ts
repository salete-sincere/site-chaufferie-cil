import type { MetadataRoute } from 'next';
import { siteOrigin } from '../lib/metadata.ts';

export default function sitemap(): MetadataRoute.Sitemap {
  return ['/', '/informer', '/informer/faq', '/informer/chiffres', '/informer/complements',
    '/sources', '/militer', '/rejoindre', '/communique-de-presse']
    .map(path => ({ url: new URL(path, siteOrigin).href }));
}
