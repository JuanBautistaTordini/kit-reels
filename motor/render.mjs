// Renderiza un reel cuadro por cuadro a MP4 1080x1920 60 fps con voz + efectos sutiles.
// Uso: node motor/render.mjs reels/<reel> [--rapido]
//   --rapido: 30 fps y calidad menor, para revisar (no para publicar)
// Salida: reels/<reel>/salida/<reel>-9x16.mp4  y  <reel>-liviano.mp4 (720p, ~2-3 MB, para WhatsApp / DM)
import puppeteer from 'puppeteer-core';
import { spawn } from 'node:child_process';
import path from 'node:path';
import fs from 'node:fs';
import { pathToFileURL } from 'node:url';
import { armar } from './armar.mjs';
import { chrome, ffmpeg, hayFfmpeg, LANZAR } from './comun.mjs';

const dirArg = process.argv[2];
if (!dirArg) { console.log('Uso: node motor/render.mjs reels/<reel> [--rapido]'); process.exit(1); }
const RAPIDO = process.argv.includes('--rapido');
const FPS = RAPIDO ? 30 : 60;
hayFfmpeg();
const { salida: html } = armar(dirArg);
const DIR = path.dirname(html);
const NOMBRE = path.basename(DIR);
fs.mkdirSync(path.join(DIR, 'salida'), { recursive: true });
const SALIDA = path.join(DIR, 'salida', `${NOMBRE}-9x16${RAPIDO ? '-borrador' : ''}.mp4`);

const browser = await puppeteer.launch({ executablePath: chrome(), ...LANZAR });
const page = await browser.newPage();
const errores = [];
page.on('pageerror', (e) => errores.push(e.message));
page.on('console', (m) => { if (m.type() === 'error' || m.type() === 'warning') errores.push(m.text()); });
await page.setViewport({ width: 1080, height: 1920, deviceScaleFactor: 1 });
await page.goto(pathToFileURL(html).href + '?render', { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);
if (errores.length) { console.log('Errores en reel.html (corregilos antes de renderizar):\n- ' + errores.join('\n- ')); await browser.close(); process.exit(1); }

const info = await page.evaluate(() => ({ fin: window.DURACION, cortes: window.CORTES || [], ...window.SFX }));
const total = Math.ceil(info.fin * FPS);
console.log(`${NOMBRE}: ${info.fin.toFixed(2)} s → ${total} cuadros a ${FPS} fps`);

// 1) Audio: colchón tonal muy bajo + efectos (aevalsrc) mezclado con la voz.
// Cada efecto usa max(t-T,0) en el exponente: sin eso, antes de T da inf*0 = NaN y satura toda la mezcla.
const f = (x) => x.toFixed(3);
const desde = (T) => `max(t-${f(T)},0)`;
const e = [];
e.push('0.014*(sin(2*PI*110*t)+0.6*sin(2*PI*164.81*t)+0.45*sin(2*PI*220*t)+0.25*sin(2*PI*329.63*t))*(0.8+0.2*sin(2*PI*0.15*t))');
for (const T of [0.05, info.cierre - .05]) e.push(`0.45*sin(2*PI*(38+70*exp(-18*${desde(T)}))*t)*exp(-3.5*${desde(T)})*gte(t,${f(T)})`);
for (const T of info.whoosh || []) e.push(`0.07*(random(0)*2-1)*exp(-pow((t-${f(T)})/0.18,2))`);
for (const T of info.clicks || []) e.push(`0.12*sin(2*PI*1750*t)*exp(-80*${desde(T)})*between(t,${f(T)},${f(T + .09)})`);
for (const T of info.golpes || []) e.push(`(0.40*sin(2*PI*62*t)+0.10*(random(1)*2-1))*exp(-11*${desde(T)})*between(t,${f(T)},${f(T + .5)})`);
for (const T of info.errores || []) e.push(`0.05*sgn(sin(2*PI*150*t))*between(t,${f(T)},${f(T + .25)})`);
e.push(`0.07*(sin(2*PI*880*t)+0.7*sin(2*PI*1318.5*t))*exp(-3*${desde(info.cierre)})*between(t,${f(info.cierre)},${f(info.cierre + 2)})`);
// La voz se corta en los mismos puntos que las pausas de config.json y cada tramo se corre con adelay.
const tramos = [];
let ini = 0, off = 0;
for (const c of [...info.cortes, { t: 1e6, d: 0 }]) { tramos.push({ ini, fin: c.t, off }); ini = c.t; off += c.d; }
const vozFiltro = tramos.map((s, k) => `[1]atrim=start=${f(s.ini)}${s.fin < 1e5 ? `:end=${f(s.fin)}` : ''},asetpts=PTS-STARTPTS,aresample=44100,adelay=${Math.round((s.ini + s.off) * 1000)}:all=1[v${k}]`).join(';');
const audio = path.join(DIR, 'salida', `audio-temp.m4a`);
await ffmpeg([
  '-f', 'lavfi', '-i', `aevalsrc='${e.join('+')}':s=44100:d=${info.fin.toFixed(2)}`,
  '-i', path.join(DIR, 'voz.mp3'),
  '-filter_complex', `${vozFiltro};${tramos.map((_, k) => `[v${k}]`).join('')}amix=inputs=${tramos.length}:normalize=0,volume=1.2[v];` +
    '[0]afade=t=out:st=' + (info.fin - 1.2).toFixed(2) + ':d=1.2[m];[m][v]amix=inputs=2:normalize=0:duration=first,loudnorm=I=-14:TP=-1.5:LRA=9,aformat=channel_layouts=stereo[a]',
  '-map', '[a]', '-ar', '44100', '-c:a', 'aac', '-b:a', '192k', audio,
]);

// 2) Video: un screenshot por cuadro, directo a ffmpeg por pipe.
const proc = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
  '-i', audio, '-map', '0:v', '-map', '1:a', '-c:v', 'libx264', '-preset', RAPIDO ? 'veryfast' : 'slow', '-crf', RAPIDO ? '24' : '18', '-pix_fmt', 'yuv420p',
  '-profile:v', 'high', '-movflags', '+faststart', '-c:a', 'copy', '-shortest', SALIDA], { stdio: ['pipe', 'inherit', 'inherit'] });
