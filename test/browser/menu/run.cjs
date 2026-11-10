/* eslint-disable no-await-in-loop -- Browser actions and animation samples must run sequentially. */
const assert = require('node:assert/strict');
const fs = require('node:fs/promises');
const http = require('node:http');
const path = require('node:path');
const esbuild = require('esbuild');
const less = require('less');
const { chromium } = require('playwright-core');

const repo = path.resolve(__dirname, '../../..');
const output = path.resolve(__dirname, '../.output/menu');
const styles = path.join(repo, 'packages/common/style/web');
const inlineLists = '#inline ul.t-menu__sub';

async function main() {
  await fs.mkdir(output, { recursive: true });
  const css = await less.render(
    ['theme/_index.less', '_reset.less', '_global.less', 'components/menu/_index.less', 'components/tabs/_index.less']
      .map((file) => `@import '${path.join(styles, file).replace(/\\/g, '/')}';`)
      .join('\n'),
    { javascriptEnabled: true },
  );
  await esbuild.build({
    entryPoints: [path.join(__dirname, 'app.tsx')],
    outfile: path.join(output, 'app.js'),
    bundle: true,
    jsx: 'automatic',
    define: { 'process.env.NODE_ENV': '"development"' },
    plugins: [
      {
        name: 'separate-styles',
        setup(build) {
          build.onResolve({ filter: /\.(css|less)$/ }, (args) => ({ path: args.path, namespace: 'styles' }));
          build.onLoad({ filter: /.*/, namespace: 'styles' }, () => ({ contents: '', loader: 'js' }));
        },
      },
    ],
  });
  await fs.writeFile(path.join(output, 'app.css'), css.css);
  await fs.writeFile(
    path.join(output, 'index.html'),
    `<!doctype html><html><head><meta charset="utf-8">
    <link rel="stylesheet" href="app.css"><style>
    body{margin:24px;font-family:sans-serif}h1{font-size:24px}h2{font-size:16px;margin:16px 0}
    .examples{display:flex;gap:72px}.controls{display:flex;gap:8px;margin:16px 0}
    button{padding:6px}section{min-width:180px}
    </style></head><body><div id="root"></div><script src="app.js"></script></body></html>`,
  );

  const server = http.createServer(async (request, response) => {
    const name = new URL(request.url, 'http://localhost').pathname.slice(1) || 'index.html';
    if (!['index.html', 'app.css', 'app.js'].includes(name)) {
      response.writeHead(404).end();
      return;
    }
    const contentTypes = { 'app.js': 'text/javascript', 'app.css': 'text/css', 'index.html': 'text/html' };
    response.setHeader('Content-Type', contentTypes[name]);
    response.end(await fs.readFile(path.join(output, name)));
  });
  await new Promise((resolve) => {
    server.listen(0, '127.0.0.1', resolve);
  });
  let browser;
  try {
    browser = await chromium.launch({ channel: process.env.BROWSER_CHANNEL || 'chrome', headless: true });
    const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(`http://127.0.0.1:${server.address().port}`);
    await page.locator(inlineLists).first().waitFor({ state: 'attached' });

    const sizes = () =>
      page.locator(inlineLists).evaluateAll((lists) =>
        lists.slice(0, 3).map((list) => ({
          client: list.clientHeight,
          scroll: list.scrollHeight,
          max: getComputedStyle(list).maxHeight,
        })),
      );
    const assertFits = (lists) =>
      lists.forEach((list) => assert.ok(list.client + 1 >= list.scroll, JSON.stringify(list)));
    const settle = () => page.waitForTimeout(400);
    const sample = (button, index = 2) =>
      page.evaluate(
        async ({ button, index }) => {
          const list = document.querySelectorAll('#inline ul.t-menu__sub')[index];
          const values = [list.getBoundingClientRect().height];
          document.getElementById(button).click();
          for (let i = 0; i < 24; i++) {
            await new Promise((resolve) => {
              requestAnimationFrame(resolve);
            });
            values.push(list.getBoundingClientRect().height);
          }
          return values;
        },
        { button, index },
      );
    const checkAnimation = (values, expanding) => {
      const from = values[0];
      const to = values[values.length - 1];
      assert.ok(expanding ? to > from + 10 : from > to + 10, JSON.stringify(values));
      assert.ok(
        values.filter((n) => n > Math.min(from, to) + 1 && n < Math.max(from, to) - 1).length >= 3,
        `Expected intermediate animation frames: ${JSON.stringify(values)}`,
      );
    };

    assert.equal((await sizes())[0].client, 0);
    for (const button of ['expand-l1', 'expand-l2']) {
      await page.click(`#${button}`);
      await settle();
    }
    const enter = await sample('expand-l3');
    checkAnimation(enter, true);
    await settle();
    assertFits(await sizes());
    console.info('PASS: nested custom-height content and enter animation');

    await page.click('#grow');
    await settle();
    assertFits(await sizes());
    const exit = await sample('close');
    checkAnimation(exit, false);
    await settle();
    assert.equal((await sizes())[0].client, 0);
    console.info('PASS: dynamic content and exit animation');

    // Reverse an in-flight exit. The next frame must continue from the visual height.
    await page.click('#expand-l1');
    await settle();
    const reversed = await page.evaluate(async () => {
      const list = document.querySelector('#inline ul.t-menu__sub');
      document.getElementById('close').click();
      await new Promise((resolve) => {
        setTimeout(resolve, 70);
      });
      const before = list.getBoundingClientRect().height;
      document.getElementById('expand-l1').click();
      await new Promise((resolve) => {
        requestAnimationFrame(resolve);
      });
      return { before, after: list.getBoundingClientRect().height };
    });
    assert.ok(Math.abs(reversed.after - reversed.before) < 20, JSON.stringify(reversed));
    await settle();
    for (let i = 0; i < 3; i++) {
      await page.click('#close');
      await page.waitForTimeout(50);
      await page.click('#expand-l1');
      await page.waitForTimeout(50);
    }
    await page.click('#close');
    await settle();
    assert.equal((await sizes())[0].client, 0);
    console.info('PASS: interrupted exits and rapid controlled toggles');

    await page.click('#huge');
    await settle();
    const huge = await page
      .locator(inlineLists)
      .last()
      .evaluate((list) => ({
        client: list.clientHeight,
        scroll: list.scrollHeight,
        lastBottom: list.lastElementChild.getBoundingClientRect().bottom,
        bottom: list.getBoundingClientRect().bottom,
      }));
    assert.ok(huge.scroll > 10000);
    assertFits([huge]);
    assert.ok(huge.lastBottom <= huge.bottom + 1);
    await page.click('#close');
    await settle();
    console.info('PASS: 120 tall items without an arbitrary height limit');

    const popup = page.locator('.regression-popup .t-menu__popup-wrapper');
    await popup.waitFor();
    await page.locator('.regression-popup .grow-item').evaluate((item) => {
      item.style.height = '350px';
    });
    await settle();
    for (const list of [popup, page.locator('.regression-head .t-menu__popup-wrapper')]) {
      assertFits([await list.evaluate((node) => ({ client: node.clientHeight, scroll: node.scrollHeight }))]);
    }
    console.info('PASS: delayed controlled popup, CSS-only resize, horizontal popup');

    await page.click('#expand-l1');
    await settle();
    await page.click('#sidebar-popup');
    await settle();
    await page.click('#sidebar-inline');
    await settle();
    assert.equal((await sizes())[0].client, 0);
    console.info('PASS: inline / popup mode switches preserve collapsed visibility');

    for (const button of ['expand-l1', 'expand-l2', 'expand-l3']) {
      await page.click(`#${button}`);
      await settle();
    }
    await page.screenshot({ path: path.join(output, 'expanded.png'), fullPage: true });
    assert.deepEqual(errors, []);
    await fs.writeFile(
      path.join(output, 'results.json'),
      JSON.stringify({ enter, exit, reversed, huge, errors }, null, 2),
    );
    console.info(`PASS: no browser exceptions; evidence in ${output}`);
  } finally {
    if (browser) await browser.close();
    await new Promise((resolve) => {
      server.close(resolve);
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
