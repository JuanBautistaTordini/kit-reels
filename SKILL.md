# Kit de reels y contenido (guía para la sesión de Claude)

> **Para vos, Claude.** Este repo contiene TODO lo necesario para producir reels 9:16 y piezas de Instagram con la misma calidad que ya aprobó el usuario (Bauti). El usuario te va a decir solo **qué quiere hacer** y **para quién**. Con eso, producís todo de punta a punta sin frenar a preguntar: guion, voz, video, verificación, caption y versión liviana. Solo preguntás si falta algo que no podés decidir vos (por ejemplo, una marca nueva sin datos).
>
> Hablale en español rioplatense. Nada de emojis en el video, en las piezas ni en los captions.

---

## 0. Antes de empezar (una vez por PC)

```bash
npm install                                   # puppeteer-core (usa el Chrome instalado)
python -m venv .tts                           # voz neuronal
.tts/Scripts/pip install -r requirements.txt  # Windows  (Mac/Linux: .tts/bin/pip)
ffmpeg -version                               # tiene que estar en el PATH
```

Si falta ffmpeg en Windows: `winget install Gyan.FFmpeg`. Si Chrome no está en la ruta típica, poné la ruta en la variable `CHROME`.

En Windows, el Python del venv es `.tts/Scripts/python`. Más abajo aparece como `PY`.

## 1. Mapa del repo

| Ruta | Qué es |
|---|---|
| `motor/motor.html` | Motor del video: fondo, escenario, ventana 3D, celular 3D, subtítulos karaoke, transiciones, helpers, íconos. **No se edita por reel.** |
| `motor/armar.mjs` | Junta motor + archivos del reel y genera `reels/<reel>/reel.html` |
| `motor/voz.py` | Genera `voz.mp3` + tiempos por palabra (`voz.json`, `voz.js`) desde `guion.json` |
| `motor/cuadros.mjs` | Saca cuadros JPG y una hoja de contacto (`cuadros/hoja.jpg`) para revisar |
| `motor/render.mjs` | Render final a MP4 60 fps con efectos de sonido, más una versión liviana |
| `motor/revisar.mjs` | Control de calidad del MP4: formato, volumen y silencios |
| `motor/telefono-base.html` | Pantalla por defecto del celular 3D (app de fichaje). Cada reel puede traer su `telefono.html` |
| `marcas/<marca>/` | `marca.json` (qué es, público, dolores, diferenciales, prohibiciones, palabra clave) y `logo.svg` |
| `reels/_plantilla/` | Punto de partida de un reel nuevo (4 escenas, ya probada) |
| `reels/ejemplo-fichito-1-planilla/` | Reel 1 aprobado, gancho "historia". Trae su voz original |
| `reels/ejemplo-fichito-2-senales/` | Reel 2 aprobado, gancho "lista con curiosidad". Trae su voz original |
| `voces/` | 8 muestras de voces. La aprobada es `8-jorge-mx.mp3` |
| `referencias/` | Los dos reels aprobados (versión liviana) y sus hojas de cuadros: **miralos para calibrar el estilo** |
| `contenido/` | Generador de carruseles e historias de Instagram (`plantilla.html`, `render.mjs`, capturas de la app y un ejemplo de semana completa) |

## 2. Flujo para un reel nuevo (seguilo en orden)

