import React, { useRef } from 'react';
import { Button, Popup, Space, type PopupInstanceFunctions } from 'tdesign-react';

export default function BasicUsage() {
  const popupRef = useRef<PopupInstanceFunctions>(null);

  const handleMouseEnter = () => {
    const popupInstance = popupRef.current;
    if (!popupInstance) return;
    console.log('getOverlay', popupInstance.getOverlay());
    console.log('getOverlayState', popupInstance.getOverlayState());
    console.log('getOverlayState', popupInstance.getPopper());
  };

  return (
    <Space>
      <Popup ref={popupRef} showArrow content={<span onMouseEnter={handleMouseEnter}>这是一个弹出框</span>}>
        <Button>Hover me</Button>
      </Popup>

      <Popup showArrow content={<span>可以在浮层内容中描述禁用原因</span>}>
        <Button disabled>Hover me</Button>
      </Popup>
    </Space>
  );
}
