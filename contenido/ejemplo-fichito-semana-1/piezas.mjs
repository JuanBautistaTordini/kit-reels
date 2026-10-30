// Contenido de la semana 1. Cada pieza se renderiza a PNG con plantilla.html (node render.mjs).
// Reglas: sin emojis, sin planes ni precios. El robot de Fichito aparece en todas las piezas.
// tipos de slide: portada | dolor | solucion | pasos | controles | panel | numero | rubros | cta | historia

const CTA = { tipo: 'cta', titulo: 'Probalo gratis en tu negocio.', texto: 'Comentá FICHITO y te mandamos el link por mensaje. O entrá desde el link de la bio.', boton: 'Comentá FICHITO' };

export const POSTS = [
  {
    id: 'F1-que-es-fichito', nombre: 'Fijado 1 · Qué es Fichito',
    slides: [
      { tipo: 'portada', tag: 'Control horario', titulo: 'Que nadie fiche por otro.', sub: 'Tu equipo ficha con su propio celular. Vos ves todo en vivo.', robot: 'feliz', claro: true },
      { tipo: 'dolor', titulo: 'Planilla, tarjeta o reloj de huella:', texto: 'cualquiera firma por cualquiera. Y a fin de mes, nadie se acuerda a qué hora llegó.', robot: 'preocupado' },
      { tipo: 'pasos', titulo: 'Así ficha tu equipo', pasos: ['Escanea el QR pegado en el local', 'Toca su botón: entrada, pausa o salida', 'Pone su NIP de 4 números'], captura: 'fichar-trabajando.png' },
      { tipo: 'controles', titulo: 'Tres controles en cada fichaje', items: [['qr', 'El QR del local', 'Si le sacan una foto, lo cambiás y el viejo deja de andar.'], ['pin', 'Tiene que estar adentro', 'La ubicación se mide al fichar. Desde la casa, no ficha.'], ['celular', 'Su celular y su NIP', 'Cada celular queda atado a una persona.']] },
      { tipo: 'panel', titulo: 'Y vos lo ves todo en vivo', texto: 'Quién está trabajando, quién está en pausa y desde cuándo. Las horas, listas para liquidar en Excel.' },
      CTA,
    ],
  },
  {
    id: 'F2-para-quien-es', nombre: 'Fijado 2 · Para quién es',
    slides: [
      { tipo: 'portada', tag: 'Para quién es', titulo: 'Si tu equipo trabaja por turnos, es para vos.', robot: 'saludo', claro: false },
      { tipo: 'rubros', titulo: '¿Te suena alguna?', items: [
        ['Gastronomía', 'Turnos nocturnos, manos con harina y el "fichame que llego en 10".'],
        ['Kioscos y almacenes', 'No sabés a qué hora se abrió hoy.'],
        ['Peluquerías y barberías', 'El cliente llegó puntual. El barbero, no.'],
        ['Gimnasios', 'Profes por hora y nadie que controle la llegada.'],
        ['Farmacias', 'Guardias y turnos rotativos difíciles de sumar.'],
        ['Varias sucursales', 'Querés ver todos los locales desde un lugar.'],
      ] },
      { tipo: 'solucion', titulo: 'Sin instalar nada', puntos: ['Funciona en el navegador del celular', 'Sin reloj, sin huellas, sin cables', 'Lo dejás andando en 10 minutos'], captura: 'fichar-quien.png' },
      CTA,
    ],
  },
  {
    id: 'C1-gastronomia', nombre: 'Martes · Gastronomía',
    slides: [
      { tipo: 'portada', tag: 'Gastronomía', titulo: 'En tu cocina, el reloj de huella no lee.', robot: 'preocupado' },
      { tipo: 'dolor', num: '01', titulo: 'Manos con harina, agua o guantes.', texto: 'El lector falla, se arma la fila y alguien "ficha después". O no ficha.' },
      { tipo: 'dolor', num: '02', titulo: 'El turno de la noche termina a las 3.', texto: '¿Esa hora es de hoy o de mañana? En la planilla, depende de quién la sume.' },
      { tipo: 'dolor', num: '03', titulo: '"Fichame que llego en 10."', texto: 'Y llega en 40. La planilla dice puntual.' },
      { tipo: 'solucion', titulo: 'Con Fichito', puntos: ['Fichan con su celular, sin tocar ningún lector', 'El turno nocturno cuenta para el día que empezó', 'Cada pausa queda con motivo y horario', 'Si quiere fichar desde la esquina, no puede'], captura: 'fichar-trabajando.png' },
      CTA,
    ],
  },
  {
    id: 'C2-kioscos', nombre: 'Miércoles · Kioscos y almacenes',
    slides: [
      { tipo: 'portada', tag: 'Kioscos y almacenes', titulo: 'Tu kiosco abre a las 8. ¿Seguro?', robot: 'sorprendido' },
      { tipo: 'dolor', titulo: 'No podés estar en el local todo el día.', texto: 'Y si la persiana se levantó a las 8:40, nadie te avisa.' },
      { tipo: 'panel', titulo: 'Con Fichito te enterás desde tu celular', texto: 'Quién abrió, a qué hora y desde dónde. Al instante.', variante: 'kiosco' },
      { tipo: 'panel', titulo: 'Y si alguien quiere fichar desde la casa, lo ves.', texto: 'El sistema mide la distancia al local en cada fichaje y lo rechaza.', variante: 'rechazo' },
      CTA,
    ],
  },
  {
    id: 'C3-barberias', nombre: 'Viernes · Peluquerías y barberías',
    slides: [
      { tipo: 'portada', tag: 'Peluquerías y barberías', titulo: 'El turno era a las 10. Tu barbero llegó 10:25.', robot: 'preocupado' },
      { tipo: 'dolor', titulo: 'El cliente espera, se cansa y no vuelve.', texto: 'Y el día que lo hablás: "Llegué 10 y 5, no exageres".' },
      { tipo: 'solucion', titulo: 'Con Fichito no hay discusión', puntos: ['Cada uno ficha al llegar, con su celular', 'Queda la hora exacta, todos los días', 'Él ve sus horas en vivo. Vos, las de todos'], captura: 'fichar-confirmacion.png' },
      { tipo: 'panel', titulo: 'A fin de mes, las horas ya están sumadas', texto: 'Por persona, con pausas descontadas. Lo exportás a Excel y listo.', variante: 'horas' },
      CTA,
    ],
  },
  {
    id: 'C4-gimnasios', nombre: 'Sábado · Gimnasios',
    slides: [
      { tipo: 'portada', tag: 'Gimnasios', titulo: 'La clase de las 7 empezó 7:20.', robot: 'sorprendido' },
      { tipo: 'dolor', titulo: 'Profes por hora, turnos de 6 a 23.', texto: 'Y nadie en recepción a esa hora para ver quién llegó.' },
      { tipo: 'pasos', titulo: 'Cada profe ficha al llegar', pasos: ['QR pegado en la recepción', 'Ubicación: tiene que estar en el gimnasio', 'Su NIP, desde su celular'], captura: 'fichar-nip.png' },
      { tipo: 'panel', titulo: 'Horas por profe, listas para pagar', texto: 'Sin planillas ni capturas de WhatsApp.', variante: 'horas' },
      CTA,
    ],
  },
  {
    id: 'C5-la-cuenta', nombre: 'Domingo · La cuenta',
    slides: [
      { tipo: 'portada', tag: 'Hagamos la cuenta', titulo: '15 minutos por día. ¿Cuánto es en un mes?', robot: 'pensando' },
      { tipo: 'numero', grande: '5 h 30 m', titulo: 'por empleado, por mes', texto: '15 minutos tarde × 22 días de trabajo.' },
      { tipo: 'numero', grande: '27 h 30 m', titulo: 'con 5 empleados', texto: 'Más de 3 jornadas completas que pagás y nadie trabajó.' },
      { tipo: 'dolor', titulo: 'No es desconfianza.', texto: 'Es que vos y tu equipo miren el mismo número. Se terminan los reclamos de fin de mes.', robot: 'feliz', claro: true },
      CTA,
    ],
  },
];

