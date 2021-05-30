import { mergeOptions } from './utils';
import { createMarkdown } from './markdown';
import transforms from './transform';

function markdownPlugin(userOptions = {}) {
  const options = mergeOptions(userOptions);
  const mdRender = createMarkdown(options);

  return {
    name: 'tdesign-markdown',
    enforce: 'pre',

    transform(raw, id) {
      if (!id.endsWith('.md')) return null;

      return mdRender(raw, id);
    },
  };
}

export { transforms };

export default markdownPlugin;
