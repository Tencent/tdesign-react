import fs from 'fs';
import path from 'path';
import vitePluginTdoc from 'vite-plugin-tdoc';

import transforms from './transform';
import renderDemo from './render-demo';

// 解析 markdown 内容
function customRenderInfo(source, id, md) {
  const mdSegment = {
    title: '',
    description: '',
    docMd: '',
    demoMd: '',
    apiMd: '',
    designMd: '### 文档 (🚧建设中）...',
    isComponent: false,
  };
  const titleLocation = source.search(/[\r\n]/);
  const describeLocation = source.split(/[\r\n]#+\s|:::\s/)[0].length || titleLocation;
  const propsRegLocation = source.search(/#+\s*属性配置\n|(#+\s*\S*\s*props\n)/i);

  mdSegment.title = source.slice(2, titleLocation) || '';
  mdSegment.description = source.slice(titleLocation, describeLocation).trim() || '';
  mdSegment.docMd = source.slice(describeLocation, propsRegLocation);
  mdSegment.isComponent = propsRegLocation !== -1;

  // 有 props 说明是组件文档
  if (propsRegLocation !== -1) {
    mdSegment.demoMd = source.slice(describeLocation, propsRegLocation);
    mdSegment.apiMd = source.slice(propsRegLocation);
  }

  // 设计指南内容
  const reg = id.match(/src\/(\w+-?\w+)\/\w+\.md/);
  const componentName = reg && reg[1];
  const designDocPath = path.resolve(__dirname, `../../src/_common/docs/web/design/${componentName}.md`);

  if (fs.existsSync(designDocPath)) {
    mdSegment.designMd = fs.readFileSync(designDocPath, 'utf-8');
  }

  return mdSegment;
}

export default () => vitePluginTdoc({
  mdClassPrefix: 'tdesign',
  customRenderInfo,
  transforms, // 解析markdown 数据
  markdownItSetup(md) {
    renderDemo(md);
  },
});
