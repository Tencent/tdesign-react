import React from 'react';
import { Button } from 'tdesign-mobile-react';

export default function HalfRound({ onButtonClick }) {
  return (
    <div className="button-group">
      <Button
        className="button"
        block
        size="large"
        variant="outline"
        theme="primary"
        onClick={() => onButtonClick('half-round', '返回顶部')}
      >
        半圆形返回顶部
      </Button>
    </div>
  );
}
