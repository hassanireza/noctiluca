import { useEffect, useRef, type CSSProperties } from 'react';
import { X } from 'lucide-react';
import { EPISODE_COUNT, LEVELS_PER_EPISODE, episodeNames } from '../episodes';
import { episodePalette } from '../questions';

type Props = { done: Set<number>; current: number; onPick: (episode: number) => void; onClose: () => void };

export function EpisodeSheet({ done, current, onPick, onClose }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const prev = document.activeElement as HTMLElement | null;
    ref.current?.focus();
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', onKey);
    document.body.classList.add('no-scroll');
    return () => { window.removeEventListener('keydown', onKey); document.body.classList.remove('no-scroll'); prev?.focus?.(); };
  }, [onClose]);

  return (
    <div className="sheet-wrap" onClick={onClose}>
      <div className="sheet" ref={ref} tabIndex={-1} role="dialog" aria-modal="true" aria-label="Jump to episode" onClick={(e) => e.stopPropagation()}>
        <div className="sheet-grip" aria-hidden="true" />
        <header><div><div className="eyebrow">NAVIGATE</div><h2>Jump to episode</h2></div><button className="icon-btn" onClick={onClose} aria-label="Close"><X size={18} /></button></header>
        <div className="sheet-grid">
          {Array.from({ length: EPISODE_COUNT }, (_, i) => EPISODE_COUNT - i).map((ep) => {
            let n = 0; for (let k = 0; k < LEVELS_PER_EPISODE; k++) if (done.has((ep - 1) * LEVELS_PER_EPISODE + k + 1)) n++;
            return (
              <button key={ep} className={`chip${ep === current ? ' here' : ''}${n === LEVELS_PER_EPISODE ? ' full' : ''}`} onClick={() => onPick(ep)}
                style={{ '--tint': episodePalette[(ep - 1) % episodePalette.length], '--fill': `${(n / LEVELS_PER_EPISODE) * 100}%` } as CSSProperties}
                aria-label={`Episode ${ep}, ${episodeNames[ep - 1]}, ${n} of ${LEVELS_PER_EPISODE} complete`}>
                <span>{String(ep).padStart(2, '0')}</span><i />
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
