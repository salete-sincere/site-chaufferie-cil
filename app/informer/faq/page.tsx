import type { Metadata } from 'next';
import Link from 'next/link';
import { getContent, renderMarkdown } from '@/lib/content';
import { PageHeading, JoinBanner } from '@/components/editorial';
import { FaqBrowser } from '@/components/faq-browser';
import styles from '@/components/site.module.css';
export const metadata: Metadata = { title: 'FAQ : vos questions sur le projet' };
export default async function FaqPage() {
  const { faq } = await getContent();
  return <><div className={styles.breadcrumb}><Link href="/">Accueil</Link><span>/</span><Link href="/informer">Je m’informe</Link><span>/</span><span>FAQ</span></div><PageHeading eyebrow="Le dossier / Questions fréquentes" title="Vos questions méritent des réponses."><p>Bois, péniches, bruit, factures… {faq.length} questions pour comprendre ce qui est annoncé et ce qui reste à préciser.</p></PageHeading><div className={styles.readingNote}><p>Réponses établies à partir du dossier HAC au 7 novembre 2026. Les prévisions ne sont pas des résultats mesurés de l’installation en service.</p></div><noscript><p className={styles.noscript}>La recherche nécessite JavaScript. Toutes les questions restent consultables ci-dessous.</p></noscript><FaqBrowser entries={faq.map(item => ({ ...item, html: renderMarkdown(item.answer), searchText: item.answer }))} /><JoinBanner /></>;
}