1. **Leé** `marcas/<marca>/marca.json` y mirá `referencias/reel1-cuadros.jpg` y `referencias/reel2-cuadros.jpg`.
2. **Copiá la plantilla:** `cp -r reels/_plantilla reels/<nombre-corto>`. Si el reel se parece a un ejemplo, copiá ese ejemplo en lugar de la plantilla (sin sus `voz.*`).
3. **Escribí el guion** en `guion.json` (sección 3). Completá `config.json`: `titulo`, `para`, `palabraClave`, `pausas`.
4. **Generá la voz:** `PY motor/voz.py reels/<reel>`. Mirá la tabla que imprime: cada escena con sus palabras y tiempos. Si dice "OJO", corregí el guion (números en letras, sin siglas raras) y repetí.
5. **Diseñá las escenas** en `escenas.html` (una `.vista` por escena) y animalas en `logica.js` (sección 5). Reusá los componentes del kit (sección 6).
6. **Revisá cuadros:** `node motor/cuadros.mjs reels/<reel>` y **mirá `cuadros/hoja.jpg`**. Después sacá cuadros justo en cada palabra ancla: `node motor/cuadros.mjs reels/<reel> 2.9 8.6 ...`. Corregí superposiciones, cosas fuera de la ventana y animaciones que no caen en su palabra. Repetí hasta que esté perfecto.
7. **Renderizá:** `node motor/render.mjs reels/<reel>`. Tarda de 3 a 5 minutos. Corrélo en segundo plano si podés.
8. **Verificá:** `node motor/revisar.mjs reels/<reel>/salida/<reel>-9x16.mp4`. Tiene que decir OK.
9. **Entregá** (sección 8).

Para una prueba rápida, `node motor/render.mjs reels/<reel> --rapido` hace un borrador a 30 fps.

### Si el usuario pide varios reels

Hacé un guion distinto por reel, cada uno con un gancho de fórmula distinta (sección 3). Renderizá en paralelo: cada reel usa su propia carpeta `salida/`, así que no chocan.

## 3. Guion

**Formato** (`guion.json`): lista de `["id_escena", "texto que dice la voz"]`. Los `id` van sin tildes ni espacios y son los que usás después en `at('id', 'palabra')`.

**Largo:** de 4 a 7 escenas, de 45 a 100 palabras (de 20 a 40 s con Jorge a +8 %). Mejor corto y con ritmo que largo.

**Estructura que funcionó:**

| Escena | Duración | Contenido |
|---|---|---|
| Gancho | 2 a 5 s | Situación concreta del dolor o promesa con curiosidad abierta. **Tiene que verse completo en el cuadro 0** |
| Dolor | 4 a 6 s | Cómo se vive hoy, con un ejemplo cotidiano (chat, planilla, "visto") |
| Solución | 6 a 10 s | El producto haciéndolo, paso a paso, sincronizado con la voz |
| Prueba | 4 a 6 s | Por qué funciona: controles, datos, rechazo de un intento trucho |
| Resultado | 3 a 4 s | Lo que gana el dueño (en vivo, horas listas) |
| Cierre | 3 a 4 s | "Comentá PALABRA y te paso…" (sale de `marca.json`) |

**Fórmulas de gancho aprobadas** (alterná entre ellas):

- **Historia en dos o tres frases cortas:** "Martín firmó a las nueve. Llegó a las diez. Y nadie se enteró."
- **Lista con curiosidad abierta:** "Tres señales de que alguien ficha por otro en tu negocio. La tercera es la más común."
- **Pregunta incómoda:** "¿Sabés a qué hora se abrió hoy tu local?"
- **Situación espejo:** "Si tu equipo ficha en papel, esto te está pasando."
- **Frase textual del empleado:** "Fichame que llego en diez."

**Reglas de escritura:**

- Frases cortas, una idea por frase. Sin jerga técnica.
- Voseo argentino: "comentá", "probalo", "vos ves".
- Nombres y horas concretos: Martín, 09:00, 1,4 km.
- **Números en letras** dentro del guion ("nueve y cuarenta", "tres segundos"): así coincide el conteo de palabras. En pantalla sí van en cifras.
- Cada escena tiene una o dos **palabras ancla** donde pasa algo en pantalla: una firma, un círculo rojo, un sello, un "Visto" o un check. Escribí el guion pensando en esas palabras.
- **Para quién:** adaptá el rubro, los nombres, los ejemplos y la pantalla al público que pidió el usuario. Por ejemplo, para gastronomía: cocina, turnos de noche, manos con harina. Para peluquerías: el cliente llegó y el barbero no.
- Respetá lo prohibido de `marca.json`. Para Fichito: sin precios ni planes y sin prometer huella ni reconocimiento facial.

## 4. Voz

