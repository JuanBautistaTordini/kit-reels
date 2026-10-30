// Saca cuadros sueltos para revisar sin renderizar todo el video.
// Uso: node motor/cuadros.mjs reels/<reel>              -> cuadro 0 + uno por escena (mitad de cada escena) + el final
//      node motor/cuadros.mjs reels/<reel> 0 3.5 12.2   -> esos segundos
// Salida: reels/<reel>/cuadros/*.jpg  y  una hoja de contacto reels/<reel>/cuadros/hoja.jpg (todo junto)
import puppeteer from 'puppeteer-core';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { armar } from './armar.mjs';
import { chrome, ffmpeg, LANZAR } from './comun.mjs';

const dirArg = process.argv[2];
if (!dirArg) { console.log('Uso: node motor/cuadros.mjs reels/<reel> [segundos...]'); process.exit(1); }
const { salida: html } = armar(dirArg);
const OUT = path.join(path.dirname(html), 'cuadros');
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: chrome(), ...LANZAR });
const page = await browser.newPage();
const errores = [];
page.on('pageerror', (e) => errores.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errores.push(m.text()); });
await page.setViewport({ width: 1080, height: 1920 });
await page.goto(pathToFileURL(html).href + '?render', { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
let tiempos = process.argv.slice(3).map(Number);
if (!tiempos.length) {
  tiempos = await page.evaluate(() => {
    const V = window.VOZ_AJ;
    return [0, ...V.map((e) => (e.t0 + e.t1) / 2), V.at(-1).t1 + .5, window.DURACION - .05];
  });
}
const archivos = [];
for (const t of tiempos) {
  await page.evaluate((x) => window.render(x), t);
  const a = path.join(OUT, `t-${t.toFixed(2).padStart(6, '0')}.jpg`);
  await page.screenshot({ path: a, type: 'jpeg', quality: 85 });
  archivos.push(a);
}
await browser.close();
if (errores.length) console.log('ERRORES en la página:\n- ' + [...new Set(errores)].join('\n- '));
// Hoja de contacto: todos los cuadros en una sola imagen para mirarlos de un vistazo.
const cols = Math.min(5, archivos.length);
const filas = Math.ceil(archivos.length / cols);
await ffmpeg([...archivos.flatMap((a) => ['-i', a]), '-filter_complex',
  archivos.map((_, i) => `[${i}]scale=270:480[s${i}]`).join(';') + ';' + Array.from({ length: cols * filas }, (_, i) => (i < archivos.length ? `[s${i}]` : '')).join('') +
  `xstack=inputs=${archivos.length}:layout=${archivos.map((_, i) => `${(i % cols) * 270}_${Math.floor(i / cols) * 480}`).join('|')}:fill=black`,
  '-frames:v', '1', path.join(OUT, 'hoja.jpg')]);
console.log(`${archivos.length} cuadros en ${path.relative(process.cwd(), OUT)} (hoja.jpg = todos juntos). Segundos: ${tiempos.map((x) => x.toFixed(2)).join(', ')}`);
