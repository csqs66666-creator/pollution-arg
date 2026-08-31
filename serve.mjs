// 钓渊 · 零依赖离线服务器
// 仅用 Node 内置模块，不安装任何包。用于"此刻没有网络 / 没装 vite"时直接跑游戏。
// 用法： node serve.mjs   （然后浏览器打开 http://localhost:5173）
// 有网络后： npm install && npm run dev  即可切到标准 Vite 开发流，工程结构无需改动。

import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = __dirname;
const PORT = process.env.PORT || 5173;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm',
  '.ogg': 'video/ogg',
  '.mov': 'video/quicktime',
  '.woff2': 'font/woff2'
};

const server = createServer(async (req, res) => {
  try {
    let urlPath = decodeURIComponent((req.url || '/').split('?')[0]);
    if (urlPath === '/') urlPath = '/prologue.html';
    // 阻止路径穿越
    const safe = normalize(urlPath).replace(/^(\.\.[/\\])+/, '');
    let filePath = join(ROOT, safe);
    let data;
    try {
      const s = await stat(filePath);
      if (s.isDirectory()) filePath = join(filePath, 'index.html');
      data = await readFile(filePath);
    } catch {
      // 无扩展名的路径（SPA 风格）回退到 index.html
      if (!extname(filePath)) {
        filePath = join(ROOT, 'index.html');
        data = await readFile(filePath);
      } else {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }
    }
    const type = MIME[extname(filePath)] || 'application/octet-stream';
    // 本地预览永远拿最新改动，避免浏览器 disk cache 导致"改了看不到"（需要手动 Ctrl+F5）
    res.writeHead(200, {
      'Content-Type': type,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0'
    });
    res.end(data);
  } catch (e) {
    res.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
    res.end('500 ' + e.message);
  }
});

server.listen(PORT, () => {
  console.log(`钓渊 · 离线服务器已启动： http://localhost:${PORT}`);
  console.log('（按 Ctrl+C 停止。有网后可用 npm install && npm run dev 切到 Vite 开发流）');
});
