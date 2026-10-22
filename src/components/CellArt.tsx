import { useId } from 'react';

/** The Noctiluca mark: a bioluminescent cell with orbit rings. Used for the brand, the hero and empty states. */
export function CellArt({ size = 120, rings = true, className = '' }: { size?: number; rings?: boolean; className?: string }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg className={className} width={size} height={size} viewBox="-400 -400 800 800" aria-hidden="true" focusable="false">
      <defs>
        <radialGradient id={`h${id}`}><stop offset="0" stopColor="#3fd6f0" stopOpacity=".55" /><stop offset=".5" stopColor="#1b8fb0" stopOpacity=".16" /><stop offset="1" stopColor="#1b8fb0" stopOpacity="0" /></radialGradient>
        <radialGradient id={`c${id}`} cx="38%" cy="34%" r="75%"><stop offset="0" stopColor="#eafdff" /><stop offset=".38" stopColor="#7defff" /><stop offset="1" stopColor="#1a8fb4" /></radialGradient>
      </defs>
      <circle r="330" fill={`url(#h${id})`} />
      {rings && <>
        <ellipse className="cell-ring a" rx="318" ry="214" transform="rotate(-24)" fill="none" stroke="#8ff3ff" strokeOpacity=".4" strokeWidth="5" />
        <ellipse className="cell-ring b" rx="226" ry="166" transform="rotate(38)" fill="none" stroke="#8ff3ff" strokeOpacity=".22" strokeWidth="4" />
        <path d="M-236 128 L-84 54 L150 -22 L262 -178" fill="none" stroke="#bff8ff" strokeOpacity=".32" strokeWidth="4" strokeLinecap="round" strokeDasharray="2 14" />
      </>}
      <circle className="cell-core" r="118" fill={`url(#c${id})`} />
      <circle cx="-34" cy="-38" r="30" fill="#fff" fillOpacity=".75" />
      {rings && <g fill="#d9fbff"><circle cx="-236" cy="128" r="14" className="twinkle" /><circle cx="150" cy="-22" r="10" opacity=".8" /><circle cx="262" cy="-178" r="17" className="twinkle t2" /></g>}
    </svg>
  );
}
