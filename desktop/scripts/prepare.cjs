const fs = require('fs');
const path = require('path');

const root = path.join(__dirname, '..');
const src = path.join(root, '..', 'www');
const dest = path.join(root, 'www');

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(dest, { recursive: true });
fs.copyFileSync(path.join(src, 'index.html'), path.join(dest, 'index.html'));
console.log('www/ preparado para Electron');