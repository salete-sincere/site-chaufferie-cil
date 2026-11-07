import test from 'node:test';
import assert from 'node:assert/strict';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { PublicEmailLink } from '../components/public-email-link';
import { makeMailto } from '../lib/contact';

test('contact public : le message et le libellé restent échappés dans le HTML', () => {
  const message = 'Bonjour <script>alert("test")</script> & merci';
  const html = renderToStaticMarkup(createElement(PublicEmailLink, {
    href: makeMailto(message),
    children: '<img src=x onerror=alert(1)>',
  }));

  assert.doesNotMatch(html, /<script|<img/);
  assert.match(html, /&lt;img src=x onerror=alert\(1\)&gt;/);
  assert.match(html, /%3Cscript%3E/);
  assert.match(html, /&amp;body=/);
  assert.match(html, /<!--email_off-->.*<a .*<\/a>.*<!--\/email_off-->/);
});
