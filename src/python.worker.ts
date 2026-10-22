import { loadPyodide } from 'https://cdn.jsdelivr.net/pyodide/v0.29.5/full/pyodide.mjs';

type RunRequest = { code: string; target: string; test?: string };
let runtime: ReturnType<typeof loadPyodide> | null = null;

self.onmessage = async (event: MessageEvent<RunRequest>) => {
  const { code, target, test = '' } = event.data;
  try {
    self.postMessage({ phase: 'loading' });
    runtime ??= loadPyodide();
    const py = await runtime;
    self.postMessage({ phase: 'running' });
    let output = '';
    py.setStdout({ batched: (line: string) => { output += `${line}\n`; } });
    py.setStderr({ batched: (line: string) => { output += `${line}\n`; } });
    await py.runPythonAsync(code + (test ? `\n${test}` : ''));
    const actual = output.trimEnd();
    output = '';
    await py.runPythonAsync(target + (test ? `\n${test}` : ''));
    const expected = output.trimEnd();
    self.postMessage({ output: actual || (test ? 'Correct. Your function is ready.' : 'Program finished with no output.'), solved: actual === expected });
  } catch (error) {
    self.postMessage({ error: String(error).replace(/^PythonError:\s*/, '').split('\n').slice(-3).join('\n') });
  }
};
