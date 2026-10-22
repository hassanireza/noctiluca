import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.mjs';

export type WorkerIn = { type: 'warm' } | { type: 'run'; id: number; code: string; target: string; test?: string };
export type WorkerOut =
  | { type: 'ready' }
  | { type: 'running'; id: number }
  | { type: 'result'; id: number; actual: string; expected: string; solved: boolean }
  | { type: 'error'; id: number; message: string };

let runtime: Promise<any> | null = null;
const boot = () => (runtime ??= loadPyodide().catch((e: unknown) => { runtime = null; throw e; }));
const post = (m: WorkerOut) => (self as unknown as Worker).postMessage(m);

/** Run source in a brand-new namespace so one run can never leak names into the next (or into the answer key). */
async function exec(py: any, source: string, test?: string) {
  let out = '';
  py.setStdout({ batched: (s: string) => { out += `${s}\n`; } });
  py.setStderr({ batched: (s: string) => { out += `${s}\n`; } });
  py.setStdin({ stdin: () => undefined });
  const ns = py.globals.get('dict')();
  try { await py.runPythonAsync(source + (test ? `\n${test}` : ''), { globals: ns }); }
  finally { ns.destroy(); }
  return out.trimEnd();
}

self.onmessage = async (event: MessageEvent<WorkerIn>) => {
  const msg = event.data;
  if (msg.type === 'warm') { try { await boot(); post({ type: 'ready' }); } catch { /* surfaced on the next run */ } return; }
  try {
    const py = await boot();
    post({ type: 'ready' });
    post({ type: 'running', id: msg.id });
    const actual = await exec(py, msg.code, msg.test);
    const expected = await exec(py, msg.target, msg.test);
    post({ type: 'result', id: msg.id, actual, expected, solved: actual === expected });
  } catch (error) {
    const text = String((error as Error)?.message ?? error).replace(/^PythonError:\s*/, '').trimEnd();
    post({ type: 'error', id: msg.id, message: text.split('\n').slice(-4).join('\n') });
  }
};
