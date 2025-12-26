import { promises as fs } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import generateChangelogJson from '@tdesign/common-docs/plugins/changelog-to-json';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = path.resolve(__dirname, '../../dist');
const rootDir = path.resolve(__dirname, '../../../');

const changelogConfigs = [
  {
    input: 'CHANGELOG.md',
    output: 'changelog.json',
  },
  {
    input: 'CHANGELOG.en-US.md',
    output: 'changelog.en-US.json',
  },
];

async function generate(input) {
  return generateChangelogJson(path.resolve(rootDir, input), 'web');
}

export default function changelog2Json() {
  return {
    name: 'changelog-to-json',
    configureServer(server) {
      // 开发模式时拦截请求
      changelogConfigs.forEach(({ input, output }) => {
        server.middlewares.use(`/${output}`, async (_, res) => {
          const json = await generate(input);
          res.setHeader('Content-Type', 'application/json');
          res.end(JSON.stringify(json));
        });
      });
    },

    async closeBundle() {
      // 生产构建时写入物理文件
      if (process.env.NODE_ENV !== 'production') return;
      await Promise.all(
        changelogConfigs.map(async ({ input, output }) => {
          const json = await generate(input);
          await fs.writeFile(path.resolve(distDir, output), JSON.stringify(json));
        }),
      );
    },
  };
}
