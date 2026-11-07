import type { Metadata } from 'next';
import Link from 'next/link';
import { getContent } from '@/lib/content';
import { PageHeading, SourceLinks, Markdown, JoinBanner } from '@/components/editorial';
import styles from '@/components/site.module.css';
export const metadata: Metadata = { title: 'Chiffres clés et leurs sources' };
export default async function FiguresPage() {
  const content = await getContent();
  const themes = [...new Set(content.figures.map(item => item.theme))];
  return <><div className={styles.breadcrumb}><Link href="/">Accueil</Link><span>/</span><Link href="/informer">Je m’informe</Link><span>/</span><span>Chiffres clés</span></div><PageHeading eyebrow="Le dossier / Les chiffres clés" title="Un chiffre seul ne raconte pas tout."><p>{content.figures.length} repères, leur périmètre et leurs limites. Pour comprendre les ordres de grandeur sans mélanger la chaufferie et l’ensemble du réseau.</p></PageHeading><div className={styles.readingNote}><p><strong>Annonces, objectifs et prévisions.</strong> Ces chiffres ne sont pas des résultats mesurés. La date de consultation d’une source ne remplace pas sa date de publication.</p></div><nav className={styles.themeIndex} aria-label="Thèmes des chiffres">{themes.map((theme,index) => <a key={theme} href={`#theme-${index+1}`}>{theme}</a>)}</nav>{themes.map((theme,index) => <section className={styles.figureTheme} id={`theme-${index+1}`} key={theme}><h2>{String(index+1).padStart(2,'0')} / {theme}</h2><div className={styles.figuresGrid}>{content.figures.filter(item=>item.theme===theme).map(item=><article data-testid="figure" id={item.id} key={item.id} className={styles.figureCard}><h3>{item.value}</h3><p>{item.description}</p>{item.note && <Markdown>{item.note}</Markdown>}<p className={styles.figurePublisher}>Publié par : {item.publisher}</p><SourceLinks ids={item.sourceIds} /></article>)}</div>{content.figureThemeNotes?.filter(item=>item.theme===theme).map(item=><div key={item.theme} className={styles.themeQuestion}><Markdown>{item.body}</Markdown></div>)}</section>)}<JoinBanner /></>;
}
