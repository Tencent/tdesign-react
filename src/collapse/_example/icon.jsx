import React, { useRef, useState } from 'react';
import { Collapse, TagInput } from 'tdesign-react';
import { CSSTransition } from 'react-transition-group';

const duration = 300;
const defaultStyle = {
  transition: `height ${duration}ms`,
  height: 0,
  overflow: 'hidden',
  backgroundColor: 'green',
};

export default function CollapseExample() {
  const [isIn, setIsIn] = useState(false);
  const contentRef = useRef();
  const innerRef = useRef();
  const { Panel } = Collapse;
  return (
    <div>
      <div className="tdesign-demo-block-row">
        <Collapse>
          <Panel header="这是一个折叠标题">
            这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
          </Panel>
          <Panel destroyOnCollapse header="设置默认展开项">
            这部分是每个折叠面板折叠或展开的内容，可根据不同业务或用户的使用诉求，进行自定义填充。可以是纯文本、图文、子列表等内容形式。
          </Panel>
          <Panel header="自定义折叠面板内容">
            <div className="tdesign-demo-block-column" style={{ width: '80%' }}>
              <TagInput defaultValue={['Vue', 'React']} clearable />
            </div>
          </Panel>
        </Collapse>
      </div>
      <div>
        <button onClick={() => setIsIn(!isIn)}>test</button>
        <CSSTransition
          in={isIn}
          timeout={duration}
          nodeRef={contentRef}
          onEnter={() => {
            contentRef.current.style.height = `${innerRef?.current.clientHeight}px`;
          }}
          onExit={() => {
            contentRef.current.style.height = `0px`;
          }}
          mountOnEnter
          unmountOnExit
        >
          <div
            style={{
              ...defaultStyle,
              exiting: { height: 0, transition: `height ${duration}ms`},
              exited: { height: 0 },
            }}
            ref={contentRef}
            className="content"
          >
            <div ref={innerRef}>
              <ul>
                <li>inner</li>
                <li>inner</li>
                <li>inner</li>
                <li>inner</li>
                <li>inner</li>
              </ul>
            </div>
          </div>
        </CSSTransition>
      </div>
      {/* <div style={{ marginTop: 100 }}>
        <button onClick={() => setTest(!test)}>test</button>
        <Transition
          in={test}
          timeout={0}
          nodeRef={contentRef}
          onEntered={() => {
            contentRef.current.style.height = `${innerRef?.current.clientHeight}px`;
          }}
          onExit={() => {
            contentRef.current.style.height = `0px`;
          }}
        >
          <div
            style={{
              ...defaultStyle,
            }}
            ref={contentRef}
          >
            <div ref={innerRef}>
              <ul>
                <li>inner</li>
                <li>inner</li>
                <li>inner</li>
                <li>inner</li>
                <li>inner</li>
              </ul>
            </div>
          </div>
        </Transition>
      </div> */}
    </div>
  );
}
