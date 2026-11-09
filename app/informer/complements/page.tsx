import type { Metadata } from 'next';
import Link from 'next/link';
import { getContent } from '@/lib/content';
import { PageHeading, Markdown, SourceLinks, JoinBanner } from '@/components/editorial';
import styles from '@/components/site.module.css';

export const metadata: Metadata = { title: 'Compléments documentaires : navigation, coûts, alternatives et santé' };

export default async function ComplementsPage() {
  const { complements, updatedAt } = await getContent();
  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(updatedAt));

  return <>
    <div className={styles.breadcrumb}>
      <Link href="/">Accueil</Link><span>/</span><Link href="/informer">Je m’informe</Link><span>/</span><span>Compléments documentaires</span>
    </div>
    <PageHeading eyebrow="Le dossier / Pour approfondir" title="Des cas concrets, avec leurs limites.">
      <p>Navigation, raccordement, alternatives énergétiques, activités industrielles et santé : les pièces réunies par Haubourdin Alternative Citoyenne au <time dateTime={updatedAt}>{date}</time>.</p>
    </PageHeading>
    <div className={styles.readingNote}>
      <p>Les exemples documentés ailleurs ne prédisent pas la situation d’Haubourdin. Chaque cas garde sa date, son auteur et son périmètre. Les estimations, les mesures, les demandes et les questions ouvertes restent distinguées.</p>
    </div>
    <nav aria-label="Explorer le dossier" className={styles.subnav}>
      <Link href="/informer/faq">Les questions fréquentes ↗</Link>
      <Link href="/informer/chiffres">Les chiffres clés ↗</Link>
      <Link href="/sources">Les sources ↗</Link>
    </nav>
    <nav id="sommaire-complements" aria-label="Thèmes des compléments documentaires" className={styles.themeIndex}>
      {complements.map(item => <a key={item.id} href={`#${item.id}`}>{item.title}</a>)}
    </nav>
    <div className={styles.complements}>
      {complements.map(item => <section id={item.id} key={item.id} className={styles.complement} aria-labelledby={`${item.id}-title`}>
        <h2 id={`${item.id}-title`}>{item.title}</h2>
        <Markdown>{item.body}</Markdown>
        <div className={styles.complementFoot}>
          <SourceLinks ids={item.sourceIds} />
          <a href="#sommaire-complements">Retour au sommaire ↑</a>
        </div>
      </section>)}
    </div>
    <JoinBanner />
  </>;
}
