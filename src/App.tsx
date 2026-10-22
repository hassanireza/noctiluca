import { useCallback, useEffect, useRef, useState } from 'react';
import { Flame, Sparkles } from 'lucide-react';
import { Backdrop } from './components/Backdrop';
import { CellArt } from './components/CellArt';
import { InstallHint } from './components/InstallHint';
import { MapScreen } from './screens/MapScreen';
import { PlayScreen } from './screens/PlayScreen';
import { LEVEL_COUNT } from './episodes';
import { useInstallHint, useKeyboardInset } from './hooks';
import { applySolve, liveStreak, readProgress, writeProgress, type Progress } from './progress';

/** The open level lives in the URL hash, so the iOS edge-swipe / Android back gesture closes a level instead of leaving the app. */
const levelFromHash = () => { const m = /^#\/level\/(\d+)$/.exec(location.hash); const n = m ? Number(m[1]) : 0; return n >= 1 && n <= LEVEL_COUNT ? n : null; };

export default function App() {
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [active, setActive] = useState<number | null>(levelFromHash);
  const lastLevel = useRef<number | null>(null);
  const pushed = useRef(false);
  useKeyboardInset();
  const hint = useInstallHint(active === null);

  useEffect(() => writeProgress(progress), [progress]);
  useEffect(() => {
    const sync = () => setActive(levelFromHash());
    window.addEventListener('hashchange', sync); window.addEventListener('popstate', sync);
    return () => { window.removeEventListener('hashchange', sync); window.removeEventListener('popstate', sync); };
  }, []);
  useEffect(() => { if (active !== null) lastLevel.current = active; document.title = active ? `Level ${active} · Noctiluca` : 'Noctiluca | Learn Python in the dark'; }, [active]);

  const open = useCallback((id: number) => {
    if (active === null) { pushed.current = true; location.hash = `/level/${id}`; }
    else { history.replaceState(null, '', `#/level/${id}`); setActive(id); } // next level replaces, so Back still returns to the map
  }, [active]);
  const close = useCallback(() => {
    if (pushed.current) { pushed.current = false; history.back(); }
    else { history.replaceState(null, '', location.pathname + location.search); setActive(null); }
  }, []);
  const solve = useCallback((id: number, xp: number) => setProgress((p) => applySolve(p, id, xp)), []);

  return (
    <main className="shell" data-view={active ? 'play' : 'map'}>
      <Backdrop />
      <header className="topbar">
        <button className="brand" onClick={() => (active ? close() : window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' }))} aria-label={active ? 'Back to map' : 'Scroll to the title and your progress'}>
          <CellArt size={34} rings={false} /><span>NOCTILUCA</span>
        </button>
        <div className="top-stats">
          <span title="Day streak" aria-label={`${liveStreak(progress)} day streak`}><Flame size={15} />{liveStreak(progress)}</span>
          <span title="Essence" aria-label={`${progress.xp} essence`}><Sparkles size={15} />{progress.xp}</span>
        </div>
      </header>
      {active
        ? <PlayScreen key={active} id={active} solved={progress.done.includes(active)} onSolve={solve} onOpen={open} onBack={close} />
        : <MapScreen progress={progress} focusLevel={lastLevel.current} onOpen={open} />}
      {hint && !active && <InstallHint hint={hint} />}
    </main>
  );
}
