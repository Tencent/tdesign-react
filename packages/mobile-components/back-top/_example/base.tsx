import React from 'react';
import { Button } from 'tdesign-mobile-react';

export default function Base({ onButtonClick }) {
  return (
    <div className="button-group">
      <Button
        className="button"
        block
        size="large"
        variant="outline"
        theme="primary"
        onClick={() => onButtonClick('round', '顶部')}
      >
        圆形返回顶部
      </Button>
    </div>
  );
}
