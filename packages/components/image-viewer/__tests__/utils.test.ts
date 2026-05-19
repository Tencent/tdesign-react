/**
 * utils.test.ts — 工具函数测试
 *
 * 测试 @tdesign/common-js/image-viewer/utils 中的导出函数：
 * - formatImages
 * - downloadImage（含跨域 canvasDownload 路径）
 */
import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import { downloadImage, formatImages } from '@tdesign/common-js/image-viewer/utils';
import { act } from '@test/utils';

// ─── formatImages ────────────────────────────────────────────────────────
describe('formatImages 图片格式化', () => {
  test('非数组输入返回空数组', () => {
    expect(formatImages(null as unknown as ImageInfo[])).toEqual([]);
    expect(formatImages(undefined as unknown as ImageInfo[])).toEqual([]);
    expect(formatImages('string' as unknown as ImageInfo[])).toEqual([]);
    expect(formatImages(123 as unknown as ImageInfo[])).toEqual([]);
  });

  test('空数组', () => {
    expect(formatImages([])).toEqual([]);
  });

  test('字符串数组：使用默认属性', () => {
    const images = ['image1.jpg', 'image2.png'];
    const result = formatImages(images);

    expect(result).toEqual([
      { mainImage: 'image1.jpg', thumbnail: 'image1.jpg', download: true },
      { mainImage: 'image2.png', thumbnail: 'image2.png', download: true },
    ]);
  });

  test('ImageInfo 对象：补全默认属性', () => {
    const images = [{ mainImage: 'main1.jpg' }, { mainImage: 'main2.jpg', thumbnail: 'thumb2.jpg' }];
    const result = formatImages(images);

    expect(result[0]).toEqual({ mainImage: 'main1.jpg', thumbnail: 'main1.jpg', download: true });
    expect(result[1]).toEqual({ mainImage: 'main2.jpg', thumbnail: 'thumb2.jpg', download: true });
  });

  test('自定义 download 设置被保留', () => {
    const images = [{ mainImage: 'main.jpg', download: false }];
    const result = formatImages(images);
    expect(result[0].download).toBeFalsy();
  });

  test('字符串与 ImageInfo 混合数组', () => {
    const images = ['string-image.jpg', { mainImage: 'object-main.jpg', thumbnail: 'object-thumb.jpg' }];
    const result = formatImages(images);

    expect(result).toEqual([
      { mainImage: 'string-image.jpg', thumbnail: 'string-image.jpg', download: true },
      { mainImage: 'object-main.jpg', thumbnail: 'object-thumb.jpg', download: true },
    ]);
  });

  test('File 对象作为图片输入', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = formatImages([file]);

    expect(result[0].mainImage).toBe(file);
    expect(result[0].thumbnail).toBe(file);
    expect(result[0].download).toBeTruthy();
  });

  test('ImageInfo 包含全部属性', () => {
    const images = [{ mainImage: 'main.jpg', thumbnail: 'thumb.jpg', download: true, isSvg: true }];
    const result = formatImages(images);
    expect(result[0]).toEqual({ mainImage: 'main.jpg', thumbnail: 'thumb.jpg', download: true, isSvg: true });
  });

  test('thumbnail 默认等于 mainImage', () => {
    const images = [{ mainImage: 'only-main.jpg' }];
    const result = formatImages(images);
    expect(result[0].thumbnail).toBe('only-main.jpg');
  });

  test('大数组处理（100 张图片）', () => {
    const images = Array.from({ length: 100 }, (_, i) => `image-${i}.jpg`);
    const result = formatImages(images);
    expect(result).toHaveLength(100);
    result.forEach((item, i) => {
      expect(item.mainImage).toBe(`image-${i}.jpg`);
      expect(item.thumbnail).toBe(`image-${i}.jpg`);
      expect(item.download).toBe(true);
    });
  });
});

