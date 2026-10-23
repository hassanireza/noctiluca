import { Undo2 } from 'lucide-react';
import type { ReactNode } from 'react';
import type { EditorHandle } from './CodeEditor';

const KEYS = ['=', '(', ')', ':', '"', "'", '[', ']', '{', '}', ',', '.', '+', '-', '*', '/', '%', '#', '<', '>', '_'];
/** Keep the keyboard (and editor focus) alive when a toolbar button is pressed. */
export const keepFocus = (e: { preventDefault: () => void }) => e.preventDefault();

/** One slim row glued above the keyboard: code symbols on the left, the primary action pinned on the right. */
export function Accessory({ editor, action }: { editor: React.RefObject<EditorHandle | null>; action: ReactNode }) {
  return (
    <div className="accessory">
      <div className="keys" role="toolbar" aria-label="Code symbols">
        <button className="key wide" onPointerDown={keepFocus} onClick={() => editor.current?.insert('    ')} aria-label="Indent four spaces">⇥</button>
        <button className="key" onPointerDown={keepFocus} onClick={() => editor.current?.undo()} aria-label="Undo"><Undo2 size={16} /></button>
        {KEYS.map((k) => <button key={k} className="key" onPointerDown={keepFocus} onClick={() => editor.current?.insert(k)}>{k}</button>)}
      </div>
      {action}
    </div>
  );
}
