import type { WorkerIn, WorkerOut } from './python.worker';

export type RunResult = { actual: string; expected: string; solved: boolean };
export type RuntimeState = 'idle' | 'loading' | 'ready';

const LOAD_LIMIT = 120_000; // first launch downloads ~10 MB
const RUN_LIMIT = 8_000;    // protects against `while True:`

let worker: Worker | null = null;
let state: RuntimeState = 'idle';
let nextId = 1;
let pending: { id: number; resolve: (r: RunResult) => void; reject: (e: Error) => void; timer: number } | null = null;
const listeners = new Set<(s: RuntimeState) => void>();
const setState = (s: RuntimeState) => { state = s; listeners.forEach((l) => l(s)); };

export const runtimeState = () => state;
export function subscribeRuntime(fn: (s: RuntimeState) => void) { listeners.add(fn); return () => { listeners.delete(fn); }; }

function kill(reason?: Error) {
  worker?.terminate(); worker = null; setState('idle');
  if (pending) { window.clearTimeout(pending.timer); pending.reject(reason ?? new Error('cancelled')); pending = null; }
}

function spawn() {
  if (worker) return worker;
  worker = new Worker(new URL('./python.worker.ts', import.meta.url), { type: 'module' });
  worker.onmessage = (e: MessageEvent<WorkerOut>) => {
    const m = e.data;
    if (m.type === 'ready') { setState('ready'); return; }
    if (!pending || ('id' in m && m.id !== pending.id)) return;
    if (m.type === 'running') { window.clearTimeout(pending.timer); pending.timer = window.setTimeout(() => kill(new Error('TIMEOUT_RUN')), RUN_LIMIT); return; }
    window.clearTimeout(pending.timer);
    const p = pending; pending = null;
    if (m.type === 'result') p.resolve({ actual: m.actual, expected: m.expected, solved: m.solved });
    else p.reject(new Error(m.message));
  };
  worker.onerror = () => kill(new Error('START_FAILED'));
  return worker;
}

/** Start downloading Python while the learner reads the prompt, so Run feels instant. */
export function warmUp() { if (state === 'idle') { setState('loading'); spawn().postMessage({ type: 'warm' } satisfies WorkerIn); } }

export function cancelRun() { if (pending) kill(); }

export function runPython(req: { code: string; target: string; test?: string }): Promise<RunResult> {
  if (pending) kill();
  if (state === 'idle') setState('loading');
  const w = spawn();
  return new Promise<RunResult>((resolve, reject) => {
    const id = nextId++;
    pending = { id, resolve, reject, timer: window.setTimeout(() => kill(new Error('TIMEOUT_LOAD')), LOAD_LIMIT) };
    w.postMessage({ type: 'run', id, ...req } satisfies WorkerIn);
  });
}