const listo = new Promise((res, rej) => proc.on('exit', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg ${c}`)))));
const t0 = Date.now();
for (let k = 0; k < total; k++) {
  await page.evaluate((t) => window.render(t), k / FPS);
  const buf = await page.screenshot({ type: 'jpeg', quality: RAPIDO ? 80 : 92, optimizeForSpeed: true });
  if (!proc.stdin.write(buf)) await new Promise((r) => proc.stdin.once('drain', r));
  if (k % (FPS * 5) === 0) console.log(`cuadro ${k}/${total} (${((Date.now() - t0) / 1000).toFixed(0)} s)`);
}
proc.stdin.end();
await listo;
await browser.close();
fs.rmSync(audio, { force: true });
console.log(`Listo: ${path.relative(process.cwd(), SALIDA)}`);

// 3) Versión liviana para mandar por WhatsApp / DM (sin links, pesa poco).
if (!RAPIDO) {
  const liviano = path.join(DIR, 'salida', `${NOMBRE}-liviano.mp4`);
  await ffmpeg(['-i', SALIDA, '-vf', 'scale=720:1280', '-r', '30', '-c:v', 'libx264', '-preset', 'slow', '-crf', '30', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', '-c:a', 'aac', '-b:a', '96k', liviano]);
  console.log(`Liviano: ${path.relative(process.cwd(), liviano)} (${(fs.statSync(liviano).size / 1e6).toFixed(1)} MB)`);
}
console.log(`Revisalo con: node motor/revisar.mjs ${path.relative(process.cwd(), SALIDA)}`);
