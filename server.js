const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 3000;
const BASE = __dirname;

const MIME_TYPES = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf',
  '.otf': 'font/otf',
  '.eot': 'application/vnd.ms-fontobject',
  '.pdf': 'application/pdf',
  '.txt': 'text/plain',
  '.xml': 'application/xml',
  '.zip': 'application/zip',
  '.map': 'application/octet-stream',
};

function getContentType(filePath) {
  return MIME_TYPES[path.extname(filePath).toLowerCase()] || 'application/octet-stream';
}

function sendFile(res, filePath) {
  return new Promise((resolve) => {
    fs.readFile(filePath, (err, data) => {
      if (err) { resolve(false); return; }
      const ext = path.extname(filePath);
      const ct = (ext === '.html' || ext === '.htm') ? 'text/html' : getContentType(filePath);
      res.writeHead(200, { 'Content-Type': ct, 'Access-Control-Allow-Origin': '*' });
      res.end(data);
      resolve(true);
    });
  });
}

function send404(res) {
  res.writeHead(404, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end('404 Not Found');
}

function send500(res) {
  res.writeHead(500, { 'Content-Type': 'text/plain', 'Access-Control-Allow-Origin': '*' });
  res.end('500 Internal Server Error');
}

const server = http.createServer((req, res) => {
  try {
    console.log(`${new Date().toISOString()} ${req.method} ${req.url}`);
    let requestPath = decodeURIComponent(req.url.split('?')[0].split('#')[0]);

    // Normalize: remove trailing slash for non-root paths
    if (requestPath.length > 1 && requestPath.endsWith('/')) {
      requestPath = requestPath.slice(0, -1);
    }

    // Root
    if (requestPath === '/' || requestPath === '') {
      sendFile(res, path.join(BASE, 'index.html')).catch(() => send500(res));
      return;
    }

    // Route legacy account-number login URLs to the local demo login page.
    if (requestPath === '/RS/UN-Display.do' || requestPath === '/RS/UN-Display') {
      sendFile(res, path.join(BASE, 'log-in', 'index.html')).catch(() => send500(res));
      return;
    }

    // Route account-number submit to the local demo dashboard.
    if (requestPath === '/RS/UN-Submit.do') {
      res.writeHead(303, {
        'Location': '/dashboard/',
        'Cache-Control': 'no-store',
        'Access-Control-Allow-Origin': '*'
      });
      res.end();
      return;
    }

    // Route "Open a New Account" links to onboarding flow
    if (requestPath === '/RS/UN-AccountCreate.do' || requestPath === '/open-account') {
      sendFile(res, path.join(BASE, 'open-account', 'index.html')).catch(() => send500(res));
      return;
    }

    const filePath = path.join(BASE, requestPath);
    const ext = path.extname(filePath);

    if (ext) {
      // Has file extension -> serve directly, fallback to root index.html
      sendFile(res, filePath).then((ok) => {
        if (!ok) {
          sendFile(res, path.join(BASE, 'index.html')).then((ok2) => {
            if (!ok2) send500(res);
          });
        }
      });
    } else {
      // No extension -> try as-is, then /index.html, then fallback
      sendFile(res, filePath).then((ok) => {
        if (!ok) {
          sendFile(res, filePath + '.html').then((ok2) => {
            if (!ok2) {
              sendFile(res, path.join(filePath, 'index.html')).then((ok3) => {
                if (!ok3) {
                  sendFile(res, path.join(BASE, 'index.html')).then((ok4) => {
                    if (!ok4) send500(res);
                  });
                }
              });
            }
          });
        }
      });
    }
  } catch (err) {
    console.error('Server error:', err);
    try { send500(res); } catch (_) {}
  }
});

server.listen(PORT, () => {
  console.log(`TreasuryDirect mirror server running at http://localhost:${PORT}`);
});
