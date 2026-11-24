import { vi } from 'vitest';
import { describe, it, expect, render, fireEvent, waitFor, act } from '@test/utils';

import React from 'react';
import type { UploadFile } from '../type';
import Upload from '../Upload';

// Mock URL.createObjectURL / revokeObjectURL (jsdom 不支持)
global.URL.createObjectURL = vi.fn(() => 'blob://mock-object-url');
global.URL.revokeObjectURL = vi.fn();

// 将 mock 放到文件顶部，确保在导入被测组件之前生效
vi.mock('../../_common/js/upload/main', () => {
  const mockFormatToUploadFile = vi.fn((files: File[]) =>
    files.map((f) => ({ name: f.name, raw: f, status: 'waiting' }) as UploadFile),
  );
  const mockGetDisplayFiles = vi.fn(({ uploadValue, toUploadFiles, autoUpload }: any) =>
    autoUpload ? [...uploadValue, ...toUploadFiles] : uploadValue,
  );
  const mockGetFilesAndErrors = vi.fn((fileValidateList: any[]) => {
    const toFiles = fileValidateList.map((x) => x.file ?? x);
    return { sizeLimitErrors: [], beforeUploadErrorFiles: [], toFiles };
  });
  const mockValidateFile = vi.fn((args: any) => {
    const { files, max, allowUploadDuplicateFile } = args;
    const hasSameNameFile = !allowUploadDuplicateFile && files.length > 1 && files[0].name === files[1].name;
    const lengthOverLimit = max > 0 && files.length > max;
    const fileValidateList = files.map((f: File) => ({
      file: { name: f.name, raw: f, status: 'waiting', size: f.size },
    }));
    return Promise.resolve({ files, hasSameNameFile, lengthOverLimit, fileValidateList });
  });
  const mockUpload = vi.fn((opts: any) => {
    const { toUploadFiles } = opts;
    const data = {
      files: toUploadFiles.map((f: UploadFile) => ({
        ...f,
        status: 'success',
        url: 'https://example.com/test.png',
      })),
      response: { ok: true },
    };
    return Promise.resolve({ status: 'success', data, list: [{ data }], failedFiles: [] });
  });

  return {
    formatToUploadFile: mockFormatToUploadFile,
    getDisplayFiles: mockGetDisplayFiles,
    getFilesAndErrors: mockGetFilesAndErrors,
    validateFile: mockValidateFile,
    upload: mockUpload,
  };
});

vi.mock('../../_common/js/upload/utils', () => ({
  getFileList: vi.fn((fl: FileList) => Array.from(fl)),
  getFileUrlByFileRaw: vi.fn(async () => 'blob://mock-url'),
  IMAGE_REGEXP: /\.(png|gif|jpg|jpeg|webp|svg|bmp|ico)(\?.*)?$/i,
  FILE_PDF_REGEXP: /\.pdf(\?.*)?$/i,
  FILE_EXCEL_REGEXP: /\.(xlsx?|csv)(\?.*)?$/i,
  FILE_WORD_REGEXP: /\.(docx?)(\?.*)?$/i,
  FILE_PPT_REGEXP: /\.(pptx?)(\?.*)?$/i,
  VIDEO_REGEXP: /\.(mp4|avi|mov|wmv|flv|mkv|webm)(\?.*)?$/i,
  AUDIO_REGEXP: /\.(mp3|wav|ogg|flac|aac)(\?.*)?$/i,
  returnFileSize: vi.fn((size: number) => `${(size / 1024).toFixed(1)}KB`),
}));

const prefix = 't';
const name = `.${prefix}-upload`;

function createFile(fileName = 'test.png', type = 'image/png', size = 1024) {
  const blob = new Blob([new ArrayBuffer(size)], { type });
  return new File([blob], fileName, { type, lastModified: Date.now() });
}

