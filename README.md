# Cotizador Alimento Animal — BigPickle v3

Cotizador de alimento balanceado para gallina de postura (Orgánicos Milenarios). App web de un solo archivo, funciona **sin internet**, y versión Android (APK) vía Capacitor.

## Uso en PC
Abre el archivo `index.html` con el navegador (Chrome/Chromium/Edge). Todo se guarda en `localStorage` del navegador.

## Servidor interno
Copia `index.html` a tu servidor (basta servirlo como archivo estático). El guardado es por navegador.

## App Android (APK)
```
npm install
./build-css.sh          # compila CSS offline e inyecta en index.html y www/
npx cap sync android
cd android && ./gradlew assembleDebug
```
El APK queda en `android/app/build/outputs/apk/debug/app-debug.apk`.
Para instalarlo en el celular: cópialo y ábrelo (permite "instalar de orígenes desconocidos").
Funciona completamente sin internet.

Requisitos de build: JDK 21 y Android SDK (platforms y build-tools 34/35). En este equipo: `JAVA_HOME=/home/malto/miniconda3/envs/j21`, SDK en `~/Android/Sdk`.

## Recompilar el CSS
Tras editar clases en `index.html`:
```
./build-css.sh
```

## App Windows (portátil) — Electron
```
cd desktop
npm install
npm run build:win
```
Genera `desktop/dist/CotizadorBigPickle-Windows-<version>.exe` (~71 MB).
Copia ese `.exe` a cualquier PC con Windows y ejecútalo: no requiere instalación ni internet.

## App Linux (portátil) — Carpeta portable (Recomendado)
Muchos Linux no traen `libfuse2` y el AppImage no arranca. Por eso se entrega una carpeta portable:
1. Descarga `CotizadorBigPickle-Linux-portable-<v>.tar.gz` (Release).
2. Extrae donde quieras (ej. `tar -xzf ...`).
3. Doble clic a **`Iniciar-Cotizador.sh`** (funciona en cualquier Linux, sin internet).
4. Opcional: ejecuta **`Instalar-acceso-directo.sh`** para que aparezca en el menú de aplicaciones.

## App Linux (AppImage) — alternativa
Solo si el sistema tiene FUSE 2 (`libfuse2`). `chmod +x *.AppImage` y ejecuta. Si no: `./*.AppImage --appimage-extract-and-run`.
Compilar desde código: `cd desktop && npm run build:linux`.

## Documentos de impresión
- **Cotización** (cliente): producto, precio, kilos, importe. Sin ingredientes.
- **Análisis de costos** (interno): composición de ingredientes, costos, margen real.

## Memoria del proyecto
Detalles técnicos, decisiones y bugs corregidos: `AGENTS.md`.