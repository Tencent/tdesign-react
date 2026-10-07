import React from 'react';
import { renderToString } from 'react-dom/server';
import assert from 'node:assert/strict';
import { readdir, readFile } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { pathToFileURL } from 'node:url';

const root = resolve(process.argv[2] || 'packages/tdesign-react-aigc');
const pkg = JSON.parse(await readFile(join(root, 'package.json'), 'utf8'));
assert(!pkg.dependencies['@tdesign/web-components-chat'], 'Chat must not depend on webc');
assert(pkg.dependencies['@tdesign/ai-chat-engine'], 'The protocol engine must be a direct dependency');
const files = [];
async function collect(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  await Promise.all(
    entries.map(async (entry) => {
      const path = join(dir, entry.name);
      if (entry.isDirectory()) await collect(path);
      else if (/\.(js|ts|css)$/.test(entry.name)) files.push(path);
    }),
  );
}
await collect(join(root, 'es'));
assert(files.length > 0, 'The release output is missing');
await Promise.all(
  files.map(async (file) => {
    const source = await readFile(file, 'utf8');
    assert(
      !/@tdesign\/web-components|reactify|from ['"]omi['"]|react-dom\/client|attachShadow|customElements\.define/.test(
        source,
      ),
      `${file}: webc/secondary React root leaked into release`,
    );
  }),
);
const style = await readFile(join(root, 'es/style/index.js'), 'utf8');
assert(/import ['"]\.\/index\.css['"]/.test(style), 'The published style entry must import the emitted stylesheet');
const css = await readFile(join(root, 'es/style/index.css'), 'utf8');
assert(
  css.includes('data-td-chat') && css.includes('--td-chat-input-padding'),
  'Native component styles and tokens must be shipped',
);
process.stdout.write(`Chat package guard passed: ${files.length} published code/type/style files\n`);

// Exercise the published entry without a DOM; this catches eager browser-only
// dependencies that source tests (which mock the Markdown renderer) cannot see.
const Chat = await import(pathToFileURL(join(root, 'es/index.js')).href);
for (const name of [
  'ChatBot',
  'ChatList',
  'ChatMessage',
  'ChatSender',
  'ChatActionBar',
  'ChatLoading',
  'ChatThinking',
  'ChatMarkdown',
  'ChatSearchContent',
  'ChatSuggestionContent',
  'Filecard',
  'Attachments',
]) {
  const component = Chat[name];
  assert(
    typeof component === 'function' || (component && typeof component === 'object' && '$$typeof' in component),
    `${name}: invalid public component export`,
  );
}
assert(
  typeof Chat.MarkdownEngine.createSyntaxHook === 'function',
  'The Markdown extension factory must remain exported',
);
const html = renderToString(
  React.createElement(
    'main',
    null,
    React.createElement(
      Chat.ChatList,
      null,
      React.createElement(Chat.ChatMessage, { role: 'user', content: [{ type: 'text', data: 'SSR message' }] }),
    ),
    React.createElement(Chat.ChatSender, { defaultValue: 'SSR input' }),
    React.createElement(Chat.ChatMarkdown, { content: '**client preview**' }),
    React.createElement(Chat.ChatLoading),
  ),
);
assert(
  html.includes('SSR message') && html.includes('SSR input'),
  'Published components must render without a browser DOM',
);
process.stdout.write('Published package SSR import/render passed\n');
