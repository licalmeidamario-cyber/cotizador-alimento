const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const https = require('https');

const REPO = 'licalmeidamario-cyber/cotizador-alimento';
const API_LATEST = 'https://api.github.com/repos/' + REPO + '/releases/latest';
const UA = 'CotizadorBigPickle-Updater';

function getAppContentDir() {
  return path.join(app.getPath('userData'), 'www');
}

function currentIndex() {
  const ext = path.join(getAppContentDir(), 'index.html');
  return fs.existsSync(ext) ? ext : path.join(__dirname, 'www', 'index.html');
}

function fileVersion(file) {
  try {
    const s = fs.readFileSync(file, 'utf8');
    const m = s.match(/const APP_VERSION\s*=\s*'([0-9.]+)'/);
    return m ? m[1] : '0';
  } catch (e) {
    return '0';
  }
}

function compareVersions(a, b) {
  const pa = String(a).split('.').map(Number);
  const pb = String(b).split('.').map(Number);
  for (let i = 0; i < 3; i++) {
    const x = pa[i] || 0;
    const y = pb[i] || 0;
    if (x !== y) return x > y ? 1 : -1;
  }
  return 0;
}

function getJSON(url) {
  return new Promise((resolve, reject) => {
    const req = https.get(url, {
      headers: { 'User-Agent': UA, 'Accept': 'application/vnd.github+json' }
    }, res => {
      let body = '';
      res.on('data', c => (body += c));
      res.on('end', () => {
        try { resolve(JSON.parse(body)); } catch (e) { reject(e); }
      });
    });
    req.setTimeout(8000, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

function resolveUrl(url, depth) {
  return new Promise((resolve, reject) => {
    const n = depth || 0;
    const req = https.get(url, { headers: { 'User-Agent': UA } }, res => {
      res.resume();
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        if (n >= 5) { reject(new Error('demasiados redireccionamientos')); return; }
        resolve(resolveUrl(res.headers.location, n + 1));
        return;
      }
      if (res.statusCode !== 200) { reject(new Error('HTTP ' + res.statusCode)); return; }
      resolve(url);
    });
    req.setTimeout(15000, () => req.destroy(new Error('timeout')));
    req.on('error', reject);
  });
}

function download(url, dest) {
  return resolveUrl(url).then(final => new Promise((resolve, reject) => {
    const f = fs.createWriteStream(dest);
    https.get(final, { headers: { 'User-Agent': UA } }, res => {
      if (res.statusCode !== 200) {
        f.destroy();
        try { fs.unlinkSync(dest); } catch (err) {}
        reject(new Error('HTTP ' + res.statusCode));
        return;
      }
      res.pipe(f);
      f.on('finish', () => f.close(() => resolve()));
    }).on('error', e => {
      try { fs.unlinkSync(dest); } catch (err) {}
      reject(e);
    });
  }));
}

async function latestInfo() {
  const r = await getJSON(API_LATEST);
  return {
    tag: String(r.tag_name || '').replace(/^v/, ''),
    assets: Array.isArray(r.assets) ? r.assets : []
  };
}

async function installUpdate() {
  try {
    const { tag, assets } = await latestInfo();
    const asset = assets.find(a => a.name === 'www-' + tag + '.html');
    if (!asset) return { error: 'actualización no publicada' };
    const tmp = path.join(app.getPath('userData'), '.update.tmp');
    await download(asset.browser_download_url, tmp);
    const v = fileVersion(tmp);
    if (!v || compareVersions(v, tag) !== 0) {
      fs.unlinkSync(tmp);
      return { error: 'archivo de actualización inválido' };
    }
    const cur = fileVersion(currentIndex());
    if (compareVersions(cur, v) >= 0) {
      fs.unlinkSync(tmp);
      return { error: 'ya actualizado' };
    }
    const dir = getAppContentDir();
    fs.mkdirSync(dir, { recursive: true });
    fs.renameSync(tmp, path.join(dir, 'index.html'));
    console.log('[BigPickle] contenido actualizado a v' + v);
    return { status: 'updated', version: v };
  } catch (e) {
    return { error: e.message };
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 950,
    height: 720,
    minWidth: 700,
    minHeight: 500,
    autoHideMenuBar: true,
    backgroundColor: '#020617',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js')
    }
  });
  win.loadFile(currentIndex()).then(() => console.log('[BigPickle] app lista, contenido:', path.basename(currentIndex())));
}

app.whenReady().then(() => {
  ipcMain.handle('update:install', installUpdate);
  ipcMain.handle('update:reload', () => {
    const w = BrowserWindow.getAllWindows()[0];
    if (w) {
      w.loadFile(currentIndex()).catch(() => { app.relaunch(); app.exit(0); });
      return true;
    }
    return false;
  });
  createWindow();
  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});