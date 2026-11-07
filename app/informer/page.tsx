import type { Metadata } from 'next';
import Link from 'next/link';
import { getContent } from '@/lib/content';
import { PageHeading, Markdown, SourceLinks, JoinBanner } from '@/components/editorial';
import styles from '@/components/site.module.css';
export const metadata: Metadata = { title: 'Je m’informe : 10 choses à savoir' };
export default async function InformPage() {
  const content = await getContent();
  return <><div className={styles.breadcrumb}><Link href="/">Accueil</Link><span>/</span><span>Je m’informe</span></div><PageHeading eyebrow="01 / Comprendre avant de décider" title="10 choses à savoir sur la chaufferie."><p>Des explications courtes pour entrer dans le sujet. Les sources et les points encore à éclaircir sont là aussi.</p></PageHeading><nav aria-label="Explorer le dossier" className={styles.subnav}><Link href="/informer/faq">Les 34 questions fréquentes ↗</Link><Link href="/informer/chiffres">Les 48 chiffres clés ↗</Link><Link href="/sources">Les sources ↗</Link></nav><div className={styles.readingNote}><p><strong>Pour bien lire ce dossier.</strong> Les caractéristiques annoncées du projet sont des prévisions. Les demandes d’HAC sont nos positions. Les questions ouvertes attendent encore des réponses documentées.</p></div><section className={styles.overviewList} aria-label="Les dix points essentiels">{content.overview.map((item,index) => <article data-testid="overview-point" id={item.id} key={item.id} className={styles.overview}><span className={styles.overviewNumber} aria-hidden="true">{String(index+1).padStart(2,'0')}</span><div><h2>{item.title}</h2><Markdown>{item.body}</Markdown><SourceLinks ids={item.sourceIds} /></div></article>)}</section><JoinBanner /></>;
}
