import React from 'react';
import { render } from '@test/utils';
import Input from '../../input';
import Button from '../../button';
import { Row } from '../../grid';

function GuideContent() {
  return (
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
  );
}

const STEPS = [
  {
    element: '.main-title-base',
    title: '新手引导标题',
    body: '新手引导的说明文案',
    placement: 'bottom-right',
  },
  {
    element: () => document.body.querySelector('.label-field-base'),
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

// only one step
export function getGuideDefaultMount(Guide, props, events) {
  return render(
    <div>
      <GuideContent />
      <Guide current={0} steps={STEPS.slice(0, 1)} {...props} {...events}></Guide>
    </div>
  );
}

// three steps
export function getGuideMultipleStepsMount(Guide, props, events) {
  return render(
    <div>
      <GuideContent />
      <Guide steps={STEPS} {...props} {...events}></Guide>
    </div>
  );
}

// custom step props
export function getCustomGuideStepMount(Guide, props) {
  const steps = [{ ...STEPS[0], ...props}]
  return render(
    <div>
      <GuideContent />
      <Guide current={0} steps={steps}></Guide>
    </div>
  );
}

// custom multiple step props
export function getCustomMultipleGuideStepMount(Guide, props) {
  const { current = 0, ...guideStepProps } = props;
  let steps = [...STEPS];
  steps[current] = { ...STEPS[current], ...guideStepProps };
  return render(
    <div>
      <GuideContent />
      <Guide current={current} steps={steps}></Guide>
    </div>
  );
}

export default {}
