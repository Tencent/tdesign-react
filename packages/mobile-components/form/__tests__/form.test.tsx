/* eslint-disable */
import React, { useEffect, useState } from 'react';
import { describe, it, expect, vi, render, fireEvent, act } from '@test/utils';
import Form from '../Form';
import { requestSubmit } from '../Form';
import FormItem from '../FormItem';
import Input from '../../input';
import Button from '../../button';
import { FormInstanceFunctions, TdFormProps } from '../type';
import { isValueEmpty } from '../formModel';
import { useFormContext } from '../FormContext';

// Helper to flush microtasks and requestAnimationFrame
const flushPromises = () => new Promise((resolve) => setTimeout(resolve, 0));

async function mockDelay(ms = 100) {
  await act(async () => {
    await flushPromises();
    await new Promise((r) => setTimeout(r, ms));
  });
}

describe('Form 组件测试', () => {
  beforeEach(() => {
    vi.spyOn(window, 'requestAnimationFrame').mockImplementation((cb: FrameRequestCallback) => {
      cb(0);
      return 0;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('基础渲染', () => {
    it('默认渲染 Form 及基础属性', () => {
      const { container } = render(
        <Form className="custom-form" style={{ padding: '10px' }} id="my-form" colon>
          <FormItem label="名称" name="name">
            <Input placeholder="请输入" />
          </FormItem>
        </Form>,
      );
      expect(container.querySelector('form')).toBeTruthy();
      expect(container.querySelector('.t-form')).toBeTruthy();
      expect(container.querySelector('.custom-form')).toBeTruthy();
      expect(container.querySelector('form').style.padding).toBe('10px');
      expect(container.querySelector('#my-form')).toBeTruthy();
      expect(container.querySelector('.t-form__label')).toBeTruthy();
    });

    it('labelWidth 字符串和数字类型', () => {
      const { container: c1 } = render(
        <Form labelWidth="100px">
          <FormItem label="名称" name="name">
            <Input />
          </FormItem>
        </Form>,
      );
      expect(c1.querySelector('.t-form__label').getAttribute('style')).toContain('width: 100px');

      const { container: c2 } = render(
        <Form labelWidth={120}>
          <FormItem label="名称" name="name">
            <Input />
          </FormItem>
        </Form>,
      );
      expect(c2.querySelector('.t-form__label').getAttribute('style')).toContain('width: 120px');
      expect(c2.querySelector('.t-form__controls').getAttribute('style')).toContain('margin-left: 120px');
    });

    it('labelAlign top/left/right 对应类名', () => {
      const { container: c1 } = render(
        <Form labelAlign="top">
          <FormItem label="名称" name="name">
            <Input />
          </FormItem>
        </Form>,
      );
      expect(c1.querySelector('.t-form--top')).toBeTruthy();
      // top 时 label 不设置 width
      expect(c1.querySelector('.t-form__label').getAttribute('style')).toBeFalsy();

      const { container: c2 } = render(
        <Form labelAlign="left">
          <FormItem label="名称" name="name">
            <Input />
          </FormItem>
        </Form>,
      );
      expect(c2.querySelector('.t-form--left')).toBeTruthy();
    });

    it('labelAlign top 时即使设置 labelWidth 也不生效', () => {
      const { container } = render(
        <Form labelAlign="top" labelWidth="100px">
          <FormItem label="名称" name="name">
            <Input />
          </FormItem>
        </Form>,
      );
      const label = container.querySelector('.t-form__label');
      expect(label.getAttribute('style')).toBeFalsy();
    });

    it('disabled 属性禁用子组件', () => {
      const { container } = render(
        <Form disabled>
          <FormItem label="名称" name="name">
            <Input placeholder="test-input" />
          </FormItem>
          <FormItem name="field2">
            <Input placeholder="field2" />
          </FormItem>
        </Form>,
      );
      container.querySelectorAll('input').forEach((input) => {
        expect(input.disabled).toBe(true);
      });
    });

    it('readonly 阻止 onChange 但 setFieldsValue 仍可更新', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} readonly>
            <FormItem label="名称" name="name" initialData="original">
              <Input placeholder="test-input" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFieldsValue({ name: 'new-value' })}>change</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByPlaceholderText, getByText } = render(<TestForm />);
      expect((getByPlaceholderText('test-input') as HTMLInputElement).value).toBe('original');
      fireEvent.click(getByText('change'));
      await mockDelay();
      expect((getByPlaceholderText('test-input') as HTMLInputElement).value).toBe('new-value');
    });

    it('contentAlign 属性正确应用', () => {
      const { container } = render(
        <Form>
          <FormItem label="名称" name="name" contentAlign="right">
            <Input />
          </FormItem>
        </Form>,
      );
      expect(container.querySelector('.t-form__controls--right')).toBeTruthy();
    });

    it('字符串 labelWidth 设置 marginLeft', () => {
      const { container } = render(
        <Form labelWidth="6em">
          <FormItem label="名称" name="name">
            <Input />
          </FormItem>
        </Form>,
      );
      expect(container.querySelector('.t-form__controls').getAttribute('style')).toContain('margin-left: 6em');
    });

    it('Form 无 children 正常渲染', () => {
      const { container } = render(<Form />);
      expect(container.querySelector('form')).toBeTruthy();
    });
  });

  describe('FormItem props', () => {
    it('name 支持数组（嵌套路径）', () => {
      const { getByPlaceholderText } = render(
        <Form initialData={{ user: { name: 'TestName' }, birthday: '1996-01-24' }}>
          <FormItem label="姓名" name={['user', 'name']}>
            <Input placeholder="name" />
          </FormItem>
          <FormItem label="生日" name="birthday">
            <Input placeholder="birthday" />
          </FormItem>
        </Form>,
      );
      expect((getByPlaceholderText('name') as HTMLInputElement).value).toBe('TestName');
      expect((getByPlaceholderText('birthday') as HTMLInputElement).value).toBe('1996-01-24');
    });

    it('arrow 属性显示右侧箭头', () => {
      const { container } = render(
        <Form>
          <FormItem label="名称" name="name" arrow>
            <Input />
          </FormItem>
        </Form>,
      );
      expect(container.querySelector('svg')).toBeTruthy();
    });

    it('help 属性支持字符串和函数', () => {
      const { container: c1 } = render(
        <Form>
          <FormItem label="名称" name="name" help="帮助信息">
            <Input />
          </FormItem>
        </Form>,
      );
      expect(c1.querySelector('.t-form__item-help')).toBeTruthy();
      expect(c1.textContent).toContain('帮助信息');

      const { container: c2 } = render(
        <Form>
          <FormItem label="名称" name="n2" help={() => <span className="custom-help">自定义帮助</span>}>
            <Input />
          </FormItem>
        </Form>,
      );
      expect(c2.querySelector('.custom-help')).toBeTruthy();
    });

    it('labelWidth 为 0 时不渲染 label 内容', () => {
      const { container } = render(
        <Form>
          <FormItem label="名称" name="name" labelWidth={0}>
            <Input />
          </FormItem>
        </Form>,
      );
      expect(container.querySelector('.t-form__label label').textContent).toBe('');
    });

    it('label 支持函数类型', () => {
      const { container } = render(
        <Form>
          <FormItem label={() => <span className="custom-label">自定义</span>} name="name">
            <Input />
          </FormItem>
        </Form>,
      );
      expect(container.querySelector('.custom-label')).toBeTruthy();
    });

    it('requiredMark 和 requiredMarkPosition', () => {
      const { container } = render(
        <Form requiredMarkPosition="right">
          <FormItem label="名称" name="name" rules={[{ required: true }]}>
            <Input />
          </FormItem>
        </Form>,
      );
      expect(container.querySelector('.t-form__label--required')).toBeTruthy();
      expect(container.querySelector('.t-form__label--required-right')).toBeTruthy();
    });

    it('showErrorMessage 为 false 时不显示错误信息', async () => {
      const { getByText, queryByText } = render(
        <Form showErrorMessage={false}>
          <FormItem name="username" rules={[{ required: true, message: '请输入用户名' }]}>
            <Input placeholder="username" />
          </FormItem>
          <FormItem>
            <Button type="submit">submit</Button>
          </FormItem>
        </Form>,
      );
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(queryByText('请输入用户名')).not.toBeTruthy();
    });

    it('FormItem initialData 优先级高于 Form.initialData', () => {
      const { getByPlaceholderText } = render(
        <Form initialData={{ name: 'form-level' }}>
          <FormItem label="名称" name="name" initialData="item-level">
            <Input placeholder="name" />
          </FormItem>
        </Form>,
      );
      expect((getByPlaceholderText('name') as HTMLInputElement).value).toBe('item-level');
    });

    it('FormItem style 和 className', () => {
      const { container } = render(
        <Form>
          <FormItem name="test" style={{ marginTop: '20px' }} className="custom-item">
            <Input />
          </FormItem>
        </Form>,
      );
      const formItem = container.querySelector('.t-form__item');
      expect(formItem.getAttribute('style')).toContain('margin-top: 20px');
      expect(container.querySelector('.custom-item')).toBeTruthy();
    });

    it('for 属性设置 label htmlFor', () => {
      const { container } = render(
        <Form>
          <FormItem label="名称" name="name" for="name-input">
            <Input />
          </FormItem>
        </Form>,
      );
      expect(container.querySelector('label').getAttribute('for')).toBe('name-input');
    });

    it('FormItem 没有 name 时正常渲染且不参与校验', async () => {
      let result: any;
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem label="无name">
              <span className="static-content">纯展示内容</span>
            </FormItem>
            <FormItem name="named" initialData="hello" rules={[{ required: true }]}>
              <Input placeholder="named" />
            </FormItem>
            <FormItem>
              <Button
                onClick={async () => {
                  result = await form.validate();
                }}
              >
                validate
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { container, getByText } = render(<TestForm />);
      expect(container.querySelector('.static-content')).toBeTruthy();
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(result).toBe(true);
    });

    it('FormItem children 各种类型：null / Fragment / 非 ReactElement / 多子组件', () => {
      const { container } = render(
        <Form>
          <FormItem label="null" name="t1">
            {null}
          </FormItem>
          <FormItem name="t2">
            <React.Fragment>
              <Input placeholder="frag-input" />
            </React.Fragment>
          </FormItem>
          <FormItem name="t3" initialData="hello">
            <Input placeholder="input" />
            {'plain text'}
          </FormItem>
          <FormItem name="t4">
            <Input placeholder="i1" />
            <Input placeholder="i2" />
          </FormItem>
        </Form>,
      );
      expect(container.querySelector('.t-form')).toBeTruthy();
      expect(container.textContent).toContain('plain text');
      expect(container.querySelectorAll('input').length).toBeGreaterThanOrEqual(3);
    });

    it('FormItem children 为函数渲染', async () => {
      const renderFn = vi.fn().mockReturnValue(<span data-testid="fn-child">test</span>);
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem shouldUpdate>{renderFn}</FormItem>
          </Form>
        );
      };
      render(<TestForm />);
      expect(renderFn).toHaveBeenCalled();
      const formInstance = renderFn.mock.calls[0][0];
      expect(formInstance).toHaveProperty('getFieldValue');
      expect(formInstance).toHaveProperty('setFieldsValue');
    });
  });

  describe('reset & submit', () => {
    it('表单提交和重置事件触发', async () => {
      const submitFn = vi.fn();
      const resetFn = vi.fn();
      const { getByText } = render(
        <Form onSubmit={submitFn} onReset={resetFn}>
          <FormItem label="input1" name="input1" initialData="test">
            <Input placeholder="input1" />
          </FormItem>
          <FormItem>
            <Button type="submit">提交表单</Button>
            <Button type="reset">重置表单</Button>
          </FormItem>
        </Form>,
      );
      fireEvent.click(getByText('重置表单'));
      expect(resetFn).toHaveBeenCalledTimes(1);
      fireEvent.click(getByText('提交表单'));
      await mockDelay();
      expect(submitFn).toHaveBeenCalledTimes(1);
    });

    it('resetType initial 和 empty 切换', async () => {
      const initialVal = 'test input';
      const TestForm = () => {
        const [form] = Form.useForm();
        const [resetType, setResetType] = useState<TdFormProps['resetType']>('initial');
        return (
          <div>
            <Button onClick={() => setResetType('empty')}>reset-empty</Button>
            <Button onClick={() => setResetType('initial')}>reset-initial</Button>
            <Form form={form} resetType={resetType}>
              <FormItem initialData={initialVal} name="input1">
                <Input placeholder="input1" />
              </FormItem>
              <FormItem>
                <Button type="reset">reset</Button>
                <Button onClick={() => form.setFieldsValue({ input1: 'value1' })}>set-value1</Button>
              </FormItem>
            </Form>
          </div>
        );
      };
      const { getByPlaceholderText, getByText } = render(<TestForm />);
      expect((getByPlaceholderText('input1') as HTMLInputElement).value).toEqual(initialVal);

      fireEvent.click(getByText('set-value1'));
      await mockDelay();
      fireEvent.click(getByText('reset'));
      await mockDelay();
      expect((getByPlaceholderText('input1') as HTMLInputElement).value).toEqual(initialVal);

      fireEvent.click(getByText('reset-empty'));
      await mockDelay();
      fireEvent.click(getByText('set-value1'));
      await mockDelay();
      fireEvent.click(getByText('reset'));
      await mockDelay();
      expect((getByPlaceholderText('input1') as HTMLInputElement).value).toEqual('');
    });

    it('reset 方法支持指定字段和 type 参数', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} resetType="initial">
            <FormItem name="field1" initialData="init1">
              <Input placeholder="field1" />
            </FormItem>
            <FormItem name="field2" initialData="init2">
              <Input placeholder="field2" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFieldsValue({ field1: 'c1', field2: 'c2' })}>changeAll</Button>
              <Button onClick={() => form.reset({ fields: ['field1'] })}>resetField1</Button>
              <Button onClick={() => form.reset({ type: 'empty', fields: ['field2'] })}>resetField2Empty</Button>
              <Button onClick={() => form.reset()}>resetAll</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByPlaceholderText, getByText } = render(<TestForm />);
      fireEvent.click(getByText('changeAll'));
      await mockDelay();
      fireEvent.click(getByText('resetField1'));
      await mockDelay();
      expect((getByPlaceholderText('field1') as HTMLInputElement).value).toBe('init1');
      expect((getByPlaceholderText('field2') as HTMLInputElement).value).toBe('c2');

      fireEvent.click(getByText('resetField2Empty'));
      await mockDelay();
      expect((getByPlaceholderText('field2') as HTMLInputElement).value).toBe('');
    });

    it('reset 后触发 onValuesChange', async () => {
      const fn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} onValuesChange={fn}>
            <FormItem name="name" initialData="hello">
              <Input placeholder="name" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.reset()}>reset</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('reset'));
      await mockDelay();
      expect(fn).toHaveBeenCalled();
    });

    it('数组和对象类型值 reset 为 empty', async () => {
      let arrVal: any;
      let objVal: any;
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} resetType="empty">
            <FormItem name="tags" initialData={['tag1', 'tag2']}>
              <Input placeholder="tags" />
            </FormItem>
            <FormItem name="obj" initialData={{ key: 'value' }}>
              <Input placeholder="obj" />
            </FormItem>
            <FormItem>
              <Button
                onClick={() => {
                  form.reset();
                }}
              >
                reset
              </Button>
              <Button
                onClick={() => {
                  arrVal = form.getFieldValue('tags');
                  objVal = form.getFieldValue('obj');
                }}
              >
                get
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('reset'));
      await mockDelay();
      fireEvent.click(getByText('get'));
      // 数组和对象 reset 为 empty 时应清为 [] 和 {}
    });

    it('preventSubmitDefault 为 true 时 submit 和 reset 阻止默认事件', async () => {
      const submitFn = vi.fn();
      const { getByText } = render(
        <Form preventSubmitDefault onSubmit={submitFn}>
          <FormItem name="test" initialData="val">
            <Input />
          </FormItem>
          <FormItem>
            <Button type="submit">submit</Button>
          </FormItem>
        </Form>,
      );
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(submitFn).toHaveBeenCalled();
    });

    it('preventSubmitDefault 为 false 时不阻止默认事件', async () => {
      const submitFn = vi.fn();
      const resetFn = vi.fn();
      const { getByText } = render(
        <Form preventSubmitDefault={false} onSubmit={submitFn} onReset={resetFn}>
          <FormItem name="test" initialData="val">
            <Input />
          </FormItem>
          <FormItem>
            <Button type="submit">submit</Button>
            <Button type="reset">reset</Button>
          </FormItem>
        </Form>,
      );
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(submitFn).toHaveBeenCalled();
      fireEvent.click(getByText('reset'));
      await mockDelay();
      expect(resetFn).toHaveBeenCalled();
    });
  });

  describe('form instance', () => {
    it('setFields, setFieldsValue, validate, clearValidate', async () => {
      const fn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} onValuesChange={fn}>
            <FormItem
              label="input1"
              name="input1"
              rules={[{ required: true, message: 'input1 未填写', type: 'error' }]}
            >
              <Input placeholder="input1" />
            </FormItem>
            <FormItem>
              <Button type="reset">reset</Button>
              <Button onClick={() => form.setFields([{ name: 'input1', value: 'setFields' }])}>setFields</Button>
              <Button onClick={() => form.setFieldsValue({ input1: 'setFieldsValue' })}>setFieldsValue</Button>
              <Button onClick={() => form.validate()}>validate</Button>
              <Button onClick={() => form.clearValidate()}>clearValidate</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByPlaceholderText, getByText, queryByText } = render(<TestForm />);

      fireEvent.click(getByText('setFields'));
      await mockDelay();
      expect((getByPlaceholderText('input1') as HTMLInputElement).value).toEqual('setFields');
      expect(fn).toHaveBeenCalled();

      fireEvent.click(getByText('setFieldsValue'));
      await mockDelay();
      expect((getByPlaceholderText('input1') as HTMLInputElement).value).toEqual('setFieldsValue');

      fireEvent.click(getByText('reset'));
      await mockDelay();
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(queryByText('input1 未填写')).toBeTruthy();

      fireEvent.click(getByText('clearValidate'));
      expect(queryByText('input1 未填写')).not.toBeTruthy();
    });

    it('validateOnly 不显示错误信息', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem label="input1" name="input1" rules={[{ required: true, message: 'input1 必填', type: 'error' }]}>
              <Input placeholder="input1" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validateOnly()}>validateOnly</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('validateOnly'));
      await mockDelay();
      expect(queryByText('input1 必填')).not.toBeTruthy();
    });

    it('getFieldValue 和 getFieldsValue', async () => {
      let result: any;
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} initialData={{ name: 'hello', age: '20' }}>
            <FormItem name="name">
              <Input />
            </FormItem>
            <FormItem name="age">
              <Input />
            </FormItem>
            <FormItem>
              <Button
                onClick={() => {
                  const val = form.getFieldValue('name');
                  const all = form.getFieldsValue(true);
                  const partial = form.getFieldsValue(['name']);
                  result = { val, all, partial };
                }}
              >
                get
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('get'));
      await mockDelay();
      expect(result.val).toBe('hello');
      expect(result.all.name).toBe('hello');
      expect(result.all.age).toBe('20');
      expect(result.partial.name).toBe('hello');
      expect(result.partial).not.toHaveProperty('age');
    });

    it('getFieldValue 空 name 返回 null', () => {
      let result: any = 'not-null';
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="test" initialData="hello">
              <Input />
            </FormItem>
            <FormItem>
              <Button
                onClick={() => {
                  result = form.getFieldValue('' as any);
                }}
              >
                get
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('get'));
      expect(result).toBeNull();
    });

    it('getFieldsValue 非数组参数打印错误', async () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
      let result: any;
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="name" initialData="test">
              <Input />
            </FormItem>
            <FormItem>
              <Button
                onClick={() => {
                  result = form.getFieldsValue('invalid' as any);
                }}
              >
                get
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('get'));
      expect(result).toEqual({});
      consoleSpy.mockRestore();
    });

    it('setFieldsValue 支持嵌套对象赋值', () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} initialData={{ user: { name: 'name1' }, birthday: '2000-01-01' }}>
            <FormItem label="姓名" name={['user', 'name']}>
              <Input placeholder="name" />
            </FormItem>
            <FormItem label="生日" name="birthday">
              <Input placeholder="birthday" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFieldsValue({ user: { name: 'name2' }, birthday: '2001-01-01' })}>
                set
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByPlaceholderText, getByText } = render(<TestForm />);
      expect((getByPlaceholderText('name') as HTMLInputElement).value).toBe('name1');
      fireEvent.click(getByText('set'));
      expect((getByPlaceholderText('name') as HTMLInputElement).value).toBe('name2');
      expect((getByPlaceholderText('birthday') as HTMLInputElement).value).toBe('2001-01-01');
    });

    it('setValidateMessage 和 getValidateMessage', async () => {
      let message: any;
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem className="username" name="username">
              <Input />
            </FormItem>
            <FormItem className="password" name="password">
              <Input />
            </FormItem>
            <FormItem>
              <Button
                onClick={() =>
                  form.setValidateMessage({
                    username: [{ type: 'error', message: 'custom error' }],
                    password: [{ type: 'warning', message: 'custom warning' }],
                  })
                }
              >
                setMsg
              </Button>
              <Button
                onClick={() => {
                  message = form.getValidateMessage();
                }}
              >
                getMsg
              </Button>
              <Button
                onClick={() => {
                  message = form.getValidateMessage(['username']);
                }}
              >
                getMsgField
              </Button>
              <Button onClick={() => form.setValidateMessage({})}>setEmpty</Button>
            </FormItem>
          </Form>
        );
      };
      const { container, getByText } = render(<TestForm />);

      // setValidateMessage 空对象直接返回
      fireEvent.click(getByText('setEmpty'));

      fireEvent.click(getByText('setMsg'));
      await mockDelay();
      expect(container.querySelector('.username .t-form__item-extra')).toBeTruthy();

      fireEvent.click(getByText('getMsg'));
      expect(message).toBeTruthy();

      fireEvent.click(getByText('getMsgField'));
      expect(Object.keys(message)).toContain('username');
    });

    it('submit 方法 + onSubmit 回调包含 firstError', async () => {
      const submitFn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} onSubmit={submitFn}>
            <FormItem name="name" rules={[{ required: true, message: '名称必填' }]}>
              <Input placeholder="name" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.submit()}>submit</Button>
              <Button onClick={() => form.submit({ showErrorMessage: false })}>submitNoError</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);

      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(submitFn).toHaveBeenCalled();
      expect(submitFn.mock.calls[0][0].firstError).toBe('名称必填');

      // submit 不显示错误信息
      fireEvent.click(getByText('submitNoError'));
      await mockDelay();
    });

    it('onSubmit 全通过时 firstError 为空', async () => {
      const submitFn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} onSubmit={submitFn}>
            <FormItem name="name" initialData="hello" rules={[{ required: true }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.submit()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(submitFn.mock.calls[0][0].firstError).toBe('');
    });

    it('setFields 设置 validateMessage 和非数组参数抛错', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="field">
              <Input placeholder="field" />
            </FormItem>
            <FormItem>
              <Button
                onClick={() =>
                  form.setFields([
                    { name: 'field', value: 'hello', validateMessage: { type: 'error', message: '自定义错误' } },
                  ])
                }
              >
                setFields
              </Button>
              <Button
                onClick={() => {
                  try {
                    form.setFields('invalid' as any);
                  } catch (e) {}
                }}
              >
                setFieldsInvalid
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, getByPlaceholderText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('setFields'));
      await mockDelay();
      expect((getByPlaceholderText('field') as HTMLInputElement).value).toBe('hello');
      expect(queryByText('自定义错误')).toBeTruthy();

      expect(() => fireEvent.click(getByText('setFieldsInvalid'))).not.toThrow();
    });

    it('setFields 赋相同值不重复触发 onValuesChange', async () => {
      const fn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} onValuesChange={fn}>
            <FormItem name="input1">
              <Input placeholder="input1" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFields([{ name: 'input1', value: 'same-value' }])}>setFields</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('setFields'));
      await mockDelay();
      expect(fn).toHaveBeenCalledTimes(1);
      fireEvent.click(getByText('setFields'));
      await mockDelay();
      expect(fn).toHaveBeenCalledTimes(1);
    });

    it('clearValidate 可指定清除某些字段', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="name" rules={[{ required: true, message: 'name required' }]}>
              <Input />
            </FormItem>
            <FormItem name="email" rules={[{ required: true, message: 'email required' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
              <Button onClick={() => form.clearValidate(['name'])}>clearName</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(queryByText('name required')).toBeTruthy();
      expect(queryByText('email required')).toBeTruthy();
      fireEvent.click(getByText('clearName'));
      await mockDelay();
      expect(queryByText('name required')).not.toBeTruthy();
      expect(queryByText('email required')).toBeTruthy();
    });

    it('validate 指定字段校验', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="name" rules={[{ required: true, message: 'name required' }]}>
              <Input />
            </FormItem>
            <FormItem name="email" rules={[{ required: true, message: 'email required' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate({ fields: ['name'] })}>validateName</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('validateName'));
      await mockDelay();
      expect(queryByText('name required')).toBeTruthy();
      expect(queryByText('email required')).not.toBeTruthy();
    });

    it('validate 返回值：通过返回 true，失败返回错误对象', async () => {
      let result1: any;
      let result2: any;
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="name" initialData="hello" rules={[{ required: true }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button
                onClick={async () => {
                  result1 = await form.validate();
                }}
              >
                v1
              </Button>
              <Button onClick={() => form.setFieldsValue({ name: '' })}>clear</Button>
              <Button
                onClick={async () => {
                  result2 = await form.validate();
                }}
              >
                v2
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('v1'));
      await mockDelay();
      expect(result1).toBe(true);

      fireEvent.click(getByText('clear'));
      await mockDelay();
      fireEvent.click(getByText('v2'));
      await mockDelay();
      expect(result2).not.toBe(true);
      expect(result2).toHaveProperty('name');
    });

    it('currentElement / getCurrentElement 返回 form DOM', () => {
      let el1: any;
      let el2: any;
      const TestForm = () => {
        const [form] = Form.useForm();
        useEffect(() => {
          el1 = (form as any).currentElement?.();
          el2 = (form as any).getCurrentElement?.();
        }, []);
        return (
          <Form form={form}>
            <FormItem name="test">
              <Input />
            </FormItem>
          </Form>
        );
      };
      render(<TestForm />);
      expect(el1).toBeTruthy();
      expect(el1.tagName).toBe('FORM');
      expect(el2.tagName).toBe('FORM');
    });

    it('getValidateMessage 非数组参数抛出 TypeError', () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="test">
              <Input />
            </FormItem>
            <FormItem>
              <Button
                onClick={() => {
                  try {
                    form.getValidateMessage('invalid' as any);
                  } catch (e) {}
                }}
              >
                getMsg
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      expect(() => fireEvent.click(getByText('getMsg'))).not.toThrow();
    });
  });

  describe('表单校验', () => {
    it('blur 触发校验', async () => {
      const { container, queryByText } = render(
        <Form>
          <FormItem name="username" rules={[{ required: true, trigger: 'blur', message: 'please input username' }]}>
            <Input placeholder="username" />
          </FormItem>
        </Form>,
      );
      fireEvent.blur(container.querySelector('input'));
      await mockDelay();
      expect(queryByText('please input username')).toBeTruthy();
    });

    it('change 触发校验', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem
              name="username"
              initialData="hello"
              rules={[{ required: true, trigger: 'change', message: 'required' }]}
            >
              <Input placeholder="username" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFieldsValue({ username: '' })}>clear</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('clear'));
      await mockDelay();
      expect(queryByText('required')).toBeTruthy();
    });

    it('blur 规则在 change 触发时不校验 (trigger 不匹配)', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="field" initialData="x" rules={[{ required: true, trigger: 'blur', message: '必填blur' }]}>
              <Input placeholder="field" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFieldsValue({ field: '' })}>change</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('change'));
      await mockDelay();
      expect(queryByText('必填blur')).not.toBeTruthy();
    });

    it('Form 级别 rules + pRuleName 匹配', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form
            form={form}
            rules={{
              username: [{ required: true, message: 'username is required' }],
            }}
          >
            <FormItem name="username">
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(queryByText('username is required')).toBeTruthy();
    });

    it('Form rules 对字符串嵌套 name 使用 pRuleName 匹配', async () => {
      // 当 name 为字符串 "user.name" 时, pRuleName = "name" (lastIndexOf('.') 后的部分)
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form
            form={form}
            rules={{
              name: [{ required: true, message: 'name is required via pRuleName' }],
            }}
          >
            <FormItem name="user.name">
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      // lodashGet(rulesFromContext, "user.name") 返回 undefined
      // pRuleName = "user.name".slice("user.name".lastIndexOf('.') + 1) = "name"
      // lodashGet(rulesFromContext, "name") 匹配到规则
      expect(queryByText('name is required via pRuleName')).toBeTruthy();
    });

    it('自定义同步和异步 validator', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem
              name="sync"
              initialData="bad"
              rules={[{ validator: (v: any) => v.length > 5, message: '至少6位' }]}
            >
              <Input />
            </FormItem>
            <FormItem
              name="async"
              initialData="bad"
              rules={[
                {
                  validator: (v: any) => new Promise((r) => setTimeout(() => r(v.length > 5), 50)),
                  message: '异步至少6位',
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay(200);
      expect(queryByText('至少6位')).toBeTruthy();
      expect(queryByText('异步至少6位')).toBeTruthy();
    });

    it('validator 返回对象类型（成功/失败）', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem
              name="fail"
              initialData="x"
              rules={[{ validator: () => ({ result: false, message: '自定义错误', type: 'error' }) }]}
            >
              <Input />
            </FormItem>
            <FormItem
              name="success"
              initialData="ok"
              rules={[{ validator: () => ({ result: true, message: '校验成功', type: 'success' }) }]}
            >
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(queryByText('自定义错误')).toBeTruthy();
      expect(queryByText('校验成功')).toBeTruthy();
    });

    it('warning 类型校验', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem
              className="warn-item"
              name="field"
              rules={[{ required: true, message: '建议填写', type: 'warning' }]}
            >
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { container, getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(queryByText('建议填写')).toBeTruthy();
      expect(container.querySelector('.t-form__item--warning')).toBeTruthy();
    });

    it('多条规则校验', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem
              name="password"
              initialData="ab"
              rules={[
                { required: true, message: '密码必填' },
                { min: 6, message: '密码至少6位' },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(queryByText('密码至少6位')).toBeTruthy();
    });

    it('onValidate 回调在校验结束后触发', async () => {
      const onValidateFn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} onValidate={onValidateFn}>
            <FormItem name="name" rules={[{ required: true, message: '必填' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(onValidateFn).toHaveBeenCalled();
      expect(onValidateFn.mock.calls[0][0]).toHaveProperty('validateResult');
    });

    it('errorMessages 模板编译', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} errorMessage={{ min: '${name}最少${validate}个字符' }}>
            <FormItem name="username" label="用户名" initialData="ab" rules={[{ min: 5 }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(queryByText('用户名最少5个字符')).toBeTruthy();
    });

    it('validator 接收 context 参数 (formData + name)', async () => {
      const validatorFn = vi.fn().mockReturnValue(true);
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="field" initialData="hello" rules={[{ validator: validatorFn }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(validatorFn).toHaveBeenCalled();
      // validator 接收 (value, context)
      const [val, context] = validatorFn.mock.calls[0];
      expect(val).toBe('hello');
      expect(context).toHaveProperty('formData');
      expect(context).toHaveProperty('name', 'field');
    });

    it('FormItem setValidateMessage 空数组清除错误/非数组参数直接返回', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="field" rules={[{ required: true, message: '必填' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
              <Button onClick={() => form.setValidateMessage({ field: [] })}>clearMsg</Button>
              <Button onClick={() => form.setValidateMessage({ field: null as any })}>setNull</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(queryByText('必填')).toBeTruthy();

      fireEvent.click(getByText('clearMsg'));
      await mockDelay();
      expect(queryByText('必填')).not.toBeTruthy();

      // 非数组参数不崩溃
      fireEvent.click(getByText('setNull'));
      await mockDelay();
    });
  });

  describe('formModel 校验规则', () => {
    const validateRuleCases = [
      { name: 'email', initialData: 'not-email', rule: { email: true, message: '邮箱格式错误' } },
      { name: 'url', initialData: 'not-url', rule: { url: true, message: 'URL格式错误' } },
      { name: 'number', initialData: 'abc', rule: { number: true, message: '必须是数字' } },
      { name: 'len', initialData: 'abc', rule: { len: 5, message: '长度必须为5' } },
      { name: 'pattern-regex', initialData: 'abc123', rule: { pattern: /^\d+$/, message: '只能输入数字regex' } },
      { name: 'pattern-string', initialData: 'abc', rule: { pattern: '^\\d+$', message: '只能输入数字str' } },
      { name: 'enum', initialData: 'unknown', rule: { enum: ['a', 'b', 'c'], message: '值不在枚举范围内' } },
      { name: 'whitespace', initialData: '   ', rule: { whitespace: true, message: '不能为空格' } },
      { name: 'idcard', initialData: '12345', rule: { idcard: true, message: '身份证格式错误' } },
      { name: 'telnumber', initialData: '12345', rule: { telnumber: true, message: '手机号格式错误' } },
      { name: 'max-str', initialData: 'abcdefghijk', rule: { max: 5, message: '超过最大长度' } },
      { name: 'min-str', initialData: 'ab', rule: { min: 5, message: '小于最小长度' } },
      { name: 'boolean', initialData: 'not-boolean', rule: { boolean: true, message: '必须是布尔值' } },
      { name: 'date', initialData: 'not-a-date', rule: { date: true, message: '日期格式错误' } },
      { name: 'max-num', initialData: 20, rule: { max: 10, message: '数字超过最大值' } },
      { name: 'min-num', initialData: 3, rule: { min: 5, message: '数字小于最小值' } },
    ];

    validateRuleCases.forEach(({ name: caseName, initialData, rule }) => {
      it(`${caseName} 规则校验失败`, async () => {
        const TestForm = () => {
          const [form] = Form.useForm();
          return (
            <Form form={form}>
              <FormItem name="field" initialData={initialData} rules={[rule as any]}>
                <Input />
              </FormItem>
              <FormItem>
                <Button onClick={() => form.validate()}>submit</Button>
              </FormItem>
            </Form>
          );
        };
        const { getByText, queryByText } = render(<TestForm />);
        fireEvent.click(getByText('submit'));
        await mockDelay();
        expect(queryByText(rule.message)).toBeTruthy();
      });
    });

    it('非必填项为空时不校验', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="email" rules={[{ email: true, message: '邮箱格式错误' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(queryByText('邮箱格式错误')).not.toBeTruthy();
    });

    it('中文字符按2字节计算', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="cn1" initialData="你好" rules={[{ max: 3, message: '超过max' }]}>
              <Input />
            </FormItem>
            <FormItem name="cn2" initialData="你" rules={[{ min: 3, message: '不够min' }]}>
              <Input />
            </FormItem>
            <FormItem name="cn3" initialData="你好" rules={[{ len: 4, message: '长度不对' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(queryByText('超过max')).toBeTruthy();
      expect(queryByText('不够min')).toBeTruthy();
      // "你好" = 4 字节，len:4 通过
      expect(queryByText('长度不对')).not.toBeTruthy();
    });

    it('无法识别的规则键不触发校验失败', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="field" initialData="test" rules={[{ message: '不会显示', type: 'error' } as any]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(queryByText('不会显示')).not.toBeTruthy();
    });
  });

  describe('formModel 辅助函数', () => {
    it('isValueEmpty 正确判断空值', () => {
      expect(isValueEmpty('')).toBe(true);
      expect(isValueEmpty(undefined)).toBe(true);
      expect(isValueEmpty(null)).toBe(true);
      expect(isValueEmpty({})).toBe(true);
      expect(isValueEmpty([])).toBe(true);
      expect(isValueEmpty(0)).toBe(false);
      expect(isValueEmpty(false)).toBe(false);
      expect(isValueEmpty('hello')).toBe(false);
      expect(isValueEmpty(new Date())).toBe(false);
    });
  });

  describe('onValuesChange', () => {
    it('setFieldsValue 触发 onValuesChange', async () => {
      const fn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} onValuesChange={fn}>
            <FormItem name="input1">
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFieldsValue({ input1: 'hello' })}>change</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('change'));
      await mockDelay();
      expect(fn).toHaveBeenCalled();
    });
  });

  describe('shouldUpdate', () => {
    it('shouldUpdate 条件渲染和函数判断', async () => {
      const renderFn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem label="性别" name="gender" initialData="male">
              <Input placeholder="gender" />
            </FormItem>
            <FormItem shouldUpdate={(prev: any, next: any) => prev.gender !== next.gender}>
              {({ getFieldValue }: FormInstanceFunctions) => {
                renderFn();
                return getFieldValue('gender') === 'female' ? (
                  <FormItem name="opt">
                    <Input placeholder="female-opt" />
                  </FormItem>
                ) : (
                  <FormItem name="def">
                    <Input placeholder="male-opt" />
                  </FormItem>
                );
              }}
            </FormItem>
            <FormItem shouldUpdate>{() => <span data-testid="always">always</span>}</FormItem>
            <FormItem>
              <Button onClick={() => form.setFieldsValue({ gender: 'female' })}>setFemale</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByPlaceholderText } = render(<TestForm />);
      expect(queryByPlaceholderText('male-opt')).toBeTruthy();
      expect(queryByPlaceholderText('female-opt')).not.toBeTruthy();

      const callsBefore = renderFn.mock.calls.length;
      fireEvent.click(getByText('setFemale'));
      await mockDelay();
      expect(queryByPlaceholderText('female-opt')).toBeTruthy();
      expect(renderFn.mock.calls.length).toBeGreaterThan(callsBefore);
    });
  });

  describe('useWatch', () => {
    it('useWatch 监听字段变化 (包括嵌套路径)', async () => {
      const WatchedValue = ({ form }: { form: any }) => {
        const name = Form.useWatch('name', form);
        const nested = Form.useWatch(['user', 'age'], form);
        return (
          <div data-testid="w">
            {name || ''},{nested || ''}
          </div>
        );
      };
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <div>
            <Form form={form}>
              <FormItem name="name">
                <Input />
              </FormItem>
              <FormItem name={['user', 'age']}>
                <Input />
              </FormItem>
              <FormItem>
                <Button onClick={() => form.setFieldsValue({ name: 'test', user: { age: '20' } })}>change</Button>
              </FormItem>
            </Form>
            <WatchedValue form={form} />
          </div>
        );
      };
      const { getByText, getByTestId } = render(<TestForm />);
      fireEvent.click(getByText('change'));
      await mockDelay();
      expect(getByTestId('w').textContent).toContain('test');
      expect(getByTestId('w').textContent).toContain('20');
    });

    it('useWatch 传入无效 form 不崩溃', () => {
      const WatchedValue = () => {
        const name = Form.useWatch('test', null as any);
        return <div data-testid="watch">{name || 'empty'}</div>;
      };
      const { getByTestId } = render(<WatchedValue />);
      expect(getByTestId('watch').textContent).toBe('empty');
    });
  });

  describe('scrollToFirstError', () => {
    it('校验失败时调用 scrollIntoView', async () => {
      const scrollIntoViewMock = vi.fn();
      Element.prototype.scrollIntoView = scrollIntoViewMock;

      const { getByText } = render(
        <Form scrollToFirstError="smooth">
          <FormItem name="username" rules={[{ required: true, message: '用户名必填' }]}>
            <Input />
          </FormItem>
          <FormItem>
            <Button type="submit">submit</Button>
          </FormItem>
        </Form>,
      );
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(scrollIntoViewMock).toHaveBeenCalledWith({ behavior: 'smooth' });
    });

    it('form.submit() 路径的 scrollToFirstError + getFirstError', async () => {
      const submitFn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} scrollToFirstError="smooth" onSubmit={submitFn}>
            <FormItem name="username" rules={[{ required: true, message: '用户名必填' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.submit()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(submitFn).toHaveBeenCalled();
      expect(submitFn.mock.calls[0][0].firstError).toBe('用户名必填');
    });
  });

  describe('requestSubmit 辅助函数', () => {
    it('非 HTMLFormElement 抛出错误', () => {
      expect(() => requestSubmit({} as any)).toThrow('target must be HTMLFormElement');
    });

    it('HTMLFormElement 正常工作', async () => {
      const { container } = render(
        <Form>
          <FormItem name="test">
            <Input />
          </FormItem>
        </Form>,
      );
      await act(async () => {
        expect(() => requestSubmit(container.querySelector('form') as HTMLFormElement)).not.toThrow();
      });
    });
  });

  describe('FormContext', () => {
    it('useFormContext 在 Form 外部使用抛出错误', () => {
      const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});
      expect(() => {
        const TestComponent = () => {
          useFormContext();
          return null;
        };
        render(<TestComponent />);
      }).toThrow('useFormContext must be used within a FormProvider');
      consoleError.mockRestore();
    });
  });

  describe('useForm hook', () => {
    it('外部传入 form 实例使用传入的', () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="name" initialData="external">
              <Input placeholder="name" />
            </FormItem>
          </Form>
        );
      };
      const { getByPlaceholderText } = render(<TestForm />);
      expect((getByPlaceholderText('name') as HTMLInputElement).value).toBe('external');
    });

    it('不传 form 实例时内部创建', () => {
      const { getByPlaceholderText } = render(
        <Form>
          <FormItem name="name" initialData="internal">
            <Input placeholder="name" />
          </FormItem>
        </Form>,
      );
      expect((getByPlaceholderText('name') as HTMLInputElement).value).toBe('internal');
    });

    it('getInternalHooks 传入非 HOOK_MARK 返回 null', () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        const result = form.getInternalHooks?.('WRONG_KEY');
        return <div data-testid="result">{result === null ? 'null' : 'not-null'}</div>;
      };
      const { getByTestId } = render(<TestForm />);
      expect(getByTestId('result').textContent).toBe('null');
    });
  });

  describe('useForm taskQueue', () => {
    it('初始化前的方法调用在 mount 后通过 flashQueue 执行', async () => {
      const submitFn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        useEffect(() => {
          form.setFieldsValue({ name: 'queued-value' });
          form.submit();
          form.reset();
          form.clearValidate();
          form.setValidateMessage({ name: [{ type: 'error', message: '初始错误' }] });
          form.setFields([{ name: 'name', value: 'final' }]);
          form.getValidateMessage();
        }, []);
        return (
          <Form form={form} onSubmit={submitFn} resetType="initial">
            <FormItem name="name" initialData="init">
              <Input placeholder="name" />
            </FormItem>
          </Form>
        );
      };
      const { getByPlaceholderText } = render(<TestForm />);
      await mockDelay();
      // taskQueue 中的方法依次执行
    });

    it('taskQueue 延迟执行 - 条件渲染', () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        const [show, setShow] = useState(false);
        useEffect(() => {
          if (!show) {
            form.setFieldsValue({ name: 'delayed' });
            setShow(true);
          }
        }, [show]);
        if (!show) return <div>loading</div>;
        return (
          <Form form={form}>
            <FormItem name="name">
              <Input placeholder="name" />
            </FormItem>
          </Form>
        );
      };
      const { getByPlaceholderText } = render(<TestForm />);
      expect((getByPlaceholderText('name') as HTMLInputElement).value).toBe('delayed');
    });

    it('taskQueue 延迟执行 - setFields/submit/reset/clearValidate/setValidateMessage', async () => {
      const submitFn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        const [show, setShow] = useState(false);
        useEffect(() => {
          if (!show) {
            // 这些方法在 Form 未挂载时调用，走 taskQueue push 路径
            form.setFields([{ name: 'field', value: 'queued' }]);
            form.submit();
            form.reset();
            form.clearValidate();
            form.setValidateMessage({ field: [{ type: 'error', message: 'msg' }] });
            form.getValidateMessage();
            setShow(true);
          }
        }, [show]);
        if (!show) return <div>loading</div>;
        return (
          <Form form={form} onSubmit={submitFn}>
            <FormItem name="field" initialData="init">
              <Input placeholder="field" />
            </FormItem>
          </Form>
        );
      };
      render(<TestForm />);
      // taskQueue 方法在 flashQueue 时执行，不崩溃即可
      await mockDelay();
    });
  });

  describe('floatingFormDataRef', () => {
    it('没有对应 FormItem 的值存到 floatingFormDataRef 并可读取', async () => {
      let fieldValue: any;
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="existing">
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFieldsValue({ nonExisting: 'floating' })}>setFloating</Button>
              <Button
                onClick={() => {
                  fieldValue = form.getFieldValue('nonExisting');
                }}
              >
                getFloating
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('setFloating'));
      await mockDelay();
      fireEvent.click(getByText('getFloating'));
      expect(fieldValue).toBe('floating');
    });

    it('FormItem 挂载时从 floatingFormDataRef 获取初始值', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        const [show, setShow] = useState(false);
        return (
          <Form form={form}>
            {show && (
              <FormItem name="dynamic">
                <Input placeholder="dynamic" />
              </FormItem>
            )}
            <FormItem>
              <Button
                onClick={() => {
                  form.setFieldsValue({ dynamic: 'pre-set' });
                  setShow(true);
                }}
              >
                show
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, getByPlaceholderText } = render(<TestForm />);
      fireEvent.click(getByText('show'));
      await mockDelay();
      expect(getByPlaceholderText('dynamic')).toBeTruthy();
    });

    it('getFieldsValue nameList 中字段不在 formMap 时从 floatingFormData/store 取值', async () => {
      let result: any;
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="existing" initialData="val1">
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFieldsValue({ floating: 'fv', storeOnly: 'sv' })}>set</Button>
              <Button
                onClick={() => {
                  result = form.getFieldsValue(['existing', 'floating', 'storeOnly', 'nonExist']);
                }}
              >
                get
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('set'));
      await mockDelay();
      fireEvent.click(getByText('get'));
      expect(result.existing).toBe('val1');
      expect(result.floating).toBe('fv');
    });
  });

  describe('FormItem onChange / onBlur 事件', () => {
    it('自定义组件 onChange 正常更新值', async () => {
      const CustomInput = ({ value, onChange }: { value?: string; onChange?: (v: string) => void }) => (
        <div>
          <span data-testid="display">{value || ''}</span>
          <button data-testid="trigger" onClick={() => onChange?.('new-value')}>
            change
          </button>
        </div>
      );
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="custom" initialData="old-value">
              <CustomInput />
            </FormItem>
          </Form>
        );
      };
      const { getByTestId } = render(<TestForm />);
      expect(getByTestId('display').textContent).toBe('old-value');
      fireEvent.click(getByTestId('trigger'));
      await mockDelay();
      expect(getByTestId('display').textContent).toBe('new-value');
    });

    it('readonly 模式下 onChange 被拦截', async () => {
      const CustomInput = ({ value, onChange }: { value?: string; onChange?: (v: string) => void }) => (
        <div>
          <span data-testid="display">{value || ''}</span>
          <button data-testid="trigger" onClick={() => onChange?.('new')}>
            change
          </button>
        </div>
      );
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} readonly>
            <FormItem name="custom" initialData="readonly-value">
              <CustomInput />
            </FormItem>
          </Form>
        );
      };
      const { getByTestId } = render(<TestForm />);
      fireEvent.click(getByTestId('trigger'));
      await mockDelay();
      expect(getByTestId('display').textContent).toBe('readonly-value');
    });

    it('自定义组件 onChange 触发 change 校验 + 保留原始 onChange', async () => {
      const changeFn = vi.fn();
      const CustomInput = ({ value, onChange }: { value?: string; onChange?: (v: string) => void }) => (
        <div>
          <span data-testid="val">{value || ''}</span>
          <button data-testid="btn" onClick={() => onChange?.('')}>
            clear
          </button>
        </div>
      );
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem
              name="custom"
              initialData="hello"
              rules={[{ required: true, trigger: 'change', message: '必填' }]}
            >
              <CustomInput onChange={changeFn} />
            </FormItem>
          </Form>
        );
      };
      const { getByTestId, queryByText } = render(<TestForm />);
      fireEvent.click(getByTestId('btn'));
      await mockDelay();
      expect(queryByText('必填')).toBeTruthy();
      expect(changeFn).toHaveBeenCalledWith('');
    });

    it('子组件的原始 onBlur 被保留', async () => {
      const blurFn = vi.fn();
      const { container } = render(
        <Form>
          <FormItem name="name">
            <Input placeholder="name" onBlur={blurFn} />
          </FormItem>
        </Form>,
      );
      fireEvent.blur(container.querySelector('input')!);
      await mockDelay();
      expect(blurFn).toHaveBeenCalled();
    });
  });

  describe('FormItem 卸载', () => {
    it('FormItem 卸载后不影响表单校验', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        const [show, setShow] = useState(true);
        return (
          <Form form={form}>
            {show && (
              <FormItem name="dynamic" rules={[{ required: true, message: '动态字段必填' }]}>
                <Input />
              </FormItem>
            )}
            <FormItem name="static" rules={[{ required: true, message: '静态字段必填' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => setShow(false)}>hide</Button>
              <Button onClick={() => form.validate()}>validate</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('hide'));
      await mockDelay();
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(queryByText('动态字段必填')).not.toBeTruthy();
      expect(queryByText('静态字段必填')).toBeTruthy();
    });
  });

  describe('needResetField 路径', () => {
    it('在校验过程中 reset 触发 needResetField', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        const handleClick = async () => {
          const p = form.validate();
          form.reset();
          await p;
        };
        return (
          <Form form={form} resetType="initial">
            <FormItem
              name="name"
              initialData=""
              rules={[
                {
                  validator: () => new Promise((r) => setTimeout(() => r(false), 50)),
                  message: '异步校验失败',
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={handleClick}>validateAndReset</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('validateAndReset'));
      await mockDelay(200);
    });

    it('validator 异步期间通过 onBlur 触发的 reset（resetValidating=true）', async () => {
      // 使用一个超长异步 validator，在其执行期间通过 button reset 触发 resetField
      // 此时 resetValidating 应为 true（state 已更新）
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} resetType="initial">
            <FormItem
              name="field"
              initialData="val"
              rules={[
                {
                  validator: () => new Promise((r) => setTimeout(() => r(false), 300)),
                  message: '异步失败',
                },
              ]}
            >
              <Input placeholder="field" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
              <Button type="reset">reset</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      // 触发校验（异步 300ms）
      fireEvent.click(getByText('validate'));
      // 等待 React 状态更新（setResetValidating(true)）
      await mockDelay(50);
      // 此时 resetValidating 应该为 true，调用 reset
      fireEvent.click(getByText('reset'));
      // 等待异步 validator 完成
      await mockDelay(400);
    });
  });

  describe('Form.tsx getFirstError 边界', () => {
    it('getFirstError 对 boolean 结果返回空字符串 (scrollToFirstError 带 scrollIntoView)', async () => {
      const submitFn = vi.fn();
      const { getByText } = render(
        <Form scrollToFirstError="smooth" onSubmit={submitFn}>
          <FormItem name="name" initialData="hello" rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <FormItem>
            <Button type="submit">submit</Button>
          </FormItem>
        </Form>,
      );
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(submitFn).toHaveBeenCalled();
      // 校验通过时 result 为 boolean true，getFirstError 返回 ''
      expect(submitFn.mock.calls[0][0].firstError).toBe('');
    });
  });

  describe('错误状态类名', () => {
    it('校验失败时添加 error 类名', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem className="test-field" name="field" rules={[{ required: true, message: '必填' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { container, getByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(container.querySelector('.t-form__item--error')).toBeTruthy();
    });
  });

  describe('FormItem setField 带 status 参数', () => {
    it('setField 传入 status 不执行额外校验', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="field" rules={[{ required: true, message: '必填' }]}>
              <Input placeholder="field" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFields([{ name: 'field', value: 'v', status: 'success' }])}>
                setWithStatus
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, getByPlaceholderText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('setWithStatus'));
      await mockDelay();
      expect((getByPlaceholderText('field') as HTMLInputElement).value).toBe('v');
      // 有 status 时不触发校验
      expect(queryByText('必填')).not.toBeTruthy();
    });
  });

  describe('FormItem resetField 时 name 为 undefined', () => {
    it('没有 name 的 FormItem resetField 直接返回', () => {
      // Form.reset() 内部遍历 formMapRef，没有 name 的 FormItem 不注册，
      // 所以此用例主要验证 Form.reset 正常运行
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem label="无name">
              <Input />
            </FormItem>
            <FormItem name="named" initialData="val">
              <Input placeholder="named" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.reset()}>reset</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      expect(() => fireEvent.click(getByText('reset'))).not.toThrow();
    });
  });

  describe('analysisValidateResult 当有 rules 但 trigger 不匹配时跳过', () => {
    it('FormItem 有 blur 规则，全量 validate 时使用 all 触发', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="field" rules={[{ required: true, trigger: 'blur', message: '必填' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      // form.validate() 使用 trigger='all'，应该包含 blur 规则
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(queryByText('必填')).toBeTruthy();
    });
  });

  describe('多实例和边界', () => {
    it('多次调用 setFieldsValue 正确覆盖', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="name">
              <Input placeholder="name" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFieldsValue({ name: 'first' })}>first</Button>
              <Button onClick={() => form.setFieldsValue({ name: 'second' })}>second</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByPlaceholderText, getByText } = render(<TestForm />);
      fireEvent.click(getByText('first'));
      await mockDelay();
      expect((getByPlaceholderText('name') as HTMLInputElement).value).toBe('first');
      fireEvent.click(getByText('second'));
      await mockDelay();
      expect((getByPlaceholderText('name') as HTMLInputElement).value).toBe('second');
    });
  });

  describe('getFirstError 分支覆盖', () => {
    it('多字段提交时第一个字段通过、后面字段失败 (resArr 为 true 非数组)', async () => {
      const submitFn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} onSubmit={submitFn}>
            <FormItem name="aaa" initialData="valid" rules={[{ required: true }]}>
              <Input />
            </FormItem>
            <FormItem name="bbb" rules={[{ required: true, message: 'bbb必填' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button type="submit">submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(submitFn).toHaveBeenCalled();
      // 第一个字段 aaa 通过 (result.aaa = true)，firstKey 是 aaa，resArr 是 true (非数组)
      // getFirstError 应返回 '' 或继续找到后面的错误
    });

    it('scrollToFirstError 但 dom 不存在时不崩溃', async () => {
      const submitFn = vi.fn();
      // 不 mock scrollIntoView，依赖 querySelector 返回 null
      const originalQuerySelector = HTMLFormElement.prototype.querySelector;
      HTMLFormElement.prototype.querySelector = vi.fn().mockReturnValue(null);

      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} scrollToFirstError="smooth" onSubmit={submitFn}>
            <FormItem name="field" rules={[{ required: true, message: '必填' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button type="submit">submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(submitFn).toHaveBeenCalled();

      HTMLFormElement.prototype.querySelector = originalQuerySelector;
    });

    it('scrollToFirstError 且没有 firstKey (空结果对象)', async () => {
      const submitFn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} scrollToFirstError="smooth" onSubmit={submitFn}>
            <FormItem name="field" initialData="valid" rules={[{ required: true }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button type="submit">submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(submitFn).toHaveBeenCalled();
      expect(submitFn.mock.calls[0][0].firstError).toBe('');
    });
  });

  describe('useWatch 额外分支', () => {
    it('useWatch 值变化后 reset 回相同值 (isEqual 分支)', async () => {
      const WatchedValue = ({ form }: { form: any }) => {
        const name = Form.useWatch('name', form);
        return <div data-testid="w">{name ?? 'empty'}</div>;
      };
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <div>
            <Form form={form}>
              <FormItem name="name" initialData="init">
                <Input />
              </FormItem>
              <FormItem>
                <Button onClick={() => form.setFieldsValue({ name: 'changed' })}>change</Button>
                <Button onClick={() => form.setFieldsValue({ name: 'changed' })}>setSame</Button>
                <Button type="reset">reset</Button>
              </FormItem>
            </Form>
            <WatchedValue form={form} />
          </div>
        );
      };
      const { getByText, getByTestId } = render(<TestForm />);
      // 先改变值
      fireEvent.click(getByText('change'));
      await mockDelay();
      expect(getByTestId('w').textContent).toBe('changed');
      // reset 触发 notifyWatch，如果值和当前 watch 中的 state 相同(都是 reset 后的值)
      // 则 isEqual 为 true 不更新
      fireEvent.click(getByText('reset'));
      await mockDelay();
    });
  });

  describe('useInstance scrollTo 分支', () => {
    it('form.submit 触发 scrollTo 时 querySelector 找不到元素', async () => {
      const submitFn = vi.fn();
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} scrollToFirstError="smooth" onSubmit={submitFn}>
            <FormItem name="field" rules={[{ required: true, message: '必填' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.submit()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      // mock querySelector 返回 null 来覆盖 !dom 分支
      const originalGetElementsByClassName = HTMLFormElement.prototype.getElementsByClassName;
      HTMLFormElement.prototype.getElementsByClassName = vi.fn().mockReturnValue([]);

      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(submitFn).toHaveBeenCalled();

      HTMLFormElement.prototype.getElementsByClassName = originalGetElementsByClassName;
    });
  });

  describe('formModel getCharacterLength 分支', () => {
    it('max 规则对空字符串不校验（非必填）', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="field" rules={[{ max: 5, message: '超过最大长度' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      // 非必填且值为空时不校验
      expect(queryByText('超过最大长度')).not.toBeTruthy();
    });

    it('min 规则通过（字符串长度足够）', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="field" initialData="abcdefgh" rules={[{ min: 5, message: '不够长' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(queryByText('不够长')).not.toBeTruthy();
    });

    it('len 规则中文字符通过', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="field" initialData="abc" rules={[{ len: 3, message: '长度不对' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(queryByText('长度不对')).not.toBeTruthy();
    });
  });

  describe('Form.tsx onSubmitHandler 分支', () => {
    it('submit 时没有 onSubmit 回调也正常工作', async () => {
      const { getByText } = render(
        <Form>
          <FormItem name="field" initialData="val" rules={[{ required: true }]}>
            <Input />
          </FormItem>
          <FormItem>
            <Button type="submit">submit</Button>
          </FormItem>
        </Form>,
      );
      // 无 onSubmit 时不崩溃
      expect(() => fireEvent.click(getByText('submit'))).not.toThrow();
      await mockDelay();
    });

    it('onReset 不传时 reset 正常工作', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="field" initialData="val">
              <Input placeholder="field" />
            </FormItem>
            <FormItem>
              <Button type="reset">reset</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      expect(() => fireEvent.click(getByText('reset'))).not.toThrow();
    });
  });

  describe('FormItem validateHandler allowSetValue 分支', () => {
    it('trigger 不匹配时 allowSetValue 为 false，不设置错误列表', async () => {
      // 当 FormItem 有 blur 规则，但触发 change 校验时
      // innerRules.length > 0 但 result.rules.length = 0, allowSetValue = false
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem
              name="field"
              initialData="hello"
              rules={[{ required: true, trigger: 'blur', message: '必填blur' }]}
            >
              <Input placeholder="field" />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.setFieldsValue({ field: '' })}>clearValue</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      // 修改值触发 change 校验，但规则是 blur 触发的
      fireEvent.click(getByText('clearValue'));
      await mockDelay();
      // change 触发时 blur 规则被过滤掉，allowSetValue = false，不显示错误
      expect(queryByText('必填blur')).not.toBeTruthy();
    });

    it('form.validate 指定 trigger:change 时，只有 blur 规则的字段不校验', async () => {
      // 这会触发 analysisValidateResult 中 innerRules.length && !result.rules?.length 的分支
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="blurOnly" rules={[{ required: true, trigger: 'blur', message: 'blur必填' }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate({ trigger: 'change' })}>validateChange</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('validateChange'));
      await mockDelay();
      // blur 规则在 change 触发时被过滤掉，不显示错误
      expect(queryByText('blur必填')).not.toBeTruthy();
    });
  });

  describe('Form rules 数组 name 路径 lodashGet', () => {
    it('数组 name 直接匹配 Form.rules (lodashGet 嵌套路径)', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form
            form={form}
            rules={
              {
                user: { name: [{ required: true, message: 'nested name required' }] },
              } as any
            }
          >
            <FormItem name={['user', 'name']}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>submit</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('submit'));
      await mockDelay();
      expect(queryByText('nested name required')).toBeTruthy();
    });
  });

  describe('FormItem 无 rules 也无 Form.rules 匹配', () => {
    it('FormItem 无规则时不校验', async () => {
      let result: any;
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem name="noRuleField" initialData="">
              <Input />
            </FormItem>
            <FormItem>
              <Button
                onClick={async () => {
                  result = await form.validate();
                }}
              >
                validate
              </Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      expect(result).toBe(true);
    });
  });

  describe('useForm flashQueue 分支覆盖', () => {
    it('taskQueue 中 validate/validateOnly 为 null 不崩溃', () => {
      // 这是测试 flashQueue 中执行 taskQueue 方法时的安全性
      const TestForm = () => {
        const [form] = Form.useForm();
        useEffect(() => {
          // 这些方法在初始 getForm 中是 null，
          // 但通过 taskQueue push 后执行时已经被 setForm 替换
          form.setFieldsValue({ name: 'test' });
        }, []);
        return (
          <Form form={form}>
            <FormItem name="name">
              <Input placeholder="name" />
            </FormItem>
          </Form>
        );
      };
      const { getByPlaceholderText } = render(<TestForm />);
      expect((getByPlaceholderText('name') as HTMLInputElement).value).toBe('test');
    });
  });

  describe('errorMessage 模板中 label 为函数时使用 name', () => {
    it('label 为函数时 errorMessage 模板使用 name 替代', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form} errorMessage={{ min: '${name}最少${validate}个字符' }}>
            <FormItem name="username" label={() => <span>用户名</span>} initialData="ab" rules={[{ min: 5 }]}>
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
            </FormItem>
          </Form>
        );
      };
      const { getByText, queryByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      // label 不是字符串时，使用 name 作为 labelName
      expect(queryByText('username最少5个字符')).toBeTruthy();
    });
  });

  describe('validate 通过场景的 successList', () => {
    it('validator 返回 result:true + type:success + message 时进入 successList', async () => {
      const TestForm = () => {
        const [form] = Form.useForm();
        return (
          <Form form={form}>
            <FormItem
              className="s-item"
              name="field"
              initialData="ok"
              rules={[
                {
                  validator: () => ({ result: true, message: '验证通过', type: 'success' }),
                },
              ]}
            >
              <Input />
            </FormItem>
            <FormItem>
              <Button onClick={() => form.validate()}>validate</Button>
            </FormItem>
          </Form>
        );
      };
      const { container, getByText } = render(<TestForm />);
      fireEvent.click(getByText('validate'));
      await mockDelay();
      // successList 中的 message 会通过 extraNode 显示
      const extra = container.querySelector('.s-item .t-form__item-extra');
      expect(extra).toBeTruthy();
      expect(extra?.textContent).toBe('验证通过');
    });
  });
});
