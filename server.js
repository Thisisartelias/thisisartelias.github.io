// Plain static file server. No framework, no build step, no bundler.
// This just reads files off disk and sends them to the browser exactly as
// they are written -- normal HTML, normal CSS, normal JS.
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = __dirname;

const port = Number(process.env.PORT);
if (!port) {
  throw new Error('PORT environment variable is required but was not provided.');
}

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
};

function safeJoin(base, target) {
  const targetPath = path.posix.normalize('/' + target);
  return path.join(base, targetPath);
}

const server = http.createServer((req, res) => {
  const url = new URL(req.url, `http://localhost:${port}`);
  let pathname = decodeURIComponent(url.pathname);

  // Serve /public/* files from the public/ folder, everything else from root.
  if (pathname === '/') pathname = '/index.html';
  if (!path.extname(pathname)) pathname += '.html';

  let filePath = safeJoin(root, pathname);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      // Fall back to public/ for assets like style.css, script.js, favicon.svg
      const publicPath = safeJoin(path.join(root, 'public'), pathname);
      fs.readFile(publicPath, (err2, data2) => {
        if (err2) {
          fs.readFile(path.join(root, '404.html'), (err3, notFoundData) => {
            res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
            res.end(err3 ? 'Not found' : notFoundData);
          });
          return;
        }
        const ext = path.extname(publicPath).toLowerCase();
        res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
        res.end(data2);
      });
      return;
    }
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, { 'Content-Type': MIME_TYPES[ext] || 'application/octet-stream' });
    res.end(data);
  });
});

server.listen(port, '0.0.0.0', () => {
  console.log(`ThisIsArtElias static site serving on port ${port}`);
});
