import type { Metadata } from 'next';
import Link from 'next/link';
import { getContent } from '@/lib/content';
import { PageHeading, JoinBanner } from '@/components/editorial';
import { CopyButton, ShareLink } from '@/components/copy-button';
import styles from '@/components/site.module.css';
import { HacLinks } from '@/components/hac-links';
export const metadata: Metadata = { title: 'Je milite : faire circuler l’information' };
export default async function CampaignPage() {
  const content = await getContent();
const messages = [
  { title: 'Ouvrir la discussion', purpose: 'Présenter le sujet', path: '/informer', text: 'Une chaufferie biomasse de 63 MWth utiles est prévue sur la friche Lever à Haubourdin. Air, bruit, circulation, factures : nous avons besoin de comprendre ce qui est annoncé et ce qui reste à préciser. Prenons le temps de nous informer et d’en discuter.' },
  { title: 'Partager les faits', purpose: 'Faire connaître le dossier', path: '/informer/faq', text: `Combien de camions ? D’où viendra le bois ? Qui pourra être raccordé ? Le dossier du comité rassemble ${content.faq.length} questions et ${content.figures.length} repères chiffrés, avec leurs sources. Les annonces du projet, les positions d’HAC et les questions ouvertes y sont distinguées.` },
  { title: 'Faire le premier pas', purpose: 'Inviter au comité', path: '/rejoindre', text: 'Un comité d’intérêt local contre la chaufferie de la friche Lever est en cours de constitution, à l’initiative d’Haubourdin Alternative Citoyenne. Réunions, porte-à-porte, tracts, partage d’informations : chacun peut apporter quelque chose, même avec peu de temps. Rejoignez-nous !' },
];

  return <><div className={styles.breadcrumb}><Link href="/">Accueil</Link><span>/</span><span>Je milite</span></div><PageHeading eyebrow="02 / Faire circuler l’information" title="Le débat commence autour de nous."><p>Un message à un voisin, une discussion entre amis, un partage dans un groupe : voici de quoi ouvrir la conversation.</p></PageHeading><section className={styles.publications}><h2>Les publications d’HAC</h2><p>Retrouvez notre prise de position et les nouvelles du collectif.</p><HacLinks /></section><div className={styles.shareGrid}>{messages.map((message,index) => <article key={message.path} className={styles.shareCard}><p className={styles.eyebrow}>0{index+1} / {message.purpose}</p><h2>{message.title}</h2><blockquote>{message.text}</blockquote><CopyButton text={message.text} path={message.path} label="Copier le texte" /><ShareLink title={message.title} path={message.path} /></article>)}</div><div className={styles.readingNote}><p><strong>Gardons les précisions qui comptent.</strong> Les « 30 camions par jour » sont un maximum de secours annoncé lorsque la voie fluviale est indisponible. Les 63 MW sont une puissance thermique utile, récupération de chaleur des fumées comprise. Des raccordements à Haubourdin sont prévus. <Link href="/informer/chiffres">Consulter les chiffres et leurs sources.</Link></p></div><section className={styles.notice}><span className={styles.soon}>À venir</span><h2>Être informé par mail</h2><p>L’inscription aux nouvelles sera proposée plus tard. Aucune adresse n’est recueillie ici pour le moment. Pour prendre part au comité, vous pouvez déjà <Link href="/rejoindre">écrire au groupe</Link>.</p></section><JoinBanner /></>;
}
