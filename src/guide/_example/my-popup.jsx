import React from 'react';
import { ArrowUpIcon } from 'tdesign-icons-react';
import Button from '../../button';
import './my-popup.css';

export default function MyPopup(props) {
  const { handlePrev, handleNext, handleSkip, handleFinish, current, total } = props;

  return (
    <div className="my-popup">
      <ArrowUpIcon className="pop-icon" />
      <p className="popup-desc">自定义的图形或说明文案，用来解释或指导该功能使用。</p>
      <div className="popup-action">
        <Button theme="default" size="small" onClick={handleSkip}>
          跳过
        </Button>
        {current !== 0 && (
          <Button theme="default" size="small" onClick={handlePrev}>
            上一步
          </Button>
        )}
        {current + 1 < total && (
          <Button theme="primary" size="small" onClick={handleNext}>
            下一步
          </Button>
        )}
        {current + 1 === total && (
          <Button theme="primary" size="small" onClick={handleFinish}>
            完成
          </Button>
        )}
      </div>
    </div>
  );
}
