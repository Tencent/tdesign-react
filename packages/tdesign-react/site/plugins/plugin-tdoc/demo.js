import path from 'path';
import Markdownitfence from 'markdown-it-fence';

function mdInJsx(_md) {
  return new Markdownitfence(_md, 'md_in_jsx', {
    validate: () => true,
    render(tokens, idx) {
      const { content, info } = tokens[idx];
      return `<pre className="language-${info}"><code className="language-${info}">{\`${content.replace(
        /`/g,
        '\\`',
      )}\`}</code></pre>`;
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
        const demoJsxCodeDefName = `Demo${demoPathOnlyLetters}JsxCode`;
        const isDev = process.env.NODE_ENV === 'development';
        const tpl = `
            <td-doc-demo component-name="${componentName.trim()}" demo-name="${demoName}" languages="TypeScript,JavaScript" data-JavaScript={${demoJsxCodeDefName}} data-TypeScript={${demoCodeDefName}}>
              <div slot="action">
                <Stackblitz code={${demoCodeDefName}} demoName="${demoName}"/>
                <Codesandbox code={${demoCodeDefName}} demoName="${demoName}"/>
                ${isDev ? `<NewWindow demoName="${demoName}"/>` : ''}
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
