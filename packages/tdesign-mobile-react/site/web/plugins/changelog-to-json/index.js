import { promises } from 'fs';
import path from 'path';

import generateChangelogJson from '../../../../../common/docs/plugins/changelog-to-json';

const changelogPath = path.resolve(__dirname, '../../../../CHANGELOG.md');

export default function changelog2Json() {
  let config;
  return {
    name: 'changelog-to-json',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    configureServer(server) {
      // 开发模式时拦截请求
      server.middlewares.use('/changelog.json', async (_, res) => {
        const json = await generateChangelogJson(changelogPath, 'mobile');
        res.setHeader('Content-Type', 'application/json');
        res.end(JSON.stringify(json));
      });
    },
    async closeBundle(error) {
      if (error) return;
      // 生产构建时写入物理文件
      if (config.env.PROD || config.env.MODE === 'preview') {
        const json = await generateChangelogJson(changelogPath, 'mobile');
        const outputPath = path.resolve(config.build.outDir || path.join(config.root, 'dist'), 'changelog.json');
        await promises.writeFile(outputPath, JSON.stringify(json));
      }
    },
  };
}
