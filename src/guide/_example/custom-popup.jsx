import React, { useEffect } from 'react';
import { ArrowUpIcon } from 'tdesign-icons-react';
import { Button, Drawer, Guide, Input, Row } from 'tdesign-react';

const classStyles = `
<style>
.guide-container {
  max-width: 600px;
  padding: 40px;
}

.title-major {
  color: var(--td-text-color-primary);
  font-size: 36px;
  font-weight: 700;
  line-height: 44px;
}

.title-sub {
  margin-top: 8px;
  color: var(--td-text-color-secondary);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.field {
  margin-top: 50px;
}

.label {
  margin-bottom: 8px;
  color: var(--td-text-color-primary);
  font-size: 14px;
  font-weight: 400;
  line-height: 22px;
}

.action {
  display: inline-flex;
  margin-top: 50px;
}

.action button:first-child {
  margin-right: 10px;
}


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

function MyPopup(props) {
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

export default function CustomPopupGuide() {
  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  const [visible, setVisible] = React.useState(false);
  const [current, setCurrent] = React.useState(-1);

  const handleClick = () => {
    setVisible(true);
    setTimeout(() => {
      setCurrent(0);
    }, 800);
  };

  const handleChange = (current, { e, total }) => {
    setCurrent(current);
    console.log(current, e, total);
  };

  const handlePrevStepClick = ({ e, prev, current, total }) => {
    console.log(e, prev, current, total);
  };

  const handleNextStepClick = ({ e, next, current, total }) => {
    console.log(e, next, current, total);
  };

  const handleFinish = ({ e, current, total }) => {
    setVisible(false);
    console.log(e, current, total);
  };

  const handleSkip = ({ e, current, total }) => {
    console.log('skip');
    setVisible(false);
    console.log(e, current, total);
  };

  const steps = [
    {
      element: '.main-title-custom-popup',
      title: '新手引导标题',
      description: '新手引导的说明文案',
      placement: 'bottom-right',
      content: <MyPopup />,
    },
    {
      element: '.label-field-1-custom-popup',
      title: '新手引导标题',
      description: '新手引导的说明文案',
      placement: 'bottom',
      content: <MyPopup />,
    },
    {
      element: '.label-field-2-custom-popup',
      title: '新手引导标题',
      description: '新手引导的说明文案',
      placement: 'bottom-left',
      content: <MyPopup />,
    },
  ];

  return (
    <Row justify="center">
      <Button onClick={handleClick}>新手引导</Button>
      <Drawer
        footer={<Button onClick={() => setVisible(false)}> 关闭抽屉 </Button>}
        visible={visible}
        header="演示新手引导"
        size="60%"
        showOverlay={false}
        destroyOnClose={true}
      >
        <div className="guide-container">
          <div className="main-title-custom-popup">
            <div className="title-major">Guide 用户引导</div>
            <div className="title-sub">按钮用于开启一个闭环的操作任务，如“删除”对象、“购买”商品等。</div>
          </div>
          <div className="field label-field-1-custom-popup">
            <div className="label">Label</div>
            <Input placeholder="请输入内容" />
          </div>
          <div className="field label-field-2-custom-popup">
            <div className="label">Label</div>
            <Input placeholder="请输入内容" />
          </div>
          <Row className="action">
            <Button>确定</Button>
            <Button theme="default" variant="base">
              取消
            </Button>
          </Row>
        </div>

        <Guide
          current={current}
          steps={steps}
          onChange={handleChange}
          onPrevStepClick={handlePrevStepClick}
          onNextStepClick={handleNextStepClick}
          onFinish={handleFinish}
          onSkip={handleSkip}
        />
      </Drawer>
    </Row>
  );
}
