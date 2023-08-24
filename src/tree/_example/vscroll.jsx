import React, { useEffect, useState, useRef } from 'react';
import { Tree, Switch, Space, Form, Button } from 'tdesign-react';

export default () => {
  const [checkable, setCheckable] = useState(true);
  const [showLine, toggleShowLine] = useState(true);
  const [options, setOptions] = useState([]);
  const treeRef = useRef(null);

  useEffect(() => {
    const newOptions = [];
    for (let i = 0; i < 3000; i++) {
      newOptions.push({
        label: `第${i + 1}段`,
        value: i,
        children: [
          {
            label: `第${i + 1}段第1个子节点`,
            value: `${i}.1`,
          },
          {
            label: `第${i + 1}段第2个子节点`,
            value: `${i}.2`,
          },
        ],
      });
    }
    setOptions(newOptions);
  }, []);

  const handleScroll = () => {
    treeRef.current.scrollTo({ index: 100, behavior: 'smooth' });
  };

  const defaultChecked = ['1.2', '2.2'];
  return (
    <Space direction="vertical">
      <Form>
        <Form.FormItem label="可选" initialData={checkable}>
          <Switch onChange={setCheckable} />
        </Form.FormItem>
        <Form.FormItem label="展示连线" initialData={showLine}>
          <Switch onChange={toggleShowLine} />
        </Form.FormItem>
      </Form>
      <Button onClick={handleScroll}>scroll to special node</Button>
      <Tree
        data={options}
        defaultValue={defaultChecked}
        line={showLine}
        checkable={checkable}
        transition
        activable
        expandAll
        hover
        scroll={{ type: 'virtual' }}
        style={{ height: '300px' }}
        ref={treeRef}
      />
    </Space>
  );
};
