import type { Metadata } from 'next';
import Link from 'next/link';
import './globals.css';
import styles from '@/components/site.module.css';
import { contactEmail } from '@/lib/contact';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.SITE_URL || 'https://chaufferie-cil-staging.saletesincere.fr'),
  title: { default: 'Chaufferie à Haubourdin : informons-nous, rassemblons-nous', template: '%s · Comité chaufferie Haubourdin' },
  description: 'Comprendre le projet de chaufferie sur la friche Lever, consulter les sources et rejoindre le comité en cours de constitution, à l’initiative de Haubourdin Alternative Citoyenne.',
  robots: { index: false, follow: false, noarchive: true },
  icons: { icon: '/favicon.svg' },
  openGraph: { locale: 'fr_FR', type: 'website', siteName: 'Comité chaufferie Haubourdin', images: [{url:'/partage.png',width:1200,height:630,alt:'À Haubourdin, nous avons notre mot à dire. Comité contre la chaufferie.'}] },
};
export default function RootLayout({ children }: { children: React.ReactNode }) {
  return <html lang="fr"><body><a href="#contenu" className={styles.skip}>Aller au contenu</a><div className={styles.topline}><div className={styles.container}><span>Haubourdin · Comité en cours de constitution</span><span>Version de travail</span></div></div><header className={styles.header}><div className={`${styles.container} ${styles.headerInner}`}><Link href="/" className={styles.brand} aria-label="Comité chaufferie Haubourdin, accueil"><span className={styles.brandMark} aria-hidden="true" /><span className={styles.brandText}>CHAUFFERIE<br />HAUBOURDIN<small>Le comité d’intérêt local</small></span></Link><nav aria-label="Navigation principale" className={styles.nav}><Link href="/informer">Je m’informe</Link><Link href="/militer">Je milite</Link><Link href="/rejoindre" className={styles.navCta}>Je rejoins le comité <span aria-hidden="true">↗</span></Link></nav></div></header><main id="contenu" className={styles.container}>{children}</main><footer className={styles.footer}><div className={styles.container}><div className={styles.footerTop}><div><div className={styles.footerSignature}>Haubourdin<br />Alternative Citoyenne</div><p>Une initiative pour constituer le comité d’intérêt local contre la chaufferie de la friche Lever.</p></div><nav aria-label="Navigation de pied de page" className={styles.footerLinks}><Link href="/informer/faq">Questions fréquentes</Link><Link href="/informer/chiffres">Chiffres clés</Link><Link href="/sources">Toutes les sources</Link><Link href="/rejoindre">Nous contacter</Link><a className={styles.footerEmail} href={`mailto:${contactEmail}`}>{contactEmail}</a></nav></div><div className={styles.footerBottom}><span>Sources documentées au 7 novembre 2026 · Site de travail non indexé</span><span>Aucun traceur · Aucune inscription collectée sur ce site</span></div></div></footer></body></html>;
}
