import vitePluginTdoc from 'vite-plugin-tdoc';

import renderDemo from './demo';
import transforms from './transforms';

export default () =>
  vitePluginTdoc({
    transforms, // 解析 markdown 数据
    markdown: {
      anchor: {
        tabIndex: false,
        config: (anchor) => ({
          permalink: anchor.permalink.linkInsideHeader({ symbol: '' }),
        }),
      },
      toc: {
        listClass: 'tdesign-toc_list',
        itemClass: 'tdesign-toc_list_item',
        linkClass: 'tdesign-toc_list_item_a',
        containerClass: 'tdesign-toc_container',
        format: parseHeader,
      },
      container(md, container) {
        renderDemo(md, container);
      },
    },
  });

function parseHeader(header) {
  // 转义 HTML 标签
  return header.replace(/</g, '&lt;').replace(/>/g, '&gt;').trim();
}
