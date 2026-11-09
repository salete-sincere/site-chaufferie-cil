import type { Metadata } from 'next';

export const siteOrigin = new URL(process.env.SITE_URL || 'https://stopchaufferiehaubourdin.fr');
export const siteName = 'Comité chaufferie Haubourdin';
export const siteTitle = 'Chaufferie à Haubourdin : informons-nous, rassemblons-nous';
export const siteDescription = 'Comprendre le projet de chaufferie sur la friche Lever, consulter les sources et rejoindre le comité en cours de constitution, à l’initiative de Haubourdin Alternative Citoyenne.';
const imageUrl = new URL('/partage-20261109.png', siteOrigin).href;
const imageAlt = 'Chaufferie à Haubourdin : ici, on a notre mot à dire. Comité en cours de constitution, à l’initiative de Haubourdin Alternative Citoyenne.';

// Next replaces nested Open Graph metadata on each page, so every card is complete.
export function pageMetadata(pathname: string, title: string, description: string): Metadata {
  const shareTitle = pathname === '/' ? title : `${title} · ${siteName}`;
  return {
    title: pathname === '/' ? { absolute: title } : title,
    description,
    alternates: { canonical: new URL(pathname, siteOrigin).href },
    openGraph: {
      title: shareTitle,
      description,
      url: new URL(pathname, siteOrigin).href,
      locale: 'fr_FR',
      type: 'website',
      siteName,
      images: [{ url: imageUrl, secureUrl: imageUrl, type: 'image/png', width: 1200, height: 630, alt: imageAlt }],
    },
    twitter: {
      card: 'summary_large_image',
      title: shareTitle,
      description,
      images: [{ url: imageUrl, alt: imageAlt }],
    },
  };
}
