import Link from 'next/link';
import { renderMarkdown } from '@/lib/content';
import styles from './site.module.css';

export function SourceLinks({ ids }: { ids: string[] }) {
  return <span className={styles.sourceLinks}><span>Sources</span> {ids.map(id => <Link key={id} href={`/sources#${id}`} aria-label={`Consulter la source ${id}`}>{id}</Link>)}</span>;
}
export function Markdown({ children }: { children: string }) {
  return <div className={styles.prose} dangerouslySetInnerHTML={{ __html: renderMarkdown(children) }} />;
}
export function PageHeading({ eyebrow, title, children }: { eyebrow: string; title: string; children?: React.ReactNode }) {
  return <header className={styles.pageHeading}><p className={styles.eyebrow}>{eyebrow}</p><h1>{title}</h1>{children && <div className={styles.lead}>{children}</div>}</header>;
}
export function JoinBanner() {
  return <aside className={styles.joinBanner}><div><p className={styles.eyebrow}>On commence par se rassembler</p><h2>Votre place est ici.<br />Même avec peu de temps.</h2><p>Le comité se construit avec les habitants volontaires. Venez avec vos questions, vos idées et vos envies d’agir.</p></div><Link className={styles.buttonDark} href="/rejoindre">Je rejoins le comité <span aria-hidden="true">↗</span></Link></aside>;
}
