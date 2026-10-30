// Reel "Martín firmó a las nueve": caso concreto -> costo (chat de reclamos) -> cómo se ficha -> validación -> panel -> Comentá FICHITO.
const VISTAS = [
  { id: 'v-planilla', lbl: 'FICHAJE · HOY', chip: 'CASO REAL', n: '01', desde: 0, prog: 'El problema' },
  { id: 'v-reclamos', lbl: 'CHAT DEL LOCAL', chip: 'TODOS LOS MESES', n: '02', desde: E.reclamos.t0 - .3, prog: 'Lo que cuesta' },
  { id: 'telefono', n: '03', desde: E.celular.t0 - .35, prog: 'Cómo se ficha' },
  { id: 'v-validacion', lbl: 'VALIDACIÓN', chip: 'EN CADA FICHAJE', n: '04', desde: E.validacion.t0 - .35, prog: 'Seguridad' },
  { id: 'v-panel', lbl: 'PANEL EN VIVO', chip: 'DUEÑO', n: '05', desde: E.panel.t0 - .35, prog: 'Panel en vivo' },
  { id: 'v-cierre', lbl: 'FICHITO', chip: 'GRATIS HOY', n: '06', desde: E.cierre.t0 - .35, prog: 'Comentá FICHITO' },
];

function escena(t, v, esTel) {
  // 01 · Planilla ya firmada (gancho en el cuadro 1); la firma de Martín cae en "firmó", el círculo en "llegó", la nota en "diez".
  if (v.id === 'v-planilla') {
    const tf1 = at('planilla', 'firmo') - .15;
    tipear('firma-trampa', 'M. Ruiz', pr(t, tf1, tf1 + .3));
    const tc = at('planilla', 'llego') - .1;
    golpe('v-planilla', t, tc);
    dibujarCirculo('circulo', t, tc);
    const td = at('planilla', 'diez') - .05;
    const n = pr(t, td, td + .25);
    set('nota-roja', { opacity: n, transform: `rotate(-8deg) scale(${.6 + .4 * eBack(n)})` });
  }
  // 02 · Chat: primero "¿me firmás?", después los reclamos de fin de mes
  if (v.id === 'v-reclamos') {
    const tiempos = [at('reclamos', 'cualquiera') - .25, at('reclamos', 'otro') - .1, at('reclamos', 'y') - .2, at('reclamos', 'fin'), at('reclamos', 'mes') + .35, at('reclamos', 'reclamos') - .05];
    [...$('chat').children].forEach((b, i) => entrar(b, t, tiempos[i], .3, 'y', 50));
  }
  // 03 · Teléfono: escanea, toca, NIP, listo (sincronizado con la voz)
  if (esTel) {
    const tEsc = at('pasos', 'escanea'), tToca = at('pasos', 'toca'), tPone = at('pasos', 'pone'), tListo = at('pasos', 'listo');
    set('cam', { opacity: t >= tEsc - .25 && t < tToca - .2 ? 1 : t >= tToca - .2 && t < tToca ? 1 - pr(t, tToca - .2, tToca) : 0 });
    set('scan', { top: `${(Math.sin((t - tEsc) * 5) * .5 + .5) * 360}px` });
    const d = pr(t, tToca + .15, tToca + .45);
    set('dedo', { display: t > tToca + .15 && t < tToca + .9 ? 'block' : 'none', left: '180px', top: '640px', transform: `scale(${1.5 - .5 * eOut(d)})`, opacity: 1 - pr(t, tToca + .55, tToca + .9) });
    set('pad', { transform: `translateY(${(1 - eOut(pr(t, tPone - .15, tPone + .25))) * 105}%)`, display: t < tListo - .1 ? 'block' : 'none' });
    [...$('dots').children].forEach((dd, i) => dd.classList.toggle('on', t > tPone + .35 + i * .2));
    const st = pr(t, tListo - .1, tListo + .35);
    set('confirma', { display: st > 0 && t < tListo + 1.5 ? 'grid' : 'none' });
    set('sello', { transform: `rotate(${-5 - (1 - st) * 14}deg) scale(${2.4 - 1.4 * eBack(st)})` });
    const trabajando = t >= tListo + 1.5;
    set('estado', { background: trabajando ? 'linear-gradient(160deg,#18A957,#0F8A45)' : '#4B4966' });
    $('est-l').textContent = trabajando ? '● Trabajando' : 'Fuera de turno';
    $('est-v').textContent = trabajando ? hms(t - tListo - 1.5) : '0h 00m';
    $('boton').textContent = trabajando ? 'Finalizar turno' : 'Registrar ingreso';
    set('boton', { background: trabajando ? '#E5484D' : '#16A34A', transform: `translateY(${t > tToca + .35 && t < tToca + .55 ? 8 : 0}px)` });
  }
  // 04 · Validación: tres checks verdes y el rechazo "desde su casa" que tiembla
  if (v.id === 'v-validacion') {
    const ts = [at('validacion', 'verifica'), at('validacion', 'adentro'), at('validacion', 'celular'), at('validacion', 'casa') - .1];
    [...$('v-validacion').querySelectorAll('.check')].forEach((c, i) => {
      const x = pr(t, ts[i], ts[i] + .35);
      const tiembla = i === 3 ? temblor(t, ts[3] + .35, .45, 14) : 0;
      set(c, { opacity: x, transform: `translateX(${(1 - eBack(x)) * 300 + tiembla}px)` });
      set(c.querySelector('.ok'), { transform: `scale(${eBack(pr(t, ts[i] + .25, ts[i] + .55))})` });
    });
    set('mapa', { opacity: pr(t, ts[1], ts[1] + .4) });
    const pc = pr(t, ts[3], ts[3] + .35);
    set('pin-casa', { opacity: pc, transform: `scale(${eBack(pc)})` });
    set('leyenda-casa', { opacity: pc });
  }
  // 05 · Panel en vivo + exportar a Excel
  if (v.id === 'v-panel') {
    [...$('v-panel').querySelectorAll('.tj')].forEach((c, i) => { const x = pr(t, v.desde + .4 + i * .2, v.desde + .75 + i * .2); set(c, { opacity: x, transform: `translateY(${(1 - eBack(x)) * 80}px)` }); });
    $('v-panel').querySelectorAll('.r').forEach((r) => { r.textContent = hms(+r.dataset.base + (t - v.desde)); });
    const x = pr(t, at('panel', 'liquidar') - .2, at('panel', 'liquidar') + .2);
    set('excel', { opacity: x, transform: `scale(${.7 + .3 * eBack(x)})` });
  }
  // 06 · Cierre: "Comentá FICHITO" se tipea, se publica, suma corazones, info y botón.
  if (v.id === 'v-cierre') cierreComentario(t, 'cierre', { comenta: 'comenta', palabra: 'fichito', info: 'paso', boton: 'empeza' }, '{{PALABRA}}', 248);
}

function sonidos() {
  const pone = at('pasos', 'pone');
  return {
    whoosh: VISTAS.slice(1).map((x) => x.desde),
    clicks: [at('pasos', 'toca') + .35, ...[0, 1, 2, 3].map((i) => pone + .35 + i * .2), at('validacion', 'verifica') + .3, at('validacion', 'adentro') + .3, at('validacion', 'celular') + .3, at('panel', 'liquidar')],
    golpes: [at('planilla', 'llego') - .1, at('pasos', 'listo') - .05],
    errores: [at('validacion', 'casa') + .25],
    cierre: at('cierre', 'comenta'),
  };
}
