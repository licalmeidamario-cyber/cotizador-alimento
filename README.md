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

## Recompilar el CSS
Tras editar clases en `index.html`:
```
./build-css.sh
```

## Documentos de impresión
- **Cotización** (cliente): producto, precio, kilos, importe. Sin ingredientes.
- **Análisis de costos** (interno): composición de ingredientes, costos, margen real.

## Memoria del proyecto
Detalles técnicos, decisiones y bugs corregidos: `AGENTS.md`.