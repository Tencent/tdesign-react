import React from 'react';
import { Tooltip } from '@tdesign/components';

export default function NewWindow(props) {
  function onNewWindow() {
    const url = `${window.location.origin + window.location.pathname.replace('components', 'demos')}/${props.demoName}`;
    window.open(url, '_blank');
  }
  return (
    <Tooltip content="在新窗口打开">
      <div className="action-online" onClick={onNewWindow}>
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <g id="bpwjump">
            <path
              id="stroke1"
              d="M9 4L4 4L4 20L20 20L20 15"
              strokeLinecap="square"
              strokeWidth="2"
              stroke="currentColor"
            />
            <path
              id="stroke2"
              d="M19.25 4.75L12 12M14 4H20L20 10"
              strokeLinecap="square"
              strokeWidth="2"
              stroke="currentColor"
            />
          </g>
        </svg>
      </div>
    </Tooltip>
  );
}
