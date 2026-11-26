import { spawn } from 'node:child_process';
import { mkdirSync, readFileSync, renameSync, rmSync, writeFileSync } from 'node:fs';
import http from 'node:http';
import net from 'node:net';
import path from 'node:path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const reviewHost = __REVIEW_HOST_JSON__;
const reviewStateDir = __REVIEW_STATE_DIR_JSON__;
const reviewConfigPath = __REVIEW_CONFIG_PATH_JSON__;
const originalPrDir = __ORIGINAL_PR_DIR_JSON__;
const originalPublishedDir = __ORIGINAL_PUBLISHED_DIR_JSON__;
const prEntry = __PR_ENTRY_JSON__;
const prStyleEntry = __PR_STYLE_ENTRY_JSON__;
const publishedEntry = __PUBLISHED_ENTRY_JSON__;
const publishedStyleEntry = __PUBLISHED_STYLE_ENTRY_JSON__;

const routesFile = path.join(reviewStateDir, 'routes.json');
const proxyPidFile = path.join(reviewStateDir, 'proxy.pid');
const proxyPort = Number(process.env.REVIEW_PROXY_PORT || 80);

function readRoutes() {
  try {
    const routes = JSON.parse(readFileSync(routesFile, 'utf8'));
    return routes && typeof routes === 'object' ? routes : {};
  } catch {
    return {};
  }
}

function withRouteLock(fn) {
  const lockPath = `${routesFile}.lock`;
  for (let attempt = 0; attempt < 50; attempt += 1) {
    try {
      mkdirSync(lockPath);
      try {
        return fn();
      } finally {
        rmSync(lockPath, { recursive: true, force: true });
      }
    } catch (error) {
      if (error.code !== 'EEXIST') throw error;
      Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 20);
    }
  }
  throw new Error('review route lock timeout');
}

function writeRoutes(routes) {
  mkdirSync(path.dirname(routesFile), { recursive: true });
  const temporary = `${routesFile}.${process.pid}.tmp`;
  writeFileSync(temporary, `${JSON.stringify(routes)}\n`);
  renameSync(temporary, routesFile);
}

function updateRoute(host, port) {
  return withRouteLock(() => {
    const routes = readRoutes();
    if (port) routes[host] = port;
    else delete routes[host];
    writeRoutes(routes);
    return routes;
  });
}

function isLoopback(address) {
  return address === '127.0.0.1' || address === '::1' || address === '::ffff:127.0.0.1';
}

function routePort(hostHeader) {
  const host = String(hostHeader || '')
    .split(':')[0]
    .toLowerCase();
  const port = Number(readRoutes()[host]);
  return Number.isInteger(port) && port > 0 ? port : 0;
}

function proxyRequest(req, res) {
  if (!isLoopback(req.socket.remoteAddress)) {
    res.destroy();
    return;
  }
  const port = routePort(req.headers.host);
  if (!port) {
    res.writeHead(404, { 'content-type': 'text/plain; charset=utf-8' });
    res.end('review route not found\n');
    return;
  }
  const upstream = http.request(
    {
      host: '127.0.0.1',
      port,
      method: req.method,
      path: req.url,
      headers: req.headers,
      timeout: 0,
    },
    (upstreamResponse) => {
      res.writeHead(upstreamResponse.statusCode ?? 502, upstreamResponse.headers);
      upstreamResponse.pipe(res);
    },
  );
  upstream.on('error', () => {
    if (!res.headersSent) {
      res.writeHead(502, { 'content-type': 'text/plain; charset=utf-8' });
      res.end('review app unavailable\n');
    } else {
      res.destroy();
    }
  });
  req.pipe(upstream);
}

function proxyUpgrade(req, socket, head) {
  if (!isLoopback(socket.remoteAddress)) {
    socket.destroy();
    return;
  }
  const port = routePort(req.headers.host);
  if (!port) {
    socket.destroy();
    return;
  }
  const upstream = net.connect({ host: '127.0.0.1', port }, () => {
    const lines = [`${req.method} ${req.url} HTTP/${req.httpVersion}`];
    for (const [key, value] of Object.entries(req.headers)) {
      if (value == null) continue;
      for (const item of Array.isArray(value) ? value : [value]) lines.push(`${key}: ${item}`);
    }
    upstream.write(`${lines.join('\r\n')}\r\n\r\n`);
    if (head?.length) upstream.write(head);
    upstream.pipe(socket);
    socket.pipe(upstream);
  });
  const closeBoth = () => {
    socket.destroy();
    upstream.destroy();
  };
  upstream.on('error', closeBoth);
  socket.on('error', closeBoth);
}

