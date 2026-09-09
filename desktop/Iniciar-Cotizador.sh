#!/usr/bin/env bash
# Inicia Cotizador BigPickle. No requiere FUSE ni instalación.
# "--no-sandbox" se usa para funcionar también en sistemas que restringen
# el sandbox de Chrome/Electron (confiable: app interna que no usa internet).
BIN_DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
exec "$BIN_DIR/cotizador-bigpickle-desktop" --no-sandbox