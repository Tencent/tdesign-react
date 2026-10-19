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

import type { ImageInfo } from '../type';

// ─── formatImages ────────────────────────────────────────────────────────
describe('formatImages', () => {
  test('images[invalid]', () => {
    expect(formatImages(null as unknown as ImageInfo[])).toEqual([]);
    expect(formatImages(undefined as unknown as ImageInfo[])).toEqual([]);
    expect(formatImages('string' as unknown as ImageInfo[])).toEqual([]);
    expect(formatImages(123 as unknown as ImageInfo[])).toEqual([]);
  });

  test('images[empty]', () => {
    expect(formatImages([])).toEqual([]);
  });

  test('images[array<string>]', () => {
    const images = ['image1.jpg', 'image2.png'];
    const result = formatImages(images);

    expect(result).toEqual([
      { mainImage: 'image1.jpg', thumbnail: 'image1.jpg', download: true },
      { mainImage: 'image2.png', thumbnail: 'image2.png', download: true },
    ]);
  });

  test('images[array<ImageInfo>]', () => {
    const images = [{ mainImage: 'main1.jpg' }, { mainImage: 'main2.jpg', thumbnail: 'thumb2.jpg' }];
    const result = formatImages(images);

    expect(result[0]).toEqual({
      mainImage: 'main1.jpg',
      thumbnail: 'main1.jpg',
      download: true,
    });
    expect(result[1]).toEqual({
      mainImage: 'main2.jpg',
      thumbnail: 'thumb2.jpg',
      download: true,
    });
  });

  test('download', () => {
    const images = [{ mainImage: 'main.jpg', download: false }];
    const result = formatImages(images);
    expect(result[0].download).toBeFalsy();
  });

  test('images[array<string | ImageInfo>]', () => {
    const images = ['string-image.jpg', { mainImage: 'object-main.jpg', thumbnail: 'object-thumb.jpg' }];
    const result = formatImages(images);

    expect(result).toEqual([
      {
        mainImage: 'string-image.jpg',
        thumbnail: 'string-image.jpg',
        download: true,
      },
      {
        mainImage: 'object-main.jpg',
        thumbnail: 'object-thumb.jpg',
        download: true,
      },
    ]);
  });

  test('images[array<File>]', () => {
    const file = new File(['test'], 'test.png', { type: 'image/png' });
    const result = formatImages([file]);

    expect(result[0].mainImage).toBe(file);
    expect(result[0].thumbnail).toBe(file);
    expect(result[0].download).toBeTruthy();
  });

  test('ImageInfo', () => {
    const images = [
      {
        mainImage: 'main.jpg',
        thumbnail: 'thumb.jpg',
        download: true,
        isSvg: true,
      },
    ];
    const result = formatImages(images);
    expect(result[0]).toEqual({
      mainImage: 'main.jpg',
      thumbnail: 'thumb.jpg',
      download: true,
      isSvg: true,
    });
  });

  test('thumbnail', () => {
    const images = [{ mainImage: 'only-main.jpg' }];
    const result = formatImages(images);
    expect(result[0].thumbnail).toBe('only-main.jpg');
  });

  test('large image list', () => {
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

  test('source[File]', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
      remove: mockRemove,
    };

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

  test('source supports same-origin URLs', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
      remove: mockRemove,
    };

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

  test('filename strips the URL query', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
      remove: mockRemove,
    };

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    const urlWithParams = `${window.location.origin}/path/image.png?sign=xxx&token=yyy`;
    downloadImage(urlWithParams);
    expect(mockAnchor.download).toBe('image.png');
  });

  test('filename strips the URL hash', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
      remove: mockRemove,
    };

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    const urlWithHash = `${window.location.origin}/path/image.jpg#section`;
    downloadImage(urlWithHash);
    expect(mockAnchor.download).toBe('image.jpg');
  });

  test('source supports cross-origin URLs', () => {
    const crossOriginUrl = 'https://cross-origin.example.com/photo.jpg';

    const setAttribute = vi.fn();
    const mockImage: Partial<HTMLImageElement> = { setAttribute };
    const ImageSpy = vi.fn().mockImplementation(() => mockImage);
    (global as any).Image = ImageSpy;

    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
      remove: mockRemove,
    };
    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    downloadImage(crossOriginUrl);

    expect(setAttribute).toHaveBeenCalledWith('crossOrigin', 'anonymous');
    expect(mockImage.src).toBe(crossOriginUrl);
    expect(mockClick).not.toHaveBeenCalled();
  });

  test('canvasDownload', () => {
    const crossOriginUrl = 'https://cross-origin.example.com/photo.png';

    const mockCanvas = {
      width: 0,
      height: 0,
      getContext: vi.fn().mockReturnValue({ drawImage: vi.fn() }),
      toBlob: vi.fn().mockImplementation((cb) => cb(new Blob())),
    };

    let onloadFn: (() => void) | null = null;
    const mockImage: Partial<HTMLImageElement> & {
      width: number;
      height: number;
    } = {
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
    const mockBlobAnchor = {
      href: '',
      download: '',
      click: mockBlobClick,
      remove: vi.fn(),
    };
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

  test('filename handles a missing basename', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
      remove: mockRemove,
    };

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    const urlNoFilename = `${window.location.origin}/`;
    downloadImage(urlNoFilename);
    expect(mockAnchor.download).toBeTruthy();
    expect(mockClick).toHaveBeenCalled();
  });

  test('filename extracts the nested path basename', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
      remove: mockRemove,
    };

    vi.spyOn(document, 'createElement').mockImplementation((tag) => {
      if (tag === 'a') return mockAnchor as unknown as HTMLAnchorElement;
      return mockCreateElement(tag);
    });

    const deepUrl = `${window.location.origin}/a/b/c/deep-image.png`;
    downloadImage(deepUrl);
    expect(mockAnchor.download).toBe('deep-image.png');
  });

  test('revokeObjectURL', () => {
    const mockClick = vi.fn();
    const mockRemove = vi.fn();
    const mockAnchor = {
      href: '',
      download: '',
      click: mockClick,
      remove: mockRemove,
    };

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

  test('mimeType infers JPEG from the extension', () => {
    const crossOriginUrl = 'https://other.com/photo.jpg';

    let onloadFn: (() => void) | null = null;
    const mockImage: Partial<HTMLImageElement> & {
      width: number;
      height: number;
    } = {
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
    const mockBlobAnchor = {
      href: '',
      download: '',
      click: mockBlobClick,
      remove: vi.fn(),
    };
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
describe('formatImages snapshots', () => {
  test('images[array<string>]', () => {
    const result = formatImages(['img1.jpg', 'img2.png', 'img3.gif']);
    expect(result).toMatchSnapshot('formatImages-string-array');
  });

  test('images[array<ImageInfo>]', () => {
    const result = formatImages([
      { mainImage: 'main1.jpg', thumbnail: 'thumb1.jpg', download: true },
      { mainImage: 'main2.jpg', download: false, isSvg: true },
    ]);
    expect(result).toMatchSnapshot('formatImages-image-info-array');
  });

  test('images[array<string | ImageInfo>]', () => {
    const result = formatImages(['simple.jpg', { mainImage: 'complex.jpg', thumbnail: 'complex-thumb.jpg' }]);
    expect(result).toMatchSnapshot('formatImages-mixed-array');
  });

  test('empty images skip downloading', () => {
    expect(formatImages([])).toMatchSnapshot('formatImages-empty');
  });
});
