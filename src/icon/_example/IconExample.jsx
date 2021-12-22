import React from 'react';
import { LoadingIcon, CloseIcon, CheckCircleFilledIcon } from 'tdesign-icons-react';

export default function IconExample() {
  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
      }}
    >
      <div
        style={{
          width: 140,
          height: 140,
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <LoadingIcon size="2em" />
        <div style={{ marginTop: 12 }}>LoadingIcon</div>
      </div>
      <div
        style={{
          width: 140,
          height: 140,
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <CloseIcon size="2em" />
        <div style={{ marginTop: 12 }}>CloseIcon</div>
      </div>
      <div
        style={{
          width: 140,
          height: 140,
          fontSize: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column',
        }}
      >
        <CheckCircleFilledIcon size="2em" />
        <div style={{ marginTop: 12 }}>CheckCircleFilledIcon</div>
      </div>
    </div>
  );
}
