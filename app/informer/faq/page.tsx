import type { Metadata } from 'next';
import Link from 'next/link';
import { getContent, renderMarkdown } from '@/lib/content';
import { PageHeading, JoinBanner } from '@/components/editorial';
import { FaqBrowser } from '@/components/faq-browser';
import styles from '@/components/site.module.css';
export const metadata: Metadata = { title: 'FAQ : vos questions sur le projet' };
export default async function FaqPage() {
  const { faq, updatedAt } = await getContent();
  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(updatedAt));
  return <><div className={styles.breadcrumb}><Link href="/">Accueil</Link><span>/</span><Link href="/informer">Je m’informe</Link><span>/</span><span>FAQ</span></div><PageHeading eyebrow="Le dossier / Questions fréquentes" title="Vos questions méritent des réponses."><p>Bois, péniches, bruit, factures… {faq.length} questions pour comprendre ce qui est annoncé et ce qui reste à préciser.</p></PageHeading><div className={styles.readingNote}><p>Réponses établies à partir du dossier d’Haubourdin Alternative Citoyenne au <time dateTime={updatedAt}>{date}</time>. Les prévisions ne sont pas des résultats mesurés de l’installation en service.</p></div><nav aria-label="Explorer le dossier" className={styles.subnav}><Link href="/informer/complements">Les compléments documentaires ↗</Link><Link href="/sources">Les sources ↗</Link></nav><noscript><p className={styles.noscript}>La recherche nécessite JavaScript. Toutes les questions restent consultables ci-dessous.</p></noscript><FaqBrowser entries={faq.map(item => ({ ...item, html: renderMarkdown(item.answer), searchText: item.answer }))} /><JoinBanner /></>;
}
