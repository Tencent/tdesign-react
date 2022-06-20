/*
 * @Author: Bin
 * @Date: 2022-04-17
 * @FilePath: /tdesign-react/src/form/__tests__/form-list.test.tsx
 */
/* eslint-disable */
import { testExamples, render, act, waitFor } from '@test/utils';
import React, { useRef, useEffect } from 'react';

import { Input, Form } from 'tdesign-react';
import { VALIDATE_STATUS } from '../FormItem';
import FormList from '../FormList';
import { FormInstanceFunctions, FormListFieldOperation } from '../type';

const { FormItem } = Form;

describe('Form List 组件测试', () => {
  test('form list 测试', async () => {
    const testId = 'form list test id';
    const TestView = (props: { operationRef: (ref: FormListFieldOperation) => void }) => (
      <div data-testid={testId}>
        <Form>
          <FormList name="data">
            {(fields, operation) => {
              if (props.operationRef) {
                props.operationRef(operation);
              }
              return fields.map(({ key, name, ...restField }) => (
                <FormItem key={key}>
                  <FormItem
                    {...restField}
                    name={[name, 'name']}
                    label="姓名"
                    rules={[{ required: true, type: 'error' }]}
                  >
                    <Input />
                  </FormItem>
                </FormItem>
              ));
            }}
          </FormList>
        </Form>
      </div>
    );
    let listOperation: FormListFieldOperation = null;
    const { debug, getByTestId, rerender, getByDisplayValue, queryByDisplayValue } = render(
      <TestView operationRef={(ref) => (listOperation = ref)} />,
    );
    // 测试 FormList add
    if (listOperation) {
      listOperation.add({ name: 'value1' });
    }
    let testInstance = await waitFor(() => getByDisplayValue('value1'));
    expect(testInstance.value).toEqual('value1');

    // 测试 FormList remove
    if (listOperation) {
      listOperation.remove(0);
    }
    testInstance = await waitFor(() => queryByDisplayValue('value1'));
    expect(testInstance).toBe(null);

    // 测试 FormList remove Array
    if (listOperation) {
      const list = [];
      for (let index = 0; index < 3; index++) {
        listOperation.add({ name: 'value1' });
        list.push(index);
      }
      listOperation.remove(list);
    }
    testInstance = await waitFor(() => queryByDisplayValue('value1'));
    expect(testInstance).toBe(null);
  });

  test('form list move item 测试', async () => {
    const testId = 'form list test move id';
    let formRef;
    const TestView = (props: { operationRef: (ref: FormListFieldOperation) => void }) => (
      <div data-testid={testId}>
        <Form ref={(ref) => (formRef = ref)}>
          <FormList name="data">
            {(fields, operation) => {
              if (props.operationRef) {
                props.operationRef(operation);
              }
              return fields.map(({ key, name, ...restField }) => (
                <FormItem key={key}>
                  <FormItem
                    {...restField}
                    name={[name, 'name']}
                    label="姓名"
                    rules={[{ required: true, type: 'error' }]}
                  >
                    <Input />
                  </FormItem>
                </FormItem>
              ));
            }}
          </FormList>
        </Form>
      </div>
    );
    let listOperation: FormListFieldOperation = null;
    const { debug, container, queryAllBySelection } = render(
      <TestView operationRef={(ref) => (listOperation = ref)} />,
    );
    // 测试 FormList move
    if (listOperation) {
      listOperation.add({ name: 'value1' });
      listOperation.add({ name: 'value2' });
      listOperation.move(0, 1);
    }
    const testInstance = await waitFor(() => container.querySelectorAll('.t-input__inner'));
    let element = null;
    testInstance.forEach((e) => {
      if (!element) {
        element = e; // 只取第一个用于判断
      }
    });

    expect(element.value).toEqual('value2');
  });

  test('form list ref 测试', async () => {
    const testId = 'form list test ref id';
    const TestView = React.forwardRef((props: { operationRef: (ref: FormListFieldOperation) => void }, ref: any) => (
      <Form ref={ref}>
        <FormList name="data">
          {(fields, operation) => {
            if (props.operationRef) {
              props.operationRef(operation);
            }
            return fields.map(({ key, name, ...restField }) => (
              <FormItem key={key}>
                <FormItem {...restField} name={[name, 'name']} label="姓名" rules={[{ required: true, type: 'error' }]}>
                  <Input />
                </FormItem>
              </FormItem>
            ));
          }}
        </FormList>
      </Form>
    ));
    let testRef: FormInstanceFunctions;
    let listOperation: FormListFieldOperation = null;
    const { debug, container, queryAllBySelection, queryByDisplayValue } = render(
      <TestView ref={(ref) => (testRef = ref)} operationRef={(ref) => (listOperation = ref)} />,
    );

    listOperation.add({ name: 'value1' });
    listOperation.add({ name: 'value2' });

    // 测试 FormList get value
    expect(testRef.getFieldsValue(true).data[0]).toEqual({ name: 'value1' });

    // 测试 FormList resetField
    testRef.reset();
    let testInstance = await waitFor(() => queryByDisplayValue('value1'));
    expect(testInstance).toBe(null);

    // 测试 FormList setValue
    // testRef.setFieldsValue({ data: [{ name: 'value changed' }] });
    // testInstance = await waitFor(() => queryByDisplayValue('value changed'));
    // expect(testInstance).not.toBe(null);

    console.log('数据', testRef.getFieldsValue(['data']));
    // 测试 FormList setFields
    // testRef.setFields([{ name: 'data', value: [{ name: 'value' }], status: VALIDATE_STATUS.SUCCESS }]);

    // FIXME: 测试 FormList validate and resetValidate
    testRef.validate({ trigger: 'all' }).then((e) => {});
    testRef.clearValidate();

    console.log('应用', testRef);

    await debug(container);
    // expect(testInstance).toBe(null);
  });
});
