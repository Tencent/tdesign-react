import React, { useRef, useState } from 'react';
import { Popup, Button } from 'tdesign-mobile-react';

export default function Nested() {
  const [showParent, setShowParent] = useState(false);
  const [showChild, setShowChild] = useState(false);
  const parentContentRef = useRef<HTMLDivElement>(null);

  const handleParentVisibleChange = (visible: boolean) => {
    setShowParent(visible);
  };

  const handleChildVisibleChange = (visible: boolean) => {
    setShowChild(visible);
  };

  return (
    <div className="popup-nested-demo">
      <Button block variant="outline" theme="primary" size="large" onClick={() => setShowParent(true)}>
        打开嵌套弹窗
      </Button>

      {/* 父 Popup：attach 到 body */}
      <Popup visible={showParent} placement="bottom" zIndex={1500} onVisibleChange={handleParentVisibleChange}>
        <div ref={parentContentRef} className="parent-popup-content">
          <h3 className="popup-title">筛选面板（父弹窗）</h3>
          <p className="popup-desc">这是第一层 Popup，点击下方按钮可打开子弹窗。</p>
          <Button block theme="primary" size="large" onClick={() => setShowChild(true)}>
            打开子弹窗（Picker）
          </Button>

          {/* 子 Popup：attach 到父 Popup 内部的 DOM 容器 */}
          <Popup
            visible={showChild}
            placement="bottom"
            attach={() => parentContentRef.current}
            zIndex={1600}
            onVisibleChange={handleChildVisibleChange}
          >
            <div className="child-popup-content">
              <h3 className="popup-title">选择器（子弹窗）</h3>
              <p className="popup-desc">
                这是第二层 Popup，通过将 attach 指向父 Popup 内部的 DOM 容器，实现正确的嵌套层级。
              </p>
              <Button block theme="primary" size="large" onClick={() => setShowChild(false)}>
                确认选择
              </Button>
            </div>
          </Popup>
        </div>
      </Popup>
    </div>
  );
}
