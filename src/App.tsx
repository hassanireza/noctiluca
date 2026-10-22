import { useEffect, useRef, useState } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { oneDark } from '@codemirror/theme-one-dark';
import { Check, ChevronLeft, ChevronRight, Code2, Flame, HelpCircle, Play, RotateCcw, Sparkles, Terminal, X } from 'lucide-react';
import { episodePalette, questions } from './questions';

type Progress = { done: number[]; streak: number; lastDay: string; xp: number };
type WorkerReply = { phase?: string; output?: string; error?: string; solved?: boolean };
const KEY = 'noctiluca.save.v1';
let pythonWorker: Worker | null = null;
const today = () => new Date().toISOString().slice(0, 10);
function readProgress(): Progress {
  try {
    const stored = JSON.parse(localStorage.getItem(KEY) || '{}');
    return { done: Array.isArray(stored.done) ? stored.done : [], streak: stored.streak || 0, lastDay: stored.lastDay || '', xp: stored.xp || 0 };
  } catch { return { done: [], streak: 0, lastDay: '', xp: 0 }; }
}

export default function App() {
  const [progress, setProgress] = useState<Progress>(readProgress);
  const [active, setActive] = useState<number | null>(null);
  const [code, setCode] = useState('');
  const [output, setOutput] = useState('');
  const [error, setError] = useState('');
  const [checking, setChecking] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [install, setInstall] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const editor = useRef<HTMLDivElement>(null);
  const q = active === null ? null : questions[active];
  const firstQuestion = questions[0];
  const groups = Array.from({ length: 50 }, (_, i) => questions.slice(i * 20, (i + 1) * 20)).reverse();

  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(progress)); }, [progress]);
  useEffect(() => {
    const handler = (e: any) => { e.preventDefault(); setInstallPrompt(e); setInstall(true); };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);
  useEffect(() => {
    if (q) { setCode(q.starter); setOutput(''); setError(''); setShowHint(false); window.scrollTo({ top: 0, behavior: 'smooth' }); }
    else requestAnimationFrame(() => window.scrollTo(0, document.body.scrollHeight));
  }, [active]);

  function openQuestion(id: number) { if (id >= 1 && id <= questions.length) setActive(id - 1); }
  function run() {
    if (!q) return;
    setChecking(true); setError(''); setOutput('Loading Python runtime. First launch can take a little while…');
    pythonWorker ??= new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' });
    const worker = pythonWorker;
    const timeout = window.setTimeout(() => { worker.terminate(); pythonWorker = null; setError('Python did not finish loading. Check your connection and tap Run again.'); setOutput(''); setChecking(false); }, 120000);
    worker.onmessage = (event: MessageEvent<WorkerReply>) => {
      if (event.data.phase) { setOutput(event.data.phase === 'loading' ? 'Downloading Python runtime…' : 'Running your code…'); return; }
      window.clearTimeout(timeout); setChecking(false);
      if (event.data.error) { setError(event.data.error); setOutput(''); return; }
      setError(''); setOutput(event.data.output || '');
      if (event.data.solved) setProgress(p => {
        if (p.done.includes(q.id)) return p;
        const day = today(); const diff = p.lastDay ? Math.floor((Date.parse(day) - Date.parse(p.lastDay)) / 86400000) : 999;
        return { done: [...p.done, q.id], streak: diff === 1 ? p.streak + 1 : diff === 0 ? p.streak : 1, lastDay: day, xp: p.xp + q.xp };
      });
    };
    worker.onerror = () => { window.clearTimeout(timeout); worker.terminate(); pythonWorker = null; setChecking(false); setError('Python could not start. Check your connection and tap Run again.'); setOutput(''); };
    worker.postMessage({ code, target: q.target, test: q.test });
  }
  function insert(text: string) { const view = editor.current?.querySelector('.cm-content') as HTMLElement | null; if (view) { view.focus(); document.execCommand('insertText', false, text); } }
  function reset() { if (q) setCode(q.starter); }
  async function installApp() { if (installPrompt) { await installPrompt.prompt(); setInstallPrompt(null); } setInstall(false); }

  return <main className="shell" data-view={q ? 'challenge' : 'map'}>
    <header className="topbar"><button className="brand" onClick={() => setActive(null)} aria-label="Noctiluca home"><span className="brand-mark"><i/><i/><i/></span><span>NOCTILUCA</span></button><div className="top-stats"><span><Flame size={15}/>{progress.streak}<small>DAY STREAK</small></span><span><Sparkles size={15}/>{progress.xp}<small>ESSENCE</small></span></div></header>
    {q ? <section className="play"><button className="back" onClick={() => setActive(null)}><ChevronLeft size={16}/> MAP</button><div className="question-head"><div className="eyebrow">{q.world} <span>·</span> LEVEL {String(q.id).padStart(3, '0')} / 1000</div><h1>{q.title}</h1><p>{q.prompt}</p><div className="line-limit">SOLUTION LIMIT · 20 LINES</div></div><div className="editor-card"><div className="editor-top"><span><Code2 size={14}/> main.py</span><button onClick={reset} aria-label="Reset code"><RotateCcw size={14}/></button></div><div ref={editor} className="editor"><CodeMirror value={code} height="205px" extensions={[python()]} theme={oneDark} onChange={setCode} basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: false, autocompletion: false }}/></div><div className="mobile-keys"><button onMouseDown={e => e.preventDefault()} onClick={() => insert('    ')}>↳ <small>INDENT</small></button>{['=', '(', ')', ':', '"', '\'', '[', ']'].map(k => <button key={k} onMouseDown={e => e.preventDefault()} onClick={() => insert(k)}>{k}</button>)}</div><div className="editor-actions"><button className="hint-btn" onClick={() => setShowHint(!showHint)}><HelpCircle size={15}/> {showHint ? 'HIDE HINT' : 'HINT'}</button><button className="run-btn" onClick={run} disabled={checking}><Play size={14} fill="currentColor"/>{checking ? 'STARTING PYTHON' : 'RUN CODE'}</button></div>{showHint && <div className="hint">{q.hint}</div>}</div><div className="output-card"><div className="output-label"><Terminal size={14}/> OUTPUT <span>{checking ? 'STARTING PYTHON' : error ? 'ERROR' : output ? 'READY' : 'AWAITING EXECUTION'}</span></div><pre className={error ? 'error' : ''}>{error || output || 'Your result will appear here.'}</pre></div>{progress.done.includes(q.id) ? <button className="continue-btn" onClick={() => q.id === questions.length ? setActive(null) : openQuestion(q.id + 1)}>{q.id === questions.length ? 'RETURN TO MAP' : 'NEXT LEVEL'}<ChevronRight size={16}/></button> : <div className="goal-note">Run a solution that produces the expected result <span>+{q.xp} essence</span></div>}</section> : <>
      <section className="hero"><div className="hero-copy"><div className="eyebrow">A 1000-LEVEL PYTHON ODYSSEY</div><h1>Find your way<br/><em>through the dark.</em></h1><p>Fifty episodes. A thousand small programs. Your path is yours to choose.</p><div className="hero-meta"><span>{progress.done.length} / 1000 TRACES LIT</span><span className="dot"/><span>{progress.xp} ESSENCE</span></div></div><div className="moon-art"><div className="orbit orbit-a"/><div className="orbit orbit-b"/><div className="moon"/><div className="star s1"/><div className="star s2"/><div className="star s3"/></div></section>
      <section className="journey"><div className="section-title"><div><div className="eyebrow">THE PATH BELOW</div><h2>50 episodes · 1000 levels</h2></div><div className="progress-count">{progress.done.length}<span> / 1000</span></div></div>
        <div className="episode-list">{groups.map((group, gi) => { const episode = 50 - gi; const tint = episodePalette[(episode - 1) % episodePalette.length]; return <article className="episode-block" key={episode} style={{ '--episode-color': tint } as React.CSSProperties}><header className="episode-heading"><span className="episode-number">EPISODE {String(episode).padStart(2, '0')}</span><h3>{episodeNames[episode - 1]}</h3><span className="episode-range">LEVELS {String(group[0].id).padStart(3, '0')} TO {String(group[group.length - 1].id).padStart(3, '0')}</span></header><div className="level-grid">{group.slice().reverse().map(item => <button key={item.id} className={`level-node ${progress.done.includes(item.id) ? 'complete' : ''}`} onClick={() => openQuestion(item.id)} aria-label={`Open level ${item.id}: ${item.title}`}><span>{String(item.id).padStart(3, '0')}</span>{progress.done.includes(item.id) && <Check size={12}/>}</button>)}</div></article>; })}</div>
        <button className="start-card" onClick={() => openQuestion(firstQuestion.id)}><span className="resume-icon"><Play size={16} fill="currentColor"/></span><span><small>START FROM THE BEGINNING</small><b>Level 001 · {firstQuestion.title}</b></span><span className="start-label">START</span></button>
      </section><footer className="footer">NOCTILUCA <span>·</span> FIFTY EPISODES · ONE THOUSAND TRACES</footer>
    </>}
    {install && <button className="toast" onClick={installPrompt ? installApp : () => setInstall(false)}><span>{installPrompt ? 'Install Noctiluca' : 'On iPhone: Share, then Add to Home Screen'}</span>{installPrompt ? <ChevronRight size={15}/> : <X size={15}/>}</button>}
  </main>;
}

const episodeNames = ['FIRST LIGHT','ORBIT','UMBRA','ECLIPSE','AFTERGLOW','GRAVE GARDEN','GLASS TIDE','BLACK COMET','HOLLOW STAR','NIGHT ENGINE','ASHEN ARCHIVE','MOONLESS SEA','PALE CONSTELLATION','THE DEEP','SILENT SIGNAL','FROST CIRCUIT','VEIL OF STATIC','DARK MATTER','WITCHING HOUR','THE VOID','CINDER PATH','MIRROR WORLD','GHOST FREQUENCY','COLD SUN','OBSIDIAN GATE','DREAM MACHINE','THORNED SKY','DUSK ENGINE','STARLESS','THE UNDERWORLD','WOLFSBANE','DROWNED CITY','NIGHT BLOOM','IRON MOON','ECHO CHAMBER','THE LAST ORBIT','DUST TEMPLE','BLACK RAIN','SABLE GARDEN','AFTERIMAGE','THE DEEP FIELD','HOLLOW CROWN','GLOAM','NOCTURNE','THE VEILED','GRAVITY WELL','DARKLING','FINAL SIGNAL','ZERO HOUR','AFTERGLOW'];

