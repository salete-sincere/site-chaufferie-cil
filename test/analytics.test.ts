import test from 'node:test';
import assert from 'node:assert/strict';
import { analyticsToken } from '../lib/analytics.ts';

test('analytics is disabled without a site token', () => {
  assert.equal(analyticsToken(undefined), null);
  assert.equal(analyticsToken(''), null);
});

test('analytics accepts the public beacon token and rejects misconfiguration', () => {
  const token = '0123456789abcdef0123456789abcdef';
  assert.equal(analyticsToken(token), token);
  for (const value of ['placeholder', '<script>', ' ', `${token}extra`]) {
    assert.throws(() => analyticsToken(value), /CLOUDFLARE_WEB_ANALYTICS_TOKEN/);
  }
});
