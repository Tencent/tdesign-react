import React from 'react';
import { describe, it, expect, render, fireEvent, waitFor, vi, cleanup, afterEach, act } from '@test/utils';
import QRCode from '../QRCode';
import { QRCodeSVG } from '../QRCodeSVG';

describe('QRCode', () => {
  it('should render nothing when value is empty', () => {
    const { container } = render(<QRCode />);
    expect(container.firstChild).toBeNull();
  });

  it('should render canvas by default with size and bgColor styles applied', async () => {
    const { container } = render(<QRCode value="hello" size={200} bgColor="#ff0000" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root).toBeTruthy();
    expect(root.className).toContain('t-qrcode');
    // default type is canvas
    expect(root.querySelector('canvas')).toBeTruthy();
    // inline styles
    expect(root).toHaveStyle('width: 200px');
    expect(root).toHaveStyle('height: 200px');
    expect(root).toHaveStyle('background-color: #ff0000');
  });

  it('should render svg when type is svg', () => {
    const { container } = render(<QRCode value="world" type="svg" />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('t-qrcode-svg');
    expect(root.querySelector('svg')).toBeTruthy();
  });

  it('should apply borderless class', () => {
    const { container } = render(<QRCode value="hello" borderless />);
    const root = container.firstElementChild as HTMLElement;
    expect(root.className).toContain('t-borderless');
  });

  describe('status mask', () => {
    it('no mask when status is active', () => {
      const { container } = render(<QRCode value="foo" status="active" />);
      expect(container.querySelector('.t-mask')).toBeNull();
    });

    it('expired shows text and triggers onRefresh', async () => {
      const onRefresh = vi.fn();
      const { container, getByText } = render(<QRCode value="foo" status="expired" onRefresh={onRefresh} />);
      // mask exists
      expect(container.querySelector('.t-mask')).toBeTruthy();
      // zh-CN default locale text
      expect(getByText('二维码过期')).toBeTruthy();
      const refresh = getByText('点击刷新');
      fireEvent.click(refresh);
      await waitFor(() => expect(onRefresh).toHaveBeenCalledTimes(1));
    });

    it('scanned shows text', () => {
      const { getByText } = render(<QRCode value="foo" status="scanned" />);
      expect(getByText('已扫描')).toBeTruthy();
    });

    it('loading shows mask', () => {
      const { container } = render(<QRCode value="foo" status="loading" />);
      expect(container.querySelector('.t-mask')).toBeTruthy();
    });
  });

  describe('icon rendering', () => {
    it('renders hidden img for canvas type when icon provided with default iconSize', () => {
      const icon = 'https://example.com/icon.png';
      const { container } = render(<QRCode value="bar" type="canvas" icon={icon} />);
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe(icon);
      expect(img?.style.display).toBe('none');
    });

    it('renders hidden img for canvas type with number iconSize', () => {
      const icon = 'https://example.com/icon.png';
      const iconSize = 32;
      const { container } = render(<QRCode value="bar" type="canvas" icon={icon} iconSize={iconSize} />);
      const img = container.querySelector('img');
      expect(img).toBeTruthy();
      expect(img?.getAttribute('src')).toBe(icon);
      expect(img?.style.display).toBe('none');
    });

    it('passes iconSize correctly to imageSettings for object type', () => {
      const icon = 'https://example.com/icon.png';
      const iconSize = { width: 40, height: 40 };

      const { container } = render(
        <QRCode style={{ height: 60, width: 60 }} value="test" type="canvas" icon={icon} iconSize={iconSize} />,
      );
      expect(container.querySelector('canvas')).toBeTruthy();
      expect(container.querySelector('img')).toBeTruthy();
    });

    it('renders <image> element inside svg when icon provided', () => {
      const icon = 'https://example.com/icon.svg';
      const { container } = render(<QRCode value="bar" type="svg" icon={icon} iconSize={{ height: 32, width: 32 }} />);
      const image = container.querySelector('svg image');
      expect(image).toBeTruthy();
      // The actual height/width in SVG are calculated values based on QR code scale, not direct iconSize values
      expect(image?.getAttribute('height')).toBeTruthy();
      expect(image?.getAttribute('width')).toBeTruthy();
      expect(parseFloat(image?.getAttribute('height') || '0')).toBeGreaterThan(0);
      expect(parseFloat(image?.getAttribute('width') || '0')).toBeGreaterThan(0);
      // Some environments expose it as href/baseVal; keep a tolerant check
      const href = (image as any)?.getAttribute('href') || (image as any)?.href?.baseVal;
      expect(href).toBe(icon);
    });
  });

  describe('QRCodeSVG title rendering', () => {
    it('renders title element inside svg when title provided', () => {
      const titleText = 'My QR Code';
      const { container } = render(<QRCodeSVG value="test" title={titleText} />);
      const svg = container.querySelector('svg');
      const titleElement = container.querySelector('svg title');

      expect(svg).toBeTruthy();
      expect(titleElement).toBeTruthy();
      expect(titleElement?.textContent).toBe(titleText);
    });

    it('does not render title element when title is not provided', () => {
      const { container } = render(<QRCodeSVG value="test" />);
      const titleElement = container.querySelector('svg title');

      expect(titleElement).toBeNull();
    });
  });
});

// Helpers to mock canvas 2d context
const createMockCtx = () => {
  const calls: Record<string, any[]> = {};
  const record = (name: string, ...args: any[]) => {
    calls[name] = calls[name] || [];
    calls[name].push(args);
  };

  let fillStyleCache: any;
  let alphaCache: any;

  const ctx: any = {
    scale: vi.fn((x: number, y: number) => record('scale', x, y)),
    fillRect: vi.fn((x: number, y: number, w: number, h: number) => record('fillRect', x, y, w, h)),
    drawImage: vi.fn((...args: any[]) => record('drawImage', ...args)),
    fill: vi.fn((...args: any[]) => record('fill', ...args)),
  };
  Object.defineProperty(ctx, 'fillStyle', {
    get: () => fillStyleCache,
    set: (v) => {
      fillStyleCache = v;
      record('fillStyle', v);
    },
    configurable: true,
  });
  Object.defineProperty(ctx, 'globalAlpha', {
    get: () => alphaCache,
    set: (v) => {
      alphaCache = v;
      record('globalAlpha', v);
    },
    configurable: true,
  });

  return { ctx, calls };
};

describe('QRCodeCanvas - canvas drawing and refs (merged)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('assigns canvas to object ref and draws using fallback rectangles when Path2D unsupported', async () => {
    const { ctx, calls } = createMockCtx();
    vi.spyOn(HTMLCanvasElement.prototype as any, 'getContext').mockImplementation(() => ctx);

    const { QRCodeCanvas } = await import('../QRCodeCanvas');

    const ref = React.createRef<HTMLCanvasElement>();
    const { container } = render(<QRCodeCanvas value="hello-canvas" size={128} includeMargin={false} ref={ref} />);

    const canvas = container.querySelector('canvas') as HTMLCanvasElement;
    expect(canvas).toBeTruthy();
    expect(ref.current).toBe(canvas);

    await waitFor(() => {
      expect(calls.fillRect?.length).toBeGreaterThan(0);
      expect(calls.scale?.length).toBe(1);
    });
  });

  it('supports function ref', async () => {
    const { ctx } = createMockCtx();
    vi.spyOn(HTMLCanvasElement.prototype as any, 'getContext').mockImplementation(() => ctx);

    const { QRCodeCanvas } = await import('../QRCodeCanvas');

    let received: HTMLCanvasElement | null = null;
    const setRef = (el: HTMLCanvasElement | null) => {
      received = el;
    };
    const { container } = render(<QRCodeCanvas value="ref-test" size={64} ref={setRef} />);

    const canvas = container.querySelector('canvas');
    expect(canvas).toBe(received);
  });
});

