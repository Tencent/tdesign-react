import { renderHook, act } from '@test/utils';
import { vi } from 'vitest';
import useUpload from '../hooks/useUpload';
import type { TdUploadProps, UploadFile } from '../type';

// Mock URL.createObjectURL / revokeObjectURL (jsdom 不支持)
global.URL.createObjectURL = vi.fn(() => 'blob://mock-object-url');
global.URL.revokeObjectURL = vi.fn();

// Mock 依赖模块
vi.mock('../../_common/js/upload/main', () => ({
  formatToUploadFile: vi.fn((files: File[]) =>
    files.map((f) => ({ name: f.name, raw: f, status: 'waiting' }) as UploadFile),
  ),
  getDisplayFiles: vi.fn(({ uploadValue, toUploadFiles, autoUpload }: any) =>
    autoUpload ? [...uploadValue, ...toUploadFiles] : uploadValue,
  ),
  getFilesAndErrors: vi.fn((fileValidateList: any[]) => {
    const toFiles = fileValidateList.map((x) => x.file ?? x);
    return { sizeLimitErrors: [], beforeUploadErrorFiles: [], toFiles };
  }),
  validateFile: vi.fn((args: any) => {
    const { files } = args;
    const fileValidateList = files.map((f: File) => ({
      file: { name: f.name, raw: f, status: 'waiting' },
    }));
    return Promise.resolve({ files, fileValidateList });
  }),
  upload: vi.fn((opts: any) => {
    // 调用回调以覆盖 onResponseProgress, onResponseSuccess, setXhrObject
    const { toUploadFiles, onResponseProgress, onResponseSuccess, setXhrObject } = opts;
    const file = toUploadFiles?.[0];
    // 触发 setXhrObject
    if (setXhrObject && file) {
      setXhrObject({ files: [file], xhrReq: { abort: vi.fn() } });
      // 触发重复检测分支
      setXhrObject({ files: [file], xhrReq: { abort: vi.fn() } });
    }
    // 触发 onResponseProgress
    if (onResponseProgress && file) {
      onResponseProgress({
        event: new Event('progress'),
        file,
        files: toUploadFiles,
        percent: 50,
        type: 'mock',
        XMLHttpRequest: {},
      });
    }
    // 触发 onResponseSuccess
    if (onResponseSuccess) {
      onResponseSuccess({ event: new Event('load'), file });
    }
    const data = {
      files:
        toUploadFiles?.map((f: UploadFile) => ({ ...f, status: 'success', url: 'https://example.com/test.png' })) || [],
      response: { ok: true },
    };
    return Promise.resolve({ status: 'success', data, list: [{ data }], failedFiles: [] });
  }),
}));

vi.mock('../../_common/js/upload/utils', () => ({
  getFileList: vi.fn((fl: FileList) => Array.from(fl)),
  getFileUrlByFileRaw: vi.fn(async () => 'blob://mock-url'),
  IMAGE_REGEXP: /\.(png|gif|jpg|jpeg|webp|svg|bmp|ico)(\?.*)?$/i,
}));

function createFile(fileName = 'test.png', type = 'image/png') {
  const blob = new Blob(['test content'], { type });
  return new File([blob], fileName, { type });
}

function flushPromises() {
  return new Promise<void>((resolve) => {
    setTimeout(resolve, 0);
  });
}

