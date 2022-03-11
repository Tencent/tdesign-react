import React from 'react';
import { Badge } from 'tdesign-react';

export default function BadgeExample() {

  const badgeBlockStyle = {
    width: "40px",
    height: "40px",
    background: "#EEEEEE",
    border: "1px solid #DCDCDC",
    boxSizing: "border-box",
    borderRadius: "3px",
  }

  return (
    <>
      <Badge count="2" dot>
        <div style={badgeBlockStyle}></div>
      </Badge>
      <Badge count="hot">
        <div style={badgeBlockStyle}></div>
      </Badge>
      <Badge count="new" color="#00A870">
        <div style={badgeBlockStyle}></div>
      </Badge>
      <Badge count="100" color="#0052D9" shape="round">
        <div style={badgeBlockStyle}></div>
      </Badge>
    </>
  );
}