- **Por defecto: `es-MX-JorgeNeural` a `+8%`**, la que eligió el usuario. Se configura en `config.json` (`voz`, `velocidad`). No la cambies salvo que el usuario lo pida.
- Para otras voces, escuchá las muestras de `voces/`: `es-AR-ElenaNeural`, `es-UY-ValentinaNeural`, `es-UY-MateoNeural`, `en-US-AndrewMultilingualNeural`, `en-US-AvaMultilingualNeural`, `en-US-EmmaMultilingualNeural` y `en-US-BrianMultilingualNeural`. Las multilingües hablan español.
- Los ejemplos traen su `voz.mp3` original. Para re-renderizarlos **no** regeneres la voz.
- Todo el guion sale en una sola llamada, así la entonación es continua. `voz.py` reintenta solo si el servicio corta el audio.
- Nunca uses la voz de sistema de Windows (SAPI): suena robótica.
- **ElevenLabs:** solo con plan pago (en el plan gratis da error 402 por API). La clave nunca va en el chat ni en el código.

## 5. Escenas y lógica (cómo se programa un reel)

**Regla de oro: todo depende de `t`.** No uses animaciones CSS por tiempo, `setTimeout` ni `requestAnimationFrame`. El motor llama `escena(t, v, esTel)` en cada cuadro y vos posicionás todo para ese segundo. **Toda animación se dispara con `at('escena', 'palabra')`**, nunca con segundos fijos.

`escenas.html` lleva una `<div class="vista" id="v-...">` por escena; se inserta dentro de la ventana 3D. Tokens disponibles: `{{LOGO}}`, `{{NOMBRE}}` y `{{PALABRA}}`.

`logica.js` define tres cosas:

```js
const VISTAS = [ // una por escena; 'telefono' muestra el celular 3D en vez de la ventana
  { id: 'v-gancho', lbl: 'FICHAJE · HOY', chip: 'PAPEL', n: '01', desde: 0, prog: 'El problema' },
  { id: 'telefono', n: '02', desde: E.solucion.t0 - .35, prog: 'La solución' },
  ...
];
function escena(t, v, esTel) { if (v.id === 'v-gancho') { ... } ... }
function sonidos() { return { whoosh: [...], clicks: [...], golpes: [...], errores: [...], cierre: at('cierre', 'comenta') }; }
```

Cada vista entra 0,3 s antes de que la voz empiece su escena (`E.<id>.t0 - .3`). La primera vista siempre tiene `desde: 0`.

**API del motor** (ya disponible en `logica.js`):

| Función | Para qué |
|---|---|
| `at(id, palabra, n=0)` | Segundo en que la voz dice `palabra` en la escena `id`. Ignora tildes y mayúsculas. `n` indica la ocurrencia |
| `E.<id>.t0` / `.t1` | Inicio y fin de la escena en la voz |
| `pr(t, a, b)` | Progreso de 0 a 1 entre `a` y `b` |
| `eOut(x)` / `eBack(x)` | Suavizado / rebote |
| `set(idOElemento, estilos)` | Aplica estilos |
| `entrar(el, t, t0, dur, 'y'\|'x'\|'s', dist)` | Entrada con rebote |
| `dibujarCirculo(el, t, t0)` | Círculo rojo que se dibuja (`.circulo`) |
| `golpe(el, t, t0)` | Sacudón de escala (acompaña un golpe de sonido) |
| `temblor(t, t0, dur, amp)` | Desplazamiento en px para un rechazo o error |
| `tipear(el, texto, p)` | Texto que se escribe solo |
| `hms(segundos)` | Formato 00:00:00 para relojes en vivo |
| `cierreComentario(t, 'cierre', {comenta, palabra, info, boton}, '{{PALABRA}}', corazones)` | Cierre completo de "Comentá PALABRA" |

**Pausas:** si una escena necesita más tiempo de lectura (un chat largo, por ejemplo), poné `"pausas": { "escena_siguiente": 1.2 }` en `config.json`. Se inserta ese silencio antes de esa escena, y video y audio se corren juntos.

