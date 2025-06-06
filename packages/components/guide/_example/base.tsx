import React, { useEffect } from 'react';
import { Button, Drawer, Guide, GuideStep, Input, Row } from 'tdesign-react';
import type { GuideProps } from 'tdesign-react';

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
</style>
`;

export default function BasicGuide() {
  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  const steps: GuideStep[] = [
    {
      element: '.main-title-base',
      title: '新手引导标题',
      body: '新手引导的说明文案',
      placement: 'bottom-right',
      stepOverlayClass: 't-test-guide-step-overlay',
      popupProps: {
        overlayStyle: { fontWeight: 'normal' },
        overlayInnerStyle: { padding: '4px', height: '128px' },
        overlayClassName: 'guide-custom-overlay-class',
        overlayInnerClassName: 'guide-custom-overlay-inner-class',
      },
    },
    {
      element: '.label-field-base',
      title: '新手引导标题',
      body: '新手引导的说明文案',
      placement: 'bottom',
    },
    {
      element: '.action-base',
      title: '新手引导标题',
      body: '新手引导的说明文案',
      placement: 'right',
    },
  ];

  const [visible, setVisible] = React.useState(false);
  const [current, setCurrent] = React.useState(-1);

  const handleClick = () => {
    setVisible(true);
    setTimeout(() => {
      setCurrent(0);
    }, 800);
  };

  const handleChange: GuideProps['onChange'] = (current: number, { e, total }) => {
    setCurrent(current);
    console.log(current, e, total);
  };

  const handlePrevStepClick: GuideProps['onPrevStepClick'] = ({ e, prev, current, total }) => {
    console.log(e, prev, current, total);
  };

  const handleNextStepClick: GuideProps['onNextStepClick'] = ({ e, next, current, total }) => {
    console.log(e, next, current, total);
  };

  const handleFinish: GuideProps['onFinish'] = ({ e, current, total }) => {
    setVisible(false);
    console.log(e, current, total);
  };

  const handleSkip: GuideProps['onSkip'] = ({ e, current, total }) => {
    console.log('skip');
    setVisible(false);
    console.log(e, current, total);
  };

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
          <div className="main-title-base">
            <div className="title-major">Guide 用户引导</div>
            <div className="title-sub">按钮用于开启一个闭环的操作任务，如“删除”对象、“购买”商品等。</div>
          </div>
          <div className="field label-field-base">
            <div className="label">Label</div>
            <Input placeholder="请输入内容" />
          </div>
          <div className="field">
            <div className="label">Label</div>
            <Input placeholder="请输入内容" />
          </div>
          <Row className="action action-base">
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
