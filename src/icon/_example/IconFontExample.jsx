import React from 'react';
import { IconFont } from 'tdesign-icons-react';

export default function IconFontExample() {
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
        <IconFont name="loading" size="2em" />
        <div style={{ marginTop: 12 }}>loading</div>
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
        <IconFont name="close" size="2em" />
        <div style={{ marginTop: 12 }}>close</div>
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
        <IconFont name="check-circle-filled" size="2em" />
        <div style={{ marginTop: 12 }}>check-circle-filled</div>
      </div>
    </div>
  );
}
