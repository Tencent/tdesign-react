/**
 * utils.test.ts — 工具函数测试
 *
 * 测试 @tdesign/common-js/image-viewer/utils 中的导出函数：
 * - formatImages
 * - downloadImage（含跨域 canvasDownload 路径）
 */
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act } from '@test/utils';
import { formatImages, downloadImage } from '@tdesign/common-js/image-viewer/utils';

// ─── formatImages ────────────────────────────────────────────────────────
describe('formatImages', () => {
  it('non-array input returns empty array', () => {
    expect(formatImages(null)).toEqual([]);
    expect(formatImages(undefined)).toEqual([]);
    // @ts-expect-error testing invalid input
    expect(formatImages('string')).toEqual([]);
    // @ts-expect-error testing invalid input
    expect(formatImages(123)).toEqual([]);
  });

  it('empty array', () => {
    expect(formatImages([])).toEqual([]);
  });

  it('string images with default properties', () => {
    const images = ['image1.jpg', 'image2.png'];
    const result = formatImages(images);

    expect(result).toEqual([
      { mainImage: 'image1.jpg', thumbnail: 'image1.jpg', download: true },
      { mainImage: 'image2.png', thumbnail: 'image2.png', download: true },
    ]);
  });

  it('ImageInfo objects with defaults', () => {
    const images = [{ mainImage: 'main1.jpg' }, { mainImage: 'main2.jpg', thumbnail: 'thumb2.jpg' }];
    const result = formatImages(images);

    expect(result[0]).toEqual({ mainImage: 'main1.jpg', thumbnail: 'main1.jpg', download: true });
    expect(result[1]).toEqual({ mainImage: 'main2.jpg', thumbnail: 'thumb2.jpg', download: true });
  });

  it('custom download setting preserved', () => {
    const images = [{ mainImage: 'main.jpg', download: false }];
    const result = formatImages(images);
    expect(result[0].download).toBeFalsy();
  });

  it('mixed string and ImageInfo array', () => {
    const images = ['string-image.jpg', { mainImage: 'object-main.jpg', thumbnail: 'object-thumb.jpg' }];
    const result = formatImages(images);

    expect(result).toEqual([
      { mainImage: 'string-image.jpg', thumbnail: 'string-image.jpg', download: true },
      { mainImage: 'object-main.jpg', thumbnail: 'object-thumb.jpg', download: true },
    ]);
  });

  it('File objects in images', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = formatImages([file]);

    expect(result[0].mainImage).toBe(file);
    expect(result[0].thumbnail).toBe(file);
    expect(result[0].download).toBeTruthy();
  });

  it('ImageInfo with all properties', () => {
    const images = [{ mainImage: 'main.jpg', thumbnail: 'thumb.jpg', download: true, isSvg: true }];
    const result = formatImages(images);
    expect(result[0]).toEqual({ mainImage: 'main.jpg', thumbnail: 'thumb.jpg', download: true, isSvg: true });
  });

  it('thumbnail defaults to mainImage', () => {
    const images = [{ mainImage: 'only-main.jpg' }];
    const result = formatImages(images);
    expect(result[0].thumbnail).toBe('only-main.jpg');
  });

  it('large array of images', () => {
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
describe('downloadImage', () => {
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

  it('File input uses URL.createObjectURL', () => {
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

  it('same-origin URL direct download', () => {
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

  it('extracts filename from URL with query parameters', () => {
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

  it('extracts filename from URL with hash', () => {
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

  it('cross-origin URL triggers canvasDownload (Image load path)', () => {
    // 跨域 URL 进入 canvasDownload 分支，创建 Image 元素
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

    // 应该新建 Image 并通过 setAttribute 设置 crossOrigin
    expect(setAttribute).toHaveBeenCalledWith('crossOrigin', 'anonymous');
    expect(mockImage.src).toBe(crossOriginUrl);
    // click 不会被触发（图片还未 onload）
    expect(mockClick).not.toHaveBeenCalled();
  });

  it('cross-origin image onload triggers canvas download', () => {
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

    // 触发 onload
    expect(onloadFn).toBeTruthy();
    act(() => {
      onloadFn?.();
    });

    expect(mockCanvas.getContext).toHaveBeenCalledWith('2d');
    expect(mockCanvas.toBlob).toHaveBeenCalled();
  });

  it('random name when URL has no filename', () => {
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
});

// ─── 快照测试 ────────────────────────────────────────────────────────────
describe('formatImages snapshots', () => {
  it('string images snapshot', () => {
    const result = formatImages(['img1.jpg', 'img2.png', 'img3.gif']);
    expect(result).toMatchSnapshot('formatImages-string-array');
  });

  it('ImageInfo objects snapshot', () => {
    const result = formatImages([
      { mainImage: 'main1.jpg', thumbnail: 'thumb1.jpg', download: true },
      { mainImage: 'main2.jpg', download: false, isSvg: true },
    ]);
    expect(result).toMatchSnapshot('formatImages-image-info-array');
  });

  it('mixed array snapshot', () => {
    const result = formatImages(['simple.jpg', { mainImage: 'complex.jpg', thumbnail: 'complex-thumb.jpg' }]);
    expect(result).toMatchSnapshot('formatImages-mixed-array');
  });

  it('empty array snapshot', () => {
    expect(formatImages([])).toMatchSnapshot('formatImages-empty');
  });
});
