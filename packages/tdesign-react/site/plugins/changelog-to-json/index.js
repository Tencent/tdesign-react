import generateChangelogJson from '@tdesign/common-docs/plugins/changelog-to-json';
import { promises } from 'fs';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

// eslint-disable-next-line no-underscore-dangle
const __dirname = dirname(fileURLToPath(import.meta.url));

const outputPath = path.resolve(__dirname, '../../dist/changelog.json');
const changelogPath = path.resolve(__dirname, '../../../CHANGELOG.md');

export default function changelog2Json() {
  return {
    name: 'changelog-to-json',
    configureServer(server) {
      // 开发模式时拦截请求
      server.middlewares.use('/changelog.json', async (_, res) => {
        const json = await generateChangelogJson(changelogPath, 'web');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(json));
      });
    },
    async closeBundle() {
      // 生产构建时写入物理文件
      if (process.env.NODE_ENV === 'production') {
        const json = await generateChangelogJson(changelogPath, 'web');
        await promises.writeFile(outputPath, JSON.stringify(json));
      }
    },
  };
}
