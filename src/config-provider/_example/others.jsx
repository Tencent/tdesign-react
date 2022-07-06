import React from 'react';
import merge from 'lodash/merge';
import {
  ConfigProvider,
  Form,
  Select,
  Cascader,
  TreeSelect,
  TimePicker,
  Tag,
  Tree,
  Input,
  Steps,
  Space,
} from 'tdesign-react';
import { ChevronRightIcon, CloseIcon, CloseCircleIcon, ErrorIcon } from 'tdesign-icons-react';
import enConfig from 'tdesign-react/es/locale/en_US';

export default function configDemo() {
  // 全局特性配置，可以引入英文默认配置 enConfig，还可以在默认配置的基础上进行自定义配置
  const globalConfig = merge(enConfig, {
    form: {
      requiredMark: false,
    },
    transfer: {
      title: '{checked} / {total}',
      empty: 'Empty Data',
      placeholder: 'type keyword to search',
    },
    tree: {
      empty: 'Tree Empty Data',
      folderIcon: <ChevronRightIcon size="18px" />,
    },
    select: {
      empty: 'Empty Data',
      loadingText: 'loading...',
      clearIcon: <CloseIcon />,
    },
    treeSelect: {
      empty: 'Empty Data',
      loadingText: 'loading...',
    },
    timePicker: {
      now: 'Now',
      confirm: 'Confirm',
      anteMeridiem: 'AM',
      postMeridiem: 'PM',
      placeholder: 'select time',
    },
    tag: {
      closeIcon: <CloseCircleIcon />,
    },
    cascader: {
      empty: 'empty data',
      loadingText: 'loading...',
      placeholder: 'select cascader data',
    },
    steps: {
      errorIcon: <ErrorIcon />,
    },
  });

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <Space direction="vertical">
        <Form
          rules={{
            username: [{ required: true, message: '此项必填', type: 'error' }],
          }}
        >
          <Form.FormItem label="User Name" name="username">
            <Input placeholder="There is no required mark on the left of this input in Form" />
          </Form.FormItem>
          <Form.FormItem label="Password" name="password" requiredMark>
            <Input type="password" placeholder="There is required mark on the left of this input in Form" />
          </Form.FormItem>
        </Form>

        <Select placeholder="see loading text in Select" loading />

        <Cascader options={[]} />

        <TreeSelect data={[]} loading placeholder="see loading text in TreeSelect" />

        <TimePicker placeholder="select time" format="hh:mm:ss a" allowInput />

        <Tag theme="primary" closable>
          Feature Tag
        </Tag>
        <Tag theme="success" closable>
          Feature Tag
        </Tag>
        <Tag theme="warning" closable>
          Feature Tag
        </Tag>
        <Tag theme="danger" closable>
          Feature Tag
        </Tag>

        <Tree data={[]} />

        <Steps current={2} layout="vertical">
          <Steps.StepItem title="First Step" content="You need to click the blue button"></Steps.StepItem>
          <Steps.StepItem title="Second Step" content="Fill your base information into the form"></Steps.StepItem>
          <Steps.StepItem
            title="Error Step"
            status="error"
            content="Something Wrong! Custom Error Icon!"
          ></Steps.StepItem>
          <Steps.StepItem title="Last Step" content="You haven't finish this step."></Steps.StepItem>
        </Steps>
      </Space>
    </ConfigProvider>
  );
}
