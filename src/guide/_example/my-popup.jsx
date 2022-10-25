import React, { useEffect } from 'react';
import { ArrowUpIcon } from 'tdesign-icons-react';
import Button from '../../button';

const classStyles = `
<style>
.my-popup {
  width: 240px;
}

.pop-icon {
  margin-top: 10px;
  color: white;
  font-size: 30px;
  font-weight: bold;
}

.popup-desc {
  margin-top: 10px;
  color: rgba(255, 255, 255, 0.9);
  font-size: 12px;
  font-weight: 400;
  text-align: left;
  line-height: 20px;
}

.popup-action {
  margin-top: 10px;
  text-align: right;
}

.popup-action button {
  margin-left: 8px;
}

</style>
`;

export default function MyPopup(props) {
  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

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
