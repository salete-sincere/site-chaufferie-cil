import test from 'node:test';
import assert from 'node:assert/strict';
import { makeMailto, makeMessage, contactEmail } from '../lib/contact';

test('courriel : encode les actions et un message sans altérer les accents', () => {
  const message = makeMessage(['Porte-à-porte', 'Réunions publiques'], 'Bonjour & merci\nÀ bientôt !');
  const url = new URL(makeMailto(message));
  assert.equal(url.pathname, contactEmail);
  assert.equal(url.searchParams.get('subject'), 'Comité chaufferie');
  assert.equal(url.searchParams.get('body'), message);
  assert.match(message, /Porte-à-porte/);
  assert.match(message, /Bonjour & merci\nÀ bientôt !/);
});

test('courriel : autorise une prise de contact sans choisir une action', () => {
  const message = makeMessage([], '');
  assert.match(message, /échanger avant de choisir/);
  assert.doesNotMatch(message, /undefined|null/);
});
