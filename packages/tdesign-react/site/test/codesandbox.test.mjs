import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import test from 'node:test';

const codesandboxDir = join(dirname(fileURLToPath(import.meta.url)), '../src/components/codesandbox');
const indexSource = readFileSync(join(codesandboxDir, 'index.jsx'), 'utf8');

// Regression: the CodeSandbox "define" request must be issued through a single
// shared code path. The baseline builds the whole fetch payload twice (once for
// `.tsx` demos, once for `.jsx` demos), so any template fix has to be edited in
// two places and can drift apart. On the unfixed source this assertion fails
// with `2 !== 1`.
test('CodeSandbox define API request is built once and shared for JS and TS demos', () => {
  const occurrences = indexSource.match(/codesandbox\.io\/api\/v1\/sandboxes\/define/g) ?? [];
  assert.equal(occurrences.length, 1);
});

// Boundaries of the refactor: deduplicating the payload must not drop support
// for either demo language or change what the action does on success.
test('sandbox generation still supports both JS and TS demos', () => {
  // Language detection still drives which file names are posted.
  assert.match(indexSource, /currentLangIndex|isTypeScriptDemo/);
  assert.match(indexSource, /tsx/);
  assert.match(indexSource, /jsx/);
  // TS demos keep their tsconfig; JS demos still omit it.
  assert.match(indexSource, /tsconfig\.json/);
  // Every variant still ships the shared manifest, page and styles.
  assert.match(indexSource, /'package\.json'/);
  assert.match(indexSource, /'public\/index\.html'/);
  assert.match(indexSource, /'src\/index\.css'/);
});

test('successful sandbox creation still opens the returned sandbox URL', () => {
  assert.match(indexSource, /window\.open\(`https:\/\/codesandbox\.io\/s\//);
});
