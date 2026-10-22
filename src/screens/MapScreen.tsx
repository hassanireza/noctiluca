import { useEffect, useMemo, useState, type CSSProperties } from 'react';
import { ChevronRight, Compass, Play } from 'lucide-react';
import { Constellation } from '../components/Constellation';
import { EpisodeSheet } from '../components/EpisodeSheet';
import { CellArt } from '../components/CellArt';
import { EPISODE_COUNT, LEVELS_PER_EPISODE, LEVEL_COUNT, episodeNames } from '../episodes';
import { episodePalette, questions } from '../questions';
import { nextLevel, type Progress } from '../progress';

type Props = { progress: Progress; focusLevel: number | null; onOpen: (id: number) => void };
const episodeOf = (id: number) => Math.ceil(id / LEVELS_PER_EPISODE);

export function MapScreen({ progress, focusLevel, onOpen }: Props) {
  const [sheet, setSheet] = useState(false);
  const done = useMemo(() => new Set(progress.done), [progress.done]);
  const next = nextLevel(progress);
  const resume = next ?? 1;
  const resumeQ = questions[resume - 1];
  const returning = progress.done.length > 0;
  const episodes = useMemo(() => Array.from({ length: EPISODE_COUNT }, (_, i) => EPISODE_COUNT - i), []);

  // Land where the player is. The title/hero now sits at the bottom of the path (the surface), so beginners land right on it.
  useEffect(() => {
    const target = focusLevel ?? (returning ? resume : null);
    const toBottom = () => window.scrollTo(0, document.documentElement.scrollHeight);
    if (target === null || episodeOf(target) <= 2) { requestAnimationFrame(toBottom); return; }
    requestAnimationFrame(() => document.getElementById(`ep-${episodeOf(target)}`)?.scrollIntoView({ block: 'center' }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const jump = (ep: number) => { setSheet(false); requestAnimationFrame(() => document.getElementById(`ep-${ep}`)?.scrollIntoView({ behavior: 'smooth', block: 'start' })); };

  return (
    <>
      <section className="journey" aria-label="Episodes">
        <div className="section-title"><div className="eyebrow">THE SUMMIT · LEVEL 1000</div></div>
        <div className="episode-list">
          {episodes.map((ep) => {
            const items = questions.slice((ep - 1) * LEVELS_PER_EPISODE, ep * LEVELS_PER_EPISODE);
            const n = items.filter((q) => done.has(q.id)).length;
            return (
              <article id={`ep-${ep}`} key={ep} className={`episode${n === LEVELS_PER_EPISODE ? ' complete' : ''}`} style={{ '--tint': episodePalette[(ep - 1) % episodePalette.length] } as CSSProperties}>
                <header>
                  <div><span className="ep-no">EPISODE {String(ep).padStart(2, '0')}</span><h2>{episodeNames[ep - 1]}</h2></div>
                  <div className="ep-count" aria-label={`${n} of ${LEVELS_PER_EPISODE} complete`}>{n === LEVELS_PER_EPISODE ? '✦ COMPLETE' : <><b>{n}</b>/{LEVELS_PER_EPISODE}</>}</div>
                </header>
                <Constellation episode={ep} items={items} done={done} nextId={next} onOpen={onOpen} />
              </article>
            );
          })}
        </div>
      </section>
      <section className="hero" id="surface">
        <div className="hero-art" aria-hidden="true"><CellArt size={300} /></div>
        <div className="hero-copy">
          <div className="eyebrow">A {LEVEL_COUNT.toLocaleString()}-LEVEL PYTHON ODYSSEY</div>
          <h1>Find your way<br /><em>through the dark.</em></h1>
          <p>Fifty constellations. A thousand small programs. Light each star by writing the Python that makes it glow.</p>
          <div className="meter" role="img" aria-label={`${progress.done.length} of ${LEVEL_COUNT} stars lit`}>
            <div className="meter-bar"><i style={{ width: `${Math.max(1.5, (progress.done.length / LEVEL_COUNT) * 100)}%` }} /></div>
            <div className="meter-text"><b>{progress.done.length}</b> / {LEVEL_COUNT.toLocaleString()} stars lit</div>
          </div>
        </div>
      </section>


      <nav className="dock" aria-label="Quick actions">
        <button className="dock-main" onClick={() => onOpen(resume)}>
          <span className="dock-play"><Play size={16} fill="currentColor" /></span>
          <span className="dock-text"><small>{next === null ? 'ALL STARS LIT · REPLAY' : returning ? 'CONTINUE' : 'BEGIN'}</small><b>Level {String(resume).padStart(3, '0')} · {resumeQ.title}</b></span>
          <ChevronRight size={18} />
        </button>
        <button className="dock-jump" onClick={() => setSheet(true)} aria-label="Jump to episode"><Compass size={22} /></button>
      </nav>
      {sheet && <EpisodeSheet done={done} current={episodeOf(resume)} onPick={jump} onClose={() => setSheet(false)} />}
    </>
  );
}
