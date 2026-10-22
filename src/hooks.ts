import { useEffect, useState } from 'react';

/** Exposes the on-screen keyboard height as --kb so fixed bars can ride above it (iOS does not resize the layout viewport). */
export function useKeyboardInset() {
  useEffect(() => {
    const vv = window.visualViewport; if (!vv) return;
    const root = document.documentElement;
    const update = () => {
      const kb = Math.max(0, Math.round(window.innerHeight - vv.height - vv.offsetTop));
      root.style.setProperty('--kb', `${kb}px`);
      root.classList.toggle('kb-open', kb > 80);
    };
    update();
    vv.addEventListener('resize', update); vv.addEventListener('scroll', update);
    return () => { vv.removeEventListener('resize', update); vv.removeEventListener('scroll', update); root.style.removeProperty('--kb'); root.classList.remove('kb-open'); };
  }, []);
}

const HINT_KEY = 'noctiluca.installHint';
const isIOS = () => /iphone|ipad|ipod/i.test(navigator.userAgent) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
const isStandalone = () => (navigator as any).standalone === true || window.matchMedia('(display-mode: standalone)').matches;

export type InstallHint = { kind: 'ios' | 'prompt'; install?: () => void; dismiss: () => void } | null;

/** iOS has no install event, so we teach the Share → Add to Home Screen path once; Chromium gets the real prompt. */
export function useInstallHint(enabled: boolean): InstallHint {
  const [kind, setKind] = useState<'ios' | 'prompt' | null>(null);
  const [evt, setEvt] = useState<any>(null);

  useEffect(() => {
    const onPrompt = (e: Event) => { e.preventDefault(); setEvt(e); };
    window.addEventListener('beforeinstallprompt', onPrompt);
    return () => window.removeEventListener('beforeinstallprompt', onPrompt);
  }, []);

  useEffect(() => {
    if (!enabled || isStandalone()) return;
    let snoozed = false;
    try { snoozed = Date.now() - Number(localStorage.getItem(HINT_KEY) || 0) < 14 * 86400000; } catch { /* ignore */ }
    if (snoozed) return;
    const t = window.setTimeout(() => setKind(evt ? 'prompt' : isIOS() ? 'ios' : null), 5000);
    return () => window.clearTimeout(t);
  }, [enabled, evt]);

  const dismiss = () => { setKind(null); try { localStorage.setItem(HINT_KEY, String(Date.now())); } catch { /* ignore */ } };
  if (!kind) return null;
  return { kind, dismiss, install: evt ? async () => { await evt.prompt(); setEvt(null); dismiss(); } : undefined };
}

export function useMedia(query: string) {
  const [m, setM] = useState(() => window.matchMedia(query).matches);
  useEffect(() => { const q = window.matchMedia(query); const f = () => setM(q.matches); q.addEventListener('change', f); return () => q.removeEventListener('change', f); }, [query]);
  return m;
}
