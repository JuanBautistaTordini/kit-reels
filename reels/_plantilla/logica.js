// VISTAS: una por escena. desde = cuándo entra (0.3 s antes de que la voz arranque esa escena; la primera siempre en 0).
// lbl/chip = barra de la ventana · prog = texto de la barra inferior · id 'telefono' muestra el celular 3D en vez de la ventana.
const VISTAS = [
  { id: 'v-gancho', lbl: 'FICHAJE · HOY', chip: 'PAPEL', n: '01', desde: 0, prog: 'El problema' },
  { id: 'v-problema', lbl: 'CHAT DEL LOCAL', chip: 'TODOS LOS DÍAS', n: '02', desde: E.problema.t0 - .3, prog: 'Lo que pasa' },
  { id: 'v-solucion', lbl: 'LA SOLUCIÓN', chip: 'EN CADA FICHAJE', n: '03', desde: E.solucion.t0 - .3, prog: 'La solución' },
  { id: 'v-cierre', lbl: '{{PALABRA}}', chip: 'GRATIS', n: '04', desde: E.cierre.t0 - .35, prog: 'Comentá {{PALABRA}}' },
];

// Se llama en cada cuadro. Todo depende de t y de at('escena','palabra'): así queda sincronizado con la voz.
function escena(t, v, esTel) {
  if (v.id === 'v-gancho') {
    const tp = at('gancho', 'pasando') - .1;
    golpe('v-gancho', t, tp);
    dibujarCirculo('g-circulo', t, tp);
    const n = pr(t, tp + .2, tp + .45);
    set('g-nota', { opacity: n, transform: `rotate(-8deg) scale(${.6 + .4 * eBack(n)})` });
  }
  if (v.id === 'v-problema') {
    const b = [...$('p-chat').querySelectorAll('.bur')];
    entrar(b[0], t, at('problema', 'fichame') - .15, .3, 'y', 50);
    entrar(b[1], t, at('problema', 'cuarenta') - .1, .3, 'y', 50);
    const n = pr(t, at('problema', 'cuarenta') + .25, at('problema', 'cuarenta') + .5);
    set('p-nota', { opacity: n, transform: `rotate(-8deg) scale(${.6 + .4 * eBack(n)})` });
  }
  if (v.id === 'v-solucion') {
    const ts = [at('solucion', 'celular'), at('solucion', 'adentro'), at('solucion', 'trampas')];
    [...$('v-solucion').querySelectorAll('.check')].forEach((c, i) => {
      const x = pr(t, ts[i] - .1, ts[i] + .25);
      set(c, { opacity: x, transform: `translateX(${(1 - eBack(x)) * 300}px)` });
      set(c.querySelector('.ok'), { transform: `scale(${eBack(pr(t, ts[i] + .15, ts[i] + .45))})` });
    });
  }
  if (v.id === 'v-cierre') cierreComentario(t, 'cierre', { comenta: 'comenta', palabra: 'fichito', info: 'paso', boton: 'gratis' }, '{{PALABRA}}', 248);
}

// Efectos de sonido (render.mjs los mezcla). Usalos con criterio: pocos y en momentos clave.
function sonidos() {
  return {
    whoosh: VISTAS.slice(1).map((x) => x.desde),                       // cambio de escena
    clicks: [at('solucion', 'celular') + .15, at('solucion', 'adentro') + .15, at('solucion', 'trampas') + .15], // cada check
    golpes: [at('gancho', 'pasando') - .1],                             // remate del gancho
    errores: [at('problema', 'cuarenta') + .25],                        // algo sale mal
    cierre: at('cierre', 'comenta'),                                    // campanita del cierre
  };
}
