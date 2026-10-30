// Arma reels/<reel>/reel.html a partir de motor/motor.html + los archivos del reel.
// Uso: node motor/armar.mjs reels/<reel>
// Archivos del reel: config.json, escenas.html, logica.js, [estilos.css], [telefono.html], voz.js (lo genera voz.py)
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const KIT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

export function armar(dirReel) {
  const dir = path.resolve(dirReel);
  const leer = (f, opcional = false) => {
    const p = path.join(dir, f);
    if (!fs.existsSync(p)) { if (opcional) return ''; throw new Error(`Falta ${path.relative(KIT, p)}`); }
    return fs.readFileSync(p, 'utf8');
  };
  const config = JSON.parse(leer('config.json'));
  const dirMarca = path.join(KIT, 'marcas', config.marca || 'fichito');
  const marca = JSON.parse(fs.readFileSync(path.join(dirMarca, 'marca.json'), 'utf8'));
  const logo = fs.existsSync(path.join(dirMarca, 'logo.svg')) ? fs.readFileSync(path.join(dirMarca, 'logo.svg'), 'utf8').trim() : '';
  // Tokens disponibles dentro de escenas.html / telefono.html / logica.js
  const tokens = { LOGO: logo, NOMBRE: marca.nombre, PALABRA: config.palabraClave || marca.palabraClave || marca.nombre.toUpperCase() };
  const conTokens = (s) => s.replace(/\{\{(LOGO|NOMBRE|PALABRA)\}\}/g, (_, k) => tokens[k]);
  if (!fs.existsSync(path.join(dir, 'voz.js'))) throw new Error(`Falta voz.js: corré primero  python motor/voz.py ${dirReel}`);

  let telefono = leer('telefono.html', true);
  if (!telefono) telefono = fs.readFileSync(path.join(KIT, 'motor', 'telefono-base.html'), 'utf8');
  const fuentes = (config.fuentesExtra || []).map((f) => `&family=${f.replace(/ /g, '+')}`).join('');
  const rellenos = {
    TITULO: `${marca.nombre} · ${config.titulo || path.basename(dir)}`,
    FUENTES_EXTRA: fuentes,
    COLOR: marca.color,
    COLOR2: marca.colorOscuro,
    ESTILOS: leer('estilos.css', true),
    ESCENAS: conTokens(leer('escenas.html')),
    TELEFONO: conTokens(telefono),
    CONFIG: JSON.stringify({ pausas: config.pausas || {}, cola: config.cola ?? 1.7 }),
    LOGICA: conTokens(leer('logica.js')),
  };
  let h = fs.readFileSync(path.join(KIT, 'motor', 'motor.html'), 'utf8');
  // Una sola pasada: el contenido insertado nunca se vuelve a interpretar como marcador.
  h = h.replace(/\{\{(TITULO|FUENTES_EXTRA|COLOR2|COLOR|ESTILOS|ESCENAS|TELEFONO|CONFIG|LOGICA)\}\}/g, (_, k) => rellenos[k]);
  const salida = path.join(dir, 'reel.html');
  fs.writeFileSync(salida, h);
  return { salida, config, marca };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  if (!process.argv[2]) { console.log('Uso: node motor/armar.mjs reels/<reel>'); process.exit(1); }
  const { salida } = armar(process.argv[2]);
  console.log(`Armado: ${path.relative(process.cwd(), salida)}`);
}
