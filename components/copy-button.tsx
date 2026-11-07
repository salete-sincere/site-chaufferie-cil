'use client';
import { useRef, useState } from 'react';
import styles from './site.module.css';

export function CopyButton({ text, label, fallbackLabel = 'Texte à copier', path }: { text: string; label: string; fallbackLabel?: string; path?: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'fallback'>('idle');
  const [fallbackText, setFallbackText] = useState(text);
  const area = useRef<HTMLTextAreaElement>(null);
  async function copy() {
    const value = path ? `${text}\n\n${new URL(path, window.location.origin).href}` : text;
    setFallbackText(value);
    try {
      if (!navigator.clipboard?.writeText) throw new Error('Clipboard unavailable');
      await navigator.clipboard.writeText(value);
      setState('copied');
    } catch {
      setState('fallback');
      requestAnimationFrame(() => { area.current?.focus(); area.current?.select(); });
    }
  }
  return <div className={styles.copyControl}><button type="button" className={styles.buttonOutline} onClick={copy}>{label} <span aria-hidden="true">↗</span></button><p role="status" className={styles.status}>{state === 'copied' ? 'Copié dans le presse-papiers.' : state === 'fallback' ? 'La copie automatique est indisponible. Sélectionnez le texte ci-dessous et copiez-le.' : ''}</p>{state === 'fallback' && <label className={styles.field}>{fallbackLabel}<textarea ref={area} readOnly value={fallbackText} rows={5} /></label>}</div>;
}

export function ShareLink({ title, path }: { title: string; path: string }) {
  const [fallback, setFallback] = useState(false);
  const [url, setUrl] = useState('');
  const [status, setStatus] = useState('');
  async function share() {
    const link = new URL(path, window.location.origin).href;
    setUrl(link);
    if (navigator.share) {
      try { await navigator.share({ title, url: link }); setStatus('Le partage a été ouvert.'); return; }
      catch (error) { if (error instanceof Error && error.name === 'AbortError') return; }
    }
    setFallback(true);
    setStatus('Vous pouvez copier le lien ci-dessous.');
  }
  return <div><button type="button" className={styles.buttonOutline} onClick={share}>Partager le lien <span aria-hidden="true">↗</span></button><p className={styles.status} role="status">{status}</p>{fallback && <CopyButton text={url} label="Copier le lien" fallbackLabel="Lien à copier" />}</div>;
}
