import React from 'react';
import {
  fireEvent,
  getFakeFileList,
  mockDelay,
  render,
  simulateDragFileChange,
  simulateFileChange,
  vi,
} from '@test/utils';

import { Upload } from '..';
import { getUploadServer } from './request';

import type { TNode } from '../../common';
import type { TdUploadProps } from '../type';

const files = [
  {
    url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
    name: 'default.jpeg',
    status: 'success' as const,
  },
];

describe('Upload', () => {
  const server = getUploadServer();

  beforeAll(() => {
    server.listen({ onUnhandledRequest: 'error' });
  });

  afterEach(() => {
    server.resetHandlers();
    vi.restoreAllMocks();
  });

  afterAll(() => {
    server.close();
  });

  describe('props', () => {
    test('abridgeName', () => {
      const abridgeName: TdUploadProps['abridgeName'] = [8, 6];
      const longName = 'this_is_a_long_name.png';
      const abbreviated = 'this_is_…me.png';

      const { container: fileInputContainer } = render(
        <Upload theme="file-input" files={[{ name: longName }]} abridgeName={abridgeName}></Upload>,
      );
      expect(fileInputContainer.querySelector('.t-upload__single-input-text').textContent).toBe(abbreviated);

      const { container: fileWithUrlContainer } = render(
        <Upload theme="file" files={[{ name: longName, url: 'https://xxx.png' }]} abridgeName={abridgeName}></Upload>,
      );
      expect(fileWithUrlContainer.querySelector('.t-upload__single-name').textContent).toBe(abbreviated);

      const { container: fileContainer } = render(
        <Upload theme="file" files={[{ name: longName }]} abridgeName={abridgeName}></Upload>,
      );
      expect(fileContainer.querySelector('.t-upload__single-name').textContent).toBe(abbreviated);

      const { container: imageContainer } = render(
        <Upload theme="image" files={[{ name: longName }]} abridgeName={abridgeName}></Upload>,
      );
      expect(imageContainer.querySelector('.t-upload__card-name').textContent).toBe(abbreviated);

      const { container: fileDraggableContainer } = render(
        <Upload theme="file" draggable files={[{ name: longName }]} abridgeName={abridgeName}></Upload>,
      );
      expect(fileDraggableContainer.querySelector('.t-upload__single-name').textContent).toBe(abbreviated);

      const { container: imageDraggableContainer } = render(
        <Upload
          theme="image"
          draggable
          status="success"
          files={[{ name: longName, url: 'https://wwww.png' }]}
          abridgeName={abridgeName}
        ></Upload>,
      );
      expect(imageDraggableContainer.querySelector('.t-upload__single-name').textContent).toBe(abbreviated);

      const longJpg = 'this_is_a_long_name.jpg';
      const abbreviatedJpg = 'this_is_…me.jpg';
      const { container: imageFlowContainer } = render(
        <Upload
          theme="image-flow"
          files={[{ name: longJpg, url: 'https://xxx.jpg' }]}
          abridgeName={abridgeName}
        ></Upload>,
      );
      expect(imageFlowContainer.querySelector('.t-upload__card-name').textContent).toBe(abbreviatedJpg);

      const { container: fileFlowLinkContainer } = render(
        <Upload
          theme="file-flow"
          files={[{ name: longJpg, url: 'https://xxx.jpg' }]}
          abridgeName={abridgeName}
        ></Upload>,
      );
      expect(fileFlowLinkContainer.querySelector('.t-upload__file-name > a').textContent).toBe(abbreviatedJpg);

      const { container: fileFlowContainer } = render(
        <Upload theme="file-flow" files={[{ name: longJpg }]} abridgeName={abridgeName}></Upload>,
      );
      expect(fileFlowContainer.querySelector('.t-upload__file-name').textContent).toBe(abbreviatedJpg);
    });

    test('accept', () => {
      const wrapper = render(<Upload accept="image/*"></Upload>);
      const container = wrapper.container.querySelector('input');
      expect(container.getAttribute('accept')).toBe('image/*');
    });

    test('action', async () => {
      const onSelectChangeFn = vi.fn();
      const onChangeFn = vi.fn();
      const { container } = render(
        <Upload
          action="https://tdesign.test.com/upload/image_success"
          onSelectChange={onSelectChangeFn}
          onChange={onChangeFn}
        ></Upload>,
      );
      const inputDom = container.querySelector('input');
      const fileList = simulateFileChange(inputDom);
      await mockDelay();
      expect(onSelectChangeFn).toHaveBeenCalled();
      expect(onSelectChangeFn.mock.calls[0][0]).toEqual(fileList);
      expect(onSelectChangeFn.mock.calls[0][1].currentSelectedFiles).toEqual([
        {
          lastModified: 1674355700444,
          name: 'file-name.txt',
          percent: 0,
          raw: fileList[0],
          size: 22,
          type: 'image/png',
          status: undefined,
        },
      ]);
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0][0].lastModified).toBe(1674355700444);
      expect(onChangeFn.mock.calls[0][0][0].response).toBeTruthy();
      expect(onChangeFn.mock.calls[0][0][0].name).toBe('file-name.txt');
      expect(onChangeFn.mock.calls[0][0][0].percent).toBe(100);
      expect(onChangeFn.mock.calls[0][0][0].status).toBe('success');
      expect(onChangeFn.mock.calls[0][0][0].raw).toEqual(fileList[0]);
      expect(onChangeFn.mock.calls[0][0][0].uploadTime).toBeTruthy();
      expect(onChangeFn.mock.calls[0][1].trigger).toBe('add');
      expect(onChangeFn.mock.calls[0][1].file.raw).toEqual(fileList[0]);
      expect(onChangeFn.mock.calls[0][1].file.url).toBe('https://tdesign.gtimg.com/demo/demo-image-1.png');
      expect(onChangeFn.mock.calls[0][1].file.name).toBe('file-name.txt');
      expect(onChangeFn.mock.calls[0][1].file.uploadTime).toBeTruthy();
      expect(onChangeFn.mock.calls[0][1].file.response).toBeTruthy();
    });

    test('allowUploadDuplicateFile', async () => {
      const rejectedOnValidateFn = vi.fn();
      const { container: rejectedContainer, unmount: unmountRejected } = render(
        <Upload
          files={[
            {
              name: 'file-name.txt',
              url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
            },
          ]}
          action="https://tdesign.test.com/upload/file_success"
          allowUploadDuplicateFile={false}
          onValidate={rejectedOnValidateFn}
        ></Upload>,
      );
      const inputDom = rejectedContainer.querySelector('input');
      const fileList = simulateFileChange(inputDom);
      await mockDelay();
      expect(rejectedOnValidateFn).toHaveBeenCalled();
      expect(rejectedOnValidateFn.mock.calls[0][0].type).toBe('FILTER_FILE_SAME_NAME');
      expect(rejectedOnValidateFn.mock.calls[0][0].files[0].raw).toEqual(fileList[0]);
      unmountRejected();

      const acceptedOnValidateFn = vi.fn();
      const { container: acceptedContainer } = render(
        <Upload
          files={[
            {
              name: 'file-name.txt',
              url: 'https://tdesign.gtimg.com/site/source/figma-pc.png',
            },
          ]}
          action="https://tdesign.test.com/upload/file_success"
          allowUploadDuplicateFile={true}
          onValidate={acceptedOnValidateFn}
        ></Upload>,
      );
      simulateFileChange(acceptedContainer.querySelector('input'));
      await mockDelay();
      expect(acceptedOnValidateFn).not.toHaveBeenCalled();
    });

    test('autoUpload', async () => {
      const waitingOnChangeFn = vi.fn();
      const { container: waitingContainer, unmount: unmountWaiting } = render(
        <Upload
          autoUpload={false}
          action="https://tdesign.test.com/upload/file_success"
          onChange={waitingOnChangeFn}
        ></Upload>,
      );
      const inputDom = waitingContainer.querySelector('input');
      const fileList = simulateFileChange(inputDom);
      await mockDelay();
      expect(waitingOnChangeFn).toHaveBeenCalled();
      expect(waitingOnChangeFn.mock.calls[0][0][0].response).toBe(undefined);
      expect(waitingOnChangeFn.mock.calls[0][0][0].raw).toEqual(fileList[0]);
      expect(waitingOnChangeFn.mock.calls[0][0][0].name).toBe('file-name.txt');
      expect(waitingOnChangeFn.mock.calls[0][0][0].status).toBe('waiting');
      expect(waitingOnChangeFn.mock.calls[0][0][0].percent).toBe(0);
      unmountWaiting();

      const onChangeFn1 = vi.fn();
      const onRemoveFn1 = vi.fn();
      const { container: flowContainer, unmount: unmountFlow } = render(
        <Upload
          theme="file-flow"
          autoUpload={false}
          files={[
            {
              name: 'file1.txt',
              status: 'waiting',
              uploadTime: '2023-01-27',
              lastModified: 1674830942522,
            },
            {
              name: 'file2.txt',
              status: 'success',
              uploadTime: '2023-01-27',
              lastModified: 1674831204354,
            },
            {
              name: 'file3.txt',
              status: 'fail',
              uploadTime: '2023-01-27',
              lastModified: 1674831204354,
            },
          ]}
          action="https://tdesign.test.com/upload/file_success"
          onChange={onChangeFn1}
          onRemove={onRemoveFn1}
        ></Upload>,
      );
      fireEvent.click(flowContainer.querySelector('.t-upload__continue'));
      fireEvent.click(flowContainer.querySelector('.t-upload__cancel'));
      expect(onChangeFn1).toHaveBeenCalled();
      expect(onChangeFn1.mock.calls[0][0]).toEqual([
        {
          name: 'file1.txt',
          status: 'waiting',
          uploadTime: '2023-01-27',
          lastModified: 1674830942522,
        },
        {
          name: 'file2.txt',
          status: 'success',
          uploadTime: '2023-01-27',
          lastModified: 1674831204354,
        },
        {
          name: 'file3.txt',
          status: 'waiting',
          uploadTime: '2023-01-27',
          lastModified: 1674831204354,
        },
      ]);
      expect(onChangeFn1.mock.calls[0][1].trigger).toBe('abort');
      expect(onRemoveFn1).not.toHaveBeenCalled();
      unmountFlow();

      const onSuccessFn = vi.fn();
      const { container: draggableContainer } = render(
        <Upload
          theme="image"
          autoUpload={false}
          draggable={true}
          action="https://tdesign.test.com/upload/image_success"
          files={[{ url: 'https://image.png', status: 'waiting' }]}
          onSuccess={onSuccessFn}
        ></Upload>,
      );
      fireEvent.click(draggableContainer.querySelector('.t-upload__dragger-upload-btn'));
      await mockDelay();
      expect(onSuccessFn).toHaveBeenCalled();
      expect(onSuccessFn.mock.calls[0][0].fileList[0].url).toBe('https://tdesign.gtimg.com/demo/demo-image-1.png');
      expect(onSuccessFn.mock.calls[0][0].currentFiles[0].url).toBe('https://tdesign.gtimg.com/demo/demo-image-1.png');
      expect(onSuccessFn.mock.calls[0][0].file.url).toBe('https://tdesign.gtimg.com/demo/demo-image-1.png');
      expect(onSuccessFn.mock.calls[0][0].results).toBe(undefined);
      expect(onSuccessFn.mock.calls[0][0].response).toBeTruthy();
      expect(onSuccessFn.mock.calls[0][0].XMLHttpRequest).toBeTruthy();
    });

    test('beforeAllFilesUpload', async () => {
      const onChangeFn = vi.fn();
      const onValidateFn = vi.fn();
      const { container } = render(
        <Upload
          autoUpload={false}
          beforeAllFilesUpload={() => false}
          action="https://tdesign.test.com/upload/file_success"
          onChange={onChangeFn}
          onValidate={onValidateFn}
        ></Upload>,
      );
      const inputDom = container.querySelector('input');
      const fileList = simulateFileChange(inputDom, 'file', 3);
      await mockDelay();
      expect(onChangeFn).not.toHaveBeenCalled();
      expect(onValidateFn).toHaveBeenCalled();
      expect(onValidateFn.mock.calls[0][0].type).toBe('BEFORE_ALL_FILES_UPLOAD');
      expect(onValidateFn.mock.calls[0][0].files.map((t) => t.raw)).toEqual(fileList);
    });

    test('beforeUpload', async () => {
      const rejectedOnChangeFn = vi.fn();
      const rejectedOnValidateFn = vi.fn();
      const { container: rejectedContainer, unmount: unmountRejected } = render(
        <Upload
          autoUpload={false}
          beforeUpload={() => false}
          action="https://tdesign.test.com/upload/file_success"
          onChange={rejectedOnChangeFn}
          onValidate={rejectedOnValidateFn}
        ></Upload>,
      );
      const inputDom = rejectedContainer.querySelector('input');
      const fileList = simulateFileChange(inputDom, 'file', 3);
      await mockDelay();
      expect(rejectedOnChangeFn).not.toHaveBeenCalled();
      expect(rejectedOnValidateFn).toHaveBeenCalled();
      expect(rejectedOnValidateFn.mock.calls[0][0].type).toBe('CUSTOM_BEFORE_UPLOAD');
      expect(rejectedOnValidateFn.mock.calls[0][0].files.map((t) => t.raw)).toEqual(fileList);
      unmountRejected();

      const acceptedOnChangeFn = vi.fn();
      const acceptedOnValidateFn = vi.fn();
      const { container: acceptedContainer } = render(
        <Upload
          autoUpload={false}
          beforeUpload={(file) => file.name === 'file-name1.txt'}
          action="https://tdesign.test.com/upload/file_success"
          onChange={acceptedOnChangeFn}
          onValidate={acceptedOnValidateFn}
        ></Upload>,
      );
      const acceptedFileList = simulateFileChange(acceptedContainer.querySelector('input'), 'file', 3);
      await mockDelay();
      expect(acceptedOnChangeFn).toHaveBeenCalled();
      expect(acceptedOnChangeFn.mock.calls[0][0][0].raw).toEqual(acceptedFileList[1]);
      expect(acceptedOnValidateFn).toHaveBeenCalled();
      expect(acceptedOnValidateFn.mock.calls[0][0].type).toBe('CUSTOM_BEFORE_UPLOAD');
      expect(acceptedOnValidateFn.mock.calls[0][0].files.map((t) => t.raw)).toEqual([
        acceptedFileList[0],
        acceptedFileList[2],
      ]);
    });

    test('data', async () => {
      const onFailFn = vi.fn();
      const { container } = render(
        <Upload
          data={{ file_name: 'custom-file-name.excel' }}
          action="https://tdesign.test.com/upload/fail/status_error"
          onFail={onFailFn}
        ></Upload>,
      );
      const inputDom = container.querySelector('input');
      const fileList = simulateFileChange(inputDom);
      await mockDelay();
      expect(onFailFn).toHaveBeenCalled();
      expect(onFailFn.mock.calls[0][0].XMLHttpRequest.upload.requestParams).toEqual({
        file_name: 'custom-file-name.excel',
        file: fileList[0],
        length: 1,
      });
    });

    test('disabled', async () => {
      const { container: fileInputContainer } = render(<Upload theme="file-input" disabled={true}></Upload>);
      expect(fileInputContainer.querySelector('.t-input.t-is-disabled')).toBeTruthy();
      expect(fileInputContainer.querySelector('.t-upload__trigger .t-button.t-is-disabled')).toBeTruthy();

      const { container: fileFlowContainer } = render(
        <Upload
          theme="file-flow"
          disabled={true}
          multiple={true}
          files={[{ name: 'file1.txt', status: 'success' }]}
        ></Upload>,
      );
      expect(fileFlowContainer.querySelector('.t-upload__delete')).toBeFalsy();

      const { container: imageFlowContainer } = render(
        <Upload
          theme="image-flow"
          disabled={true}
          multiple={true}
          files={[{ name: 'file1.txt', status: 'success' }]}
        ></Upload>,
      );
      expect(imageFlowContainer.querySelector('.t-upload__delete')).toBeFalsy();

      const onSelectChangeFn = vi.fn();
      const { container: disabledContainer } = render(
        <Upload disabled={true} onSelectChange={onSelectChangeFn}></Upload>,
      );
      const inputDom = disabledContainer.querySelector('input');
      simulateFileChange(inputDom);
      await mockDelay();
      expect(onSelectChangeFn).not.toHaveBeenCalled();

      const { container: fileContainer } = render(
        <Upload theme="file" files={[{ name: 'file1.txt' }]} disabled={true}></Upload>,
      );
      expect(fileContainer.querySelector('.t-upload__icon-delete')).toBeFalsy();

      const { container: imageContainer } = render(
        <Upload theme="image" files={[{ name: 'img1.txt', url: 'https://img1.png' }]} disabled={true}></Upload>,
      );
      expect(imageContainer.querySelector('.t-upload__icon-delete')).toBeFalsy();
    });

    test('draggable', () => {
      const { container: urlContainer, unmount: unmountUrl } = render(
        <Upload
          theme="image"
          draggable={true}
          files={[
            {
              url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
              name: 'image1.png',
              status: 'success',
            },
          ]}
        ></Upload>,
      );
      expect(urlContainer.querySelectorAll('.t-icon-check-circle-filled').length).toBe(1);
      const attrDom = urlContainer.querySelector('.t-upload__dragger-img-wrap img');
      expect(attrDom.getAttribute('src')).toBe('https://tdesign.gtimg.com/demo/demo-image-1.png');
      expect(urlContainer).toMatchSnapshot();
      unmountUrl();

      const { container: responseContainer, unmount: unmountResponse } = render(
        <Upload
          theme="image"
          draggable={true}
          files={[
            {
              response: {
                url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
              },
              name: 'image1.png',
              status: 'success',
            },
          ]}
        ></Upload>,
      );
      expect(responseContainer.querySelectorAll('.t-icon-check-circle-filled').length).toBe(1);
      const responseImage = responseContainer.querySelector('.t-upload__dragger-img-wrap img');
      expect(responseImage.getAttribute('src')).toBe('https://tdesign.gtimg.com/demo/demo-image-1.png');
      expect(responseContainer).toMatchSnapshot();
      unmountResponse();

      const { container: failedContainer, unmount: unmountFailed } = render(
        <Upload
          theme="image"
          draggable={true}
          files={[{ url: 'https://image4.png', name: 'image4.png', status: 'fail' }]}
        ></Upload>,
      );
      expect(failedContainer.querySelectorAll('.t-icon-error-circle-filled').length).toBe(1);
      expect(failedContainer).toMatchSnapshot();
      unmountFailed();

      const { container: progressContainer, unmount: unmountProgress } = render(
        <Upload
          theme="image"
          draggable={true}
          files={[
            {
              url: 'https://image2.png',
              name: 'image2.png',
              status: 'progress',
              percent: 80,
            },
          ]}
        ></Upload>,
      );
      expect(progressContainer.querySelector('.t-upload__single-percent').textContent).toBe('80%');
      expect(progressContainer).toMatchSnapshot();
      unmountProgress();

      const { container: waitingContainer, unmount: unmountWaiting } = render(
        <Upload
          theme="image"
          draggable={true}
          files={[
            {
              url: 'https://image3.png',
              name: 'image3.png',
              status: 'waiting',
            },
          ]}
        ></Upload>,
      );
      expect(waitingContainer.querySelectorAll('.t-upload__dragger-progress-cancel').length).toBe(1);
      expect(waitingContainer).toMatchSnapshot();
      unmountWaiting();

      const { container: manualContainer } = render(
        <Upload
          theme="image"
          draggable={true}
          autoUpload={false}
          files={[
            {
              url: 'https://image3.png',
              name: 'image3.png',
              status: 'waiting',
            },
          ]}
        ></Upload>,
      );
      expect(manualContainer.querySelectorAll('.t-upload__dragger-progress-cancel').length).toBe(1);
    });

    test('format', async () => {
      const onSelectChangeFn = vi.fn();
      const { container } = render(
        <Upload
          format={(fileRaw) => ({
            field_custom: 'a new file field',
            name: 'another name',
            raw: fileRaw,
          })}
          action="https://tdesign.test.com/upload/file_success"
          onSelectChange={onSelectChangeFn}
        ></Upload>,
      );
      const inputDom = container.querySelector('input');
      const fileList = simulateFileChange(inputDom);
      await mockDelay();
      expect(onSelectChangeFn).toHaveBeenCalled();
      expect(onSelectChangeFn.mock.calls[0][0]).toEqual(fileList);
      expect(onSelectChangeFn.mock.calls[0][1].currentSelectedFiles[0].name).toBe('another name');
      expect(onSelectChangeFn.mock.calls[0][1].currentSelectedFiles[0].field_custom).toBe('a new file field');
      expect(onSelectChangeFn.mock.calls[0][1].currentSelectedFiles[0].raw).toEqual(fileList[0]);
    });

    test('formatRequest', async () => {
      const onFailFn = vi.fn();
      const { container } = render(
        <Upload
          formatRequest={(requestData) => ({
            requestData,
            more_field: 'more custom field',
          })}
          action="https://tdesign.test.com/upload/fail/status_error"
          onFail={onFailFn}
        ></Upload>,
      );
      const inputDom = container.querySelector('input');
      const fileList = simulateFileChange(inputDom);
      await mockDelay();
      expect(onFailFn).toHaveBeenCalled();
      expect(onFailFn.mock.calls[0][0].XMLHttpRequest.upload.requestParams.requestData).toEqual({
        file: fileList[0],
        length: 1,
      });
      expect(onFailFn.mock.calls[0][0].XMLHttpRequest.upload.requestParams.more_field).toBe('more custom field');
    });

    test('formatResponse', async () => {
      const onChangeFn = vi.fn();
      const { container: successContainer, unmount: unmountSuccess } = render(
        <Upload
          formatResponse={(response) => ({
            responseData: { ret: response.ret, data: response.data },
            url: response.data.url,
            extra_field: 'extra value',
          })}
          action="https://tdesign.test.com/upload/file_success"
          onChange={onChangeFn}
        ></Upload>,
      );
      const inputDom = successContainer.querySelector('input');
      simulateFileChange(inputDom);
      await mockDelay();
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0][0].response.responseData).toEqual({
        ret: 0,
        data: {
          name: 'tdesign.min.js',
          url: 'https://tdesign.gtimg.com/site/spline/script/tdesign.min.js',
        },
      });
      expect(onChangeFn.mock.calls[0][0][0].response.url).toBe(
        'https://tdesign.gtimg.com/site/spline/script/tdesign.min.js',
      );
      expect(onChangeFn.mock.calls[0][0][0].response.extra_field).toBe('extra value');
      unmountSuccess();

      const onFailFn = vi.fn();
      const { container: failedContainer } = render(
        <Upload
          action="https://tdesign.test.com/upload/fail/response_error"
          formatResponse={(response) => ({
            error: response.error,
            name: response.name,
          })}
          onFail={onFailFn}
        ></Upload>,
      );
      const failedFileList = simulateFileChange(failedContainer.querySelector('input'));
      await mockDelay();
      expect(onFailFn).toHaveBeenCalled();
      expect(onFailFn.mock.calls[0][0].failedFiles[0].raw).toEqual(failedFileList[0]);
      expect(onFailFn.mock.calls[0][0].currentFiles[0].raw).toEqual(failedFileList[0]);
      expect(onFailFn.mock.calls[0][0].file.raw).toEqual(failedFileList[0]);
      expect(onFailFn.mock.calls[0][0].e.type).toBe('load');
      expect(onFailFn.mock.calls[0][0].XMLHttpRequest).toBeTruthy();
      expect(onFailFn.mock.calls[0][0].response).toEqual({
        error: 'upload failed',
        name: 'file-name.txt',
      });
    });

    test('headers', async () => {
      const onFailFn = vi.fn();
      const { container } = render(
        <Upload
          headers={{ 'XML-HTTP-REQUEST': 'tdesign_token' }}
          action="https://tdesign.test.com/upload/fail/status_error"
          onFail={onFailFn}
        ></Upload>,
      );
      const inputDom = container.querySelector('input');
      simulateFileChange(inputDom);
      await mockDelay();
      expect(onFailFn).toHaveBeenCalled();
      expect(onFailFn.mock.calls[0][0].XMLHttpRequest.upload.requestHeaders['XML-HTTP-REQUEST']).toBe('tdesign_token');
    });

    test('isBatchUpload', async () => {
      const onChangeFn = vi.fn();
      const { container } = render(
        <Upload
          isBatchUpload={true}
          autoUpload={false}
          multiple={true}
          action="https://tdesign.test.com/upload/file_success"
          files={[{ url: 'https://file.txt', name: 'file.txt' }]}
          onChange={onChangeFn}
        ></Upload>,
      );
      const inputDom = container.querySelector('input');
      simulateFileChange(inputDom, 'file', 3);
      await mockDelay();
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0].length).toBe(3);
    });

    test('locale', () => {
      const locale = { progress: { uploadingText: 'uploading' } };
      const progressFile = [
        {
          url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
          status: 'progress' as const,
          percent: 80,
        },
      ];
      const action = 'https://tdesign.test.com/upload/file_success';

      const { container: fileFlowContainer } = render(
        <Upload locale={locale} theme="file-flow" files={progressFile} action={action}></Upload>,
      );
      expect(fileFlowContainer.querySelector('.t-upload__file-flow-progress').textContent).toBe('uploading 80%');

      const { container: imageContainer } = render(
        <Upload locale={locale} theme="image" files={progressFile} action={action}></Upload>,
      );
      expect(imageContainer.querySelector('.t-upload__image-progress').textContent).toBe('uploading 80%');
    });

    test('max', async () => {
      const filledFiles = [
        { url: 'xxxx.url', name: 'file1.txt' },
        { url: 'yyyy.url', name: 'file2.txt' },
      ];

      const { container: hideAddContainer } = render(
        <Upload theme="image" max={2} files={filledFiles} multiple></Upload>,
      );
      expect(hideAddContainer.querySelector('.t-upload__image-add')).toBeFalsy();

      const onChangeRejectFn = vi.fn();
      const { container: rejectExtraContainer } = render(
        <Upload max={2} multiple autoUpload={false} files={filledFiles} onChange={onChangeRejectFn}></Upload>,
      );
      simulateFileChange(rejectExtraContainer.querySelector('input'), 'file', 1);
      await mockDelay(300);
      expect(onChangeRejectFn).not.toHaveBeenCalled();

      const onChangeAllowFn = vi.fn();
      const { container: unlimitedContainer } = render(
        <Upload max={0} multiple autoUpload={false} files={[]} onChange={onChangeAllowFn}></Upload>,
      );
      simulateFileChange(unlimitedContainer.querySelector('input'), 'file', 3);
      await mockDelay(300);
      expect(onChangeAllowFn).toHaveBeenCalled();
      expect(onChangeAllowFn.mock.calls[0][0].length).toBe(3);
    });

    test('name', async () => {
      const onFailFn = vi.fn();
      const { container } = render(
        <Upload name="file_name" action="https://tdesign.test.com/upload/fail/status_error" onFail={onFailFn}></Upload>,
      );
      const inputDom = container.querySelector('input');
      const fileList = simulateFileChange(inputDom);
      await mockDelay();
      expect(onFailFn).toHaveBeenCalled();
      expect(onFailFn.mock.calls[0][0].XMLHttpRequest.upload.requestParams).toEqual({
        file_name: fileList[0],
        length: 1,
      });
    });

    test('placeholder', () => {
      const text = 'this is placeholder';
      (['file', 'file-input', 'image-flow', 'file-flow'] as TdUploadProps['theme'][]).forEach((theme) => {
        const { container } = render(<Upload theme={theme} placeholder={text}></Upload>);
        expect(container.querySelector('.t-upload__placeholder').textContent).toBe(text);
      });
    });

    test('requestMethod', async () => {
      const onChangeFn = vi.fn();
      const { container: successContainer, unmount: unmountSuccess } = render(
        <Upload
          theme="image-flow"
          multiple={true}
          files={[]}
          requestMethod={() =>
            Promise.resolve({
              status: 'success',
              response: {
                url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
              },
            })
          }
          onChange={onChangeFn}
        ></Upload>,
      );
      const inputDom = successContainer.querySelector('input');
      const fileList = simulateFileChange(inputDom, 'image');
      await mockDelay();
      expect(onChangeFn).toHaveBeenCalled();
      expect(onChangeFn.mock.calls[0][0][0].raw).toEqual(fileList[0]);
      expect(onChangeFn.mock.calls[0][0][0].response.url).toBe('https://tdesign.gtimg.com/demo/demo-image-1.png');
      unmountSuccess();

      const onFailFn = vi.fn();
      const { container: failedContainer } = render(
        <Upload
          theme="file-flow"
          multiple={true}
          files={[]}
          requestMethod={() =>
            Promise.resolve({
              status: 'fail',
              error: 'upload failed',
              response: {},
            })
          }
          onFail={onFailFn}
        ></Upload>,
      );
      const failedFileList = simulateFileChange(failedContainer.querySelector('input'));
      await mockDelay();
      expect(onFailFn).toHaveBeenCalled();
      expect(onFailFn.mock.calls[0][0].failedFiles.map((t) => t.raw)).toEqual(failedFileList);
      expect(onFailFn.mock.calls[0][0].currentFiles.map((t) => t.raw)).toEqual(failedFileList);
    });

    test('showUploadProgress', () => {
      const action = 'https://tdesign.test.com/upload/file_success';
      const progressFile = {
        name: 'file1.txt',
        status: 'progress' as const,
        url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
      };

      const { container: fileFlowContainer } = render(
        <Upload
          theme="file-flow"
          showUploadProgress={false}
          files={[{ ...progressFile, percent: 80 }]}
          action={action}
        ></Upload>,
      );
      expect(fileFlowContainer.querySelector('.t-upload__file-flow-progress').textContent).toBe('上传中');

      const { container: imageContainer } = render(
        <Upload
          theme="image"
          showUploadProgress={false}
          files={[{ ...progressFile, percent: 10 }]}
          action={action}
        ></Upload>,
      );
      expect(imageContainer.querySelector('.t-upload__image-progress').textContent).toBe('上传中');
    });

    test('sizeLimit', async () => {
      const action = 'https://tdesign.test.com/upload/file_success';
      const assertOverSizeLimit = (onValidateFn: ReturnType<typeof vi.fn>) => {
        expect(onValidateFn).toHaveBeenCalled();
        expect(onValidateFn.mock.calls[0][0].type).toBe('FILE_OVER_SIZE_LIMIT');
        expect(onValidateFn.mock.calls[0][0].files.length).toBe(3);
      };

      const onValidateDefaultFn = vi.fn();
      const { container: objectDefaultContainer } = render(
        <Upload sizeLimit={{ size: 23, unit: 'B' }} multiple action={action} onValidate={onValidateDefaultFn}></Upload>,
      );
      simulateFileChange(objectDefaultContainer.querySelector('input'), 'file', 5);
      await mockDelay();
      assertOverSizeLimit(onValidateDefaultFn);

      const onValidateCustomMessageFn = vi.fn();
      const { container: objectCustomContainer } = render(
        <Upload
          sizeLimit={{
            size: 23,
            unit: 'B',
            message: 'image size can not over than {sizeLimit}',
          }}
          multiple
          action={action}
          onValidate={onValidateCustomMessageFn}
        ></Upload>,
      );
      simulateFileChange(objectCustomContainer.querySelector('input'), 'file', 5);
      await mockDelay();
      assertOverSizeLimit(onValidateCustomMessageFn);

      const onValidateNumberFn = vi.fn();
      const { container: numberUnitContainer } = render(
        <Upload sizeLimit={0.023} multiple action={action} onValidate={onValidateNumberFn}></Upload>,
      );
      simulateFileChange(numberUnitContainer.querySelector('input'), 'file', 5);
      await mockDelay();
      assertOverSizeLimit(onValidateNumberFn);
    });

    const statusExpectedDom = [
      '.t-upload__tips-default',
      '.t-upload__tips-success',
      '.t-upload__tips-warning',
      '.t-upload__tips-error',
    ];
    (['default', 'success', 'warning', 'error'] as TdUploadProps['status'][]).forEach((item, index) => {
      test(`status[${item}]`, () => {
        const { container } = render(
          <Upload status={item} tips="upload tips text" action="https://tdesign.test.com/upload/file_success"></Upload>,
        );
        expect(container.querySelector(statusExpectedDom[index])).toBeTruthy();
      });
    });

    test('theme', () => {
      const { container: imageContainer, unmount: unmountImage } = render(
        <Upload
          files={[
            { url: 'xxxx.url', name: 'file1.txt' },
            { url: 'yyyy.url', name: 'file2.txt' },
          ]}
          multiple={true}
          theme="image"
        ></Upload>,
      );
      expect(imageContainer.querySelector('.t-upload__image-add')).toBeTruthy();
      unmountImage();

      const { container: fileContainer, unmount: unmountFile } = render(
        <Upload theme="file" autoUpload={false} files={[{ name: 'file1.txt', status: 'fail' }]}></Upload>,
      );
      expect(fileContainer.querySelector('.t-icon-error-circle-filled')).toBeTruthy();
      unmountFile();

      const { container: progressContainer, unmount: unmountProgress } = render(
        <Upload theme="file-input" files={[{ name: 'file1.txt', status: 'progress' }]}></Upload>,
      );
      expect(progressContainer.querySelector('.t-upload__single-progress')).toBeTruthy();
      unmountProgress();

      const { container: waitingContainer, unmount: unmountWaiting } = render(
        <Upload theme="file-input" files={[{ name: 'file1.txt', status: 'waiting' }]}></Upload>,
      );
      expect(waitingContainer.querySelector('.t-upload__file-waiting.t-icon-time-filled')).toBeTruthy();
      unmountWaiting();

      const { container: failedContainer, unmount: unmountFailed } = render(
        <Upload theme="file-input" files={[{ name: 'file1.txt', status: 'fail' }]}></Upload>,
      );
      expect(failedContainer.querySelector('.t-icon-error-circle-filled')).toBeTruthy();
      unmountFailed();

      const { container: successContainer, unmount: unmountSuccess } = render(
        <Upload theme="file-input" files={[{ name: 'file1.txt', status: 'success' }]}></Upload>,
      );
      expect(successContainer.querySelector('.t-icon-check-circle-filled')).toBeTruthy();
      unmountSuccess();

      const { container: fileFlowContainer, unmount: unmountFileFlow } = render(
        <Upload
          theme="file-flow"
          files={[
            { name: 'file1.txt', status: 'success' },
            { name: 'file2.txt', status: 'waiting' },
            { name: 'file3.txt', status: 'fail' },
            { name: 'file4.txt', status: 'progress', percent: 90 },
          ]}
        ></Upload>,
      );
      expect(fileFlowContainer.querySelectorAll('.t-upload__flow-table tbody > tr').length).toBe(4);
      expect(fileFlowContainer).toMatchSnapshot();
      unmountFileFlow();

      const SnapshotIdBoundary = () => {
        React.useId();
        return null;
      };
      const { unmount: unmountSnapshotIdBoundary } = render(<SnapshotIdBoundary />);
      unmountSnapshotIdBoundary();

      const { container: imageFlowContainer } = render(
        <Upload
          theme="image-flow"
          files={[
            { url: '', status: 'success', name: 'img.txt' },
            { url: 'https://img1.txt', status: 'success', name: 'img1.txt' },
            { url: 'https://img2.txt', status: 'waiting', name: 'img2.txt' },
            { url: 'https://img3.txt', status: 'fail', name: 'img3.txt' },
            {
              url: 'https://img4.txt',
              status: 'progress',
              percent: 90,
              name: 'img4.txt',
            },
          ]}
        ></Upload>,
      );
      expect(imageFlowContainer.querySelectorAll('.t-upload__card-item').length).toBe(5);
      expect(imageFlowContainer).toMatchSnapshot();
    });

    test('triggerButtonProps', () => {
      const { container } = render(
        <Upload
          triggerButtonProps={{ theme: 'warning' }}
          action="https://tdesign.test.com/upload/file_success"
        ></Upload>,
      );
      expect(container.querySelectorAll('.t-button--theme-warning').length).toBe(1);
    });

    test('withCredentials', async () => {
      const onFailFn = vi.fn();
      const { container } = render(
        <Upload
          withCredentials={true}
          action="https://tdesign.test.com/upload/fail/status_error"
          onFail={onFailFn}
        ></Upload>,
      );
      const inputDom = container.querySelector('input');
      simulateFileChange(inputDom);
      await mockDelay();
      expect(onFailFn).toHaveBeenCalled();
      expect(onFailFn.mock.calls[0][0].XMLHttpRequest.withCredentials).toBeTruthy();
    });

    test('imageProps', async () => {
      const { container } = render(
        <Upload
          files={files}
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          theme="image"
          accept="image/*"
          imageProps={{
            className: 'tdesign',
          }}
        />,
      );

      await mockDelay();
      expect(container).toBeInTheDocument();
      expect(container.querySelector('.tdesign')).toBeInTheDocument();
    });

    test('children[TNode]', () => {
      const action = 'https://tdesign.test.com/upload/file_success';
      const child = <span className="custom-node">TNode</span>;

      const { container: fileContainer } = render(
        <Upload theme="file" action={action}>
          {child}
        </Upload>,
      );
      expect(fileContainer.querySelector('.custom-node')).toBeTruthy();

      const { container: customContainer } = render(
        <Upload theme="custom" action={action}>
          {child}
        </Upload>,
      );
      expect(customContainer.querySelector('.custom-node')).toBeTruthy();

      const { container: draggableContainer } = render(
        <Upload theme="custom" draggable action={action}>
          {child}
        </Upload>,
      );
      expect(draggableContainer.querySelector('.custom-node')).toBeTruthy();
    });

    test('children[function]', () => {
      const fn = vi.fn();
      render(
        <Upload theme="custom" draggable action="https://tdesign.test.com/upload/file_success">
          {fn as unknown as TNode}
        </Upload>,
      );
      expect(fn).toHaveBeenCalled();
      expect(fn.mock.calls[0][0].dragActive).toBe(false);
      expect(fn.mock.calls[0][0].files).toEqual([]);
    });

    test('dragContent', () => {
      const { container } = render(
        <Upload
          dragContent={<span className="custom-node">TNode</span>}
          theme="custom"
          draggable={true}
          action="https://tdesign.test.com/upload/file_success"
        ></Upload>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
    });

    test('fileListDisplay[TNode]', () => {
      const action = 'https://tdesign.test.com/upload/file_success';
      const display = <span className="custom-node">TNode</span>;

      const fileList = getFakeFileList('file', 3);
      const { container: fileContainer } = render(
        <Upload fileListDisplay={display} files={fileList} theme="file" action={action}></Upload>,
      );
      expect(fileContainer.querySelector('.custom-node')).toBeTruthy();

      const flowImageList = [{ url: 'https://tdesign.gtimg.com/demo/demo-image-1.png' }];
      const { container: imageFlowContainer } = render(
        <Upload
          fileListDisplay={display}
          files={flowImageList}
          theme="image-flow"
          multiple
          draggable
          action={action}
        ></Upload>,
      );
      expect(imageFlowContainer.querySelector('.custom-node')).toBeTruthy();

      const { container: fileFlowContainer } = render(
        <Upload
          fileListDisplay={display}
          files={flowImageList}
          theme="file-flow"
          multiple
          draggable
          action={action}
        ></Upload>,
      );
      expect(fileFlowContainer.querySelector('.custom-node')).toBeTruthy();

      const { container: fileDraggableContainer } = render(
        <Upload
          fileListDisplay={display}
          theme="file"
          draggable
          files={[{ name: 'file1.txt', status: 'waiting', uploadTime: 1674897038406 }]}
        ></Upload>,
      );
      expect(fileDraggableContainer.querySelector('.custom-node')).toBeTruthy();

      const { container: imageDraggableContainer } = render(
        <Upload
          fileListDisplay={display}
          theme="image"
          draggable
          files={[
            {
              url: 'https://img1.txt',
              status: 'waiting',
              uploadTime: 1674897038406,
            },
          ]}
        ></Upload>,
      );
      expect(imageDraggableContainer.querySelector('.custom-node')).toBeTruthy();
    });

    test('fileListDisplay[function]', () => {
      const action = 'https://tdesign.test.com/upload/file_success';
      const fileList = getFakeFileList('file', 3);
      const fileFn = vi.fn();
      render(<Upload fileListDisplay={fileFn} files={fileList} theme="file" action={action}></Upload>);
      expect(fileFn).toHaveBeenCalled();
      expect(fileFn.mock.calls[0][0].files).toEqual(fileList);

      const flowImageList = [{ url: 'https://tdesign.gtimg.com/demo/demo-image-1.png' }];
      const imageFlowFn = vi.fn();
      render(
        <Upload
          fileListDisplay={imageFlowFn}
          files={flowImageList}
          theme="image-flow"
          multiple
          draggable
          action={action}
        ></Upload>,
      );
      expect(imageFlowFn).toHaveBeenCalled();
      expect(imageFlowFn.mock.calls[0][0].files).toEqual(flowImageList);

      const fileFlowFn = vi.fn();
      render(
        <Upload
          fileListDisplay={fileFlowFn}
          files={flowImageList}
          theme="file-flow"
          multiple
          draggable
          action={action}
        ></Upload>,
      );
      expect(fileFlowFn).toHaveBeenCalled();
      expect(fileFlowFn.mock.calls[0][0].files).toEqual(flowImageList);

      const waitingFile = [
        {
          name: 'file1.txt',
          status: 'waiting' as const,
          uploadTime: 1674897038406,
        },
      ];
      const fileDraggableFn = vi.fn();
      render(<Upload fileListDisplay={fileDraggableFn} theme="file" draggable files={waitingFile}></Upload>);
      expect(fileDraggableFn).toHaveBeenCalled();
      expect(fileDraggableFn.mock.calls[0][0].files).toEqual(waitingFile);

      const imageWaitingFile = [
        {
          url: 'https://img1.txt',
          status: 'waiting' as const,
          uploadTime: 1674897038406,
        },
      ];
      const imageDraggableFn = vi.fn();
      render(<Upload fileListDisplay={imageDraggableFn} theme="image" draggable files={imageWaitingFile}></Upload>);
      expect(imageDraggableFn).toHaveBeenCalled();
      expect(imageDraggableFn.mock.calls[0][0].files).toEqual(imageWaitingFile);
    });

    test('tips', () => {
      const { container } = render(
        <Upload
          tips={<span className="custom-node">TNode</span>}
          action="https://tdesign.test.com/upload/file_success"
        ></Upload>,
      );
      expect(container.querySelector('.custom-node')).toBeTruthy();
      expect(container.querySelector('.t-upload__tips')).toBeTruthy();
    });

    test('trigger[TNode]', () => {
      const trigger = <span className="custom-node">TNode</span>;

      const { container: fileContainer } = render(<Upload trigger={trigger} theme="file"></Upload>);
      expect(fileContainer.querySelector('.custom-node')).toBeTruthy();

      const { container: customContainer } = render(<Upload trigger={trigger} theme="custom"></Upload>);
      expect(customContainer.querySelector('.custom-node')).toBeTruthy();

      const { container: draggableContainer } = render(<Upload trigger={trigger} theme="custom" draggable></Upload>);
      expect(draggableContainer.querySelector('.custom-node')).toBeTruthy();

      const { container: withFilesContainer } = render(
        <Upload
          trigger={trigger}
          theme="custom"
          draggable
          files={[{ name: 'file-name.txt', status: 'progress' }]}
        ></Upload>,
      );
      expect(withFilesContainer.querySelector('.custom-node')).toBeTruthy();
    });

    test('trigger[function]', () => {
      const emptyFilesFn = vi.fn();
      render(<Upload trigger={emptyFilesFn} theme="custom" draggable></Upload>);
      expect(emptyFilesFn).toHaveBeenCalled();
      expect(emptyFilesFn.mock.calls[0][0].dragActive).toBe(false);
      expect(emptyFilesFn.mock.calls[0][0].files).toEqual([]);

      const progressFiles = [{ name: 'file-name.txt', status: 'progress' as const }];
      const withFilesFn = vi.fn();
      render(<Upload trigger={withFilesFn} theme="custom" draggable files={progressFiles}></Upload>);
      expect(withFilesFn).toHaveBeenCalled();
      expect(withFilesFn.mock.calls[0][0].dragActive).toBe(false);
      expect(withFilesFn.mock.calls[0][0].files).toEqual(progressFiles);
    });
  });

  describe('events', () => {
    test('cancelUpload', async () => {
      const onChangeFn = vi.fn();
      const onCancelUploadFn = vi.fn();
      const { container, unmount } = render(
        <Upload
          theme="file"
          draggable={true}
          autoUpload={true}
          action="https://tdesign.test.com/upload/file_success"
          files={[{ name: 'xxx.txt', status: 'progress' }]}
          onChange={onChangeFn}
          onCancelUpload={onCancelUploadFn}
        ></Upload>,
      );
      fireEvent.click(container.querySelector('.t-upload__dragger-progress-cancel'));
      await mockDelay();
      expect(onChangeFn).not.toHaveBeenCalled();
      expect(onCancelUploadFn).toHaveBeenCalled();
      unmount();

      const manualOnCancelUploadFn = vi.fn();
      const onRemoveFn = vi.fn();
      const { container: manualContainer } = render(
        <Upload
          theme="image"
          draggable={true}
          autoUpload={false}
          files={[
            {
              url: 'https://image3.png',
              name: 'image3.png',
              status: 'waiting',
            },
          ]}
          onCancelUpload={manualOnCancelUploadFn}
          onRemove={onRemoveFn}
        ></Upload>,
      );
      fireEvent.click(manualContainer.querySelector('.t-upload__dragger-progress-cancel'));
      expect(manualOnCancelUploadFn).toHaveBeenCalled();
      expect(onRemoveFn).toHaveBeenCalled();
      expect(onRemoveFn.mock.calls[0][0].file).toEqual({
        url: 'https://image3.png',
        name: 'image3.png',
        status: 'waiting',
      });
      expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      expect(onRemoveFn.mock.calls[0][0].index).toBe(0);
    });

    test('change', async () => {
      const imageOnChangeFn = vi.fn();
      const { container: imageContainer, unmount: unmountImage } = render(
        <Upload theme="image" draggable={true} autoUpload={false} files={[]} onChange={imageOnChangeFn}></Upload>,
      );
      const inputDom = imageContainer.querySelector('input');
      const fileList = simulateFileChange(inputDom, 'image', 1);
      await mockDelay(100);
      expect(imageOnChangeFn).toHaveBeenCalled();
      expect(imageOnChangeFn.mock.calls[0][0][0].raw).toEqual(fileList[0]);
      expect(imageOnChangeFn.mock.calls[0][1].trigger).toBe('add');
      expect(imageOnChangeFn.mock.calls[0][1].index).toBe(0);
      expect(imageOnChangeFn.mock.calls[0][1].file.raw).toEqual(fileList[0]);
      unmountImage();

      const imageFlowOnChangeFn = vi.fn();
      const { container: imageFlowContainer } = render(
        <Upload
          theme="image-flow"
          draggable={true}
          autoUpload={false}
          multiple={true}
          files={[{ url: 'https://image1.png', status: 'success' }]}
          onChange={imageFlowOnChangeFn}
        ></Upload>,
      );
      const imageFlowFileList = simulateFileChange(imageFlowContainer.querySelector('input'), 'image', 1);
      await mockDelay(100);
      expect(imageFlowOnChangeFn).toHaveBeenCalled();
      expect(imageFlowOnChangeFn.mock.calls[0][0][0]).toEqual({
        url: 'https://image1.png',
        status: 'success',
      });
      expect(imageFlowOnChangeFn.mock.calls[0][0][1].raw).toEqual(imageFlowFileList[0]);
      expect(imageFlowOnChangeFn.mock.calls[0][1].trigger).toBe('add');
      expect(imageFlowOnChangeFn.mock.calls[0][1].index).toBe(1);
      expect(imageFlowOnChangeFn.mock.calls[0][1].file.raw).toEqual(imageFlowFileList[0]);
      expect(imageFlowOnChangeFn.mock.calls[0][1].files.map((t) => t.raw)).toEqual(imageFlowFileList);
    });

    test('dragenter', () => {
      const imageOnDragenterFn = vi.fn();
      const imageOnDragleaveFn = vi.fn();
      const { container: imageContainer, unmount: unmountImage } = render(
        <Upload
          theme="image"
          draggable={true}
          onDragenter={imageOnDragenterFn}
          onDragleave={imageOnDragleaveFn}
        ></Upload>,
      );
      const tUploadDraggerDom = imageContainer.querySelector('.t-upload__dragger');
      const files = simulateDragFileChange(tUploadDraggerDom, 'dragEnter', 'image');
      expect(imageOnDragenterFn).toHaveBeenCalled();
      expect(imageOnDragenterFn.mock.calls[0][0].e.type).toBe('dragenter');
      expect(imageOnDragenterFn.mock.calls[0][0].e.dataTransfer.files).toEqual(files);
      const tUploadDraggerDom1 = imageContainer.querySelector('.t-upload__dragger');
      simulateDragFileChange(tUploadDraggerDom1, 'dragOver');
      const tUploadDraggerDom2 = imageContainer.querySelector('.t-upload__dragger');
      simulateDragFileChange(tUploadDraggerDom2, 'dragLeave');
      expect(imageOnDragleaveFn).toHaveBeenCalled();
      expect(imageOnDragleaveFn.mock.calls[0][0].e.type).toBe('dragleave');
      expect(imageOnDragleaveFn.mock.calls[0][0].e.dataTransfer.files).toEqual(files);
      unmountImage();

      const fileOnDragenterFn = vi.fn();
      const fileOnDragleaveFn = vi.fn();
      const { container: fileContainer } = render(
        <Upload theme="file" draggable={true} onDragenter={fileOnDragenterFn} onDragleave={fileOnDragleaveFn}></Upload>,
      );
      const fileDraggerDom = fileContainer.querySelector('.t-upload__dragger');
      const fileList = simulateDragFileChange(fileDraggerDom, 'dragEnter');
      expect(fileOnDragenterFn).toHaveBeenCalled();
      expect(fileOnDragenterFn.mock.calls[0][0].e.type).toBe('dragenter');
      expect(fileOnDragenterFn.mock.calls[0][0].e.dataTransfer.files).toEqual(fileList);
      simulateDragFileChange(fileContainer.querySelector('.t-upload__dragger'), 'dragOver');
      simulateDragFileChange(fileContainer.querySelector('.t-upload__dragger'), 'dragLeave');
      expect(fileOnDragleaveFn).toHaveBeenCalled();
      expect(fileOnDragleaveFn.mock.calls[0][0].e.type).toBe('dragleave');
      expect(fileOnDragleaveFn.mock.calls[0][0].e.dataTransfer.files).toEqual(fileList);
    });

    test('dragleave', () => {
      const onDragleaveFn1 = vi.fn();
      const { container } = render(
        <Upload
          theme="image"
          draggable={true}
          action="https://tdesign.test.com/upload/file_success"
          onDragleave={onDragleaveFn1}
        ></Upload>,
      );
      const tUploadDraggerDom = container.querySelector('.t-upload__dragger');
      simulateDragFileChange(tUploadDraggerDom, 'dragEnter');
      const tUploadTriggerDom1 = container.querySelector('.t-upload__trigger');
      simulateDragFileChange(tUploadTriggerDom1, 'dragLeave');
      expect(onDragleaveFn1).not.toHaveBeenCalled();
    });

    test('drop', () => {
      const imageOnDropFn = vi.fn();
      const { container: imageContainer, unmount: unmountImage } = render(
        <Upload
          theme="image"
          draggable={true}
          action="https://tdesign.test.com/upload/file_success"
          onDrop={imageOnDropFn}
        ></Upload>,
      );
      const tUploadDraggerDom = imageContainer.querySelector('.t-upload__dragger');
      const files = simulateDragFileChange(tUploadDraggerDom, 'drop', 'image');
      expect(imageOnDropFn).toHaveBeenCalled();
      expect(imageOnDropFn.mock.calls[0][0].e.type).toBe('drop');
      expect(imageOnDropFn.mock.calls[0][0].e.dataTransfer.files).toEqual(files);
      unmountImage();

      const fileOnDropFn = vi.fn();
      const { container: fileContainer } = render(
        <Upload
          theme="file"
          draggable={true}
          action="https://tdesign.test.com/upload/file_success"
          onDrop={fileOnDropFn}
        ></Upload>,
      );
      const fileDraggerDom = fileContainer.querySelector('.t-upload__dragger');
      const fileList = simulateDragFileChange(fileDraggerDom, 'drop');
      expect(fileOnDropFn).toHaveBeenCalled();
      expect(fileOnDropFn.mock.calls[0][0].e.type).toBe('drop');
      expect(fileOnDropFn.mock.calls[0][0].e.dataTransfer.files).toEqual(fileList);
    });

    test('fail', async () => {
      const onFailFn = vi.fn();
      const { container } = render(
        <Upload action="https://tdesign.test.com/upload/fail/status_error" onFail={onFailFn}></Upload>,
      );
      const inputDom = container.querySelector('input');
      const fileList = simulateFileChange(inputDom);
      await mockDelay();
      expect(onFailFn).toHaveBeenCalled();
      expect(onFailFn.mock.calls[0][0].XMLHttpRequest.upload.requestParams).toEqual({ file: fileList[0], length: 1 });
    });

    test('preview', async () => {
      const singleOnPreviewFn = vi.fn();
      const { container: singleContainer, unmount: unmountSingle } = render(
        <Upload
          files={[
            {
              url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
              name: 'demo-image-1.png',
            },
          ]}
          theme="image"
          onPreview={singleOnPreviewFn}
        ></Upload>,
      );
      fireEvent.mouseEnter(singleContainer.querySelector('.t-upload__card-item'));
      await mockDelay();
      fireEvent.click(singleContainer.querySelector('.t-icon-browse'));
      await mockDelay(300);
      const singlePreviewImage = document.querySelector('.t-image-viewer__modal-image');
      expect(singlePreviewImage.getAttribute('src')).toBe('https://tdesign.gtimg.com/demo/demo-image-1.png');
      expect(singleOnPreviewFn).toHaveBeenCalled();
      expect(singleOnPreviewFn.mock.calls[0][0].file).toEqual({
        url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
        name: 'demo-image-1.png',
      });
      expect(singleOnPreviewFn.mock.calls[0][0].index).toBe(0);
      expect(singleOnPreviewFn.mock.calls[0][0].e.type).toBe('click');
      unmountSingle();

      const multipleOnPreviewFn = vi.fn();
      const { container: multipleContainer, unmount: unmountMultiple } = render(
        <Upload
          files={[
            {
              url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
              name: 'demo-image-1.png',
            },
            {
              url: 'https://tdesign.gtimg.com/site/avatar.jpg',
              name: 'avatar.jpg',
            },
          ]}
          theme="image"
          multiple={true}
          onPreview={multipleOnPreviewFn}
        ></Upload>,
      );
      fireEvent.mouseEnter(multipleContainer.querySelector('.t-upload__card-item:last-child'));
      await mockDelay();
      fireEvent.click(multipleContainer.querySelector('.t-upload__card-item:nth-child(2) .t-icon-browse'));
      await mockDelay(300);
      const multiplePreviewImage = document.querySelector('.t-image-viewer__modal-image');
      expect(multiplePreviewImage.getAttribute('src')).toBe('https://tdesign.gtimg.com/site/avatar.jpg');
      expect(multipleOnPreviewFn).toHaveBeenCalled();
      expect(multipleOnPreviewFn.mock.calls[0][0].file).toEqual({
        url: 'https://tdesign.gtimg.com/site/avatar.jpg',
        name: 'avatar.jpg',
      });
      expect(multipleOnPreviewFn.mock.calls[0][0].index).toBe(1);
      expect(multipleOnPreviewFn.mock.calls[0][0].e.type).toBe('click');
      unmountMultiple();

      const flowOnPreviewFn = vi.fn();
      const { container: flowContainer } = render(
        <Upload
          files={[
            {
              url: 'https://tdesign.gtimg.com/demo/demo-image-1.png',
              name: 'demo-image-1.png',
            },
            {
              url: 'https://tdesign.gtimg.com/site/avatar.jpg',
              name: 'avatar.jpg',
            },
          ]}
          theme="image-flow"
          multiple={true}
          onPreview={flowOnPreviewFn}
        ></Upload>,
      );
      fireEvent.mouseEnter(flowContainer.querySelector('.t-upload__card-item:nth-child(2)'));
      await mockDelay();
      fireEvent.click(flowContainer.querySelector('.t-upload__card-item:nth-child(2) .t-icon-browse'));
      await mockDelay(300);
      const flowPreviewImage = document.querySelector('.t-image-viewer__modal-image');
      expect(flowPreviewImage.getAttribute('src')).toBe('https://tdesign.gtimg.com/site/avatar.jpg');
      expect(flowOnPreviewFn).toHaveBeenCalled();
      expect(flowOnPreviewFn.mock.calls[0][0].file).toEqual({
        url: 'https://tdesign.gtimg.com/site/avatar.jpg',
        name: 'avatar.jpg',
      });
      expect(flowOnPreviewFn.mock.calls[0][0].index).toBe(1);
      expect(flowOnPreviewFn.mock.calls[0][0].e.type).toBe('click');
    });

    test('remove', async () => {
      {
        const onChangeFn = vi.fn();
        const onRemoveFn = vi.fn();
        const { container } = render(
          <Upload
            files={[{ name: 'file1.txt', url: 'https://xxx1.txt' }]}
            onChange={onChangeFn}
            onRemove={onRemoveFn}
          ></Upload>,
        );
        fireEvent.click(container.querySelector('.t-upload__icon-delete'));
        expect(onChangeFn).toHaveBeenCalled();
        expect(onChangeFn.mock.calls[0][0]).toEqual([]);
        expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
        expect(onRemoveFn).toHaveBeenCalled();
        expect(onRemoveFn.mock.calls[0][0].index).toBe(0);
        expect(onRemoveFn.mock.calls[0][0].file).toBeTruthy();
        expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      }

      {
        const onChangeFn = vi.fn();
        const onRemoveFn = vi.fn();
        const { container } = render(
          <Upload
            multiple={true}
            files={[
              { name: 'file1.txt', url: 'https://xxx1.txt' },
              { name: 'file2.txt', url: 'https://xxx2.txt' },
              { name: 'file3.txt', url: 'https://xxx3.txt' },
            ]}
            onChange={onChangeFn}
            onRemove={onRemoveFn}
          ></Upload>,
        );
        fireEvent.click(container.querySelector('.t-upload__single-display-text .t-upload__icon-delete'));
        expect(onChangeFn).toHaveBeenCalled();
        expect(onChangeFn.mock.calls[0][0]).toEqual([
          { name: 'file2.txt', url: 'https://xxx2.txt' },
          { name: 'file3.txt', url: 'https://xxx3.txt' },
        ]);
        expect(onChangeFn.mock.calls[0][1].index).toBe(0);
        expect(onChangeFn.mock.calls[0][1].file).toBeTruthy();
        expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
        expect(onRemoveFn).toHaveBeenCalled();
        expect(onRemoveFn.mock.calls[0][0].index).toBe(0);
        expect(onRemoveFn.mock.calls[0][0].file).toBeTruthy();
        expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      }

      {
        const onChangeFn = vi.fn();
        const onRemoveFn = vi.fn();
        const { container } = render(
          <Upload
            theme="image"
            multiple={true}
            files={[{ name: 'image1.png', status: 'fail' }]}
            onChange={onChangeFn}
            onRemove={onRemoveFn}
          ></Upload>,
        );
        fireEvent.click(container.querySelector('.t-upload__card-mask-item .t-icon-delete'));
        expect(onChangeFn).toHaveBeenCalled();
        expect(onChangeFn.mock.calls[0][0]).toEqual([]);
        expect(onChangeFn.mock.calls[0][1].index).toBe(0);
        expect(onChangeFn.mock.calls[0][1].file).toBeTruthy();
        expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
        expect(onRemoveFn).toHaveBeenCalled();
        expect(onRemoveFn.mock.calls[0][0].index).toBe(0);
        expect(onRemoveFn.mock.calls[0][0].file).toBeTruthy();
        expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      }

      {
        const onChangeFn = vi.fn();
        const onRemoveFn = vi.fn();
        const { container } = render(
          <Upload
            theme="image"
            multiple={true}
            files={[{ url: 'https://image1.png', status: 'success' }]}
            onChange={onChangeFn}
            onRemove={onRemoveFn}
          ></Upload>,
        );
        fireEvent.click(container.querySelector('.t-upload__card-mask-item .t-icon-delete'));
        expect(onChangeFn).toHaveBeenCalled();
        expect(onChangeFn.mock.calls[0][0]).toEqual([]);
        expect(onChangeFn.mock.calls[0][1].index).toBe(0);
        expect(onChangeFn.mock.calls[0][1].file).toBeTruthy();
        expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
        expect(onRemoveFn).toHaveBeenCalled();
        expect(onRemoveFn.mock.calls[0][0].index).toBe(0);
        expect(onRemoveFn.mock.calls[0][0].file).toBeTruthy();
        expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      }

      {
        const onChangeFn = vi.fn();
        const onRemoveFn = vi.fn();
        const { container } = render(
          <Upload
            theme="file-input"
            files={[{ name: 'file.txt', status: 'success' }]}
            onChange={onChangeFn}
            onRemove={onRemoveFn}
          ></Upload>,
        );
        fireEvent.click(container.querySelector('.t-upload__single-input-clear'));
        expect(onChangeFn).toHaveBeenCalled();
        expect(onChangeFn.mock.calls[0][0]).toEqual([]);
        expect(onRemoveFn).toHaveBeenCalled();
        expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      }

      {
        const onChangeFn = vi.fn();
        const onRemoveFn = vi.fn();
        const { container } = render(
          <Upload
            theme="file-flow"
            multiple={true}
            files={[{ name: 'file1.txt', url: 'https://xxx1.txt' }]}
            onChange={onChangeFn}
            onRemove={onRemoveFn}
          ></Upload>,
        );
        fireEvent.click(container.querySelector('.t-upload__delete'));
        expect(onChangeFn).toHaveBeenCalled();
        expect(onChangeFn.mock.calls[0][0]).toEqual([]);
        expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
        expect(onRemoveFn).toHaveBeenCalled();
        expect(onRemoveFn.mock.calls[0][0].index).toBe(0);
        expect(onRemoveFn.mock.calls[0][0].file).toBeTruthy();
        expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      }

      {
        const onChangeFn = vi.fn();
        const onRemoveFn = vi.fn();
        const { container } = render(
          <Upload
            theme="image-flow"
            multiple={true}
            files={[{ name: 'file1.txt', url: 'https://xxx1.txt' }]}
            onChange={onChangeFn}
            onRemove={onRemoveFn}
          ></Upload>,
        );
        fireEvent.click(container.querySelector('.t-upload__delete'));
        expect(onChangeFn).toHaveBeenCalled();
        expect(onChangeFn.mock.calls[0][0]).toEqual([]);
        expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
        expect(onRemoveFn).toHaveBeenCalled();
        expect(onRemoveFn.mock.calls[0][0].index).toBe(0);
        expect(onRemoveFn.mock.calls[0][0].file).toBeTruthy();
        expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      }

      {
        const onChangeFn = vi.fn();
        const onRemoveFn = vi.fn();
        const { container } = render(
          <Upload
            theme="file-flow"
            multiple={true}
            isBatchUpload={true}
            files={[
              { name: 'file1.txt', url: 'https://xxx1.txt' },
              { name: 'file2.txt', url: 'https://xxx2.txt' },
            ]}
            onChange={onChangeFn}
            onRemove={onRemoveFn}
          ></Upload>,
        );
        fireEvent.click(container.querySelector('.t-upload__delete'));
        expect(onChangeFn).toHaveBeenCalled();
        expect(onChangeFn.mock.calls[0][0]).toEqual([]);
        expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
        expect(onRemoveFn).toHaveBeenCalled();
        expect(onRemoveFn.mock.calls[0][0].index).toBe(-1);
        expect(onRemoveFn.mock.calls[0][0].file).toBe(undefined);
        expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      }

      {
        const onChangeFn = vi.fn();
        const onRemoveFn = vi.fn();
        const { container } = render(
          <Upload
            theme="image"
            draggable={true}
            files={[{ url: 'https://www.image.png', status: 'success' }]}
            onChange={onChangeFn}
            onRemove={onRemoveFn}
          ></Upload>,
        );
        fireEvent.click(container.querySelector('.t-upload__dragger-delete-btn'));
        expect(onChangeFn).toHaveBeenCalled();
        expect(onChangeFn.mock.calls[0][0]).toEqual([]);
        expect(onChangeFn.mock.calls[0][1].e.type).toBe('click');
        expect(onRemoveFn).toHaveBeenCalled();
        expect(onRemoveFn.mock.calls[0][0].index).toBe(0);
        expect(onRemoveFn.mock.calls[0][0].file).toEqual({
          url: 'https://www.image.png',
          status: 'success',
        });
        expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      }

      {
        const onChangeFn = vi.fn();
        const onRemoveFn = vi.fn();
        const { container } = render(
          <Upload
            theme="file"
            multiple={true}
            autoUpload={false}
            files={[
              { name: 'file1.txt' },
              { name: 'file2.txt', status: 'success' },
              { name: 'file3.txt', status: 'waiting' },
            ]}
            onChange={onChangeFn}
            onRemove={onRemoveFn}
          ></Upload>,
        );
        fireEvent.click(container.querySelector('.t-upload__single-display-text:last-child .t-upload__icon-delete'));
        expect(onChangeFn).toHaveBeenCalled();
        expect(onChangeFn.mock.calls[0][0]).toEqual([{ name: 'file1.txt' }, { name: 'file2.txt', status: 'success' }]);
        expect(onRemoveFn).toHaveBeenCalled();
        expect(onRemoveFn.mock.calls[0][0].index).toBe(2);
        expect(onRemoveFn.mock.calls[0][0].file).toEqual({
          name: 'file3.txt',
          status: 'waiting',
        });
        expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      }

      {
        const onChangeFn = vi.fn();
        const onRemoveFn = vi.fn();
        const { container } = render(
          <Upload
            theme="file-flow"
            multiple={true}
            autoUpload={true}
            files={[
              { name: 'file1.txt' },
              { name: 'file2.txt', status: 'success' },
              { name: 'file3.txt', status: 'waiting' },
              { name: 'file4.txt', status: 'fail' },
            ]}
            onChange={onChangeFn}
            onRemove={onRemoveFn}
          ></Upload>,
        );
        fireEvent.click(container.querySelector('.t-upload__flow-table tbody tr:nth-child(2) .t-upload__delete'));
        expect(onChangeFn).toHaveBeenCalled();
        expect(onChangeFn.mock.calls[0][0]).toEqual([
          { name: 'file1.txt' },
          { name: 'file3.txt', status: 'waiting' },
          { name: 'file4.txt', status: 'fail' },
        ]);
        expect(onRemoveFn).toHaveBeenCalled();
        expect(onRemoveFn.mock.calls[0][0].index).toBe(1);
        expect(onRemoveFn.mock.calls[0][0].file).toEqual({
          name: 'file2.txt',
          status: 'success',
        });
        expect(onRemoveFn.mock.calls[0][0].e.type).toBe('click');
      }

      {
        const onChangeFn1 = vi.fn();
        const onRemoveFn1 = vi.fn();
        const { container } = render(
          <Upload
            theme="file-flow"
            multiple={true}
            autoUpload={true}
            files={[{ name: 'file1.txt' }, { name: 'file2.txt', status: 'success' }]}
            action="https://tdesign.test.com/upload/fail/status_error"
            onChange={onChangeFn1}
            onRemove={onRemoveFn1}
          ></Upload>,
        );
        const inputDom = container.querySelector('input');
        simulateFileChange(inputDom);
        await mockDelay();
        fireEvent.click(container.querySelector('.t-upload__flow-table tbody tr:last-child .t-upload__delete'));
        expect(onChangeFn1).not.toHaveBeenCalled();
        expect(onRemoveFn1).toHaveBeenCalled();
        expect(onRemoveFn1.mock.calls[0][0].index).toBe(2);
        expect(onRemoveFn1.mock.calls[0][0].file.name).toBe('file-name.txt');
        expect(onRemoveFn1.mock.calls[0][0].file.status).toBe('fail');
        expect(onRemoveFn1.mock.calls[0][0].e.type).toBe('click');
      }
    });
  });
});