describe('useUpload', () => {
  describe('basic functionality', () => {
    it(': initializes with default values', () => {
      const props: TdUploadProps = {};
      const { result } = renderHook(() => useUpload(props));

      expect(result.current.uploadValue).toEqual([]);
      expect(result.current.toUploadFiles).toEqual([]);
      expect(result.current.displayFiles).toEqual([]);
      expect(result.current.isUploading).toBe(false);
      expect(result.current.disabled).toBeUndefined();
    });

    it(': handles disabled state', () => {
      const props: TdUploadProps = { disabled: true };
      const { result } = renderHook(() => useUpload(props));

      expect(result.current.disabled).toBe(true);
    });

    it(': initializes with defaultFiles', () => {
      const defaultFiles: UploadFile[] = [{ name: 'test.png', url: 'https://example.com/test.png', status: 'success' }];
      const props: TdUploadProps = { defaultFiles };
      const { result } = renderHook(() => useUpload(props));

      expect(result.current.uploadValue).toEqual(defaultFiles);
    });
  });

  describe('file operations', () => {
    it(': handles file change', async () => {
      const onSelectChange = vi.fn();
      const props: TdUploadProps = { onSelectChange };
      const { result } = renderHook(() => useUpload(props));

      const files = [createFile('test.png')];

      await act(async () => {
        result.current.onFileChange(files);
      });

      expect(onSelectChange).toHaveBeenCalledWith(
        files,
        expect.objectContaining({ currentSelectedFiles: expect.any(Array) }),
      );
    });

    it(': does not handle file change when disabled', async () => {
      const onSelectChange = vi.fn();
      const props: TdUploadProps = { disabled: true, onSelectChange };
      const { result } = renderHook(() => useUpload(props));

      const files = [createFile('test.png')];

      await act(async () => {
        result.current.onFileChange(files);
      });

      expect(onSelectChange).not.toHaveBeenCalled();
    });

    it(': handles file upload', async () => {
      const onSuccess = vi.fn();
      const props: TdUploadProps = {
        autoUpload: true,
        action: '//mock-api',
        onSuccess,
      };
      const { result } = renderHook(() => useUpload(props));

      const uploadFiles: UploadFile[] = [{ name: 'test.png', raw: createFile('test.png'), status: 'waiting' }];

      await act(async () => {
        result.current.uploadFiles(uploadFiles);
      });

      expect(onSuccess).toHaveBeenCalled();
    });

    it(': handles file removal', () => {
      const onRemove = vi.fn();
      const files: UploadFile[] = [{ name: 'test.png', url: 'https://example.com/test.png', status: 'success' }];
      const props: TdUploadProps = { files, onRemove };
      const { result } = renderHook(() => useUpload(props));

      const mockEvent = { stopPropagation: vi.fn() } as any;

      act(() => {
        result.current.onInnerRemove({
          e: mockEvent,
          file: files[0],
          index: 0,
        });
      });

      expect(onRemove).toHaveBeenCalledWith(
        expect.objectContaining({
          file: files[0],
          index: 0,
          e: mockEvent,
        }),
      );
    });

    it(': handles upload cancellation', () => {
      const props: TdUploadProps = { autoUpload: true };
      const { result } = renderHook(() => useUpload(props));

      act(() => {
        result.current.cancelUpload();
      });

      expect(result.current.isUploading).toBe(false);
    });
  });

  describe('validation', () => {
    it(': validates file size limit', async () => {
      const { validateFile } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [],
        fileValidateList: [
          {
            file: { name: 'large.png', size: 2000000, status: 'waiting' },
            validateResult: { type: 'FILE_OVER_SIZE_LIMIT' },
          },
        ],
      });

      const onValidate = vi.fn();
      const props: TdUploadProps = {
        sizeLimit: 1000,
        onValidate,
      };
      const { result } = renderHook(() => useUpload(props));

      const files = [createFile('large.png')];

      await act(async () => {
        result.current.onFileChange(files);
      });

      expect(validateFile).toHaveBeenCalled();
    });

    it(': validates max file count', async () => {
      const { validateFile } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [],
        lengthOverLimit: true,
        fileValidateList: [],
      });

      const onValidate = vi.fn();
      const props: TdUploadProps = {
        max: 1,
        onValidate,
      };
      const { result } = renderHook(() => useUpload(props));

      const files = [createFile('test1.png'), createFile('test2.png')];

      await act(async () => {
        result.current.onFileChange(files);
      });

      expect(onValidate).toHaveBeenCalledWith(expect.objectContaining({ type: 'FILES_OVER_LENGTH_LIMIT' }));
    });

    it(': handles duplicate file names', async () => {
      const { validateFile } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [],
        hasSameNameFile: true,
        fileValidateList: [],
      });

      const onValidate = vi.fn();
      const props: TdUploadProps = {
        allowUploadDuplicateFile: false,
        onValidate,
      };
      const { result } = renderHook(() => useUpload(props));

      const files = [createFile('same.png'), createFile('same.png')];

      await act(async () => {
        result.current.onFileChange(files);
      });

      expect(onValidate).toHaveBeenCalledWith(expect.objectContaining({ type: 'FILTER_FILE_SAME_NAME' }));
    });
  });

  describe('upload modes', () => {
    it(': handles auto upload mode', async () => {
      const onSuccess = vi.fn();
      const props: TdUploadProps = {
        autoUpload: true,
        action: '//mock-api',
        onSuccess,
      };
      const { result } = renderHook(() => useUpload(props));

      const files = [createFile('test.png')];

      await act(async () => {
        result.current.onFileChange(files);
        await flushPromises();
        await flushPromises();
        await flushPromises();
      });

      expect(onSuccess).toHaveBeenCalled();
    });

    it(': handles manual upload mode', async () => {
      const onChange = vi.fn();
      const props: TdUploadProps = {
        autoUpload: false,
        onChange,
      };
      const { result } = renderHook(() => useUpload(props));

      const files = [createFile('test.png')];

      await act(async () => {
        result.current.onFileChange(files);
        await flushPromises();
        await flushPromises();
      });

      expect(onChange).toHaveBeenCalled();
    });

    it(': triggers onProgress callback during upload', async () => {
      const onProgress = vi.fn();
      const onSuccess = vi.fn();
      const props: TdUploadProps = {
        autoUpload: true,
        multiple: true,
        action: '//mock-api',
        onProgress,
        onSuccess,
      };
      const { result } = renderHook(() => useUpload(props));

      const uploadFilesList: UploadFile[] = [{ name: 'test.png', raw: createFile('test.png'), status: 'waiting' }];

      await act(async () => {
        result.current.uploadFiles(uploadFilesList);
        await flushPromises();
      });

      expect(onProgress).toHaveBeenCalledWith(expect.objectContaining({ percent: 50 }));
      expect(onSuccess).toHaveBeenCalled();
    });

    it(': auto upload triggers setUploadValue with trigger=add on success', async () => {
      const onChange = vi.fn();
      const onSuccess = vi.fn();
      const props: TdUploadProps = {
        autoUpload: true,
        action: '//mock-api',
        onChange,
        onSuccess,
      };
      const { result } = renderHook(() => useUpload(props));

      const uploadFilesList: UploadFile[] = [{ name: 'test.png', raw: createFile('test.png'), status: 'waiting' }];

      await act(async () => {
        result.current.uploadFiles(uploadFilesList);
        await flushPromises();
      });

      expect(onChange).toHaveBeenCalledWith(expect.any(Array), expect.objectContaining({ trigger: 'add' }));
    });
  });

  describe('progress handling', () => {
    it(': uploadFilePercent function is defined and callable', () => {
      const props: TdUploadProps = { autoUpload: true };
      const { result } = renderHook(() => useUpload(props));

      expect(typeof result.current.uploadFilePercent).toBe('function');

      const file: UploadFile = { name: 'test.png', raw: createFile('test.png'), status: 'progress' };

      act(() => {
        result.current.uploadFilePercent({ file, percent: 50 });
      });

      expect(result.current.uploadFilePercent).toBeDefined();
    });
  });

  describe('utility functions', () => {
    it(': isImageFile correctly identifies image files', () => {
      const props: TdUploadProps = {};
      const { result } = renderHook(() => useUpload(props));

      const imageFile: UploadFile = { name: 'test.png', raw: createFile('test.png', 'image/png'), status: 'success' };
      expect(result.current.isImageFile(imageFile)).toBe(true);

      const nonImageFile: UploadFile = {
        name: 'doc.pdf',
        raw: createFile('doc.pdf', 'application/pdf'),
        status: 'success',
      };
      expect(result.current.isImageFile(nonImageFile)).toBe(false);
    });

    it(': isImageFile with url-based detection', () => {
      const props: TdUploadProps = {};
      const { result } = renderHook(() => useUpload(props));

      const fileWithImgUrl: UploadFile = { name: 'photo', url: 'https://example.com/photo.jpg', status: 'success' };
      expect(result.current.isImageFile(fileWithImgUrl)).toBe(true);

      const fileWithNonImgUrl: UploadFile = { name: 'doc', url: 'https://example.com/doc.pdf', status: 'success' };
      expect(result.current.isImageFile(fileWithNonImgUrl)).toBe(false);
    });

    it(': inputRef is defined', () => {
      const props: TdUploadProps = {};
      const { result } = renderHook(() => useUpload(props));

      expect(result.current.inputRef).toBeDefined();
    });
  });

  describe('file removal scenarios', () => {
    it(': onInnerRemove in single file mode clears all', () => {
      const onChange = vi.fn();
      const onRemove = vi.fn();
      const files: UploadFile[] = [{ name: 'test.png', url: 'https://example.com/test.png', status: 'success' }];
      const props: TdUploadProps = { files, multiple: false, onChange, onRemove };
      const { result } = renderHook(() => useUpload(props));

      const mockEvent = { stopPropagation: vi.fn() } as any;

      act(() => {
        result.current.onInnerRemove({ e: mockEvent, file: files[0], index: 0 });
      });

      expect(onChange).toHaveBeenCalledWith([], expect.objectContaining({ trigger: 'remove' }));
      expect(onRemove).toHaveBeenCalled();
    });

    it(': onInnerRemove in multiple + non-autoUpload mode', () => {
      const onChange = vi.fn();
      const files: UploadFile[] = [
        { name: 'a.png', url: 'https://example.com/a.png', status: 'success' },
        { name: 'b.png', url: 'https://example.com/b.png', status: 'success' },
      ];
      const props: TdUploadProps = { files, multiple: true, autoUpload: false, onChange };
      const { result } = renderHook(() => useUpload(props));

      const mockEvent = { stopPropagation: vi.fn() } as any;

      act(() => {
        result.current.onInnerRemove({ e: mockEvent, file: files[0], index: 0 });
      });

      expect(onChange).toHaveBeenCalled();
    });

    it(': onInnerRemove in multiple + autoUpload mode for uploaded file', () => {
      const onChange = vi.fn();
      const files: UploadFile[] = [
        { name: 'a.png', url: 'https://example.com/a.png', status: 'success' },
        { name: 'b.png', url: 'https://example.com/b.png', status: 'success' },
      ];
      const props: TdUploadProps = { files, multiple: true, autoUpload: true, onChange };
      const { result } = renderHook(() => useUpload(props));

      const mockEvent = { stopPropagation: vi.fn() } as any;

      act(() => {
        result.current.onInnerRemove({ e: mockEvent, file: files[1], index: 1 });
      });

      expect(onChange).toHaveBeenCalled();
    });

    it(': onInnerRemove in multiple + autoUpload mode for toUploadFiles item', async () => {
      const onChange = vi.fn();
      const files: UploadFile[] = [
        { name: 'uploaded.png', url: 'https://example.com/uploaded.png', status: 'success' },
      ];
      const props: TdUploadProps = { files, multiple: true, autoUpload: true, onChange };
      const { result } = renderHook(() => useUpload(props));

      // First, add a file to toUploadFiles via onFileChange
      await act(async () => {
        result.current.onFileChange([createFile('pending.png')]);
        await flushPromises();
        await flushPromises();
        await flushPromises();
      });

      const mockEvent = { stopPropagation: vi.fn() } as any;
      // Index >= uploadValue.length means it's in toUploadFiles
      act(() => {
        result.current.onInnerRemove({
          e: mockEvent,
          file: { name: 'pending.png', status: 'waiting' },
          index: files.length, // index >= uploadValue.length triggers toUploadFiles splice
        });
      });

      // Should not crash and should handle the removal
      expect(mockEvent.stopPropagation).toHaveBeenCalled();
    });
  });

  describe('cancelUpload scenarios', () => {
    it(': cancelUpload in non-autoUpload mode resets file status', () => {
      const onChange = vi.fn();
      const files: UploadFile[] = [{ name: 'a.png', url: 'https://example.com/a.png', status: 'progress' }];
      const props: TdUploadProps = { files, autoUpload: false, onChange };
      const { result } = renderHook(() => useUpload(props));

      act(() => {
        result.current.cancelUpload();
      });

      expect(onChange).toHaveBeenCalledWith(
        expect.arrayContaining([expect.objectContaining({ status: 'waiting' })]),
        expect.objectContaining({ trigger: 'abort' }),
      );
    });

    it(': cancelUpload in non-autoUpload mode with context.file triggers onInnerRemove', () => {
      const onChange = vi.fn();
      const onRemove = vi.fn();
      const file: UploadFile = { name: 'a.png', url: 'https://example.com/a.png', status: 'progress' };
      const props: TdUploadProps = { files: [file], autoUpload: false, onChange, onRemove };
      const { result } = renderHook(() => useUpload(props));

      const mockEvent = { stopPropagation: vi.fn() } as any;
      act(() => {
        result.current.cancelUpload({ file, e: mockEvent });
      });

      expect(onRemove).toHaveBeenCalled();
    });

    it(': cancelUpload in autoUpload mode sets toUploadFiles status to waiting', async () => {
      const onProgress = vi.fn();
      const onSuccess = vi.fn();
      const props: TdUploadProps = { autoUpload: true, action: '//mock-api', onProgress, onSuccess };
      const { result } = renderHook(() => useUpload(props));

      const uploadFile: UploadFile[] = [{ name: 'test.png', raw: createFile('test.png'), status: 'waiting' }];

      await act(async () => {
        result.current.uploadFiles(uploadFile);
        await flushPromises();
      });

      // Now cancel
      act(() => {
        result.current.cancelUpload();
      });

      expect(result.current.isUploading).toBe(false);
    });

    it(': cancelUpload preserves success files in non-autoUpload mode', () => {
      const onChange = vi.fn();
      const files: UploadFile[] = [
        { name: 'done.png', url: 'https://example.com/done.png', status: 'success' },
        { name: 'pending.png', url: 'https://example.com/pending.png', status: 'progress' },
      ];
      const props: TdUploadProps = { files, autoUpload: false, onChange };
      const { result } = renderHook(() => useUpload(props));

      act(() => {
        result.current.cancelUpload();
      });

      const callArgs = onChange.mock.calls[0];
      const updatedFiles = callArgs[0];
      expect(updatedFiles[0].status).toBe('success');
      expect(updatedFiles[1].status).toBe('waiting');
    });
  });

  describe('upload failure', () => {
    it(': handles upload failure with failedFiles', async () => {
      const { upload } = await import('../../_common/js/upload/main');
      vi.mocked(upload).mockImplementationOnce((opts: any) => {
        const { toUploadFiles, onResponseError } = opts;
        // 触发 onResponseError 回调
        if (onResponseError) {
          onResponseError({ event: new Event('error'), files: toUploadFiles });
        }
        return Promise.resolve({
          status: 'fail',
          data: { event: new Event('error'), response: { error: 'fail' } },
          list: [],
          failedFiles: [{ name: 'test.png', status: 'fail' }],
        } as any);
      });

      const onFail = vi.fn();
      const props: TdUploadProps = { autoUpload: true, action: '//mock-api', onFail };
      const { result } = renderHook(() => useUpload(props));

      const uploadFilesList: UploadFile[] = [{ name: 'test.png', raw: createFile('test.png'), status: 'waiting' }];

      await act(async () => {
        result.current.uploadFiles(uploadFilesList);
        await flushPromises();
      });

      expect(onFail).toHaveBeenCalled();
    });

    it(': handles onResponseError in single mode (non-multiple)', async () => {
      const { upload } = await import('../../_common/js/upload/main');
      vi.mocked(upload).mockImplementationOnce((opts: any) => {
        const { toUploadFiles, onResponseError } = opts;
        if (onResponseError) {
          onResponseError({ event: new Event('error'), files: toUploadFiles });
        }
        return Promise.resolve({
          status: 'fail',
          data: { event: new Event('error'), response: { error: 'fail' } },
          list: [],
          failedFiles: toUploadFiles,
        } as any);
      });

      const onFail = vi.fn();
      const onChange = vi.fn();
      const props: TdUploadProps = { autoUpload: true, multiple: false, action: '//mock-api', onFail, onChange };
      const { result } = renderHook(() => useUpload(props));

      const uploadFilesList: UploadFile[] = [{ name: 'test.png', raw: createFile('test.png'), status: 'waiting' }];

      await act(async () => {
        result.current.uploadFiles(uploadFilesList);
        await flushPromises();
      });

      expect(onFail).toHaveBeenCalled();
    });

    it(': handles onResponseError with empty/null data', async () => {
      const { upload } = await import('../../_common/js/upload/main');
      vi.mocked(upload).mockImplementationOnce((opts: any) => {
        const { onResponseError } = opts;
        // 触发空参数分支
        if (onResponseError) {
          onResponseError(null);
          onResponseError({});
          onResponseError({ files: [] });
        }
        return Promise.resolve({
          status: 'fail',
          data: { event: new Event('error'), response: {} },
          list: [],
          failedFiles: [{ name: 'test.png', status: 'fail' }],
        } as any);
      });

      const onFail = vi.fn();
      const props: TdUploadProps = { autoUpload: true, action: '//mock-api', onFail };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.uploadFiles([{ name: 'test.png', raw: createFile('test.png'), status: 'waiting' }]);
        await flushPromises();
      });

      expect(onFail).toHaveBeenCalled();
    });

    it(': uploadFiles does nothing when empty array given', async () => {
      const onSuccess = vi.fn();
      const props: TdUploadProps = { autoUpload: true, action: '//mock-api', onSuccess };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.uploadFiles([]);
        await flushPromises();
      });

      expect(onSuccess).not.toHaveBeenCalled();
    });

    it(': uploadFiles in non-autoUpload mode uses notUploadedFiles', async () => {
      const { upload } = await import('../../_common/js/upload/main');
      vi.mocked(upload).mockImplementationOnce((opts: any) => {
        const { toUploadFiles } = opts;
        const data = {
          files: toUploadFiles?.map((f: UploadFile) => ({ ...f, status: 'success' })),
          response: { ok: true },
        };
        return Promise.resolve({ status: 'success', data, list: [{ data }], failedFiles: [] });
      });

      const onSuccess = vi.fn();
      const files: UploadFile[] = [{ name: 'waiting.png', url: 'https://example.com/waiting.png', status: 'waiting' }];
      const props: TdUploadProps = { files, autoUpload: false, action: '//mock-api', onSuccess };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.uploadFiles();
        await flushPromises();
      });

      expect(onSuccess).toHaveBeenCalled();
    });
  });

  describe('BEFORE_ALL_FILES_UPLOAD validation', () => {
    it(': triggers onValidate with BEFORE_ALL_FILES_UPLOAD type', async () => {
      const { validateFile } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [],
        validateResult: { type: 'BEFORE_ALL_FILES_UPLOAD' },
        fileValidateList: [],
      });

      const onValidate = vi.fn();
      const props: TdUploadProps = { onValidate };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.onFileChange([createFile('test.png')]);
        await flushPromises();
      });

      expect(onValidate).toHaveBeenCalledWith(expect.objectContaining({ type: 'BEFORE_ALL_FILES_UPLOAD' }));
    });
  });

  describe('sizeLimitErrors handling', () => {
    it(': triggers FILE_OVER_SIZE_LIMIT when size limit exceeded', async () => {
      const { validateFile, getFilesAndErrors } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [createFile('big.png')],
        fileValidateList: [{ file: { name: 'big.png', status: 'waiting', size: 5000000 } }],
      });
      vi.mocked(getFilesAndErrors).mockReturnValueOnce({
        sizeLimitErrors: [{ file: { name: 'big.png', status: 'fail', response: { error: 'too big' } } }],
        beforeUploadErrorFiles: [],
        toFiles: [],
      });

      const onValidate = vi.fn();
      const props: TdUploadProps = { sizeLimit: 1000, onValidate };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.onFileChange([createFile('big.png')]);
        await flushPromises();
      });

      expect(onValidate).toHaveBeenCalledWith(expect.objectContaining({ type: 'FILE_OVER_SIZE_LIMIT' }));
    });

    it(': triggers CUSTOM_BEFORE_UPLOAD when beforeUpload rejects', async () => {
      const { validateFile, getFilesAndErrors } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [createFile('test.png')],
        fileValidateList: [{ file: { name: 'test.png', status: 'waiting' } }],
      });
      vi.mocked(getFilesAndErrors).mockReturnValueOnce({
        sizeLimitErrors: [],
        beforeUploadErrorFiles: [{ name: 'test.png', status: 'fail' }],
        toFiles: [],
      });

      const onValidate = vi.fn();
      const props: TdUploadProps = { onValidate };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.onFileChange([createFile('test.png')]);
        await flushPromises();
      });

      expect(onValidate).toHaveBeenCalledWith(expect.objectContaining({ type: 'CUSTOM_BEFORE_UPLOAD' }));
    });

    it(': uses sizeLimit object with message for error display', async () => {
      const { validateFile, getFilesAndErrors } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [createFile('big.png')],
        fileValidateList: [{ file: { name: 'big.png', status: 'waiting', size: 5000000 } }],
      });
      vi.mocked(getFilesAndErrors).mockImplementationOnce((fileValidateList: any[], getSizeLimitError: any) => {
        // Actually call getSizeLimitError to exercise the t() function
        const error = getSizeLimitError({ size: 1024, unit: 'KB', message: 'File exceeds {sizeLimit}' });
        return {
          sizeLimitErrors: [{ file: { name: 'big.png', status: 'fail', response: { error } } }],
          beforeUploadErrorFiles: [],
          toFiles: [],
        };
      });

      const onValidate = vi.fn();
      const props: TdUploadProps = {
        sizeLimit: { size: 1024, unit: 'KB', message: 'File exceeds {sizeLimit}' },
        onValidate,
      };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.onFileChange([createFile('big.png')]);
        await flushPromises();
      });

      expect(onValidate).toHaveBeenCalledWith(expect.objectContaining({ type: 'FILE_OVER_SIZE_LIMIT' }));
    });

    it(': uses sizeLimit object without message falls back to default', async () => {
      const { validateFile, getFilesAndErrors } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [createFile('big.png')],
        fileValidateList: [{ file: { name: 'big.png', status: 'waiting', size: 5000000 } }],
      });
      vi.mocked(getFilesAndErrors).mockImplementationOnce((fileValidateList: any[], getSizeLimitError: any) => {
        // Call getSizeLimitError without message to exercise the else branch
        const error = getSizeLimitError({ size: 2048, unit: 'MB' });
        return {
          sizeLimitErrors: [{ file: { name: 'big.png', status: 'fail', response: { error } } }],
          beforeUploadErrorFiles: [],
          toFiles: [],
        };
      });

      const onValidate = vi.fn();
      const props: TdUploadProps = { sizeLimit: { size: 2048, unit: 'MB' }, onValidate };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.onFileChange([createFile('big.png')]);
        await flushPromises();
      });

      expect(onValidate).toHaveBeenCalledWith(expect.objectContaining({ type: 'FILE_OVER_SIZE_LIMIT' }));
    });

    it(': uses sizeLimit object with function message', async () => {
      const { validateFile, getFilesAndErrors } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [createFile('big.png')],
        fileValidateList: [{ file: { name: 'big.png', status: 'waiting', size: 5000000 } }],
      });
      vi.mocked(getFilesAndErrors).mockImplementationOnce((fileValidateList: any[], getSizeLimitError: any) => {
        // Call getSizeLimitError with function message to exercise function branch
        const error = getSizeLimitError({ size: 1024, unit: 'KB', message: (data: any) => `Max ${data.sizeLimit}` });
        return {
          sizeLimitErrors: [{ file: { name: 'big.png', status: 'fail', response: { error } } }],
          beforeUploadErrorFiles: [],
          toFiles: [],
        };
      });

      const onValidate = vi.fn();
      const props: TdUploadProps = {
        sizeLimit: { size: 1024, unit: 'KB', message: ((data: any) => `Max ${data.sizeLimit}`) as any },
        onValidate,
      };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.onFileChange([createFile('big.png')]);
        await flushPromises();
      });

      expect(onValidate).toHaveBeenCalledWith(expect.objectContaining({ type: 'FILE_OVER_SIZE_LIMIT' }));
    });

    it(': handles non-string non-function message pattern in t()', async () => {
      const { validateFile, getFilesAndErrors } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [createFile('big.png')],
        fileValidateList: [{ file: { name: 'big.png', status: 'waiting', size: 5000000 } }],
      });
      vi.mocked(getFilesAndErrors).mockImplementationOnce((fileValidateList: any[], getSizeLimitError: any) => {
        // Call with number/null/etc to hit the return '' branch
        const error = getSizeLimitError({ size: 1024, unit: 'KB', message: 123 as any });
        return {
          sizeLimitErrors: [{ file: { name: 'big.png', status: 'fail', response: { error } } }],
          beforeUploadErrorFiles: [],
          toFiles: [],
        };
      });

      const onValidate = vi.fn();
      const props: TdUploadProps = { sizeLimit: { size: 1024, unit: 'KB', message: 123 as any }, onValidate };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.onFileChange([createFile('big.png')]);
        await flushPromises();
      });

      expect(onValidate).toHaveBeenCalledWith(expect.objectContaining({ type: 'FILE_OVER_SIZE_LIMIT' }));
    });
  });

  describe('multiple file with manual upload', () => {
    it(': handleNotAutoUpload concatenates files in multiple mode', async () => {
      const onChange = vi.fn();
      const files: UploadFile[] = [
        { name: 'existing.png', url: 'https://example.com/existing.png', status: 'success' },
      ];
      const props: TdUploadProps = { files, multiple: true, autoUpload: false, onChange };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.onFileChange([createFile('new.png')]);
        await flushPromises();
      });

      expect(onChange).toHaveBeenCalled();
    });
  });

  describe('lengthOverLimit with remaining files', () => {
    it(': continues upload when lengthOverLimit but files exist', async () => {
      const { validateFile } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [{ name: 'ok.png', raw: createFile('ok.png'), status: 'waiting' }],
        lengthOverLimit: true,
        fileValidateList: [{ file: { name: 'ok.png', raw: createFile('ok.png'), status: 'waiting' } }],
      });

      const onValidate = vi.fn();
      const props: TdUploadProps = { max: 1, autoUpload: true, action: '//mock-api', onValidate };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.onFileChange([createFile('ok.png')]);
        await flushPromises();
        await flushPromises();
      });

      expect(onValidate).toHaveBeenCalledWith(expect.objectContaining({ type: 'FILES_OVER_LENGTH_LIMIT' }));
    });
  });

  describe('useEffect cleanup', () => {
    it(': releases object URLs on unmount', async () => {
      const props: TdUploadProps = { autoUpload: false };
      const { result, unmount } = renderHook(() => useUpload(props));

      // Add a file to trigger createObjectUrl
      await act(async () => {
        result.current.onFileChange([createFile('test.png')]);
        await flushPromises();
      });

      // URL.createObjectURL should have been called
      expect(global.URL.createObjectURL).toHaveBeenCalled();

      // Unmount the hook to trigger cleanup
      unmount();

      // URL.revokeObjectURL should have been called during cleanup
      expect(global.URL.revokeObjectURL).toHaveBeenCalled();
    });
  });

  describe('validateFile without fileValidateList array', () => {
    it(': skips processing when fileValidateList is not an array', async () => {
      const { validateFile } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [],
        fileValidateList: null as any, // Not an Array
      });

      const onValidate = vi.fn();
      const onChange = vi.fn();
      const props: TdUploadProps = { onValidate, onChange };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.onFileChange([createFile('test.png')]);
        await flushPromises();
      });

      // Should not trigger size/beforeUpload validation since fileValidateList is not array
      const calls = onValidate.mock.calls.map((c: any) => c[0]?.type);
      expect(calls).not.toContain('FILE_OVER_SIZE_LIMIT');
      expect(calls).not.toContain('CUSTOM_BEFORE_UPLOAD');
    });
  });

  describe('cancelUpload with active xhr', () => {
    it(': aborts active xhr requests during cancelUpload', async () => {
      const abortFn = vi.fn();
      const { upload } = await import('../../_common/js/upload/main');
      // Override upload mock to set xhrReq that won't resolve immediately
      vi.mocked(upload).mockImplementationOnce((opts: any) => {
        const { setXhrObject, toUploadFiles } = opts;
        if (setXhrObject && toUploadFiles?.[0]) {
          setXhrObject({ files: [toUploadFiles[0]], xhrReq: { abort: abortFn } });
        }
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        return new Promise(() => {});
      });

      const props: TdUploadProps = { autoUpload: true, action: '//mock-api' };
      const { result } = renderHook(() => useUpload(props));

      const uploadFilesList: UploadFile[] = [{ name: 'test.png', raw: createFile('test.png'), status: 'waiting' }];

      // Start upload (won't resolve)
      act(() => {
        result.current.uploadFiles(uploadFilesList);
      });

      // Now cancel - should call abort on xhrReq items
      act(() => {
        result.current.cancelUpload();
      });

      expect(abortFn).toHaveBeenCalled();
      expect(result.current.isUploading).toBe(false);
    });
  });

  describe('handleNotAutoUpload edge cases', () => {
    it(': does nothing when resulting files list is empty', async () => {
      const { validateFile, getFilesAndErrors } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [],
        fileValidateList: [],
      });
      vi.mocked(getFilesAndErrors).mockReturnValueOnce({
        sizeLimitErrors: [],
        beforeUploadErrorFiles: [],
        toFiles: [], // empty toFiles
      });

      const onChange = vi.fn();
      const props: TdUploadProps = { autoUpload: false, onChange };
      const { result } = renderHook(() => useUpload(props));

      await act(async () => {
        result.current.onFileChange([createFile('test.png')]);
        await flushPromises();
      });

      // onChange should not be called because tmpFiles is empty
      expect(onChange).not.toHaveBeenCalled();
    });
  });
});
