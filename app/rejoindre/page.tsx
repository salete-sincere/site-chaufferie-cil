import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHeading } from '@/components/editorial';
import { JoinForm } from '@/components/join-form';
import styles from '@/components/site.module.css';
export const metadata: Metadata = { title: 'Je rejoins le comité' };
export default function JoinPage() {
  return <><div className={styles.breadcrumb}><Link href="/">Accueil</Link><span>/</span><span>Je rejoins le comité</span></div><PageHeading eyebrow="03 / Agir ensemble" title="Le comité commence avec vous."><p>Il est en cours de constitution. L’objectif : partager nos informations, faire entendre notre opposition et préparer ensemble les actions à mener.</p></PageHeading><noscript><p className={styles.noscript}>Vous pouvez nous écrire directement à l’adresse ci-dessous avec l’objet « Comité chaufferie » et indiquer les actions qui vous intéressent. La préparation automatique du message nécessite JavaScript.</p></noscript><JoinForm /></>;
}
