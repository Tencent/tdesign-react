import React, { useState } from 'react';
import { Popup, Button } from 'tdesign-mobile-react';

export default function WithTitle() {
  const [visible, setVisible] = useState(false);

  const handleVisibleChange = (visible) => {
    setVisible(visible);
  };

  const onHide = () => setVisible(false);

  return (
    <>
      <Button variant="outline" block={true} theme="primary" size="large" onClick={() => setVisible(true)}>
        底部弹出层-带标题及操作
      </Button>

      <Popup visible={visible} onVisibleChange={handleVisibleChange} placement="bottom" style={{ height: '258px' }}>
        <div className="tdesign-mobile-popup-demo__with-title header">
          <div className="btn btn--cancel" onClick={onHide}>
            取消
          </div>
          <div className="title">标题文字</div>
          <div className="btn btn--confirm" onClick={onHide}>
            确定
          </div>
        </div>
      </Popup>
    </>
  );
}
