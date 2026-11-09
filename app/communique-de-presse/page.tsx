import { pageMetadata } from '@/lib/metadata';
import Link from 'next/link';
import { getPressRelease } from '@/lib/content';
import { contactEmail, makeMailto } from '@/lib/contact';
import { Markdown, PageHeading } from '@/components/editorial';
import { PublicEmailLink } from '@/components/public-email-link';
import { ShareLink } from '@/components/copy-button';
import styles from '@/components/site.module.css';

export const metadata = pageMetadata("/communique-de-presse", "Le communiqué de presse d’Haubourdin Alternative Citoyenne", "Lisez le communiqué du 6 novembre 2026 d’Haubourdin Alternative Citoyenne sur le projet de chaufferie et la constitution d’un comité d’intérêt local.");

export default async function PressReleasePage() {
  const release = await getPressRelease();
  const date = new Intl.DateTimeFormat('fr-FR', { dateStyle: 'long', timeZone: 'UTC' }).format(new Date(release.publishedAt));
  return <>
    <div className={styles.breadcrumb}><Link href="/">Accueil</Link><span>/</span><span>Communiqué de presse</span></div>
    <PageHeading eyebrow="La parole d’Haubourdin Alternative Citoyenne" title={release.title}>
      <p>Communiqué de presse · Haubourdin, le <time dateTime={release.publishedAt}>{date}</time></p>
    </PageHeading>
    <div className={styles['press-release']}>
      <p className={styles['press-byline']}>{release.publisher}, groupe d’opposition au conseil municipal d’Haubourdin</p>
      <p className={styles.small}>Le nom Haubourdin Alternative Citoyenne est écrit en toutes lettres dans cette reproduction du communiqué.</p>
      <article aria-label="Texte du communiqué d’Haubourdin Alternative Citoyenne"><Markdown>{release.body}</Markdown></article>
      <section className={styles['press-contact']} aria-labelledby="press-contact">
        <h2 id="press-contact">Contact presse et comité d’intérêt local</h2>
        <p className={styles.email}><PublicEmailLink href={makeMailto('')}>{contactEmail}</PublicEmailLink></p>
        <p>Objet : Comité chaufferie</p>
        <Link href="/rejoindre" className={styles.textLink}>Préparer mon message au groupe <span aria-hidden="true">↗</span></Link>
      </section>
      <div className={styles['press-source']}>
        <a href={release.sourceDocument} target="_blank" rel="noopener noreferrer">Consulter le communiqué dans le document source <span aria-hidden="true">↗</span><span className="sr-only"> (nouvel onglet)</span></a>
        <ShareLink title={release.title} path="/communique-de-presse" />
      </div>
    </div>
  </>;
}
