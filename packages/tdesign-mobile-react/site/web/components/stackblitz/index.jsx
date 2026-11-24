import React, { useRef, useState } from 'react';

import {
  htmlContent,
  mainJsContent,
  styleContent,
  tsconfigContent,
  viteConfigContent,
  packageJSONContent,
  stackblitzRc,
} from './content';

export default function Stackblitz(props) {
  const formRef = useRef(null);
  const [code, setCurrentCode] = useState('');
  let pkgJSONContent = packageJSONContent;
  const match = window.location.hostname.match(/preview-pr-(\d+)-tdesign-mobile-react.surge.sh/);
  if (match) {
    const packageJSON = JSON.parse(packageJSONContent);
    packageJSON.dependencies['tdesign-mobile-react'] =
      `https://pkg.pr.new/Tencent/tdesign-mobile-react/tdesign-mobile-react@${match[1]}`;
    pkgJSONContent = JSON.stringify(packageJSON, null, 2);
  }
  function submit() {
    const demoDom = document.querySelector(`td-doc-demo[demo-name='${props.demoName}']`);

    setCurrentCode(demoDom?.currentRenderCode);

    setTimeout(() => {
      formRef.current.submit();
    });
  }

  return (
    <td-tooltip trigger-type="hover">
      <form
        ref={formRef}
        method="post"
        action={`https://stackblitz.com/run?file=src%2Fdemo.tsx'}`}
        target="_blank"
        onClick={submit}
      >
        <input type="hidden" name="project[files][src/demo.tsx]" value={code} />
        <input type="hidden" name="project[files][tsconfig.json]" value={tsconfigContent} />
        <input type="hidden" name="project[files][src/index.css]" value={styleContent} />
        <input type="hidden" name="project[files][src/index.jsx]" value={mainJsContent} />
        <input type="hidden" name="project[files][index.html]" value={htmlContent} />
        <input type="hidden" name="project[files][vite.config.js]" value={viteConfigContent} />
        <input type="hidden" name="project[files][.stackblitzrc]" value={stackblitzRc} />
        <input type="hidden" name="project[files][package.json]" value={pkgJSONContent} />
        <input type="hidden" name="project[template]" value="node" />

        <div className="action-online">
          <svg viewBox="0 0 28 28" height="20">
            <path
              fill="currentColor"
              d="M12.747 16.273h-7.46L18.925 1.5l-3.671 10.227h7.46L9.075 26.5l3.671-10.227z"
            ></path>
          </svg>
        </div>
      </form>
      <span slot="content">在 Stackblitz 中打开</span>
    </td-tooltip>
  );
}
