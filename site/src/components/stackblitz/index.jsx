import React, { useRef } from 'react';
import Tooltip from 'tdesign-react/tooltip';

import { htmlContent, mainJsContent, styleContent, dependenciesContent } from './content';

export default function Stackblitz(props) {
  const { code } = props;
  const formRef = useRef(null);

  function submit() {
    formRef.current.submit();
  }

  return (
    <Tooltip content="在 Stackblitz 中打开">
      <form ref={formRef} method="post" action="https://stackblitz.com/run" target="_blank" onClick={submit}>
        <input type="hidden" name="project[files][src/demo.jsx]" value={code} />
        <input type="hidden" name="project[files][src/index.css]" value={styleContent} />
        <input type="hidden" name="project[files][src/index.js]" value={mainJsContent} />
        <input type="hidden" name="project[files][public/index.html]" value={htmlContent} />
        <input type="hidden" name="project[dependencies]" value={dependenciesContent} />
        <input type="hidden" name="project[template]" value="create-react-app" />

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
