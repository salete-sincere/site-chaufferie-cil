import Link from 'next/link';
import { hacFacebookUrl } from '@/lib/hac';
import styles from './site.module.css';

export function HacLinks() {
  return <nav aria-label="Publications d’Haubourdin Alternative Citoyenne" className={styles['publication-links']}>
    <Link href="/communique-de-presse" className={styles.textLink}>Lire le communiqué d’Haubourdin Alternative Citoyenne <span aria-hidden="true">↗</span></Link>
    <a href={hacFacebookUrl} className={styles.textLink} target="_blank" rel="noopener noreferrer">Haubourdin Alternative Citoyenne sur Facebook <span aria-hidden="true">↗</span><span className="sr-only"> (nouvel onglet)</span></a>
  </nav>;
}
