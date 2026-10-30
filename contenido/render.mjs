// Renderiza las piezas de Instagram (carruseles 1080x1350, historias 1080x1920, perfil y destacadas 1080x1080) a PNG.
// Uso: node contenido/render.mjs contenido/<semana>     (la carpeta tiene un piezas.mjs que exporta POSTS e HISTORIAS)
// Las capturas de la app van en contenido/capturas/ y se usan con  captura: 'archivo.png'.
import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { chrome, LANZAR } from '../motor/comun.mjs';

const AQUI = path.dirname(fileURLToPath(import.meta.url));
if (!process.argv[2]) { console.log('Uso: node contenido/render.mjs contenido/<semana>'); process.exit(1); }
const DIR = path.resolve(process.argv[2]);
const { POSTS = [], HISTORIAS = [], PERFIL = true } = await import(pathToFileURL(path.join(DIR, 'piezas.mjs')).href);
const OUT = path.join(DIR, 'png');
// Se sobrescriben los PNG (no se borra la carpeta: OneDrive suele tenerla tomada).
fs.mkdirSync(OUT, { recursive: true });

const browser = await puppeteer.launch({ executablePath: chrome(), ...LANZAR });
const page = await browser.newPage();
const errores = [];
page.on('pageerror', (e) => errores.push(e.message));
await page.goto(pathToFileURL(path.join(AQUI, 'plantilla.html')).href, { waitUntil: 'networkidle0' });
await page.evaluate(() => document.fonts.ready);

async function foto(slide, meta, archivo, alto) {
  await page.setViewport({ width: 1080, height: alto, deviceScaleFactor: 1 });
  await page.evaluate((s, m) => window.render(s, m), slide, meta);
  await page.evaluate(() => Promise.all([...document.images].map((i) => (i.complete ? 0 : new Promise((r) => { i.onload = i.onerror = r; })))));
  fs.mkdirSync(path.dirname(archivo), { recursive: true });
  await page.screenshot({ path: archivo, clip: { x: 0, y: 0, width: 1080, height: alto } });
}

let n = 0;
for (const p of POSTS) {
  for (let i = 0; i < p.slides.length; i++) {
    await foto(p.slides[i], { formato: 'post', i, total: p.slides.length }, path.join(OUT, 'posts', p.id, `${String(i + 1).padStart(2, '0')}.png`), 1350);
    n++;
  }
}
for (const h of HISTORIAS) {
  await foto({ ...h, tipo: 'historia' }, { formato: 'story', i: 0, total: 1 }, path.join(OUT, 'historias', `${h.id}.png`), 1920);
  n++;
}
// Foto de perfil y portadas de destacadas (el robot centrado; Instagram recorta en círculo)
if (PERFIL) {
  for (const [archivo, expr, fondo] of [['perfil.png', 'feliz', '#5B3DF5'], ['destacada-como-funciona.png', 'feliz', '#0A0E1E'], ['destacada-preguntas.png', 'pensando', '#0A0E1E']]) {
    await page.setViewport({ width: 1080, height: 1080, deviceScaleFactor: 1 });
    await page.evaluate((e, f) => {
      const s = document.getElementById('s');
      s.className = '';
      s.style.cssText = `width:1080px;height:1080px;display:grid;place-items:center;background:radial-gradient(700px 700px at 50% 40%,#7A5CFF55,transparent 70%),${f}`;
      s.innerHTML = `<div style="width:860px;height:860px;margin:60px 0 0 40px">${window.robotSvg(e)}</div>`;
    }, expr, fondo);
    await page.screenshot({ path: path.join(OUT, archivo), clip: { x: 0, y: 0, width: 1080, height: 1080 } });
    await page.evaluate(() => { document.getElementById('s').style.cssText = ''; });
    n++;
  }
}
await browser.close();
if (errores.length) console.log('ERRORES en la plantilla:\n- ' + errores.join('\n- '));
console.log(`${n} piezas en ${path.relative(process.cwd(), OUT)}`);