// Historias (1080x1920). "sticker" indica qué agregar en Instagram sobre el espacio libre.
export const HISTORIAS = [
  { id: 'H-lun-1', dia: 'Lunes', titulo: 'Hola. Somos Fichito.', texto: 'Ayudamos a negocios con empleados a que nadie fiche por otro.', robot: 'saludo' },
  { id: 'H-lun-2', dia: 'Lunes', titulo: '¿Cómo controlás los horarios de tu equipo?', sticker: 'Encuesta: Planilla / Reloj de huella / Confío / No controlo', espacio: true, robot: 'pensando' },
  { id: 'H-lun-3', dia: 'Lunes', titulo: 'Nuevo video', texto: 'Mirá qué pasa cuando alguien ficha por un compañero.', sticker: 'Compartí el reel del día encima', espacio: true },
  { id: 'H-mar-1', dia: 'Martes', titulo: '¿Tenés un bar, restaurante o cafetería?', sticker: 'Encuesta: Sí / No, pero tengo empleados', espacio: true, robot: 'pensando' },
  { id: 'H-mar-2', dia: 'Martes', titulo: 'Así ficha tu equipo', texto: 'QR del local, su botón y su NIP. Tres segundos.', captura: 'fichar-nip.png' },
  { id: 'H-mar-3', dia: 'Martes', titulo: 'Probalo gratis en tu local', sticker: 'Sticker de enlace a la web', espacio: true, robot: 'feliz' },
  { id: 'H-mie-1', dia: 'Miércoles', titulo: '¿A qué hora abrió tu local hoy?', texto: 'Si tuviste que preguntar, esto es para vos.', robot: 'sorprendido' },
  { id: 'H-mie-2', dia: 'Miércoles', titulo: 'Esto ves desde tu casa', panel: 'kiosco' },
  { id: 'H-mie-3', dia: 'Miércoles', titulo: 'Preguntanos lo que quieras', sticker: 'Caja de preguntas', espacio: true, robot: 'feliz' },
  { id: 'H-jue-1', dia: 'Jueves', titulo: 'Así se ve cuando alguien ficha', captura: 'fichar-confirmacion.png' },
  { id: 'H-jue-2', dia: 'Jueves', titulo: 'Los primeros 10 negocios', texto: 'Te lo dejamos instalado nosotros, por videollamada, sin costo de instalación.', sticker: 'Cuenta regresiva: "Instalación asistida" (domingo 23:59)', espacio: true, robot: 'saludo' },
  { id: 'H-jue-3', dia: 'Jueves', titulo: 'Nuevo video', texto: 'Tres señales de que en tu negocio alguien ficha por otro.', sticker: 'Compartí el reel 2 encima', espacio: true },
  { id: 'H-vie-1', dia: 'Viernes', titulo: '¿Tu equipo llega puntual a los turnos?', sticker: 'Encuesta: Siempre / Casi siempre / Ni idea', espacio: true, robot: 'pensando' },
  { id: 'H-vie-2', dia: 'Viernes', titulo: '¿Qué es el NIP?', texto: 'Un código de 4 números que el encargado le da a cada empleado. Se pide en cada fichaje, así nadie usa el celular de otro.', robot: 'feliz' },
  { id: 'H-vie-3', dia: 'Viernes', titulo: 'Comentá FICHITO', texto: 'En cualquier publicación y te mandamos el link por mensaje.', robot: 'saludo' },
  { id: 'H-sab-1', dia: 'Sábado', titulo: '¿Necesitan bajar una app?', texto: 'No. El QR abre una página en el navegador del celular. Nada que instalar.', robot: 'feliz' },
  { id: 'H-sab-2', dia: 'Sábado', titulo: '¿Y si no tienen datos?', texto: 'Usan el wifi del local. Solo hace falta conexión en el momento de fichar.', robot: 'pensando' },
  { id: 'H-sab-3', dia: 'Sábado', titulo: '¿Guardan la ubicación todo el día?', texto: 'No. Solo en el instante en que fichan. Sin seguimiento y sin fotos.', robot: 'feliz' },
  { id: 'H-dom-1', dia: 'Domingo', titulo: 'Esta semana', texto: 'Contamos cómo fichar con el celular en bares, kioscos, barberías y gimnasios. ¿Cuál es tu rubro?', sticker: 'Caja de preguntas: "Mi rubro es…"', espacio: true, robot: 'saludo' },
  { id: 'H-dom-2', dia: 'Domingo', titulo: 'Últimos lugares', texto: 'Instalación asistida para los primeros 10 negocios. Cierra hoy a las 23:59.', sticker: 'Cuenta regresiva + enlace', espacio: true, robot: 'sorprendido' },
];
