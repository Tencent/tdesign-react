import { render, mockTimeout } from '@test/utils';
import React from 'react';

import Input from '../../input';
import Form from '../index';
import FormList from '../FormList';
import { FormListFieldOperation } from '../type';

const { FormItem } = Form;

describe('Form List 组件测试', () => {
  test('form list 测试', async () => {
    const TestView = (props: { operationRef: (ref: FormListFieldOperation) => void }) => (
      <Form>
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
    );
    let listOperation: FormListFieldOperation = null;
    const { getByDisplayValue, queryByDisplayValue } = render(
      <TestView operationRef={(ref) => (listOperation = ref)} />,
    );
    // 测试 FormList add
    listOperation?.add?.({ name: 'value1' });
    // @ts-ignore
    await mockTimeout(() => expect(getByDisplayValue('value1').value).toBe('value1'));

    // 测试 FormList remove
    listOperation?.remove?.(0);
    await mockTimeout(() => expect(queryByDisplayValue('value1')).toBe(null));
  });
});
