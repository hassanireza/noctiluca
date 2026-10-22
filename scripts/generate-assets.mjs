// Generates every raster brand asset (home-screen icons, favicons, iOS splash screens)
// from one vector definition.  Run with:  npm run assets
import sharp from 'sharp';
import { writeFileSync, mkdirSync } from 'node:fs';

const OUT = new URL('../public/', import.meta.url).pathname;
mkdirSync(OUT + 'splash', { recursive: true });

/** The Noctiluca mark: a glowing plankton cell, its orbit, and a small constellation. */
const glyph = (cx, cy, s) => `
  <g transform="translate(${cx} ${cy}) scale(${s})">
    <circle r="330" fill="url(#halo)"/>
    <ellipse rx="318" ry="214" transform="rotate(-24)" fill="none" stroke="#8ff3ff" stroke-opacity=".38" stroke-width="5"/>
    <ellipse rx="226" ry="166" transform="rotate(38)" fill="none" stroke="#8ff3ff" stroke-opacity=".20" stroke-width="4"/>
    <path d="M-236 128 L-84 54 L150 -22 L262 -178" fill="none" stroke="#bff8ff" stroke-opacity=".30" stroke-width="4" stroke-linecap="round" stroke-dasharray="2 14"/>
    <circle r="118" fill="url(#cell)" filter="url(#bloom)"/>
    <circle cx="-34" cy="-38" r="30" fill="#ffffff" fill-opacity=".75"/>
    <g fill="#d9fbff">
      <circle cx="-236" cy="128" r="14" filter="url(#bloom)"/>
      <circle cx="150" cy="-22" r="10" opacity=".8"/>
      <circle cx="262" cy="-178" r="17" filter="url(#bloom)"/>
    </g>
  </g>`;

const defs = `
  <defs>
    <radialGradient id="sea" cx="50%" cy="42%" r="75%">
      <stop offset="0" stop-color="#0d3347"/><stop offset=".55" stop-color="#06131f"/><stop offset="1" stop-color="#02060c"/>
    </radialGradient>
    <radialGradient id="halo"><stop offset="0" stop-color="#3fd6f0" stop-opacity=".55"/><stop offset=".5" stop-color="#1b8fb0" stop-opacity=".16"/><stop offset="1" stop-color="#1b8fb0" stop-opacity="0"/></radialGradient>
    <radialGradient id="cell" cx="38%" cy="34%" r="75%">
      <stop offset="0" stop-color="#eafdff"/><stop offset=".38" stop-color="#7defff"/><stop offset="1" stop-color="#1a8fb4"/>
    </radialGradient>
    <filter id="bloom" x="-80%" y="-80%" width="260%" height="260%"><feGaussianBlur stdDeviation="14" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
  </defs>`;

const specks = (size) => {
  // deterministic "plankton sparkle" dots so the art is identical on every build
  let seed = 7; const rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
  return Array.from({ length: 34 }, () => {
    const x = rnd() * size, y = rnd() * size, r = 1.2 + rnd() * 3.2;
    return `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="${r.toFixed(1)}" fill="#9cf3ff" opacity="${(0.15 + rnd() * 0.45).toFixed(2)}"/>`;
  }).join('');
};

const iconSvg = ({ size = 1024, glyphScale = 1, rounded = false } = {}) => `
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 1024 1024">${defs}
  <rect width="1024" height="1024" ${rounded ? 'rx="228"' : ''} fill="url(#sea)"/>
  ${specks(1024)}
  ${glyph(512, 512, 0.98 * glyphScale)}
</svg>`;

const splashSvg = (w, h) => {
  const s = (Math.min(w, h) * 0.46) / 1024 / 0.98 * 1.0;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">${defs}
  <rect width="${w}" height="${h}" fill="url(#sea)"/>
  <g transform="translate(0 0)">${Array.from({ length: 46 }, (_, i) => { const r = ((i * 9301 + 49297) % 233280) / 233280, q = ((i * 4271 + 1337) % 233280) / 233280; return `<circle cx="${(r * w).toFixed(0)}" cy="${(q * h).toFixed(0)}" r="${(1 + r * 2.4).toFixed(1)}" fill="#9cf3ff" opacity="${(0.12 + q * 0.4).toFixed(2)}"/>`; }).join('')}</g>
  ${glyph(w / 2, h * 0.45, s)}
</svg>`;
};

const png = (svg, file, w, h) => sharp(Buffer.from(svg)).resize(w, h).flatten({ background: '#02060c' }).png({ compressionLevel: 9 }).toFile(OUT + file);

// --- icons --------------------------------------------------------------------
writeFileSync(OUT + 'favicon.svg', iconSvg({ rounded: true }).trim());
await png(iconSvg(), 'apple-touch-icon.png', 180, 180);           // iOS Home Screen (opaque, iOS rounds it)
await png(iconSvg(), 'icon-192.png', 192, 192);
await png(iconSvg(), 'icon-512.png', 512, 512);
await png(iconSvg({ glyphScale: 0.72 }), 'icon-maskable-512.png', 512, 512); // Android adaptive-icon safe zone
await png(iconSvg({ rounded: true }), 'favicon-32.png', 32, 32);

// --- iOS splash screens (portrait, device pixels) ---------------------------------
const devices = [
  [1320, 2868, 440, 956, 3], [1206, 2622, 402, 874, 3], [1260, 2736, 420, 912, 3],
  [1290, 2796, 430, 932, 3], [1179, 2556, 393, 852, 3], [1284, 2778, 428, 926, 3],
  [1170, 2532, 390, 844, 3], [1125, 2436, 375, 812, 3], [1242, 2688, 414, 896, 3],
  [828, 1792, 414, 896, 2], [1242, 2208, 414, 736, 3], [750, 1334, 375, 667, 2], [640, 1136, 320, 568, 2],
];
const links = [];
for (const [pw, ph, w, h, r] of devices) {
  const name = `splash/splash-${pw}x${ph}.png`;
  await png(splashSvg(pw, ph), name, pw, ph);
  links.push(`<link rel="apple-touch-startup-image" media="(device-width: ${w}px) and (device-height: ${h}px) and (-webkit-device-pixel-ratio: ${r}) and (orientation: portrait)" href="%BASE_URL%${name}" />`);
}
writeFileSync(new URL('./splash-links.html', import.meta.url).pathname, links.join('\n'));
console.log('assets written:', devices.length, 'splash screens + icons');
