# Genera la voz en off + los tiempos de cada palabra (para subtítulos karaoke y para sincronizar animaciones).
# Uso: python motor/voz.py reels/<reel>          (requiere: pip install -r requirements.txt)
#   lee   reels/<reel>/guion.json   -> [["id_escena", "texto que se dice"], ...]
#   lee   reels/<reel>/config.json  -> "voz" y "velocidad" (opcionales)
#   crea  reels/<reel>/voz.mp3, voz.json, voz.js
# Voz por defecto: es-MX-JorgeNeural a +8% (la aprobada para Fichito). Escuchá las opciones en voces/.
import asyncio, json, os, pathlib, sys
import edge_tts

sys.stdout.reconfigure(encoding="utf-8")
if len(sys.argv) < 2:
    sys.exit("Uso: python motor/voz.py reels/<reel>")
DIR = pathlib.Path(sys.argv[1]).resolve()
CONFIG = json.loads((DIR / "config.json").read_text(encoding="utf-8")) if (DIR / "config.json").exists() else {}
VOZ = os.environ.get("VOZ") or CONFIG.get("voz") or "es-MX-JorgeNeural"
VELOCIDAD = os.environ.get("VELOCIDAD") or CONFIG.get("velocidad") or "+8%"
GUION = json.loads((DIR / "guion.json").read_text(encoding="utf-8"))


def contar(t):
    # Mismo criterio que edge-tts para cortar palabras: los signos sueltos no cuentan.
    return len([w for w in t.replace("¿", " ").replace("?", " ").replace("¡", " ").replace("!", " ").split() if any(c.isalnum() for c in w)])


async def sintetizar(texto):
    com = edge_tts.Communicate(texto, VOZ, rate=VELOCIDAD, boundary="WordBoundary")
    palabras, audio = [], bytearray()
    async for ch in com.stream():
        if ch["type"] == "audio":
            audio.extend(ch["data"])
        elif ch["type"] == "WordBoundary":
            palabras.append({"w": ch["text"], "t": ch["offset"] / 1e7, "d": ch["duration"] / 1e7})
    return palabras, audio


async def main():
    texto = " ".join(t for _, t in GUION)
    esperadas = sum(contar(t) for _, t in GUION)
    # El servicio a veces corta el stream a mitad de camino: si faltan palabras, se reintenta.
    for intento in range(4):
        palabras, audio = await sintetizar(texto)
        if len(palabras) >= esperadas:
            break
        print(f"Llegaron {len(palabras)} de {esperadas} palabras, reintento...")
    (DIR / "voz.mp3").write_bytes(audio)

    # Repartir las palabras en escenas según el guion (por conteo de palabras).
    escenas, i = [], 0
    for esc, t in GUION:
        n = contar(t)
        ws = palabras[i:i + n]
        i += n
        if not ws:
            sys.exit(f"La escena '{esc}' quedó sin palabras: revisá el guion (¿números o siglas raras?)")
        escenas.append({"id": esc, "texto": t, "palabras": ws, "t0": ws[0]["t"], "t1": ws[-1]["t"] + ws[-1]["d"]})
    if i != len(palabras):
        print(f"OJO: {len(palabras)} palabras en el audio y {i} en el guion. Escribí los números en letras y evitá guiones/siglas.")
    (DIR / "voz.json").write_text(json.dumps(escenas, ensure_ascii=False, indent=1), encoding="utf-8")
    (DIR / "voz.js").write_text("window.VOZ = " + json.dumps(escenas, ensure_ascii=False) + ";\n", encoding="utf-8")
    print(f"Voz {VOZ} {VELOCIDAD}: {len(palabras)} palabras, dura {palabras[-1]['t'] + palabras[-1]['d']:.2f} s")
    for e in escenas:
        print(f"{e['id']:<12} {e['t0']:6.2f} -> {e['t1']:6.2f}  {' '.join(w['w'] for w in e['palabras'])}")


asyncio.run(main())
