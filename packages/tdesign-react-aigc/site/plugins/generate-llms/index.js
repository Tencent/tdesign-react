import { existsSync, promises, readFileSync } from 'fs';
import path from 'path';

import generateLlmsDocs, { createComponentDocParser } from '@tdesign/common-docs/plugins/generate-llms';

/**
 * 读取组件目录下的 demo 源码：_example/<demoName>.tsx，回退 <demoName>/index.tsx。
 * 输出 tsx 代码块。
 */
function readReactDemo(componentDir, demoName) {
  const candidates = [
    path.join(componentDir, '_example', `${demoName}.tsx`),
    path.join(componentDir, '_example', demoName, 'index.tsx'),
  ];
  for (const candidate of candidates) {
    try {
      const content = readFileSync(candidate, 'utf-8');
      if (content.trim()) return `\`\`\`tsx\n${content.trim()}\n\`\`\``;
    } catch {
      // 继续尝试下一个候选路径
    }
  }
  return '';
}

/**
 * 判断是否为 demo 占位符：匹配 _example/<demoName>.tsx 或 _example/<demoName>/index.tsx。
 * 本仓库 demo 为扁平 .tsx 文件（非目录），默认目录判断不命中，需自定义以正确替换 {{ demo }}。
 */
function isDemoSlot(componentDir, demoName) {
  const candidates = [
    path.join(componentDir, '_example', `${demoName}.tsx`),
    path.join(componentDir, '_example', demoName, 'index.tsx'),
  ];
  return candidates.some((candidate) => existsSync(candidate));
}

/**
 * vite 插件：chat 站点构建时，基于 CHAT_COMPONENT_MAP 生成组件的 LLM Markdown 文档。
 * 核心逻辑为纯 JS 方法 generateLlmsDocs（来自 common 的 docs/plugins/generate-llms），
 * 此处仅负责 vite 构建钩子分发，并按 React AIGC 仓库约定注入组件文档与 demo 源码读取器。
 */
export default function generateChatLlms() {
  let config;
  return {
    name: 'generate-llms',
    configResolved(resolvedConfig) {
      config = resolvedConfig;
    },
    async closeBundle(error) {
      if (error) return;
      if (!config.env.PROD && config.env.MODE !== 'preview') return;

      // 基于 config.root 推导路径，避免依赖 __dirname 多层回溯
      const siteRoot = config.root;
      const componentsRoot = path.resolve(siteRoot, '../../pro-components/chat');
      // 产物输出目录：从 config.build.outDir 推导，避免硬编码 dist
      const outputDir = config.build.outDir || path.join(siteRoot, 'dist');

      // 组件文档读取器：React AIGC 组件文档为全量内容（用法 + API），直接读取组件目录 <slug>.md；
      // 不回退 common 子仓文档，避免生成 React AIGC 中不存在的组件（如 chat-content）
      const readComponentDoc = async (componentDir, slug) => {
        try {
          return await promises.readFile(path.join(componentDir, `${slug}.md`), 'utf-8');
        } catch {
          return null;
        }
      };

      // 通用文档解析管道：读取 frontmatter -> 替换 demo -> 清理正文
      const parseComponentDoc = createComponentDocParser({
        readComponentDoc,
        readDemoCode: readReactDemo,
        isDemoSlot,
        transformers: [],
      });

      await generateLlmsDocs({
        componentsRoot,
        outputDir,
        platform: 'chat',
        parseComponentDoc,
        splineLabels: { aigc: 'AI' },
        siteTitle: 'TDesign React AIGC',
        siteDescription: 'TDesign React AIGC 聊天组件库的 LLM 友好文档索引。',
      });
    },
  };
}