describe('Upload', () => {
  describe('props', () => {
    it(': accept', () => {
      const { container } = render(<Upload accept="image/*" />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toHaveAttribute('accept', 'image/*');
    });

    it(': multiple', () => {
      const { container } = render(<Upload multiple />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      expect(input).toHaveAttribute('multiple');
    });

    it(': disabled', () => {
      const onClickUpload = vi.fn();
      const { container } = render(<Upload disabled onClickUpload={onClickUpload} />);
      const addBtn = container.querySelector(`${name}__item--add`);
      if (addBtn) {
        fireEvent.click(addBtn);
        expect(onClickUpload).not.toHaveBeenCalled();
      }
    });

    it(': max controls add button visibility', () => {
      const files: UploadFile[] = [{ name: 'test.png', url: 'https://example.com/test.png', status: 'success' }];
      const { container } = render(<Upload max={1} files={files} />);
      const addBtn = container.querySelector(`${name}__item--add`);
      expect(addBtn).toBeNull();
    });

    it(': max allows add button when under limit', () => {
      const { container } = render(<Upload max={2} />);
      const addBtn = container.querySelector(`${name}__item--add`);
      expect(addBtn).toBeTruthy();
    });

    it(': max=0 always shows add button', () => {
      const { container } = render(<Upload max={0} />);
      const addBtn = container.querySelector(`${name}__item--add`);
      expect(addBtn).toBeTruthy();
    });

    it(': addContent as custom trigger content', () => {
      const onClickUpload = vi.fn();
      const { container } = render(<Upload onClickUpload={onClickUpload} addContent={<span>自定义上传</span>} />);
      const addBtn = container.querySelector(`${name}__item--add`);
      if (addBtn) {
        fireEvent.click(addBtn);
        expect(onClickUpload).toHaveBeenCalled();
      }
    });

    it(': addContent custom add button', () => {
      const { container } = render(<Upload addContent={<span>添加文件</span>} />);
      expect(container.querySelector(`${name}__add-icon`)).toBeTruthy();
    });

    it(': files display uploaded files', () => {
      const files: UploadFile[] = [
        { name: 'test1.png', url: 'https://example.com/test1.png', status: 'success' },
        { name: 'test2.png', url: 'https://example.com/test2.png', status: 'success' },
      ];
      const { container } = render(<Upload files={files} />);
      const items = container.querySelectorAll(`${name}__item`);
      expect(items.length).toBeGreaterThanOrEqual(2);
    });

    it(': files without url do not render Image but keep delete button', () => {
      const files: UploadFile[] = [{ name: 'no-url.png', status: 'success' } as any];
      const { container } = render(<Upload files={files} />);
      const image = container.querySelector(`${name}__image`);
      expect(image).toBeFalsy();
      const delBtn = container.querySelector(`${name}__delete-btn`);
      expect(delBtn).toBeTruthy();
    });

    it(': preview controls image preview', () => {
      const files: UploadFile[] = [{ name: 'test.png', url: 'https://example.com/test.png', status: 'success' }];
      const { container } = render(<Upload files={files} preview={false} />);
      const image = container.querySelector(`${name}__image`);
      if (image) {
        fireEvent.click(image);
        expect(container.querySelector('.t-image-viewer')).toBeFalsy();
      }
    });

    it(': imageProps passed to Image component', () => {
      const files: UploadFile[] = [{ name: 'test.png', url: 'https://example.com/test.png', status: 'success' }];
      const { container } = render(<Upload files={files} imageProps={{ shape: 'square' }} />);
      const image = container.querySelector(`${name}__image`);
      expect(image).toBeTruthy();
    });

    it(': addBtn=false hides add button', () => {
      const { container } = render(<Upload addBtn={false} />);
      const addBtn = container.querySelector(`${name}__item--add`);
      expect(addBtn).toBeNull();
    });

    it(': removeBtn=false hides delete button', () => {
      const files: UploadFile[] = [{ name: 'test.png', url: 'https://example.com/test.png', status: 'success' }];
      const { container } = render(<Upload files={files} removeBtn={false} />);
      const delBtn = container.querySelector(`${name}__delete-btn`);
      expect(delBtn).toBeFalsy();
    });

    it(': className and style passed through', () => {
      const { container } = render(<Upload className="custom-class" style={{ color: 'red' }} />);
      const root = container.querySelector(`${name}`) as HTMLElement;
      expect(root).not.toBeNull();
      expect(root.classList.contains('custom-class')).toBe(true);
      expect(root.style.color).toBe('red');
    });
  });

  describe('events', () => {
    it(': onClickUpload', () => {
      const onClickUpload = vi.fn();
      const { container } = render(<Upload onClickUpload={onClickUpload} />);
      const addBtn = container.querySelector(`${name}__item--add`);
      if (addBtn) {
        fireEvent.click(addBtn);
        expect(onClickUpload).toHaveBeenCalledWith(expect.objectContaining({ e: expect.any(Object) }));
      }
    });

    it(': onSelectChange when files selected', async () => {
      const onSelectChange = vi.fn();
      const { container } = render(<Upload onSelectChange={onSelectChange} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createFile('test.png');
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(onSelectChange).toHaveBeenCalledWith(
          [file],
          expect.objectContaining({ currentSelectedFiles: expect.any(Array) }),
        );
      });
    });

    it(': onSuccess when upload succeeds', async () => {
      const onSuccess = vi.fn();
      const { container } = render(<Upload onSuccess={onSuccess} autoUpload action="//mock-api" />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createFile('test.png');
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(
        () => {
          expect(onSuccess).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });

    it(': onValidate when validation fails', async () => {
      const { validateFile } = await import('../../_common/js/upload/main');
      vi.mocked(validateFile).mockResolvedValueOnce({
        files: [],
        lengthOverLimit: true,
        fileValidateList: [],
      });

      const onValidate = vi.fn();
      const { container } = render(<Upload onValidate={onValidate} max={1} />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      const files = [createFile('test1.png'), createFile('test2.png')];
      Object.defineProperty(input, 'files', {
        value: files,
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(() => {
        expect(onValidate).toHaveBeenCalledWith(expect.objectContaining({ type: 'FILES_OVER_LENGTH_LIMIT' }));
      });
    });

    it(': allowUploadDuplicateFile=true does not trigger same-name validate', async () => {
      const onValidate = vi.fn();
      const { container } = render(<Upload onValidate={onValidate} allowUploadDuplicateFile action="//mock-api" />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      const f1 = createFile('same.png');
      const f2 = createFile('same.png');
      Object.defineProperty(input, 'files', {
        value: [f1, f2],
        writable: false,
      });
      fireEvent.change(input);

      await waitFor(() => {
        const types = onValidate.mock.calls.map((c: any[]) => c[0]?.type);
        expect(types).not.toContain('FILTER_FILE_SAME_NAME');
      });
    });

    it(': autoUpload=false does not call onSuccess', async () => {
      const onSelectChange = vi.fn();
      const onChange = vi.fn();
      const onSuccess = vi.fn();
      const { container } = render(
        <Upload autoUpload={false} onSelectChange={onSelectChange} onChange={onChange} onSuccess={onSuccess} />,
      );
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createFile('manual.png');
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });
      fireEvent.change(input);

      await waitFor(() => {
        expect(onSelectChange).toHaveBeenCalled();
        expect(onChange).toHaveBeenCalled();
        expect(onSuccess).not.toHaveBeenCalled();
      });
    });

    it(': onPreview when image clicked', () => {
      const onPreview = vi.fn();
      const files: UploadFile[] = [{ name: 'test.png', url: 'https://example.com/test.png', status: 'success' }];
      const { container } = render(<Upload files={files} onPreview={onPreview} />);
      const image = container.querySelector(`${name}__image`);

      if (image) {
        fireEvent.click(image);
        expect(onPreview).toHaveBeenCalledWith(
          expect.objectContaining({
            file: expect.any(Object),
            index: 0,
            e: expect.any(Object),
          }),
        );
      }
    });

    it(': onRemove when delete button clicked', () => {
      const onRemove = vi.fn();
      const files: UploadFile[] = [{ name: 'test.png', url: 'https://example.com/test.png', status: 'success' }];
      const { container } = render(<Upload files={files} onRemove={onRemove} />);
      const deleteBtn = container.querySelector(`${name}__delete-btn`);

      if (deleteBtn) {
        fireEvent.click(deleteBtn);
        expect(onRemove).toHaveBeenCalledWith(
          expect.objectContaining({
            file: expect.any(Object),
            index: 0,
            e: expect.any(Object),
          }),
        );
      }
    });

    it(': onChange when files change', async () => {
      const onChange = vi.fn();
      const { container } = render(<Upload onChange={onChange} autoUpload action="//mock-api" />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;

      const file = createFile('test.png');
      Object.defineProperty(input, 'files', {
        value: [file],
        writable: false,
      });

      fireEvent.change(input);

      await waitFor(
        () => {
          expect(onChange).toHaveBeenCalled();
        },
        { timeout: 3000 },
      );
    });
  });

  describe('status rendering', () => {
    it(': progress status shows loading and percent', () => {
      const files: UploadFile[] = [
        {
          name: 'test.png',
          url: 'https://example.com/test.png',
          status: 'progress',
          percent: 50,
        },
      ];
      const { container, getByText } = render(<Upload files={files} />);

      expect(container.querySelector(`${name}__progress-loading`)).toBeTruthy();
      expect(getByText('50%')).toBeInTheDocument();
    });

    it(': progress status without percent shows uploading text', () => {
      const files: UploadFile[] = [
        {
          name: 'no-percent.png',
          url: 'https://example.com/no-percent.png',
          status: 'progress',
        },
      ];
      const { container } = render(<Upload files={files} />);
      expect(container.querySelector(`${name}__progress-mask`)).toBeTruthy();
      expect(container.querySelector(`${name}__progress-text`)).toBeTruthy();
    });

    it(': fail status shows error icon', () => {
      const files: UploadFile[] = [
        {
          name: 'test.png',
          url: 'https://example.com/test.png',
          status: 'fail',
        },
      ];
      const { container } = render(<Upload files={files} />);

      expect(container.querySelector(`${name}__progress-mask`)).toBeTruthy();
      expect(container.querySelector(`${name}__progress-text`)).toBeTruthy();
    });

    it(': success status shows no progress mask', () => {
      const files: UploadFile[] = [
        {
          name: 'test.png',
          url: 'https://example.com/test.png',
          status: 'success',
        },
      ];
      const { container } = render(<Upload files={files} />);

      expect(container.querySelector(`${name}__progress-mask`)).toBeFalsy();
    });
  });

  describe('slots', () => {
    it(': addContent renders custom content in add button area', () => {
      const { getByText } = render(<Upload addContent={<div>自定义上传区域</div>} />);
      expect(getByText('自定义上传区域')).toBeInTheDocument();
    });
  });

  describe('interaction', () => {
    it(': input click triggered by add button', () => {
      const { container } = render(<Upload />);
      const input = container.querySelector('input[type="file"]') as HTMLInputElement;
      const addBtn = container.querySelector(`${name}__item--add`);

      const clickSpy = vi.spyOn(input, 'click');

      if (addBtn) {
        fireEvent.click(addBtn);
        expect(clickSpy).toHaveBeenCalled();
      }
    });

    it(': ImageViewer opens and closes', async () => {
      const files: UploadFile[] = [{ name: 'test.png', url: 'https://example.com/test.png', status: 'success' }];
      const { container } = render(<Upload files={files} />);
      const image = container.querySelector(`${name}__image`);

      if (image) {
        fireEvent.click(image);

        await waitFor(() => {
          expect(container.querySelector('.t-image-viewer')).toBeTruthy();
        });
      }
    });
  });

  describe('theme: list', () => {
    it(': renders list layout', () => {
      const files: UploadFile[] = [
        { name: 'doc.pdf', url: 'https://example.com/doc.pdf', status: 'success', size: 2048 },
      ];
      const { container } = render(<Upload theme="list" files={files} />);
      expect(container.querySelector(`${name}__list`)).toBeTruthy();
      expect(container.querySelector(`${name}__list-item`)).toBeTruthy();
    });

    it(': list item shows file name', () => {
      const files: UploadFile[] = [{ name: 'report.docx', url: 'https://example.com/report.docx', status: 'success' }];
      const { container } = render(<Upload theme="list" files={files} />);
      const nameEl = container.querySelector(`${name}__list-item-name`);
      expect(nameEl?.textContent).toBe('report.docx');
    });

    it(': list item shows progress status', () => {
      const files: UploadFile[] = [
        { name: 'uploading.pdf', url: 'https://example.com/uploading.pdf', status: 'progress', percent: 30 },
      ];
      const { container } = render(<Upload theme="list" files={files} />);
      expect(container.querySelector(`${name}__list-item--progress`)).toBeTruthy();
    });

    it(': list item shows fail status', () => {
      const files: UploadFile[] = [{ name: 'failed.pdf', url: 'https://example.com/failed.pdf', status: 'fail' }];
      const { container } = render(<Upload theme="list" files={files} />);
      expect(container.querySelector(`${name}__list-item--fail`)).toBeTruthy();
    });

    it(': list item delete button triggers onRemove', () => {
      const onRemove = vi.fn();
      const files: UploadFile[] = [{ name: 'doc.pdf', url: 'https://example.com/doc.pdf', status: 'success' }];
      const { container } = render(<Upload theme="list" files={files} onRemove={onRemove} />);
      const deleteBtn = container.querySelector(`${name}__list-item-delete`);
      if (deleteBtn) {
        fireEvent.click(deleteBtn);
        expect(onRemove).toHaveBeenCalled();
      }
    });

    it(': list trigger button is hidden when max reached', () => {
      const files: UploadFile[] = [{ name: 'doc.pdf', url: 'https://example.com/doc.pdf', status: 'success' }];
      const { container } = render(<Upload theme="list" files={files} max={1} />);
      const trigger = container.querySelector(`${name}__list-trigger`);
      expect(trigger).toBeNull();
    });

    it(': list shows trigger button when addBtn=true and under max', () => {
      const { container } = render(<Upload theme="list" />);
      const trigger = container.querySelector(`${name}__list-trigger`);
      expect(trigger).toBeTruthy();
    });

    it(': list onPreview triggered on item click', () => {
      const onPreview = vi.fn();
      const files: UploadFile[] = [{ name: 'doc.pdf', url: 'https://example.com/doc.pdf', status: 'success' }];
      const { container } = render(<Upload theme="list" files={files} onPreview={onPreview} />);
      const item = container.querySelector(`${name}__list-item`);
      if (item) {
        fireEvent.click(item);
        expect(onPreview).toHaveBeenCalled();
      }
    });

    it(': list removeBtn=false hides delete icon', () => {
      const files: UploadFile[] = [{ name: 'doc.pdf', url: 'https://example.com/doc.pdf', status: 'success' }];
      const { container } = render(<Upload theme="list" files={files} removeBtn={false} />);
      const deleteBtn = container.querySelector(`${name}__list-item-delete`);
      expect(deleteBtn).toBeFalsy();
    });

    it(': list item with image file and url shows thumbnail', () => {
      const files: UploadFile[] = [{ name: 'photo.png', url: 'https://example.com/photo.png', status: 'success' }];
      const { container } = render(<Upload theme="list" files={files} />);
      const thumbnail = container.querySelector(`${name}__list-item-thumbnail`);
      expect(thumbnail).toBeTruthy();
    });

    it(': list item with non-image file shows file type icon', () => {
      const files: UploadFile[] = [{ name: 'data.xlsx', url: 'https://example.com/data.xlsx', status: 'success' }];
      const { container } = render(<Upload theme="list" files={files} />);
      const icon = container.querySelector(`${name}__list-item-icon`);
      expect(icon).toBeTruthy();
    });

    it(': list item progress without percent shows uploadingText only', () => {
      const files: UploadFile[] = [
        { name: 'uploading.pdf', url: 'https://example.com/uploading.pdf', status: 'progress' },
      ];
      const { container } = render(<Upload theme="list" files={files} />);
      expect(container.querySelector(`${name}__list-item--progress`)).toBeTruthy();
    });

    it(': list item fail shows error text', () => {
      const files: UploadFile[] = [
        { name: 'bad.pdf', url: 'https://example.com/bad.pdf', status: 'fail', response: { error: 'network error' } },
      ];
      const { container } = render(<Upload theme="list" files={files} />);
      expect(container.querySelector(`${name}__list-item--fail`)).toBeTruthy();
    });

    it(': list item with size shows file size', () => {
      const files: UploadFile[] = [
        { name: 'doc.pdf', url: 'https://example.com/doc.pdf', status: 'success', size: 4096 },
      ];
      const { container } = render(<Upload theme="list" files={files} />);
      expect(container.querySelector(`${name}__list-item`)).toBeTruthy();
    });
  });

  describe('grid: non-image file rendering', () => {
    it(': renders file type icon for non-image file without url', () => {
      const files: UploadFile[] = [{ name: 'report.pdf', status: 'success', type: 'application/pdf' } as any];
      const { container } = render(<Upload files={files} />);
      const fileContent = container.querySelector(`${name}__file-content`);
      expect(fileContent).toBeTruthy();
      const fileIcon = container.querySelector(`${name}__file-icon`);
      expect(fileIcon).toBeTruthy();
    });

    it(': does not render file content for non-image file in progress status', () => {
      const files: UploadFile[] = [
        { name: 'report.pdf', status: 'progress', percent: 50, type: 'application/pdf' } as any,
      ];
      const { container } = render(<Upload files={files} />);
      const fileContent = container.querySelector(`${name}__file-content`);
      expect(fileContent).toBeFalsy();
    });

    it(': does not render file content for non-image file in fail status', () => {
      const files: UploadFile[] = [{ name: 'report.pdf', status: 'fail', type: 'application/pdf' } as any];
      const { container } = render(<Upload files={files} />);
      const fileContent = container.querySelector(`${name}__file-content`);
      expect(fileContent).toBeFalsy();
    });

    it(': renders file-name for non-image file', () => {
      const files: UploadFile[] = [{ name: 'my-doc.docx', status: 'success', type: 'application/msword' } as any];
      const { container } = render(<Upload files={files} />);
      const fileName = container.querySelector(`${name}__file-name`);
      expect(fileName?.textContent).toBe('my-doc.docx');
    });

    it(': file item has file class for non-image without url', () => {
      const files: UploadFile[] = [{ name: 'archive.zip', status: 'success', type: 'application/zip' } as any];
      const { container } = render(<Upload files={files} />);
      const fileItem = container.querySelector(`${name}__item--file`);
      expect(fileItem).toBeTruthy();
    });

    it(': onPreview for non-image file does not open ImageViewer', () => {
      const onPreview = vi.fn();
      const files: UploadFile[] = [{ name: 'report.pdf', status: 'success', type: 'application/pdf' } as any];
      const { container } = render(<Upload files={files} onPreview={onPreview} />);
      const fileContent = container.querySelector(`${name}__file-content`);
      if (fileContent) {
        fireEvent.click(fileContent);
        expect(onPreview).toHaveBeenCalled();
        // ImageViewer should not open for non-image files
        expect(container.querySelector('.t-image-viewer')).toBeFalsy();
      }
    });

    it(': file removeBtn per-file override', () => {
      const files: UploadFile[] = [
        { name: 'a.pdf', status: 'success', type: 'application/pdf', removeBtn: false } as any,
        { name: 'b.pdf', status: 'success', type: 'application/pdf' } as any,
      ];
      const { container } = render(<Upload files={files} removeBtn={true} />);
      const deleteBtns = container.querySelectorAll(`${name}__delete-btn`);
      // Only b.pdf should have delete button (a.pdf has removeBtn=false)
      expect(deleteBtns.length).toBe(1);
    });
  });

  describe('draggable', () => {
    const dragFiles: UploadFile[] = [
      { name: 'a.png', url: 'https://example.com/a.png', status: 'success' },
      { name: 'b.png', url: 'https://example.com/b.png', status: 'success' },
    ];

    it(': draggable adds draggable class and data-drag-key on items', () => {
      const { container } = render(<Upload draggable files={dragFiles} />);
      expect(container.querySelector(`${name}--draggable`)).toBeTruthy();
      const dragItems = container.querySelectorAll('[data-drag-key]');
      expect(dragItems.length).toBe(2);
      dragItems.forEach((el) => {
        expect(el.getAttribute('data-drag-key')).toBeTruthy();
      });
    });

    it(': non-draggable does not render data-drag-key', () => {
      const { container } = render(<Upload files={dragFiles} />);
      expect(container.querySelector(`${name}--draggable`)).toBeNull();
      expect(container.querySelectorAll('[data-drag-key]').length).toBe(0);
    });

    it(': onDrag fires on long press with file and index', () => {
      vi.useFakeTimers();
      const onDrag = vi.fn();
      const { container } = render(<Upload draggable files={dragFiles} onDrag={onDrag} />);
      const dragItems = container.querySelectorAll('[data-drag-key]');

      fireEvent.touchStart(dragItems[0], { touches: [{ clientX: 0, clientY: 0 }] });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onDrag).toHaveBeenCalledTimes(1);
      const ctx = onDrag.mock.calls[0][0];
      expect(ctx.index).toBe(0);
      expect(ctx.file.name).toBe('a.png');
      vi.useRealTimers();
    });

    it(': onDrag not fired when finger moves beyond threshold before long press', () => {
      vi.useFakeTimers();
      const onDrag = vi.fn();
      const { container } = render(<Upload draggable files={dragFiles} onDrag={onDrag} />);
      const dragItems = container.querySelectorAll('[data-drag-key]');

      fireEvent.touchStart(dragItems[0], { touches: [{ clientX: 0, clientY: 0 }] });
      // 长按定时器触发前手指滑动超过阈值，应判定为滚动而非拖拽
      fireEvent.touchMove(dragItems[0], { touches: [{ clientX: 50, clientY: 0 }] });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onDrag).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it(': onDrag not fired on non-draggable long press', () => {
      vi.useFakeTimers();
      const onDrag = vi.fn();
      const { container } = render(<Upload files={dragFiles} onDrag={onDrag} />);
      const item = container.querySelector(`${name}__item`) as HTMLElement;

      fireEvent.touchStart(item, { touches: [{ clientX: 0, clientY: 0 }] });
      act(() => {
        vi.advanceTimersByTime(300);
      });

      expect(onDrag).not.toHaveBeenCalled();
      vi.useRealTimers();
    });

    it(': onDrop fires with reordered files after drag and release', () => {
      vi.useFakeTimers();
      const onDrag = vi.fn();
      const onDrop = vi.fn();
      const { container } = render(<Upload draggable files={dragFiles} onDrag={onDrag} onDrop={onDrop} />);
      const dragEl = container.querySelectorAll('[data-drag-key]')[0];

      // 长按进入拖拽态
      fireEvent.touchStart(dragEl, { touches: [{ clientX: 0, clientY: 0 }] });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      expect(onDrag).toHaveBeenCalledTimes(1);

      // 将拖拽项移动到第二个位置，触发重排
      fireEvent.touchMove(dragEl, { touches: [{ clientX: 1, clientY: 0 }] });
      act(() => {
        vi.advanceTimersByTime(50);
      });

      // 释放，rAF 中提交排序结果并回调 onDrop
      fireEvent.touchEnd(dragEl, { changedTouches: [{ clientX: 1, clientY: 0 }] });
      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(onDrop).toHaveBeenCalledTimes(1);
      const newOrder = (onDrop.mock.calls[0][0] as UploadFile[]).map((f) => f.name);
      expect(newOrder).toEqual(['b.png', 'a.png']);
      vi.useRealTimers();
    });

    it(': onDrop not fired when released without moving', () => {
      vi.useFakeTimers();
      const onDrop = vi.fn();
      const { container } = render(<Upload draggable files={dragFiles} onDrop={onDrop} />);
      const dragEl = container.querySelectorAll('[data-drag-key]')[0];

      fireEvent.touchStart(dragEl, { touches: [{ clientX: 0, clientY: 0 }] });
      act(() => {
        vi.advanceTimersByTime(300);
      });
      // 未发生移动直接释放
      fireEvent.touchEnd(dragEl, { changedTouches: [{ clientX: 0, clientY: 0 }] });
      act(() => {
        vi.advanceTimersByTime(50);
      });

      expect(onDrop).not.toHaveBeenCalled();
      vi.useRealTimers();
    });
  });
});
