import React, { useRef } from 'react';
import { Button, Popup, Space, type PopupInstanceFunctions } from 'tdesign-react';

const CUSTOM_STYLE = { fontStyle: 'italic', fontFamily: 'Times' };

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
      <Popup
        ref={popupRef}
        showArrow
        content={
          <div style={CUSTOM_STYLE} onMouseEnter={handleMouseEnter}>
            Access Granted
          </div>
        }
      >
        <Button>Hover me</Button>
      </Popup>
      <Popup showArrow content={<div style={CUSTOM_STYLE}>Permission Denied</div>}>
        <Button disabled>Hover me</Button>
      </Popup>
    </Space>
  );
}
