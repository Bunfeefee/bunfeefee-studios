import { createServer } from 'node:http';
import { readFile } from 'node:fs/promises';
import { dirname, extname, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), 'public');
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.mp4': 'video/mp4',
  '.js': 'text/javascript; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
};
const headerFile = await readFile(resolve(root, '_headers'), 'utf8');
const headers = Object.fromEntries(
  headerFile.split(/\r?\n/).filter((line) => line.startsWith('  ')).map((line) => {
    const colon = line.indexOf(':');
    return [line.slice(0, colon).trim(), line.slice(colon + 1).trim()];
  }),
);

const server = createServer(async (request, response) => {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    response.writeHead(405, { ...headers, Allow: 'GET, HEAD' });
    response.end('Method not allowed');
    return;
  }

  let pathname;
  try {
    pathname = decodeURIComponent(new URL(request.url, 'http://localhost').pathname);
  } catch (error) {
    console.error('Invalid request URL:', error.message);
    response.writeHead(400, headers);
    response.end('Bad request');
    return;
  }

  const path = resolve(root, `.${pathname === '/' ? '/index.html' : pathname}`);
  if (!path.startsWith(root + sep) || pathname.includes('\\') || pathname.includes('\0') || pathname === '/_headers') {
    response.writeHead(403, headers);
    response.end('Forbidden');
    return;
  }

  try {
    const body = await readFile(path);
    const fileHeaders = {
      ...headers,
      'Content-Type': types[extname(path)] ?? 'application/octet-stream',
      'Accept-Ranges': 'bytes',
    };
    const range = request.headers.range;
    if (range && request.method === 'GET') {
      const match = /^bytes=(\d*)-(\d*)$/.exec(range);
      const suffix = match && !match[1] && match[2] ? Number(match[2]) : 0;
      const start = match?.[1] ? Number(match[1]) : Math.max(0, body.length - suffix);
      const end = match?.[1] && match[2] ? Math.min(Number(match[2]), body.length - 1) : body.length - 1;
      if (!match || (!match[1] && !suffix) || !Number.isSafeInteger(start) || !Number.isSafeInteger(end) || start > end || start >= body.length) {
        console.warn('Unsatisfiable byte range:', range);
        response.writeHead(416, { ...fileHeaders, 'Content-Range': `bytes */${body.length}` });
        response.end('Range not satisfiable');
        return;
      }
      response.writeHead(206, {
        ...fileHeaders,
        'Content-Range': `bytes ${start}-${end}/${body.length}`,
        'Content-Length': end - start + 1,
      });
      response.end(body.subarray(start, end + 1));
      return;
    }
    response.writeHead(200, { ...fileHeaders, 'Content-Length': body.length });
    response.end(request.method === 'HEAD' ? undefined : body);
  } catch (error) {
    if (error.code !== 'ENOENT' && error.code !== 'ENOTDIR' && error.code !== 'EISDIR') {
      console.error('Could not serve file:', error);
      response.writeHead(500, headers);
      response.end('Internal server error');
      return;
    }
    try {
      const body = await readFile(resolve(root, '404.html'));
      response.writeHead(404, { ...headers, 'Content-Type': types['.html'] });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (notFoundError) {
      console.error('Could not serve 404 page:', notFoundError);
      response.writeHead(500, headers);
      response.end('Internal server error');
    }
  }
});

server.on('error', (error) => {
  console.error('Preview server failed:', error);
  process.exitCode = 1;
});
server.listen(4173, '127.0.0.1', () => {
  console.log('Studio preview: http://127.0.0.1:4173');
});
