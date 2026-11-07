import type { ReactNode } from 'react';

type PublicEmailLinkProps = {
  href: string;
  className?: string;
  children: ReactNode;
};

/** Keep the public contact usable without JavaScript behind Cloudflare.
 * https://developers.cloudflare.com/waf/tools/scrape-shield/email-address-obfuscation/
 * Only fixed comments use raw HTML; React escapes the link and its content.
 */
export function PublicEmailLink({ href, className, children }: PublicEmailLinkProps) {
  return <>
    <span hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: '<!--email_off-->' }} />
    <a href={href} className={className}>{children}</a>
    <span hidden aria-hidden="true" dangerouslySetInnerHTML={{ __html: '<!--/email_off-->' }} />
  </>;
}
