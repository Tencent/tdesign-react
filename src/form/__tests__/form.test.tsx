/* eslint-disable */
import { testExamples, render, act } from '@test/utils';
import React, { useRef, useEffect } from 'react';

import { Input, Form } from 'tdesign-react';

const { FormItem } = Form;

// 测试组件代码 Example 快照
testExamples(__dirname);

describe('Form 组件测试', () => {
  test('setFieldsValue测试', async () => {
    await act(async () => {
      jest.useFakeTimers();
      const TestForm = () => {
        const ref = useRef();

        useEffect(() => {
          // @ts-ignore
          ref.current?.setFieldsValue({
            input1: 'value1',
            input2: 'value2',
          });
        }, [ref.current]);

        return (
          <div>
            <Form ref={ref}>
              <FormItem label="input1" name="input1">
                <Input placeholder="input1" />
              </FormItem>
              <FormItem label="input2" name="input2">
                <Input placeholder="input2" />
              </FormItem>
            </Form>
          </div>
        );
      };
      const res = render(<TestForm />);
      const { getByPlaceholderText } = res;

      // @ts-ignore
      expect(getByPlaceholderText('input1').value).toEqual('');
      // @ts-ignore
      expect(getByPlaceholderText('input2').value).toEqual('');

      setTimeout(() => {
        // @ts-ignore
        expect(getByPlaceholderText('input1').value).toEqual('value1');
        // @ts-ignore
        expect(getByPlaceholderText('input2').value).toEqual('value2');
      }, 400);

      jest.runAllTimers();
    });
  });
});
