import React, { useEffect } from 'react';
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

</style>
`;

export default function NoMaskGuide() {
  useEffect(() => {
    // 添加示例代码所需样式
    document.head.insertAdjacentHTML('beforeend', classStyles);
  }, []);

  const steps = [
    {
      element: '.main-title-no-mask',
      title: '新手引导标题',
      body: '新手引导的说明文案',
      placement: 'bottom-right',
    },
    {
      element: '.label-field-no-mask',
      title: '新手引导标题',
      body: '新手引导的说明文案',
      placement: 'bottom',
    },
    {
      element: '.action-no-mask',
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
          <div className="main-title-no-mask">
            <div className="title-major">Guide 用户引导</div>
            <div className="title-sub">按钮用于开启一个闭环的操作任务，如“删除”对象、“购买”商品等。</div>
          </div>
          <div className="field label-field-no-mask">
            <div className="label">Label</div>
            <Input placeholder="请输入内容" />
          </div>
          <div className="field">
            <div className="label">Label</div>
            <Input placeholder="请输入内容" />
          </div>
          <Row className="action action-no-mask">
            <Button>确定</Button>
            <Button theme="default" variant="base">
              取消
            </Button>
          </Row>
        </div>

        <Guide
          current={current}
          steps={steps}
          showOverlay={false}
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
