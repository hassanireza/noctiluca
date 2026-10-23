import { useId } from 'react';

/** Small, crisp brand tile for the header (a tiny version of the app icon). Pure vector strokes: no blur filters,
 *  so it stays sharp on 3x iPhone screens and in standalone mode. */
export function LogoMark({ size = 30 }: { size?: number }) {
  const id = useId().replace(/:/g, '');
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden="true" focusable="false" shapeRendering="geometricPrecision" style={{ display: 'block', flex: 'none' }}>
      <defs>
        <linearGradient id={`g${id}`} x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#0f3a52" /><stop offset="1" stopColor="#030a12" /></linearGradient>
        <radialGradient id={`o${id}`} cx="36%" cy="32%" r="75%"><stop offset="0" stopColor="#f4feff" /><stop offset=".45" stopColor="#7defff" /><stop offset="1" stopColor="#1a8fb4" /></radialGradient>
      </defs>
      <rect x=".5" y=".5" width="31" height="31" rx="8" fill={`url(#g${id})`} stroke="#8ff3ff" strokeOpacity=".3" />
      <ellipse cx="16" cy="16" rx="11.6" ry="7.4" transform="rotate(-24 16 16)" fill="none" stroke="#8ff3ff" strokeOpacity=".65" strokeWidth="1.2" />
      <circle cx="16" cy="16" r="5.2" fill={`url(#o${id})`} />
      <circle cx="14.4" cy="14.3" r="1.3" fill="#fff" fillOpacity=".9" />
      <circle cx="7.4" cy="19.9" r="1.1" fill="#d9fbff" />
      <circle cx="24.6" cy="10.3" r="1.4" fill="#d9fbff" />
    </svg>
  );
}
