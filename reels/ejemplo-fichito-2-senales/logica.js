// Reel "3 señales": lista con curiosidad (la tercera es la más común) -> solución en el celular -> panel -> Comentá FICHITO.
// desde = segundo en que entra cada vista (0.3 s antes de que la voz empiece esa escena). prog = texto de la barra inferior.
const VISTAS = [
  { id: 'v-gancho', lbl: 'AUDITORÍA', chip: '3 SEÑALES', n: '01', desde: 0, prog: 'Las 3 señales' },
  { id: 'v-senal1', lbl: 'SEÑAL 1', chip: 'PLANILLA', n: '02', desde: E.senal1.t0 - .3, prog: 'Todos llegan justo' },
  { id: 'v-senal2', lbl: 'SEÑAL 2', chip: 'FIRMAS', n: '03', desde: E.senal2.t0 - .3, prog: 'Firmas parecidas' },
  { id: 'v-senal3', lbl: 'SEÑAL 3', chip: 'LA MÁS COMÚN', n: '04', desde: E.senal3.t0 - .3, prog: 'Nadie sabe quién abrió' },
  { id: 'telefono', n: '05', desde: E.solucion.t0 - .35, prog: 'La solución' },
  { id: 'v-vivo', lbl: 'PANEL EN VIVO', chip: 'DUEÑO', n: '06', desde: E.vivo.t0 - .35, prog: 'En vivo' },
  { id: 'v-cierre', lbl: 'FICHITO', chip: 'GRATIS', n: '07', desde: E.cierre.t0 - .35, prog: 'Comentá FICHITO' },
];

function escena(t, v, esTel) {
  // 01 · Gancho: tres señales ocultas; la tercera se marca como "la más común".
  if (v.id === 'v-gancho') {
    const t0 = at('gancho', 'tres');
    // Las tres señales ocultas están desde el cuadro 1: la curiosidad es el gancho.
    ['g1', 'g2', 'g3'].forEach((id, i) => {
      const pulso = Math.max(0, Math.sin((t - t0 - i * .12) * 9)) * (t > t0 && t < t0 + .6 ? 1 : 0);
      set(id, { opacity: 1, transform: `scale(${1 + pulso * .02})` });
      set($(id).querySelector('.bloq'), { backgroundPosition: `${(t * 60) % 200}% 0` });
    });
    const tt = at('gancho', 'tercera') - .1;
    $('g3').classList.toggle('on', t >= tt);
    const c = pr(t, at('gancho', 'comun') - .1, at('gancho', 'comun') + .2);
    set('g3c', { opacity: c, transform: `scale(${.6 + .4 * eBack(c)})` });
    set('g3', { transform: `translateX(${temblor(t, tt, .5, 14)}px)` });
  }
  // 02 · Señal 1: todos los días a las 09:00
  if (v.id === 'v-senal1') {
    const t9 = at('senal1', 'nueve');
    for (let i = 0; i < 5; i++) $(`s1h${i}`).classList.toggle('marca', t >= t9 + i * .14);
    const n = pr(t, at('senal1', 'dias') - .1, at('senal1', 'dias') + .2);
    set('s1n', { opacity: n, transform: `rotate(-6deg) scale(${.6 + .4 * eBack(n)})` });
  }
  // 03 · Señal 2: dos firmas con la misma letra
  if (v.id === 'v-senal2') {
    dibujarCirculo($('s2c1'), t, at('senal2', 'firmas') - .05);
    dibujarCirculo($('s2c2'), t, at('senal2', 'parecen') - .05);
    const n = pr(t, at('senal2', 'demasiado') - .05, at('senal2', 'demasiado') + .25);
    set('s2n', { opacity: n, transform: `rotate(-8deg) scale(${.6 + .4 * eBack(n)})` });
  }
  // 04 · Señal 3: el dueño pregunta y le clavan el visto
  if (v.id === 'v-senal3') {
    const b = [...$('chat3').querySelectorAll('.bur')];
    const tiempos = [at('senal3', 'sabes') - .1, at('senal3', 'abrio') - .1];
    b.forEach((el, i) => { const x = pr(t, tiempos[i], tiempos[i] + .3); set(el, { opacity: x, transform: `translateY(${(1 - eBack(x)) * 50}px)` }); });
    const tv = at('senal3', 'visto') - .05;
    const x = pr(t, tv, tv + .3);
    $('visto').classList.toggle('grande', t >= tv);
    set('visto', { opacity: x, transform: `scale(${.6 + .4 * eBack(x)})`, transformOrigin: 'right center' });
  }
  // 05 · Solución en el teléfono: QR -> botón -> NIP -> sello
  if (esTel) {
    const tEsc = E.solucion.t0 - .1, tToca = at('solucion', 'celular'), tPone = at('solucion', 'local'), tListo = at('solucion', 'nip') + .2;
    set('cam', { opacity: t < tToca - .2 ? 1 : 1 - pr(t, tToca - .2, tToca) });
    set('scan', { top: `${(Math.sin((t - tEsc) * 5) * .5 + .5) * 360}px` });
    const d = pr(t, tToca + .1, tToca + .4);
    set('dedo', { display: t > tToca + .1 && t < tToca + .8 ? 'block' : 'none', left: '180px', top: '640px', transform: `scale(${1.5 - .5 * eOut(d)})`, opacity: 1 - pr(t, tToca + .5, tToca + .8) });
    set('boton', { transform: `translateY(${t > tToca + .3 && t < tToca + .5 ? 8 : 0}px)` });
    set('pad', { transform: `translateY(${(1 - eOut(pr(t, tPone - .3, tPone + .05))) * 105}%)`, display: t < tListo - .1 ? 'block' : 'none' });
    [...$('dots').children].forEach((dd, i) => dd.classList.toggle('on', t > tPone + .1 + i * .13));
    const st = pr(t, tListo - .1, tListo + .35);
    set('confirma', { display: st > 0 ? 'grid' : 'none' });
    set('sello', { transform: `rotate(${-5 - (1 - st) * 14}deg) scale(${2.4 - 1.4 * eBack(st)})` });
  }
  // 06 · En vivo: tarjetas que entran y relojes que corren
  if (v.id === 'v-vivo') {
    [...$('v-vivo').querySelectorAll('.tj')].forEach((c, i) => { const x = pr(t, v.desde + .3 + i * .18, v.desde + .65 + i * .18); set(c, { opacity: x, transform: `translateY(${(1 - eBack(x)) * 80}px)` }); });
    $('v-vivo').querySelectorAll('.r').forEach((r) => { r.textContent = hms(+r.dataset.base + (t - v.desde)); });
  }
  // 07 · Cierre: "Comentá FICHITO"
  if (v.id === 'v-cierre') cierreComentario(t, 'cierre', { comenta: 'comenta', palabra: 'fichito', info: 'paso', boton: 'gratis' }, '{{PALABRA}}', 312);
}

// Momentos de los efectos de sonido (render.mjs arma el audio con esto).
function sonidos() {
  return {
    whoosh: VISTAS.slice(1).map((x) => x.desde),
    clicks: [at('solucion', 'celular') + .3, ...[0, 1, 2, 3].map((i) => at('solucion', 'local') + .1 + i * .13), at('senal1', 'nueve'), at('senal1', 'nueve') + .28, at('senal1', 'nueve') + .56],
    golpes: [at('gancho', 'tercera') - .1, at('solucion', 'nip') + .15],
    errores: [at('senal3', 'visto')],
    cierre: at('cierre', 'comenta'),
  };
}
