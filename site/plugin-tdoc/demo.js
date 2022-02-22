import path from 'path';
import Markdownitfence from 'markdown-it-fence';

function mdInJsx(_md) {
  return new Markdownitfence(_md, 'md_in_jsx', {
    validate: () => true,
    render(tokens, idx) {
      const { content, info } = tokens[idx];
      return `<pre className="language-${info}"><code className="language-${info}">{\`${content.replace(/`/g, '\\`')}\`}</code></pre>`;
    },
  });
}

export default function renderDemo(md, container) {
  md.use(mdInJsx).use(container, 'demo', {
    validate(params) {
      return params.trim().match(/^demo\s+([\\/.\w-]+)(\s+(.+?))?(\s+--dev)?$/);
    },
    render(tokens, idx) {
      if (tokens[idx].nesting === 1) {
        const match = tokens[idx].info.trim().match(/^demo\s+([\\/.\w-]+)(\s+(.+?))?(\s+--dev)?$/);
        const [, demoPath, componentName = ''] = match;
        const demoPathOnlyLetters = demoPath.replace(/[^a-zA-Z\d]/g, '');
        const demoName = path.basename(demoPath).trim();
        const demoDefName = `Demo${demoPathOnlyLetters}`;
        const demoCodeDefName = `Demo${demoPathOnlyLetters}Code`;

        const tpl = `
            <td-doc-demo code={${demoCodeDefName}} demo-name="${demoName}" component-name="${componentName.trim()}">
              <div slot="action">
                <Stackblitz code={${demoCodeDefName}} />
                <Codesandbox code={${demoCodeDefName}} />
              </div>
              <div className="tdesign-demo-item__body">
                <div style={{width: '100%'}}><${demoDefName} /></div>
              </div>
            </td-doc-demo>
          `;

        // eslint-disable-next-line no-param-reassign
        tokens.tttpl = tpl;

        return `<div className="tdesign-demo-wrapper tdesign-demo-item--${componentName.trim()}-${demoName} tdesign-demo-item--${componentName.trim()}">`;
      }
      if (tokens.tttpl) return `${tokens.tttpl || ''}</div>`;

      return '';
    },
  });
}