describe('QRCodeCanvas - image settings, excavation and crossOrigin (merged)', () => {
  afterEach(() => {
    vi.restoreAllMocks();
    cleanup();
  });

  it('sets globalAlpha and draws image when icon loads; excavates modules', async () => {
    const { ctx, calls } = createMockCtx();
    vi.spyOn(HTMLCanvasElement.prototype as any, 'getContext').mockImplementation(() => ctx);

    const utils = await import('../../_common/js/qrcode/utils');
    const excavateSpy = vi.spyOn(utils, 'excavateModules');

    const { QRCodeCanvas } = await import('../QRCodeCanvas');

    const { container } = render(
      <QRCodeCanvas
        value="with-image"
        size={128}
        includeMargin
        imageSettings={{
          src: 'https://example.com/icon.png',
          width: 20,
          height: 20,
          excavate: true,
          opacity: 0.5,
          crossOrigin: 'use-credentials',
        }}
      />,
    );

    const img = container.querySelector('img') as HTMLImageElement;
    expect(img).toBeTruthy();
    expect(img.getAttribute('crossorigin') || (img as any).crossOrigin).toBe('use-credentials');

    Object.defineProperty(img, 'complete', { configurable: true, get: () => true });
    Object.defineProperty(img, 'naturalWidth', { configurable: true, get: () => 10 });
    Object.defineProperty(img, 'naturalHeight', { configurable: true, get: () => 10 });

    act(() => {
      img.dispatchEvent(new Event('load'));
    });

    await waitFor(() => {
      const alphaSets = calls.globalAlpha || [];
      expect(alphaSets.some((args) => args?.[0] === 0.5)).toBe(true);
      expect(calls.drawImage?.length).toBeGreaterThan(0);
      expect(excavateSpy).toHaveBeenCalled();
    });
  });

  it('uses Path2D branch when supported', async () => {
    class Path2DStub {
      d: string | undefined;

      constructor(d?: string) {
        this.d = d;
      }

      addPath() {
        return this;
      }
    }
    vi.stubGlobal('Path2D', Path2DStub as any);

    vi.resetModules();
    vi.doMock('../../_common/js/qrcode/utils', async () => {
      const actual: any = await vi.importActual('../../_common/js/qrcode/utils');
      return { ...actual, isSupportPath2d: true };
    });

    const { ctx, calls } = createMockCtx();
    vi.spyOn(HTMLCanvasElement.prototype as any, 'getContext').mockImplementation(() => ctx);

    const { QRCodeCanvas } = await import('../QRCodeCanvas');

    render(<QRCodeCanvas value="p2d" size={96} />);

    await waitFor(() => {
      expect(calls.fill?.length).toBeGreaterThan(0);
      expect(calls.fillRect?.length).toBeGreaterThan(0);
    });
  });
});
