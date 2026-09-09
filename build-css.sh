#!/usr/bin/env bash
# Compila el CSS offline de Tailwind y lo inyecta en index.html (estilo #tw-offline).
# Luego copia index.html a www/ (assets de la app Android / Capacitor).
set -euo pipefail
cd "$(dirname "$0")"
npx --yes tailwindcss@3.4.17 -c tailwind.config.cjs -i input.css -o /tmp/tw-offline.css --minify
node build-css.mjs
echo "OK: CSS compilado e inyectado ($(wc -c < /tmp/tw-offline.css) bytes)."