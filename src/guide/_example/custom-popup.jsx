import React from 'react';
import { Button, Drawer, Guide, Input, Row } from 'tdesign-react';
import './custom-popup.css';
import MyPopup from './my-popup';

export default function CustomPopupGuide() {
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
