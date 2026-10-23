import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.mjs';

export type WorkerIn =
  | { type: 'warm' }
  | { type: 'run'; id: number; code: string; target: string; test?: string }
  | { type: 'exec'; id: number; code: string; stdin: string };
export type WorkerOut =
  | { type: 'ready' }
  | { type: 'running'; id: number }
  | { type: 'result'; id: number; actual: string; expected: string; solved: boolean }
  | { type: 'exec-result'; id: number; output: string; error?: string; ms: number }
  | { type: 'error'; id: number; message: string };

const OUTPUT_CAP = 200_000; // an endless print loop must not eat the phone's memory
let runtime: Promise<any> | null = null;
const boot = () => (runtime ??= loadPyodide().catch((e: unknown) => { runtime = null; throw e; }));
const post = (m: WorkerOut) => (self as unknown as Worker).postMessage(m);

/** Pyodide tracebacks start with its own internal frames. Keep only the learner's frames and show "main.py". */
export function cleanTraceback(raw: string): string {
  const out: string[] = []; let keep = true;
  for (const line of raw.replace(/\s+$/, '').split('\n')) {
    const frame = /^\s+File "(.*)", line \d+/.exec(line);
    if (frame) { keep = !frame[1].includes('_pyodide') && !frame[1].startsWith('/lib/python'); if (keep) out.push(line); continue; }
    if (/^\s{4,}/.test(line)) { if (keep) out.push(line); continue; }
    keep = true; out.push(line);
  }
  if (/^(SyntaxError|IndentationError|TabError)/.test(out[out.length - 1] ?? '')) { if (out[0]?.startsWith('Traceback')) out.shift(); }
  return out.join('\n').replace(/File "<exec>"/g, 'File "main.py"');
}

/** Runs source in a brand-new namespace and returns everything it printed (prompts and typed answers included). */
async function exec(py: any, source: string, stdin = ''): Promise<{ output: string; error?: string }> {
  let output = '';
  const decOut = new TextDecoder(), decErr = new TextDecoder();
  const add = (s: string) => { if (output.length < OUTPUT_CAP) output += s; else if (!output.endsWith('…(output truncated)\n')) output += '\n…(output truncated)\n'; };
  py.setStdout({ write: (b: Uint8Array) => { add(decOut.decode(b, { stream: true })); return b.length; } });
  py.setStderr({ write: (b: Uint8Array) => { add(decErr.decode(b, { stream: true })); return b.length; } });
  const lines = stdin ? stdin.replace(/\r/g, '').replace(/\n$/, '').split('\n') : [];
  py.setStdin({ stdin: () => { if (!lines.length) return undefined; const l = lines.shift() as string; add(`${l}\n`); return l; } });
  const ns = py.globals.get('dict')();
  try { await py.runPythonAsync(source, { globals: ns }); return { output }; }
  catch (e) { return { output, error: cleanTraceback(String((e as Error)?.message ?? e).replace(/^PythonError:\s*/, '')) }; }
  finally { ns.destroy(); }
}

self.onmessage = async (event: MessageEvent<WorkerIn>) => {
  const msg = event.data;
  if (msg.type === 'warm') { try { await boot(); post({ type: 'ready' }); } catch { /* surfaced on the next run */ } return; }
  try {
    const py = await boot();
    post({ type: 'ready' });
    post({ type: 'running', id: msg.id });
    if (msg.type === 'exec') {
      const t0 = performance.now();
      const r = await exec(py, msg.code, msg.stdin);
      post({ type: 'exec-result', id: msg.id, output: r.output, error: r.error, ms: Math.round(performance.now() - t0) });
      return;
    }
    const mine = await exec(py, msg.code + (msg.test ? `\n${msg.test}` : ''));
    if (mine.error) { post({ type: 'error', id: msg.id, message: mine.error.split('\n').slice(-5).join('\n') }); return; }
    const key = await exec(py, msg.target + (msg.test ? `\n${msg.test}` : ''));
    const actual = mine.output.trimEnd(), expected = key.output.trimEnd();
    post({ type: 'result', id: msg.id, actual, expected, solved: actual === expected });
  } catch (error) {
    post({ type: 'error', id: msg.id, message: String((error as Error)?.message ?? error).split('\n').slice(-4).join('\n') });
  }
};
