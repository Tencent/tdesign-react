import React from 'react';
import { renderToString } from 'react-dom/server';
import assert from 'node:assert/strict';
import { cp, mkdtemp, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
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

// Compile a real consumer against emitted declarations with strict null checks.
// Source builds use different compiler options and can miss broken public types.
const require = createRequire(import.meta.url);
const consumerDir = await mkdtemp(join(tmpdir(), 'tdesign-chat-api-'));
try {
  // Keep the published peer declarations outside this monorepo: otherwise
  // their common-js imports resolve to workspace .ts sources, not consumer libs.
  const peer = join(consumerDir, 'peer');
  await cp(join(root, 'node_modules/tdesign-react/es'), join(peer, 'es'), { recursive: true });
  const reactTypes = dirname(require.resolve('@types/react/package.json'));
  const consumer = join(consumerDir, 'consumer.tsx');
  await writeFile(
    consumer,
    `import React from 'react';
import { ChatBot, ChatList, ChatMessage, ChatSender, ChatActionBar, ChatLoading,
  ChatThinking, ChatSearchContent, ChatSuggestionContent, Attachments, Filecard,
  ChatMarkdown, useChat } from ${JSON.stringify(join(root, 'es/index.js'))};
export function Consumer() {
  const { messages } = useChat({ defaultMessages: [], chatServiceConfig: { endpoint: '/chat' } });
  return <main>
    <ChatBot defaultMessages={[]} onChatAfterSend={e => e.detail.prompt?.toUpperCase()} />
    <ChatList defaultScrollTo="bottom">{messages.map(m => <ChatMessage key={m.id} message={m} />)}</ChatList>
    <ChatSender value="input" onChange={e => e.detail.toUpperCase()} onSend={e => e.detail.value.toUpperCase()} />
    <ChatActionBar actionBar={['good', <button key="custom">custom</button>]} />
    <ChatLoading animation="dots" />
    <ChatThinking content={{ text: 'thinking' }} onCollapsedChange={e => Boolean(e.detail)} />
    <ChatSearchContent content={{ title: 'search', references: [] }} handleSearchItemClick={d => d.content.title} />
    <ChatSuggestionContent content={[{ title: 'prompt' }]} handlePromptClick={d => d.content.title} />
    <Attachments items={[{ name: 'file.pdf', status: 'success' }]} onRemove={e => e.detail.name} />
    <Filecard item={{ name: 'file.pdf', status: 'progress', percent: 40 }} />
    <ChatMarkdown content="code" options={{ callback: { onCopyCode: (_event, code) => code } }} />
  </main>;
}
`,
  );
  const tsconfig = join(consumerDir, 'tsconfig.json');
  await writeFile(tsconfig, JSON.stringify({
    compilerOptions: {
      noEmit: true, strict: true, skipLibCheck: true, target: 'ES2020',
      module: 'ESNext', moduleResolution: 'bundler', jsx: 'react-jsx',
      paths: {
        react: [join(reactTypes, 'index.d.ts')],
        'react/jsx-runtime': [join(reactTypes, 'jsx-runtime.d.ts')],
        'tdesign-react': [join(peer, 'es/index.d.ts')],
        'tdesign-react/*': [join(peer, '*')],
      },
    },
    files: ['consumer.tsx'],
  }));
  execFileSync(
    process.execPath,
    [
      require.resolve('typescript/lib/tsc.js'),
      '-p', tsconfig,
    ],
    { stdio: 'inherit' },
  );
  process.stdout.write('Published package strict TypeScript consumer passed\n');
} finally {
  await rm(consumerDir, { recursive: true, force: true });
}