**Sonidos:** con pocos efectos alcanza. Van `whoosh` en cada cambio de vista, `clicks` en teclas, checks y botones, `golpes` en uno o dos remates (el gancho y el sello), `errores` en un rechazo o "visto", y `cierre` en "Comentá". El motor agrega un colchón tonal casi imperceptible. **Nada de ritmo ni pulsos.**

## 6. Componentes listos (CSS del motor)

- **Planilla de papel:** `.hoja` > `h3` + `.fila` (columnas nombre, `.h` hora, `.firma` manuscrita). También `.h.marca` (hora marcada en rojo), `.circulo` y `.nota-roja` (posición absoluta).
- **Chat:** `.chat-cab` (`.chat-av` + nombre), `.chat` > `.bur.izq` / `.bur.der` (con `<small>` remitente y hora), `.sep` (fecha) y `.visto` (`.grande` lo agranda).
- **Checklist:** `.check` > `.ic[data-ic]` + `<div><b>título</b><span>detalle</span></div>` + `.ok[data-ic=check]`. `.check.mal` es la versión roja.
- **Radio de ubicación:** `.mapa` > `.rad` con `.pin`.
- **Panel en vivo:** `.kpis` > `.kpi` (`b` número, `span` texto); `.tj` (`.tj.p` es pausa) con `.av`, `.n`, y `.r[data-base=segundos]` como reloj que corre; `.excel`.
- **Gancho de lista:** `.g-top` (`.g-num` número gigante + `.g-tit`), `.senal` (`.sn`, `.bloq` borroso, `.senal.on`, `.chip-com`).
- **Celular** (`telefono-base.html`): `#cam` QR con `#scan`, `#app` con `.chipc`, `#estado`, `#boton`, `#pad` NIP con `#dots`, `#dedo` (toque) y `#confirma` > `#sello`.
- **Cierre:** `.logo-cierre` con `{{LOGO}}`, `#c-titulo`, la caja de Instagram `#c-ig`, `#c-ok`, `#c-info` y `#c-btn` (copiala de la plantilla).
- **Íconos** (sin emojis): `<span data-ic="nombre">`. Disponibles: check, cruz, checks, qr, pin, celular, casa, tabla, corazon, reloj, alerta, calendario, usuario, dinero, grafico, candado, mensaje, estrella y carrito.
- **Colores:** marca `var(--marca)`, verde `#16A34A` (éxito), rojo `#E5484D` (error), naranja `#F97316` (destacar) y azul `#4D8DFF` (UI).

Estilos propios del reel van en `estilos.css` del reel; fuentes extra en `config.json` → `fuentesExtra`.

## 7. Estándar de calidad (si no cumple, no está terminado)

- [ ] 1080×1920, 60 fps, de 20 a 45 s.
- [ ] **El cuadro 0 ya es la portada:** la escena del gancho visible y el subtítulo con la primera palabra resaltada. Nunca arranca en negro.
- [ ] La voz suena desde el segundo 0; `revisar.mjs` da OK con -14 LUFS ±1,5.
- [ ] Cada animación cae en su palabra ancla (verificado con cuadros en esos segundos).
- [ ] Sin textos pisados ni elementos fuera de la ventana; ningún ícono gigante.
- [ ] Subtítulos de 2 a 4 palabras, sin palabras sueltas (el motor ya lo hace).
- [ ] Limpio, profesional, sutil e impactante: sin confeti, sin partículas, sin emojis, sin "piu" de fondo.
- [ ] Termina con "Comentá PALABRA" animado en la caja de Instagram.
- [ ] La mascota o logo de la marca está presente (en el cierre como mínimo).

## 8. Entrega al usuario

1. **Ruta del MP4 final** (`reels/<reel>/salida/<reel>-9x16.mp4`) y del liviano (`<reel>-liviano.mp4`, de 2 a 3 MB, para WhatsApp o DM).
2. **Guion** usado, en texto.
3. **Caption** para publicar: la primera línea repite el gancho; después 2 o 3 líneas de valor, el llamado ("Comentá FICHITO y te paso…") y de 5 a 8 hashtags del rubro. Sin emojis.
4. **Portada:** el cuadro 0 (`cuadros/t-000.00.jpg`).
5. **Respuesta automática** sugerida para quien comente la palabra, corta y sin link si el usuario no lo pidió.

