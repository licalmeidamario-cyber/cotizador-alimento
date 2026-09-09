import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const root = path.dirname(fileURLToPath(import.meta.url));
const index = path.join(root, 'index.html');
const tmp = '/tmp/tw-offline.css';
const www = path.join(root, 'www');

let html = fs.readFileSync(index, 'utf8');
const css = fs.readFileSync(tmp, 'utf8');

const re = /<style id="tw-offline">[\s\S]*?<\/style>/;
if (!re.test(html)) throw new Error('No se encontró <style id="tw-offline"> en index.html');
html = html.replace(re, '<style id="tw-offline">\n' + css + '\n    </style>');
fs.writeFileSync(index, html);

fs.mkdirSync(www, { recursive: true });
fs.copyFileSync(index, path.join(www, 'index.html'));
console.log('index.html actualizado y copiado a www/');