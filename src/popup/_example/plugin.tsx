import React from 'react';
import { Space, Button, PopupPlugin } from 'tdesign-react';

const Plugin = () => {
  const ref = React.useRef();

  const handleElement1 = () => {
    PopupPlugin(ref.current, 'Tdesign React PopupPlugin');
  };
  const handleElement2 = async () => {
    PopupPlugin('.trigger-element2', '渲染文本的内容', {
      placement: 'right',
      showArrow: true,
    });
  };
  const handleCreatePopupOffset = () => {
    PopupPlugin('.trigger-element3', <div>透传popperOptions，在offset里控制节点位置</div>, {
      placement: 'bottom',
      popperOptions: {
        modifiers: [
          {
            name: 'offset',
            trigger: 'click',
            options: {
              offset: ({ reference }) => {
                const target = document.querySelector('.trigger-element2');
                let { lineHeight } = getComputedStyle(target);
                if (lineHeight === 'normal') {
                  const temp = document.createElement('div');
                  temp.innerText = 't';
                  document.body.appendChild(temp);
                  lineHeight = `${temp.offsetHeight}px`;
                  document.body.removeChild(temp);
                }
                const isBreakLine = reference.height > parseInt(lineHeight, 10);
                return isBreakLine ? [reference.x, -reference.height + 10] : [0, 0];
              },
            },
          },
        ],
      },
    });
  };

  return (
    <Space direction="vertical">
      <Button ref={ref} variant="outline" onClick={handleElement1} className="trigger-element1">
        正常的方式打开
      </Button>
      <Button variant="outline" onClick={handleElement2} className="trigger-element2">
        通过Plugin打开，并修改不同浮层的配置
      </Button>
      <div>
        <span>这里是一个日志查询的例子，在很长的日志内容中，日志内容存在换行的情况，可以点击链接进行日志查询操作</span>
        <a
          className="trigger-element3"
          style={{ color: 'var(--td-text-color-brand)' }}
          onClick={handleCreatePopupOffset}
        >
          点击此链接，会打开浮层进行跳转操作
        </a>
      </div>
    </Space>
  );
};

export default Plugin;
