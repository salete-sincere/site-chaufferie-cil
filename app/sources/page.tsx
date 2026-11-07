import type { Metadata } from 'next';
import Link from 'next/link';
import { getContent } from '@/lib/content';
import { PageHeading } from '@/components/editorial';
import styles from '@/components/site.module.css';
export const metadata: Metadata = { title: 'Sources et documents de référence' };
export default async function SourcesPage() {
  const { sources } = await getContent();
  return <><div className={styles.breadcrumb}><Link href="/">Accueil</Link><span>/</span><span>Sources</span></div><PageHeading eyebrow="Le dossier / Les références" title="Remonter aux sources."><p>Qui publie quoi ? Voici les {sources.length} références utilisées dans le dossier, avec les précisions utiles pour les consulter.</p></PageHeading><div className={styles.readingNote}><p>ilénergie est la société concessionnaire du groupe Dalkia. Les publications du porteur, les décisions publiques, la retranscription HAC et les enquêtes associatives de Canopée sont identifiées séparément. Un lien peut mener vers un PDF ou un document nécessitant un accès.</p><p>La position du collectif est également disponible dans le <Link href="/communique-de-presse">communiqué de presse d’HAC du 6 novembre 2026</Link>.</p></div><div className={styles.sourcesList}>{sources.map(source => <article id={source.id} key={source.id} className={styles.source}><span className={styles.sourceId}>{source.id}</span><h2>{source.title}</h2><p><strong>Publié par : {source.publisher}</strong></p><p>{source.description}</p><a className={styles.buttonOutline} href={source.url} target="_blank" rel="noopener noreferrer">Consulter le document <span aria-hidden="true">↗</span><span className="sr-only"> (nouvel onglet)</span></a></article>)}</div></>;
}
