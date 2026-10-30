// Utilidades compartidas por render.mjs, cuadros.mjs y revisar.mjs.
import fs from 'node:fs';
import { spawn, spawnSync } from 'node:child_process';

/** Busca Chrome/Edge instalado (o usa la variable CHROME). */
export function chrome() {
  const candidatos = [
    process.env.CHROME,
    'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
    'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
    `${process.env.LOCALAPPDATA}\\Google\\Chrome\\Application\\chrome.exe`,
    'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
    '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    '/usr/bin/google-chrome', '/usr/bin/google-chrome-stable', '/usr/bin/chromium', '/usr/bin/chromium-browser',
  ].filter(Boolean);
  const ok = candidatos.find((p) => fs.existsSync(p));
  if (!ok) throw new Error('No encontré Chrome. Instalalo o poné la ruta en la variable CHROME.');
  return ok;
}

export function hayFfmpeg() {
  const r = spawnSync('ffmpeg', ['-version'], { stdio: 'ignore' });
  if (r.error) throw new Error('No encontré ffmpeg en el PATH. Windows: winget install Gyan.FFmpeg  ·  Mac: brew install ffmpeg');
}

export const ffmpeg = (args) => new Promise((res, rej) => {
  const p = spawn('ffmpeg', ['-y', '-hide_banner', '-loglevel', 'error', ...args], { stdio: ['ignore', 'inherit', 'inherit'] });
  p.on('exit', (c) => (c === 0 ? res() : rej(new Error(`ffmpeg salió con ${c}`))));
});

export const LANZAR = { headless: true, args: ['--hide-scrollbars', '--allow-file-access-from-files', '--autoplay-policy=no-user-gesture-required'] };
