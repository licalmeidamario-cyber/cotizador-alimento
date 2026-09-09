#!/usr/bin/env bash
# Crea el acceso directo "Cotizador BigPickle" en el menú de aplicaciones.
set -e
DIR="$(cd -- "$(dirname -- "$0")" && pwd)"
chmod +x "$DIR/Iniciar-Cotizador.sh"

mkdir -p "$HOME/.local/share/applications"
cat > "$HOME/.local/share/applications/cotizador-bigpickle.desktop" <<EOF
[Desktop Entry]
Type=Application
Name=Cotizador BigPickle
GenericName=Cotizador de alimento balanceado
Comment=Alimento para gallina de postura (Orgánicos Milenarios)
Exec=$DIR/Iniciar-Cotizador.sh
Icon=$DIR/cotizador-bigpickle-desktop.png
Terminal=false
Categories=Office;Finance;
EOF
echo "Listo. Busca 'Cotizador BigPickle' en el menú de aplicaciones."
echo "Acceso directo: $HOME/.local/share/applications/cotizador-bigpickle.desktop"