## 9. Piezas de Instagram (carruseles, historias, perfil)

```bash
cp -r contenido/ejemplo-fichito-semana-1 contenido/<semana-o-tema>
# editá contenido/<semana-o-tema>/piezas.mjs
node contenido/render.mjs contenido/<semana-o-tema>      # -> contenido/<...>/png/
```

`piezas.mjs` exporta `POSTS` (carruseles de 1080×1350: `{ id, nombre, slides: [...] }`), `HISTORIAS` (1080×1920) y, opcionalmente, `PERFIL = false` para no regenerar la foto de perfil.

**Tipos de slide:**

| Tipo | Campos |
|---|---|
| `portada` | `tag`, `titulo`, `sub`, `robot`, `claro` |
| `dolor` | `num`, `titulo`, `texto`, `robot` |
| `solucion` | `titulo`, `puntos[]`, `captura` |
| `pasos` | `titulo`, `pasos[]`, `captura` |
| `controles` | `titulo`, `items[[icono, título, detalle]]` |
| `panel` | `titulo`, `texto`, `variante` (`kiosco`, `rechazo`, `horas` o por defecto) |
| `rubros` | `titulo`, `items[[rubro, frase]]` |
| `numero` | `grande`, `titulo`, `texto` |
| `cta` | `titulo`, `texto`, `boton` |

Las **historias** usan `titulo`, `texto`, `robot`, `captura`, `panel`, `espacio: true` (deja lugar para un sticker de encuesta o link) y `sticker` (nota para vos de qué sticker poner, no se dibuja).

- **Robot** (siempre presente): las expresiones son `feliz`, `saludo`, `preocupado`, `sorprendido` y `pensando`.
- **Capturas** reales de la app: están en `contenido/capturas/`.
- **Ejemplo:** `contenido/ejemplo-fichito-semana-1/PLAN.md` es un plan semanal completo (2 reels, carruseles, historias, horarios y respuestas). Usalo de modelo cuando pidan un plan.

Después de renderizar, **mirá algunos PNG** (leé las imágenes) antes de entregar: textos largos se pueden cortar. Si pasa, acortá el texto.

## 10. Marca nueva

Creá `marcas/<marca>/marca.json` (mismos campos que `fichito`) y `logo.svg`, y poné `"marca": "<marca>"` en `config.json` de cada reel. Si la app no es de fichaje, armá un `telefono.html` propio en el reel con la pantalla clave del producto. Para las piezas de Instagram, copiá `contenido/plantilla.html` y cambiá colores, `LOGO`, `robot()` y el `@usuario`.

## 11. Errores ya cometidos (no los repitas)

| Problema | Solución |
|---|---|
| Audio saturado o la voz "arranca en el segundo 20" | En `aevalsrc`, siempre `exp(-k*max(t-T,0))`; ya está en `render.mjs`, no lo toques |
| "Piu" o pulso molesto en todo el video | Nada de ritmo, solo el colchón bajo del motor |
| Ícono o corazón gigante | Selectores con `>` (`.logo-cierre > svg`); los SVG llevan `width="1em"` |
| El reel arranca en negro | La primera vista con `desde: 0`; el motor ya la muestra en el cuadro 0 |
| Textos que se pisan | Cuadros en cada palabra ancla antes del render |
| Mensajes del chat que no se llegan a leer | `pausas` antes de la escena siguiente |
| "OJO: N palabras en el audio…" | Números en letras, sin siglas raras ni barras |
| `La escena X quedó sin palabras` | El servicio cortó el audio: volvé a correr `voz.py` |
| Voz robótica | edge-tts Jorge; nunca SAPI |
| Error 402 de ElevenLabs | Plan gratis: usar edge-tts |
| Confeti, emojis o precios | Prohibido (`marca.json`) |
