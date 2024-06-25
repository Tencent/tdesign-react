import { Tree, Form, Switch, Space } from 'tdesign-react';
import { Icon } from 'tdesign-icons-react';
import classNames from 'classnames';
import React, { useState } from 'react';

const items = [
  {
    value: '1',
    label: '1',
    children: [
      {
        value: '1.1',
        label: '1.1',
      },
      {
        value: '1.2',
        label: '1.2',
      },
    ],
  },
  {
    value: '2',
    label: '2',
    children: [
      {
        value: '2.1',
        label: '2.1',
        children: [
          {
            value: '2.1.1',
            label: '2.1.1',
            children: [
              {
                value: '2.1.1.1',
                label: '2.1.1.1',
                children: [
                  {
                    value: '2.1.1.1.1',
                    label: '2.1.1.1.1',
                  },
                  {
                    value: '2.1.1.1.2',
                    label: '2.1.1.1.2',
                  },
                ],
              },
            ],
          },
          {
            value: '2.1.2',
            label: '2.1.2',
          },
        ],
      },
      {
        value: '2.2',
        label: '2.2',
      },
    ],
  },
  {
    value: '3',
    label: '3',
    children: [
      {
        value: '3.1',
        label: '3.1',
      },
      {
        value: '3.2',
        label: '3.2',
      },
    ],
  },
  {
    value: '4',
    label: '4',
  },
];

export default () => {
  const [showLine, setShowLine] = useState(true);
  const [showIcon, setShowIcon] = useState(true);

  const getLineNodes = (node) => {
    const nodes = node.getParents().reverse();
    const lineNodes = [];
    nodes.forEach((item, index) => {
      const line = {};
      const nextItem = nodes[index + 1];
      if (index < nodes.length - 1 && nextItem) {
        line.cross = !nextItem.isLast();
      }
      lineNodes.push(line);
    });
    return lineNodes;
  };

  const renderLine = (node) => {
    if (!showLine) return null;

    return (
      <div
        className={classNames('custom-line', {
          'custom-line-first': node.isFirst(),
          'custom-line-leaf': node.isLeaf(),
          'custom-line-last': node.isLast(),
        })}
      >
        <div className="custom-line-box">
          {getLineNodes(node).map((item, index) => (
            <span key={index} className={classNames({ 'custom-line-cross': item.cross })} />
          ))}
        </div>
        {node.isLeaf() ? (
          <i className="custom-line-icon">
            <Icon name={'heart-filled'} />
          </i>
        ) : null}
      </div>
    );
  };
  return (
    <Space direction="vertical">
      <Form>
        <Form.FormItem label="显示连线" initialData={showLine}>
          <Switch onChange={setShowLine} />
        </Form.FormItem>
        <Form.FormItem label="显示图标" initialData={showIcon}>
          <Switch onChange={setShowIcon} />
        </Form.FormItem>
      </Form>
      <Tree data={items} line={showLine} icon={showIcon} expandAll />
      <h3>render</h3>
      <Tree data={items} line={renderLine} icon={showIcon} expandAll />
    </Space>
  );
};
