import Link from 'next/link';
import { PageHeading } from '@/components/editorial';
import styles from '@/components/site.module.css';
export default function NotFound() { return <section className={styles.section}><PageHeading eyebrow="Page introuvable / 404" title="Ce chemin ne mène nulle part."><p>La page recherchée n’existe pas. Retrouvez les informations et les moyens d’agir depuis l’accueil.</p></PageHeading><Link href="/" className={styles.buttonDark}>Revenir à l’accueil ↗</Link></section>; }