function listen(host, ipv6Only) {
  const server = http.createServer(proxyRequest);
  server.on('upgrade', proxyUpgrade);
  server.on('connection', (socket) => {
    if (!isLoopback(socket.remoteAddress)) socket.destroy();
  });
  return new Promise((resolve, reject) => {
    const onError = (error) => {
      server.off('listening', onListening);
      reject(error);
    };
    const onListening = () => {
      server.off('error', onError);
      resolve();
    };
    server.once('error', onError);
    server.once('listening', onListening);
    server.listen({ port: proxyPort, host, ipv6Only });
  });
}

async function serveProxy() {
  await listen('0.0.0.0', false);
  await listen('::', true);
  writeFileSync(proxyPidFile, `${process.pid}\n`);
  await new Promise(() => {});
}

function proxyAccepting() {
  return new Promise((resolve) => {
    const socket = net.connect({ host: '127.0.0.1', port: proxyPort }, () => {
      socket.end();
      resolve(true);
    });
    socket.on('error', () => resolve(false));
  });
}

async function ensureProxy() {
  if (await proxyAccepting()) return;
  const child = spawn(process.execPath, [reviewConfigPath, '--review-proxy'], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
}

function originalTarget(importer) {
  const cleanImporter = String(importer || '').split('?')[0];
  if (originalPrDir && cleanImporter.startsWith(`${originalPrDir}${path.sep}`)) {
    return { dir: originalPrDir, entry: prEntry, style: prStyleEntry };
  }
  if (originalPublishedDir && cleanImporter.startsWith(`${originalPublishedDir}${path.sep}`)) {
    return {
      dir: originalPublishedDir,
      entry: publishedEntry,
      style: publishedStyleEntry,
    };
  }
  return null;
}

function stopProxyIfIdle(routes) {
  if (Object.keys(routes).length > 0) return;
  try {
    process.kill(Number(readFileSync(proxyPidFile, 'utf8')), 'SIGTERM');
  } catch {
    // 转发进程已经退出
  }
  rmSync(proxyPidFile, { force: true });
}

const proxyFlag = process.argv.indexOf('--review-proxy');
if (proxyFlag !== -1) {
  await serveProxy();
}

export default defineConfig({
  root: __APP_DIR_JSON__,
  plugins: [
    react(),
    {
      name: 'review-original-demo-resolver',
      enforce: 'pre',
      resolveId(source, importer) {
        const target = originalTarget(importer);
        if (!target) return null;
        if (source === 'tdesign-react') return target.entry;
        if (
          /^tdesign-react\/(?:(?:es\/)?style(?:\/index\.(?:js|css))?|dist\/tdesign\.css)$/.test(
            source,
          )
        ) {
          return target.style;
        }
        if (source.startsWith('@/')) return path.join(target.dir, 'src', source.slice(2));
        if (source.startsWith('/src/')) return path.join(target.dir, source.slice(1));
        return null;
      },
    },
    {
      name: 'review-host-proxy',
      configureServer(server) {
        server.httpServer?.once('listening', () => {
          const address = server.httpServer?.address();
          const port = address && typeof address === 'object' ? address.port : 0;
          if (!port) return;
          updateRoute(reviewHost, port);
          ensureProxy();
        });
        return () => {
          stopProxyIfIdle(updateRoute(reviewHost, 0));
        };
      },
    },
  ],
  define: {
    __VERSION__: JSON.stringify(__SOURCE_VERSION_JSON__),
  },
  resolve: {
    alias: __ALIASES_JSON__,
    dedupe: ['react', 'react-dom'],
  },
  server: {
    host: '127.0.0.1',
    allowedHosts: [reviewHost],
    fs: {
      allow: __SERVER_ALLOW_JSON__,
    },
  },
});
