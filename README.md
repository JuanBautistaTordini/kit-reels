# Kit de reels y contenido

Reels verticales 9:16 estilo "explicador tech 3D" oscuro, con:

- voz neural (Jorge, la aprobada);
- subtítulos karaoke;
- efectos de sonido sutiles;
- cierre "Comentá PALABRA".

Además: carruseles, historias y foto de perfil para Instagram.

## Cómo se usa con Claude

1. Abrí una sesión de Claude Code en esta carpeta, o pasale el repo.
2. Decile qué querés y para quién. Por ejemplo:
   - *"Un reel para dueños de peluquerías sobre el barbero que llega tarde."*
   - *"Dos reels gancho y las historias de la semana para gastronomía."*
3. Claude sigue `SKILL.md` y te devuelve:
   - el MP4 final (en `reels/<reel>/salida/`) y su versión liviana;
   - el guion;
   - el caption para publicar;
   - la portada.

## Instalación (una vez)

```bash
npm install
python -m venv .tts
.tts/Scripts/pip install -r requirements.txt   # Mac/Linux: .tts/bin/pip
```

Hace falta tener **Chrome** instalado y **ffmpeg** en el PATH (en Windows: `winget install Gyan.FFmpeg`).

## Comandos

```bash
.tts/Scripts/python motor/voz.py reels/<reel>   # voz + tiempos por palabra
node motor/cuadros.mjs reels/<reel>             # cuadros de revisión (cuadros/hoja.jpg)
node motor/render.mjs reels/<reel>              # MP4 final + liviano
node motor/revisar.mjs reels/<reel>/salida/<reel>-9x16.mp4
node contenido/render.mjs contenido/<semana>    # piezas de Instagram a PNG
```

Para ver un ejemplo ya hecho: `node motor/render.mjs reels/ejemplo-fichito-2-senales` (trae su voz original, no necesita internet salvo para las fuentes).

## Llevarlo a su propio repo

```bash
git init
git add .
git commit -m "Kit de reels"
```

El `.gitignore` ya deja afuera `node_modules`, `.tts`, los HTML armados y los cuadros de revisión.