// ─── downloadImage ───────────────────────────────────────────────────────
describe('downloadImage 图片下载', () => {
  let mockCreateObjectURL: ReturnType<typeof vi.fn>;
  let mockRevokeObjectURL: ReturnType<typeof vi.fn>;
  let mockCreateElement: typeof document.createElement;

  beforeEach(() => {
    vi.clearAllMocks();
    mockCreateObjectURL = vi.fn().mockReturnValue('blob:test');
    mockRevokeObjectURL = vi.fn();
    window.URL.createObjectURL = mockCreateObjectURL;
    window.URL.revokeObjectURL = mockRevokeObjectURL;
    mockCreateElement = document.createElement.bind(document);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('File 输入使用 URL.createObjectURL', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = { href: '', download: '', click: mockClick, remove: mockRemove };

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    const file = new File(['test'], 'test-image.png', { type: 'image/png' });
    downloadImage(file);

    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    expect(mockAnchor.download).toBe('test-image.png');
    expect(mockClick).toHaveBeenCalled();
  });

  test('同源 URL 直接下载', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = { href: '', download: '', click: mockClick, remove: mockRemove };

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    const sameOriginUrl = `${window.location.origin}/test-image.png`;
    downloadImage(sameOriginUrl);

    expect(mockAnchor.href).toBe(sameOriginUrl);
    expect(mockAnchor.download).toBe('test-image.png');
    expect(mockClick).toHaveBeenCalled();
  });

  test('从带查询参数的 URL 提取文件名', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = { href: '', download: '', click: mockClick, remove: mockRemove };

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    const urlWithParams = `${window.location.origin}/path/image.png?sign=xxx&token=yyy`;
    downloadImage(urlWithParams);
    expect(mockAnchor.download).toBe('image.png');
  });

  test('从带 hash 的 URL 提取文件名', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = { href: '', download: '', click: mockClick, remove: mockRemove };

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    const urlWithHash = `${window.location.origin}/path/image.jpg#section`;
    downloadImage(urlWithHash);
    expect(mockAnchor.download).toBe('image.jpg');
  });

  test('跨域 URL 触发 canvasDownload 路径', () => {
    const crossOriginUrl = 'https://cross-origin.example.com/photo.jpg';

    const setAttribute = vi.fn();
    const mockImage: Partial<HTMLImageElement> = { setAttribute };
    const ImageSpy = vi.fn().mockImplementation(() => mockImage);
    (global as any).Image = ImageSpy;

    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = { href: '', download: '', click: mockClick, remove: mockRemove };
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    downloadImage(crossOriginUrl);

    expect(setAttribute).toHaveBeenCalledWith('crossOrigin', 'anonymous');
    expect(mockImage.src).toBe(crossOriginUrl);
    expect(mockClick).not.toHaveBeenCalled();
  });

  test('跨域图片 onload 后触发 canvas 下载', () => {
    const crossOriginUrl = 'https://cross-origin.example.com/photo.png';

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toBlob: vi.fn().mockImplementation((cb) => cb(new Blob())),
    };

    let onloadFn: (() => void) | null = null;
    const mockImage: Partial<HTMLImageElement> & { width: number; height: number } = {
      setAttribute: vi.fn(),
      width: 100,
      height: 80,
    };
    Object.defineProperty(mockImage, 'onload', {
      set(fn) {
        onloadFn = fn;
      },
    });

    const ImageSpy = vi.fn().mockImplementation(() => mockImage);
    (global as any).Image = ImageSpy;

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'canvas') return mockCanvas as unknown as HTMLCanvasElement;
      return mockCreateElement(tag);
    });

    const mockBlobClick = vi.fn();
    const mockBlobAnchor = { href: '', download: '', click: mockBlobClick, remove: vi.fn() };
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'canvas') return mockCanvas as unknown as HTMLCanvasElement;
      if (tag === 'a') return mockBlobAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    downloadImage(crossOriginUrl);

    expect(onloadFn).toBeTruthy();
    act(() => {
      onloadFn?.();
    });

    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockCanvas.toBlob).toHaveBeenCalled();
  });

  test('URL 无文件名时使用随机名称', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = { href: '', download: '', click: mockClick, remove: mockRemove };

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    const urlNoFilename = `${window.location.origin}/`;
    downloadImage(urlNoFilename);
    expect(mockAnchor.download).toBeTruthy();
    expect(mockClick).toHaveBeenCalled();
  });

  test('URL 含多个 / 和复杂路径时正确提取文件名', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = { href: '', download: '', click: mockClick, remove: mockRemove };

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    const deepUrl = `${window.location.origin}/a/b/c/deep-image.png`;
    downloadImage(deepUrl);
    expect(mockAnchor.download).toBe('deep-image.png');
  });

  test('File 对象下载后调用 revokeObjectURL', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = { href: '', download: '', click: mockClick, remove: mockRemove };

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    const file = new File(['test'], 'photo.jpg', { type: 'image/jpeg' });
    downloadImage(file);

    expect(mockCreateObjectURL).toHaveBeenCalledWith(file);
    expect(mockClick).toHaveBeenCalled();
    // revokeObjectURL is called after click, need to verify
    expect(mockRevokeObjectURL).toHaveBeenCalled();
  });

  test('跨域 URL jpg 扩展名使用 image/jpeg mime', () => {
    const crossOriginUrl = 'https://other.com/photo.jpg';

    let onloadFn: (() => void) | null = null;
    const mockImage: Partial<HTMLImageElement> & { width: number; height: number } = {
      setAttribute: vi.fn(),
      width: 100,
      height: 100,
    };
    Object.defineProperty(mockImage, 'onload', {
      set(fn) {
        onloadFn = fn;
      },
    });
    const ImageSpy = vi.fn().mockImplementation(() => mockImage);
    (global as any).Image = ImageSpy;

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toBlob: vi.fn(),
    };

    const mockBlobClick = vi.fn();
    const mockBlobAnchor = { href: '', download: '', click: mockBlobClick, remove: vi.fn() };
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'canvas') return mockCanvas as unknown as HTMLCanvasElement;
      if (tag === 'a') return mockBlobAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    downloadImage(crossOriginUrl);

    expect(onloadFn).toBeTruthy();
    act(() => {
      onloadFn?.();
    });

    // toBlob should be called with jpeg mime for .jpg extension
    expect(mockCanvas.toBlob).toHaveBeenCalledWith(expect.any(Function), 'image/jpeg');
  });
});

// ─── 快照测试 ────────────────────────────────────────────────────────────
describe('formatImages 快照', () => {
  test('字符串数组快照', () => {
    const result = formatImages(['img1.jpg', 'img2.png', 'img3.gif']);
    expect(result).toMatchSnapshot('formatImages-string-array');
  });

  test('ImageInfo 对象数组快照', () => {
    const result = formatImages([
      { mainImage: 'main1.jpg', thumbnail: 'thumb1.jpg', download: true },
      { mainImage: 'main2.jpg', download: false, isSvg: true },
    ]);
    expect(result).toMatchSnapshot('formatImages-image-info-array');
  });

  test('混合数组快照', () => {
    const result = formatImages(['simple.jpg', { mainImage: 'complex.jpg', thumbnail: 'complex-thumb.jpg' }]);
    expect(result).toMatchSnapshot('formatImages-mixed-array');
  });

  test('空数组快照', () => {
    expect(formatImages([])).toMatchSnapshot('formatImages-empty');
  });
});
