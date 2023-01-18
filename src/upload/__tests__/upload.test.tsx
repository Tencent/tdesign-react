/* eslint-disable no-param-reassign */
/* eslint-disable no-await-in-loop */
import { render, act, fireEvent, vi } from '@test/utils';
import React from 'react';
import MockDate from 'mockdate';
import Upload from '../index';

MockDate.set('2022-08-27');

async function waitFakeTimer(advanceTime = 1000, times = 20) {
  for (let i = 0; i < times; i += 1) {
    await act(async () => {
      await Promise.resolve();
      if (advanceTime > 0) {
        vi.advanceTimersByTime(advanceTime);
      } else {
        vi.runAllTimers();
      }
    });
  }
}

const requestSuccessMethod: any = (file) =>
  new Promise((resolve) => {
    file.percent = 0;
    setTimeout(() => {
      resolve({
        status: 'success',
        response: { url: 'https://tdesign.gtimg.com/site/avatar.jpg' },
      });
      file.percent = 100;
    }, 100);
  });

const requestFailMethod: any = () =>
  new Promise((resolve) => {
    setTimeout(() => {
      const errorResult = {
        status: 'fail',
        response: { url: '', error: 'for some reason, upload fail' },
      };
      resolve(errorResult);
    }, 100);
  });

describe('Upload 组件测试', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
  });

  afterAll(() => {
    vi.useRealTimers();
  });

  test('测试 beforeUpload 通过且上传文件成功', async () => {
    const onFailFn = vi.fn();
    const onSuccessFn = vi.fn();
    const onChangeFn = vi.fn();
    const onSelectChangeFn = vi.fn();
    const beforeUploadFn = vi.fn();

    const { container: wrapper } = render(
      <Upload
        multiple={false}
        placeholder="这是一段没有文件时的占位文本"
        requestMethod={requestSuccessMethod}
        onSelectChange={onSelectChangeFn}
        beforeUpload={() => {
          beforeUploadFn();
          return true;
        }}
        onChange={onChangeFn}
        onFail={onFailFn}
        onSuccess={onSuccessFn}
      >
        <div className="test">自定义上传</div>
      </Upload>,
    );
    const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });
    const inputFile = wrapper.querySelector('input');

    fireEvent.change(inputFile, {
      target: { files: [fakeFile] },
    });

    await waitFakeTimer();

    expect(inputFile.files).toHaveLength(1);
    expect(onSelectChangeFn).toHaveBeenCalledTimes(1);
    expect(beforeUploadFn).toHaveBeenCalledTimes(1);
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(onSuccessFn).toHaveBeenCalledTimes(1);
    expect(onFailFn).toHaveBeenCalledTimes(0);
  });

  test('测试 beforeUpload 失败', async () => {
    const onFailFn = vi.fn();
    const onSuccessFn = vi.fn();
    const onChangeFn = vi.fn();
    const onSelectChangeFn = vi.fn();
    const beforeUploadFn = vi.fn();

    const { container: wrapper } = render(
      <Upload
        multiple={false}
        placeholder="这是一段没有文件时的占位文本"
        requestMethod={requestSuccessMethod}
        onSelectChange={onSelectChangeFn}
        beforeUpload={() => {
          beforeUploadFn();
          return false;
        }}
        onChange={onChangeFn}
        onFail={onFailFn}
        onSuccess={onSuccessFn}
      >
        <div className="test">自定义上传</div>
      </Upload>,
    );
    const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });
    const inputFile = wrapper.querySelector('input');

    fireEvent.change(inputFile, {
      target: { files: [fakeFile] },
    });

    await waitFakeTimer();

    expect(inputFile.files).toHaveLength(1);
    expect(onSelectChangeFn).toHaveBeenCalledTimes(1);
    expect(beforeUploadFn).toHaveBeenCalledTimes(1);
    expect(onChangeFn).toHaveBeenCalledTimes(0);
    expect(onSuccessFn).toHaveBeenCalledTimes(0);
    expect(onFailFn).toHaveBeenCalledTimes(0);
  });

  test('测试上传文件失败', async () => {
    const onFailFn = vi.fn();
    const onSuccessFn = vi.fn();
    const onChangeFn = vi.fn();
    const onSelectChangeFn = vi.fn();

    const { container: wrapper } = render(
      <Upload
        multiple={false}
        placeholder="这是一段没有文件时的占位文本"
        requestMethod={requestFailMethod}
        onSelectChange={onSelectChangeFn}
        onChange={onChangeFn}
        onFail={onFailFn}
        onSuccess={onSuccessFn}
      >
        <div className="test">自定义上传</div>
      </Upload>,
    );
    const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });
    const inputFile = wrapper.querySelector('input');

    fireEvent.change(inputFile, {
      target: { files: [fakeFile] },
    });

    await waitFakeTimer();

    expect(inputFile.files).toHaveLength(1);
    expect(onSelectChangeFn).toHaveBeenCalledTimes(1);
    expect(onChangeFn).toHaveBeenCalledTimes(0);
    expect(onSuccessFn).toHaveBeenCalledTimes(0);
    expect(onFailFn).toHaveBeenCalledTimes(1);
  });

  test('测试上传成功且出现文件列表', async () => {
    const onFailFn = vi.fn();
    const onSuccessFn = vi.fn();
    const onChangeFn = vi.fn();
    const onSelectChangeFn = vi.fn();

    const { container: wrapper, getByText } = render(
      <Upload
        multiple={true}
        placeholder="这是一段没有文件时的占位文本"
        requestMethod={requestSuccessMethod}
        onSelectChange={onSelectChangeFn}
        onChange={onChangeFn}
        onFail={onFailFn}
        onSuccess={onSuccessFn}
      >
        <div className="test">自定义上传</div>
      </Upload>,
    );
    const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });
    const fakeFile2 = new File(['hello2'], 'hello2.png', { type: 'image/png' });
    const inputFile = wrapper.querySelector('input'); // 上传前，没有列表

    expect(wrapper.querySelector('.t-upload__single-display-text')).toBeNull();

    fireEvent.change(inputFile, {
      target: { files: [fakeFile, fakeFile2] },
    });
    await waitFakeTimer();

    expect(inputFile.files).toHaveLength(2);

    expect(onSelectChangeFn).toHaveBeenCalledTimes(1);
    expect(onChangeFn).toHaveBeenCalledTimes(1);
    expect(onSuccessFn).toHaveBeenCalledTimes(1);

    const helloItem1 = getByText('hello.png');
    expect(helloItem1).not.toBeNull();
  });

  test('测试移除一个上传项', async () => {
    const onFailFn = vi.fn();
    const onSuccessFn = vi.fn();
    const onChangeFn = vi.fn();
    const onSelectChangeFn = vi.fn();
    const onRemoveFn = vi.fn();

    const { container: wrapper, getByText } = render(
      <Upload
        multiple={true}
        placeholder="这是一段没有文件时的占位文本"
        requestMethod={requestSuccessMethod}
        onSelectChange={onSelectChangeFn}
        onChange={onChangeFn}
        onFail={onFailFn}
        onSuccess={onSuccessFn}
        onRemove={onRemoveFn}
      >
        <div className="test">自定义上传</div>
      </Upload>,
    );
    const fakeFile = new File(['hello'], 'hello.png', { type: 'image/png' });
    const fakeFile2 = new File(['hello2'], 'hello2.png', { type: 'image/png' });
    const inputFile = wrapper.querySelector('input'); // 上传前，没有列表

    expect(wrapper.querySelector('.t-upload__single-display-text')).toBeNull();

    fireEvent.change(inputFile, {
      target: { files: [fakeFile, fakeFile2] },
    });
    await waitFakeTimer();

    const helloItem1 = getByText('hello.png');
    expect(helloItem1).not.toBeNull();
    expect(wrapper.querySelector('.t-upload__single-display-text')).toHaveTextContent('hello.png');

    fireEvent.click(wrapper.querySelector('.t-upload__icon-delete'));
    expect(wrapper.querySelector('.t-upload__single-display-text')).toHaveTextContent('hello2.png');
    expect(onRemoveFn).toHaveBeenCalledTimes(1);
  });
});
