// Control de calidad de un MP4 terminado: formato, duración, volumen y que el audio arranque en el segundo 0.
// Uso: node motor/revisar.mjs reels/<reel>/salida/<reel>-9x16.mp4
import { spawnSync } from 'node:child_process';

const mp4 = process.argv[2];
if (!mp4) { console.log('Uso: node motor/revisar.mjs <video.mp4>'); process.exit(1); }
const correr = (cmd, args) => { const r = spawnSync(cmd, args, { encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 }); return (r.stdout || '') + (r.stderr || ''); };

const probe = JSON.parse(correr('ffprobe', ['-v', 'error', '-show_streams', '-show_format', '-of', 'json', mp4]));
const v = probe.streams.find((s) => s.codec_type === 'video');
const a = probe.streams.find((s) => s.codec_type === 'audio');
const dur = Number(probe.format.duration);
const [n, d] = v.r_frame_rate.split('/').map(Number);
const problemas = [];
console.log(`Video: ${v.width}x${v.height} · ${(n / d).toFixed(0)} fps · ${dur.toFixed(1)} s · ${(Number(probe.format.size) / 1e6).toFixed(1)} MB`);
if (!a) problemas.push('No tiene audio');
if (v.width / v.height !== 9 / 16) problemas.push('No es 9:16');
if (dur > 60) problemas.push('Dura más de 60 s: para reels de venta apuntá a 25-45 s');

// Volumen integrado (objetivo -14 LUFS ±1.5) y volumen por segundo (detecta silencios o audio que arranca tarde).
const ebu = correr('ffmpeg', ['-hide_banner', '-nostats', '-i', mp4, '-af', 'ebur128', '-f', 'null', '-']);
const lufs = Number((ebu.match(/I:\s+(-?[\d.]+) LUFS/g) || []).pop()?.match(/-?[\d.]+/)[0]);
console.log(`Volumen: ${lufs} LUFS (objetivo -14)`);
if (!(lufs > -16 && lufs < -12)) problemas.push(`Volumen fuera de rango (${lufs} LUFS)`);
const rms = correr('ffmpeg', ['-hide_banner', '-nostats', '-i', mp4, '-af', 'asetnsamples=44100,astats=metadata=1:reset=1,ametadata=print:key=lavfi.astats.Overall.RMS_level', '-f', 'null', '-']);
const niveles = [...rms.matchAll(/RMS_level=(-?[\d.inf]+)/g)].map((m) => (m[1].includes('inf') ? -99 : Number(m[1])));
console.log('dB por segundo: ' + niveles.map((x) => x.toFixed(0)).join(' '));
const mudos = niveles.map((x, i) => [i, x]).filter(([i, x]) => x < -45 && i < niveles.length - 2);
if (mudos.length) problemas.push(`Segundos casi mudos: ${mudos.map(([i]) => i).join(', ')} (¿la voz arranca tarde o hay una pausa demasiado larga?)`);
if (niveles.some((x) => x > -6)) problemas.push('Algún segundo está saturado (> -6 dB RMS)');

console.log(problemas.length ? '\nREVISAR:\n- ' + problemas.join('\n- ') : '\nOK: listo para publicar.');
process.exit(problemas.length ? 2 : 0);
