# Proyecto: Cotizador Alimento Animal — BigPickle v3

## Contexto
Negocio "Orgánicos Milenarios": producen y venden alimento balanceado para **gallina de postura en producción**. Recetas reales de la farmacia/agroveterinaria (núcleo). Herramienta interna de cotización, será subida a servidor interno de la empresa.

## Archivo principal
- Ruta: `projects/alimento-animal-v3/index.html`
- Stack: HTML único + Tailwind CDN + JavaScript vanilla + `localStorage` (sin build).
- Predecesores (referencia, sin migrar): `projects/alimento-animal`, `projects/alimento-animal-copia`, `projects/alimento-animal-v2`.

## Estado actual (última sesión)
- Implementado y probado con Chromium headless. Todo funcional.
- 3 opciones de cotización (A/B/C) persistibles en `localStorage`.
- Usuario está probándolo; dará feedback en unos días (aprox. 2026-09-10).

## Funcionalidades implementadas
- **Multicotización**: 3 tarjetas (opciones). Se pueden **ocultar/reactivar** (botón ✕ en tarjeta + barra "Opciones ocultas"). Nunca menos de 1 visible. Selector de impresión solo lista visibles.
- **Ingredientes**: lista base con precio y unidad:
  Maíz 6.8/kg, Pasta de soya 10/kg, Sorgo 5/kg, Trigo 6.5/kg, Calcio fino 7/kg, Calcio grueso 7/kg, Aceite vegetal 35/L, Núcleo 82/kg.
- **Nombre manual + guardado**: el campo es texto con autocompletado (datalist); nombres nuevos se guardan en `localStorage` (`alimento_ingredientes_v3`) y reaparecen.
- **Precios ajustables persistentes**: si se edita un precio en pantalla, se guarda en `alimento_precios_v3` y se usa como automático (`precioMaestro`).
- **Unidades**: kg y L (aceite). Aparecen junto al campo de cantidad y en impresiones.
- **Decimales**: campos precio/margen/venta son texto con `inputmode="decimal"`; aceptan **coma y punto** (`num()` normaliza `,`→`.`). Cantidad: number (paso 0.01).
- **Composición**: bloque estructurado por ingrediente con barra proporcional y % (texto 14px).
- **Campos por opción**: margen (%), precio sugerido, precio de venta $/kg, **kilos a cotizar**, **maquila $/kg**, **empacado $/kg**.
  - Costo total = costo ingredientes (promedio ponderado) + maquila + empacado.
  - Precio sugerido = costo total / (1 − margen/100). Utilidad y margen real se calculan vs costo total.
- **Ajuste a 1000 kg**: escala cantidades a exactamente 1000 (método mayor residuo).
- **Historial**: guardar/cargar/eliminar con dedupe por nombre+cliente; deep-copy (sin referencias compartidas).
- **Impresiones (2)**, ambas con emulación de media print y toggle `body[data-imp]`:
  1. **Cotización** (cliente): producto terminado, precio, kilos, importe + nota "incluye maquila y empacado". Sin ingredientes.
  2. **Análisis de costos** (uso interno): lista de ingredientes (cant/%/$/parcial), costo ingredientes, maquila, empacado, costo total, sug. margen%, venta, utilidad/kg, utilidad/ton, margen real.
- **Responsive móvil**: sin scroll horizontal a 375px, filas de ingredientes apiladas en móvil, inputs 16px (evita zoom iOS).

## Claves de localStorage
- `alimento_options_v3` (3 opciones con recetas)
- `historial_v3`
- `alimento_visibles_v3`
- `alimento_ingredientes_v3` (nombres custom)
- `alimento_precios_v3` (precios ajustados)

## Números de referencia (redondeo)
- Receta típica prueba: maíz 420, soya 220, sorgo 150, calcio fino 100, grueso 60, aceite 30 L, núcleo 20 (1000 kg).
- Costo antes de maquila ~$9.62/kg; maquila 0.80, empacado 0.50 → total ~$11.45/kg (sin ajuste).

## Trabajo previo descartado/migrado
- v1/v2 tenían bugs: pérdida de foco al escribir (oninput + render completo) — corregido con actualización selectiva y "no pisar campo enfocado".
- v2 usaba `<select>` fijo y margen sin validar (Infinity) — resuelto.

