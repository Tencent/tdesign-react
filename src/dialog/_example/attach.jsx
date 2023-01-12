import React, { useState, useRef } from 'react';
import { Dialog, Button } from 'tdesign-react';

const buttonStyle = { marginRight: 16 };

export default function AttachModalExample() {
  const elRef = useRef(null);
  const [state, setState] = useState({
    visibleBody: false,
    visibleIdAttach: false,
    visibleFunctionAttach: false,
    visibleShowInAttachedElement: false,
  });

  const handleOpen = (visibleName) => {
    setState({
      ...state,
      [visibleName]: true,
    });
  };

  const handleClose = (visibleName) => {
    setState({
      ...state,
      [visibleName]: false,
    });
  };

  const getAttach = () => elRef.current;

  const { visibleBody, visibleIdAttach, visibleFunctionAttach, visibleShowInAttachedElement } = state;

  return (
    <div ref={elRef} style={{ position: 'relative', height: '400px' }}>
      <Button theme="primary" onClick={() => handleOpen('visibleBody')} style={buttonStyle}>
        挂载在body
      </Button>
      <Button theme="primary" onClick={() => handleOpen('visibleIdAttach')} style={buttonStyle}>
        挂载特定元素
      </Button>
      <Button theme="primary" onClick={() => handleOpen('visibleFunctionAttach')} style={buttonStyle}>
        挂载函数返回节点
      </Button>
      <Button theme="primary" onClick={() => handleOpen('visibleShowInAttachedElement')} style={buttonStyle}>
        展示在挂载元素区域
      </Button>
      <Dialog
        attach="body"
        header="挂载在body"
        visible={visibleBody}
        onClose={() => handleClose('visibleBody')}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <div>
          <div>我是被挂载到body元素的对话框</div>
          <div>我是内容</div>
          <div>我是内容</div>
          <div>我是内容</div>
          <div>我是内容</div>
        </div>
      </Dialog>
      <Dialog
        attach="#app"
        header="挂载到id为app的元素"
        visible={visibleIdAttach}
        onClose={() => handleClose('visibleIdAttach')}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <div>
          <div>通过querySelect指定元素挂载</div>
          <div>支持原生document.querySelect选择元素</div>
          <div>querySelect获取到的第一个元素为挂载点</div>
          <div>我是内容</div>
          <div>我是内容</div>
        </div>
      </Dialog>
      <Dialog
        attach={getAttach}
        header="函数返回挂载节点"
        visible={visibleFunctionAttach}
        onClose={() => handleClose('visibleFunctionAttach')}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <div>
          <div>指定函数返回的节点为挂载点</div>
          <div>函数返回为DOM节点对象</div>
          <div>我是内容</div>
          <div>我是内容</div>
          <div>我是内容</div>
        </div>
      </Dialog>

      <Dialog
        header="展示在挂载元素区域"
        attach={getAttach}
        showInAttachedElement={true}
        visible={visibleShowInAttachedElement}
        onClose={() => handleClose('visibleShowInAttachedElement')}
        onOpened={() => {
          console.log('dialog is open');
        }}
      >
        <div>
          <div>父元素（挂载元素）需要有定位属性，如：position: relative</div>
          <div>showInAttachedElement API 仅针对模态对话框有效</div>
        </div>
      </Dialog>
    </div>
  );
}
