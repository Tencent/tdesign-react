import assert from 'node:assert/strict';
import { readFileSync, realpathSync } from 'node:fs';
import { createRequire } from 'node:module';
import { test } from 'node:test';
import { fileURLToPath, pathToFileURL } from 'node:url';

const root = new URL('../../', import.meta.url);
const read = (path) => readFileSync(new URL(path, root), 'utf8');
const requireChat = createRequire(new URL('packages/tdesign-react-aigc/package.json', root));

test('React Chat has no local ai-core dependency or source alias', () => {
  const pkg = JSON.parse(read('package.json'));
  assert.equal(pkg.dependencies['@tdesign/ai-chat-engine'], undefined);
  assert.doesNotMatch(read('.gitmodules'), /ai-core/);
  assert.doesNotMatch(read('packages/tdesign-react-aigc/site/vite.config.js'), /ai-core|@tdesign\/ai-chat-engine/);
});

test('WebC resolves the published headless engine without browser globals', async () => {
  const entry = requireChat.resolve('@tdesign/web-components-chat/chat-engine');
  const requireWebc = createRequire(entry);
  const engineEntry = realpathSync(requireWebc.resolve('@tdesign/ai-chat-engine'));
  assert.ok(!engineEntry.startsWith(fileURLToPath(new URL('packages/', root))));
  const webc = await import(pathToFileURL(entry));
  const engine = await import(pathToFileURL(engineEntry));
  assert.equal(typeof window, 'undefined');
  assert.equal(webc.ChatEngine, engine.default);
  assert.equal(webc.stateManager, engine.stateManager);
  assert.equal(webc.AGUIEventType, engine.AGUIEventType);
});

test('both size comparisons synchronize submodules before installing', () => {
  const commands = read('.github/workflows/pr-compressed-size.yml').match(/install-script: .+/g);
  assert.equal(commands.length, 2);
  for (const command of commands) {
    assert.equal(
      command,
      'install-script: bash -c "git submodule update --init --recursive && pnpm install --no-frozen-lockfile"',
    );
  }
});
