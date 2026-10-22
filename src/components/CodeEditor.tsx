import { forwardRef, useImperativeHandle, useRef } from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { indentUnit, syntaxHighlighting, HighlightStyle } from '@codemirror/language';
import { EditorView } from '@codemirror/view';
import { undo } from '@codemirror/commands';
import { tags as t } from '@lezer/highlight';

const night = EditorView.theme({
  '&': { backgroundColor: 'transparent', color: '#dbe9f2' },
  '.cm-content': { caretColor: '#6fe3f2', padding: '12px 0' },
  '.cm-cursor': { borderLeftColor: '#6fe3f2', borderLeftWidth: '2px' },
  '&.cm-focused .cm-selectionBackground, .cm-selectionBackground, ::selection': { backgroundColor: 'rgba(111,227,242,.22)' },
  '.cm-gutters': { backgroundColor: 'transparent', color: '#5b7487', border: 'none' },
  '.cm-matchingBracket': { backgroundColor: 'rgba(111,227,242,.2)', outline: 'none' },
}, { dark: true });

const ink = syntaxHighlighting(HighlightStyle.define([
  { tag: [t.keyword, t.controlKeyword, t.definitionKeyword, t.moduleKeyword], color: '#b79cff' },
  { tag: [t.string, t.special(t.string)], color: '#7df0c6' },
  { tag: [t.number, t.bool, t.null], color: '#ffcf86' },
  { tag: t.comment, color: '#5f7b8f', fontStyle: 'italic' },
  { tag: [t.function(t.variableName), t.function(t.propertyName), t.className], color: '#6fe3f2' },
  { tag: [t.operator, t.punctuation], color: '#8fb4ff' },
  { tag: t.self, color: '#ff9ec2' },
]));

export type EditorHandle = { insert: (text: string) => void; undo: () => void; blur: () => void };

/** CodeMirror configured for phones: no autocapitalise / autocorrect / smart quotes, 4-space indent, brand theme. */
export const CodeEditor = forwardRef<EditorHandle, { value: string; onChange: (v: string) => void }>(function CodeEditor({ value, onChange }, ref) {
  const view = useRef<EditorView | null>(null);
  useImperativeHandle(ref, () => ({
    insert(text) {
      const v = view.current; if (!v) return;
      const { from, to } = v.state.selection.main;
      v.dispatch({ changes: { from, to, insert: text }, selection: { anchor: from + text.length }, scrollIntoView: true, userEvent: 'input.type' });
      v.focus();
    },
    undo() { const v = view.current; if (v) { undo(v); v.focus(); } },
    blur() { view.current?.contentDOM.blur(); },
  }), []);

  return (
    <CodeMirror
      value={value}
      minHeight="168px"
      maxHeight="340px"
      onChange={onChange}
      onCreateEditor={(v) => { view.current = v; }}
      theme="none"
      extensions={[
        python(), night, ink, indentUnit.of('    '),
        EditorView.contentAttributes.of({ autocapitalize: 'off', autocorrect: 'off', autocomplete: 'off', spellcheck: 'false', 'aria-label': 'Python code editor', enterkeyhint: 'enter' }),
      ]}
      basicSetup={{ lineNumbers: true, foldGutter: false, highlightActiveLine: false, highlightActiveLineGutter: false, autocompletion: false, closeBrackets: false, searchKeymap: false }}
    />
  );
});