## Repositorio y despliegue (2026-09-09)
- Repo privado GitHub: **licalmeidamario-cyber/cotizador-alimento** (rama `main`).
- Autenticación: GitHub CLI (`gh`) en `~/.local/bin/gh`, logueado con **licalmeidamario-cyber**. `git` usa `credential.helper = !~/.local/bin/gh auth git-credential`.
- **Tailwind offline**: el CSS ahora se compila a `tailwind` (config `tailwind.config.cjs`, `input.css`) y se inyecta en línea como `<style id="tw-offline">` dentro de `index.html`. YA NO usa CDN → funciona sin internet. Recetas: `grid-cols-[...]` arbitrarias se reemplazaron por `grid-cols-ings` (detectadas en `gridTemplateColumns`); el extractor de Tailwind NO genera valores arbitrarios con decimal/underscore, usar `safelist` o extensiones de tema.
- Recompilar CSS tras editar clases: `./build-css.sh` (inyecta en `index.html` y copia a `www/`).
- **App Android (APK)**: Capacitor 8.5 (requiere **JDK 21**). `www/` es el webDir; `android/` proyecto generado. Compilar: `cd android && ./gradlew assembleDebug` → `app/build/outputs/apk/debug/app-debug.apk`. Copia del APK: `~/Descargas/CotizadorBigPickle-v3.apk`.
- **Entorno build local**: JDK 21 en conda env `j21` (`JAVA_HOME=/home/malto/miniconda3/envs/j21`), Android SDK en `~/Android/Sdk` (platforms 34/35, build-tools 34/35). Variables exportadas en `~/.zshrc`.
- APK instalado en el celular funciona 100% sin internet (verificado con red bloqueada en Chromium).
- **App Windows (Escritorio)**: Electron 33 + electron-builder (`desktop/`). `npm run build:win` → `desktop/dist/CotizadorBigPickle-Windows-<v>.exe` (portable, ~71 MB, sin instalación, sin internet). Subido a GitHub Release **v1.1.0**. Notable: `electron-builder` descarga su propio Electron de Windows por lo que el binario Linux local no es necesario; npm bloquea el postinstall de electron → aprobar con `npm install-scripts approve electron`.
- **App Linux (Escritorio)**: mismo `desktop/`, `npm run build:linux` → `CotizadorBigPickle-<v>.AppImage` (~104 MB, x64). Release v1.2.0. ⚠ Esta PC de trabajo NO tiene `libfuse2` → el AppImage no arranca aquí ("dlopen(): error loading libfuse.so.2"). SOLUCIÓN USADA: carpeta portable generada de `dist/linux-unpacked` + `Iniciar-Cotizador.sh` (ejecuta el binario con `--no-sandbox`, necesario en sistemas sin userns/setuid) e `Instalar-acceso-directo.sh` (crea entrada de menú). Empaquetada como `CotizadorBigPickle-Linux-portable-v1.0.0.tar.gz` (102 MB) → Release **v1.3.0** (la recomendada para PCs Linux). Instalada localmente en `~/CotizadorBigPickle/` (acceso directo creado). Android=APK v1.0.0, Windows=exe v1.1.0, Linux portátil=v1.3.0, AppImage=v1.2.0.

- **Impresión a PDF** (2026-09-09): se agregó `@page { size: letter; margin: 12mm; }` y CSS compacto en `@media print` (h1 19px, body 11px, tablas 10.5px, celdas `padding:3px 6px`, párrafos `margin:2px 0 !important`) para que cotización y análisis salgan en **1 sola hoja tamaño carta**. `imprimir(modalidad)` fija `document.title` a `cotizacion alimento (CLIENTE FECHA)` (fecha ISO `YYYY-MM-DD`; sin cliente usa `sin cliente`) y lo **restaura con `window.addEventListener('afterprint', ...)`**, NO después de `window.print()` (que es ASÍNCRONO → si se restaura al vuelo, el diálogo PDF lee el título viejo y guarda con el nombre equivocado). Verificado con CDP: título nuevo durante todo el diálogo, restaura al cerrar.

- **Impresión en Android**: `window.print()` NO funciona en el WebView. Solución: plugin **`@capgo/capacitor-printer` v8** (compatible Capacitor 8). En `imprimir()`, si `window.Capacitor.Plugins.Printer` existe usa `printWebView({ name })` (nombre = `cotizacion alimento (CLIENTE FECHA)`); si no, `window.print()` (PC/navegador). En Android el diálogo nativo del sistema permite "Guardar como PDF". Verificado integración: `android/capacitor.settings.gradle` + `cap/go plugin` → APK creció a 7.1 MB. Test de impresión en dispositivo real: pendiente del usuario.

## Pendientes / feedback pendiente del usuario
- Usuario dice "mantener memoria persistente" (este archivo).
- Falta conocer costos reales de maquila y empacado de la empresa (campos en 0).
- **Despliegue**: se trabajará en el servidor de la empresa cuando el usuario termine sus pruebas locales. Recordar que `localStorage` es por navegador; si varios empleados comparten el servidor convendrá decidir si se quiere guardado compartido (backend/BD) o uno por máquina.
- Feedback del usuario tras probar la app (aprox. 2026-09-10+).

## Notas de sesiones futuras
- ALWAYS recordar: probar con `chromium --headless=new` + CDP (o revisar que render haga focus-retention en inputs).
- No usar `alert()` (rompe pruebas headless); usar toasts.
- Mantener todo en UN solo index.html autónomo (sin dependencias locales).