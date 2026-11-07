'use client';
import { useEffect, useState } from 'react';
import styles from './site.module.css';

type Entry = { id: string; question: string; theme: string; html: string; sourceIds: string[]; searchText: string };
const normalize = (value: string) => value.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
export function FaqBrowser({ entries }: { entries: Entry[] }) {
  const [query, setQuery] = useState('');
  const [theme, setTheme] = useState('');
  useEffect(() => {
    const openAnchor = () => {
      const id = window.location.hash.slice(1);
      const target = document.getElementById(id);
      if (target instanceof HTMLDetailsElement) {
        target.open = true;
        // Position after opening: a previous native smooth scroll can otherwise
        // leave the active fragment outside the viewport.
        target.scrollIntoView({ behavior: 'instant', block: 'start' });
      }
    };
    openAnchor(); window.addEventListener('hashchange', openAnchor);
    return () => window.removeEventListener('hashchange', openAnchor);
  }, []);
  const shown = entries.filter(item => (!theme || item.theme === theme) && normalize(`${item.question} ${item.searchText}`).includes(normalize(query)));
  return <div><div className={styles.filters}><label className={styles.field}>Rechercher une question<input type="search" value={query} onChange={event => setQuery(event.target.value)} placeholder="Par exemple : bois, camions, facture…" /></label><label className={styles.field}>Thème<select value={theme} onChange={event => setTheme(event.target.value)}><option value="">Tous les thèmes</option>{[...new Set(entries.map(item => item.theme))].map(value => <option key={value}>{value}</option>)}</select></label></div><p role="status" className={styles.resultCount}>{shown.length} question{shown.length > 1 ? 's' : ''}{query || theme ? ' trouvée' + (shown.length > 1 ? 's' : '') : ' pour comprendre le projet'}</p>{shown.length === 0 && <div className={styles.empty}><h2>Aucune question trouvée</h2><p>Essayez un autre mot ou consultez tous les thèmes.</p><button className={styles.buttonOutline} onClick={() => { setQuery(''); setTheme(''); }}>Réinitialiser la recherche</button></div>}<div className={styles.faqList}>{shown.map(item => <details id={item.id} key={item.id} className={styles.faq}><summary><span><small>{item.theme}</small>{item.question}</span><span aria-hidden="true" className={styles.plus}>+</span></summary><div className={styles.faqAnswer}><div className={styles.prose} dangerouslySetInnerHTML={{ __html: item.html }} /><div className={styles.faqFoot}><span className={styles.sourceLinks}>Sources {item.sourceIds.map(id => <a key={id} href={`/sources#${id}`}>{id}</a>)}</span><a href={`#${item.id}`} className={styles.textLink}>Lien vers cette question <span aria-hidden="true">↗</span></a></div></div></details>)}</div></div>;
}
