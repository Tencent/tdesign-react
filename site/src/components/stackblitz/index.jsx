import React, { useRef, useState } from 'react';
import Tooltip from 'tdesign-react/tooltip';

import {
  htmlContent,
  mainJsContent,
  styleContent,
  tsconfigContent,
  viteConfigContent,
  packageJSONContent,
  stackblitzRc,
} from './content';

const TypeScriptType = 0;

export default function Stackblitz(props) {
  const formRef = useRef(null);
  const [isTypeScriptDemo, setIsTypeScriptDemo] = useState(false);
  const [code, setCurrentCode] = useState('');
  function submit() {
    const demoDom = document.querySelector(`td-doc-demo[demo-name='${props.demoName}']`);
    const isTypeScriptDemo = demoDom?.currentLangIndex === TypeScriptType;

    setCurrentCode(demoDom?.currentRenderCode);
    setIsTypeScriptDemo(isTypeScriptDemo);

    setTimeout(() => {
      formRef.current.submit();
    });
  }

  return (
    <Tooltip content="在 Stackblitz 中打开">
      <form
        ref={formRef}
        method="post"
        action={`https://stackblitz.com/run?file=src%2F${isTypeScriptDemo ? 'demo.tsx' : 'demo.jsx'}`}
        target="_blank"
        onClick={submit}
      >
        {isTypeScriptDemo ? (
          <>
            <input type="hidden" name="project[files][src/demo.tsx]" value={code} />
            <input type="hidden" name="project[files][tsconfig.json]" value={tsconfigContent} />
          </>
        ) : (
          <input type="hidden" name="project[files][src/demo.jsx]" value={code} />
        )}
        <input type="hidden" name="project[files][src/index.css]" value={styleContent} />
        <input type="hidden" name="project[files][src/index.jsx]" value={mainJsContent} />
        <input type="hidden" name="project[files][index.html]" value={htmlContent} />
        <input type="hidden" name="project[files][vite.config.js]" value={viteConfigContent} />
        <input type="hidden" name="project[files][.stackblitzrc]" value={stackblitzRc} />
        <input type="hidden" name="project[files][package.json]" value={packageJSONContent} />
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
    </Tooltip>
  );
}
