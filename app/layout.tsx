import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import styles from '@/components/site.module.css';
import { contactEmail } from '@/lib/contact';
import { hacFacebookUrl } from '@/lib/hac';
import { PublicEmailLink } from '@/components/public-email-link';
import { siteOrigin, siteTitle, siteDescription } from '@/lib/metadata';

export const metadata: Metadata = {
  metadataBase: siteOrigin,
  title: { default: siteTitle, template: '%s · Comité chaufferie Haubourdin' },
  description: siteDescription,
  robots: { index: false, follow: false, noarchive: true },
  icons: { icon: '/favicon.svg' },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body><a href="#contenu" className={styles.skip}>Aller au contenu</a><div className={styles.topline}><div className={styles.container}><span>Haubourdin · Comité en cours de constitution</span><Link href="/militer">Faites savoir autour de vous <span aria-hidden="true">↗</span></Link></div></div><header className={styles.header}><div className={`${styles.container} ${styles.headerInner}`}><Link href="/" className={styles.brand} aria-label="Comité chaufferie Haubourdin, accueil"><span className={styles.brandMark} aria-hidden="true" /><span className={styles.brandText}>CHAUFFERIE<br />HAUBOURDIN<small>Le comité d’intérêt local</small></span></Link><nav aria-label="Navigation principale" className={styles.nav}><Link href="/informer">Je m’informe</Link><Link href="/militer">Je milite</Link><Link href="/rejoindre" className={styles.navCta}>Je rejoins le comité <span aria-hidden="true">↗</span></Link></nav></div></header><main id="contenu" className={styles.container}>{children}</main><footer className={styles.footer}><div className={styles.container}><div className={styles.footerTop}><div><div className={styles.footerSignature}>Haubourdin<br />Alternative Citoyenne</div><p>Groupe d’opposition au conseil municipal d’Haubourdin, à l’initiative du comité d’intérêt local en cours de constitution contre la chaufferie de la friche Lever.</p></div><nav aria-label="Navigation de pied de page" className={styles.footerLinks}><Link href="/informer/faq">Questions fréquentes</Link><Link href="/informer/chiffres">Chiffres clés</Link><Link href="/informer/complements">Compléments documentaires</Link><Link href="/sources">Toutes les sources</Link><Link href="/communique-de-presse">Communiqué de presse</Link><a href={hacFacebookUrl} target="_blank" rel="noopener noreferrer">Haubourdin Alternative Citoyenne sur Facebook<span className="sr-only"> (nouvel onglet)</span></a><Link href="/rejoindre">Nous contacter</Link><PublicEmailLink className={styles.footerEmail} href={`mailto:${contactEmail}`}>{contactEmail}</PublicEmailLink></nav></div><div className={styles.footerBottom}><span>Sources documentées au 9 novembre 2026 · Site non indexé</span><span>Aucun traceur · Aucune inscription collectée sur ce site</span></div></div></footer></body></html>;
}
