import React from 'react';
import { act, fireEvent, mockDelay, mockTimeout, render, vi, waitFor } from '@test/utils';
import userEvent from '@testing-library/user-event';

import { ImageViewer } from '../index';

const imgUrl = 'https://tdesign.gtimg.com/demo/demo-image-1.png';
const imgUrl2 = 'https://tdesign.gtimg.com/demo/demo-image-2.png';
const imgUrl3 = 'https://tdesign.gtimg.com/demo/demo-image-3.png';

describe('ImageViewer 组件测试', () => {
  const triggerText = '预览单张图片';

  test('基本渲染和关闭', async () => {
    const onClose = vi.fn();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} onClose={onClose} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    const imgContainer = document.querySelector('.t-image-viewer-preview-image');
    expect(imgContainer).toBeNull();

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    expect(onClose).toHaveBeenCalledTimes(0);
    const imgModal = document.querySelector('.t-image-viewer__modal-pic');
    expect(imgModal).toBeTruthy();

    const closeBtn = document.querySelector('.t-image-viewer__modal-close-bt');
    act(() => {
      fireEvent.click(closeBtn);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
    await mockTimeout(() => expect(document.querySelector('.t-image-viewer-preview-image')).toBeNull());
  });

  test('trigger 为非函数', async () => {
    const BasicImageViewer = () => {
      const trigger = <span>{triggerText}</span>;
      return <ImageViewer trigger={trigger} />;
    };
    const { getByText } = render(<BasicImageViewer />);
    expect(getByText(triggerText)).toBeTruthy();
  });

  test('attach 默认为 body', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    const imgContainer = document.body.querySelector('.t-image-viewer-preview-image');
    expect(imgContainer).toBeNull();

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    const imgModal = document.body.querySelector('.t-image-viewer__modal-pic');
    expect(imgModal).toBeTruthy();
  });

  test('attach 为函数', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} attach={() => document.body} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    const imgContainer = document.body.querySelector('.t-image-viewer-preview-image');
    expect(imgContainer).toBeNull();

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    act(() => {
      const imgModal = document.body.querySelector('.t-image-viewer__modal-pic');
      expect(imgModal).toBeTruthy();
    });
  });
});

describe('ImageViewerMini 组件测试', () => {
  const triggerText = '预览单张图片';

  test('modeless 模式', async () => {
    const onClose = vi.fn();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} onClose={onClose} mode="modeless" />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    const miniFooter = await waitFor(() => document.querySelector('.t-image-viewer-mini__footer'));
    expect(miniFooter).toBeTruthy();

    const closeBtn = await waitFor(() => document.querySelector('.t-icon-close'));
    act(() => {
      fireEvent.click(closeBtn);
    });
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

describe('ImageViewerModal 组件测试', () => {
  const triggerText = '预览单张图片';

  test('键盘操作和遮罩关闭', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const onIndexChange = vi.fn();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return (
        <ImageViewer
          trigger={trigger}
          images={[imgUrl, imgUrl2]}
          onClose={onClose}
          onIndexChange={onIndexChange}
          closeOnOverlay={true}
        />
      );
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await user.type(document.body, '{ArrowRight}');
    expect(onIndexChange).toHaveBeenCalledTimes(1);

    await user.type(document.body, '{ArrowLeft}');
    expect(onIndexChange).toHaveBeenCalledTimes(2);

    await user.type(document.body, '{Escape}');
    expect(onClose).toHaveBeenCalledTimes(1);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });
    const mask = await waitFor(() => document.querySelector('.t-image-viewer__modal-mask'));
    act(() => {
      fireEvent.click(mask);
    });
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  test('弹窗关闭后键盘事件失效', async () => {
    const user = userEvent.setup();
    const onIndexChange = vi.fn();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2]} onIndexChange={onIndexChange} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });
    await user.type(document.body, '{ArrowRight}');
    expect(onIndexChange).toHaveBeenCalledTimes(1);

    await user.type(document.body, '{Escape}');

    await user.type(document.body, '{ArrowRight}');
    await user.type(document.body, '{ArrowLeft}');
    expect(onIndexChange).toHaveBeenCalledTimes(1);
  });

  test('单图操作（缩放/旋转/重置）', async () => {
    const user = userEvent.setup();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    const img = document.querySelector('.t-image-viewer__modal-image');
    expect(getComputedStyle(img).transform).toBe('rotateZ(0deg) scale(1)');

    await user.type(document.body, '{ArrowUp}');
    expect(getComputedStyle(img).transform).toBe('rotateZ(0deg) scale(1.2)');

    await user.type(document.body, '{ArrowDown}');
    expect(getComputedStyle(img).transform).toBe('rotateZ(0deg) scale(1)');

    const rotateIcon = await waitFor(() => document.querySelector('.t-icon-rotation'));
    act(() => {
      fireEvent.click(rotateIcon);
    });
    expect(getComputedStyle(img).transform).toBe('rotateZ(-90deg) scale(1)');

    const resetIcon = await waitFor(() => document.querySelector('.t-icon-image'));
    act(() => {
      fireEvent.click(resetIcon);
    });
    expect(getComputedStyle(img).transform).toBe('rotateZ(0deg) scale(1)');
  });

  test('自定义关闭按钮', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} closeBtn={<span>closeBtn</span>} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });
    expect(getByText('closeBtn')).toBeTruthy();
  });

  test('closeOnEscKeydown 为 false', async () => {
    const user = userEvent.setup();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2]} closeOnEscKeydown={false} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });
    expect(document.querySelector('.t-image-viewer-preview-image')).toBeInTheDocument();

    await user.type(document.body, '{Escape}');
    await mockDelay(300);
    expect(document.querySelector('.t-image-viewer-preview-image')).toBeInTheDocument();
  });

  test('imageScale defaultScale 正常范围', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return (
        <ImageViewer
          trigger={trigger}
          images={[imgUrl, imgUrl2]}
          imageScale={{
            max: 3,
            min: 0.5,
            step: 0.5,
            defaultScale: 2,
          }}
        />
      );
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();

    expect(document.querySelector('.t-image-viewer__modal-image')).toBeInTheDocument();
    expect(document.querySelector('.t-image-viewer__modal-image')).toHaveStyle({
      transform: 'rotateZ(0deg) scale(2)',
    });
  });

  test('imageScale defaultScale 超过 max 被截断', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return (
        <ImageViewer
          trigger={trigger}
          images={[imgUrl, imgUrl2]}
          imageScale={{
            max: 3,
            min: 0.5,
            step: 0.5,
            defaultScale: 3.5,
          }}
        />
      );
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();

    expect(document.querySelector('.t-image-viewer__modal-image')).toBeInTheDocument();
    expect(document.querySelector('.t-image-viewer__modal-image')).toHaveStyle({
      transform: 'rotateZ(0deg) scale(3)',
    });
  });

  test('imageScale defaultScale 低于 min 被截断', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return (
        <ImageViewer
          trigger={trigger}
          images={[imgUrl, imgUrl2]}
          imageScale={{
            max: 3,
            min: 2.5,
            step: 0.5,
            defaultScale: 2,
          }}
        />
      );
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();

    expect(document.querySelector('.t-image-viewer__modal-image')).toBeInTheDocument();
    expect(document.querySelector('.t-image-viewer__modal-image')).toHaveStyle({
      transform: 'rotateZ(0deg) scale(2.5)',
    });
  });

  test('imageScale max 意外小于 min 时使用 min', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return (
        <ImageViewer
          trigger={trigger}
          images={[imgUrl, imgUrl2]}
          imageScale={{
            max: 2,
            min: 2.5,
            step: 0.5,
            defaultScale: 2,
          }}
        />
      );
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();

    expect(document.querySelector('.t-image-viewer__modal-image')).toBeInTheDocument();
    expect(document.querySelector('.t-image-viewer__modal-image')).toHaveStyle({
      transform: 'rotateZ(0deg) scale(2.5)',
    });
  });

  test('imageReferrerpolicy 属性', async () => {
    const referrerPolicy = 'strict-origin-when-cross-origin';

    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2]} imageReferrerpolicy={referrerPolicy} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();

    expect(document.querySelector('.t-image-viewer__modal-image')?.getAttribute('referrerpolicy')).toBe(referrerPolicy);
  });
});

// ─── 快照测试 ─────────────────────────────────────────────────────────────────
describe('ImageViewer 快照测试', () => {
  const triggerText = '预览单张图片';

  test('单张图片默认状态', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();
    expect(document.body).toMatchSnapshot('image-viewer-single-image-default');
  });

  test('多张图片默认状态', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2, imgUrl3]} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();
    expect(document.body).toMatchSnapshot('image-viewer-multi-image-default');
  });

  test('自定义关闭按钮', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} closeBtn={<span className="custom-close">✕</span>} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();
    expect(document.body).toMatchSnapshot('image-viewer-custom-close-btn');
  });

  test('关闭按钮为 false', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} closeBtn={false} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();
    expect(document.body).toMatchSnapshot('image-viewer-close-btn-disabled');
  });

  test('无遮罩层', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} showOverlay={false} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();
    expect(document.body).toMatchSnapshot('image-viewer-no-overlay');
  });

  test('不可拖拽', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} draggable={false} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();
    expect(document.body).toMatchSnapshot('image-viewer-not-draggable');
  });

  test('自定义 imageScale 配置', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return (
        <ImageViewer
          trigger={trigger}
          images={[imgUrl, imgUrl2]}
          imageScale={{
            max: 3,
            min: 0.5,
            step: 0.5,
            defaultScale: 2,
          }}
        />
      );
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();
    expect(document.body).toMatchSnapshot('image-viewer-custom-scale-config');
  });

  test('modeless 模式', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} mode="modeless" />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();
    expect(document.body).toMatchSnapshot('image-viewer-modeless');
  });

  test('modeless 模式切换图片', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2]} mode="modeless" />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    const user = userEvent.setup();
    await user.type(document.body, '{ArrowRight}');
    await mockDelay();

    expect(document.body).toMatchSnapshot('image-viewer-modeless-second-image');
  });

  test('自定义 title', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2]} title="自定义标题" />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();
    expect(document.body).toMatchSnapshot('image-viewer-custom-title');
  });

  test('attach 到指定容器', async () => {
    const customContainer = document.createElement('div');
    customContainer.id = 'custom-attach-container';
    document.body.appendChild(customContainer);

    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} attach={() => customContainer} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });

    await mockDelay();
    expect(customContainer).toMatchSnapshot('image-viewer-attach-custom-container');

    document.body.removeChild(customContainer);
  });

  test('DefaultTrigger 默认触发器', async () => {
    const { container } = render(<ImageViewer images={[imgUrl]} />);
    await mockDelay();
    expect(container).toMatchSnapshot('image-viewer-default-trigger');
  });

  test('DefaultTrigger 多张图片默认触发器', async () => {
    const { container } = render(<ImageViewer images={[imgUrl, imgUrl2, imgUrl3]} />);
    await mockDelay();
    expect(container).toMatchSnapshot('image-viewer-default-trigger-multi');
  });
});

describe('ImageViewerModal 滚轮向中心缩放', () => {
  const fireWheelEvent = (deltaY: number) => {
    act(() => {
      document.dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true }));
    });
  };

  const parseTranslate = (style: string) => {
    const match = style.match(/translate\(([-\d.]+)px,\s*([-\d.]+)px\)/);
    return match ? { x: parseFloat(match[1]), y: parseFloat(match[2]) } : { x: 0, y: 0 };
  };

  test('图片超出视口时缩小触发向中心路径', async () => {
    const transformModule = await import('@tdesign/common-js/image-viewer/transform');
    const exceedsSpy = vi.spyOn(transformModule, 'isImageExceedsViewport').mockReturnValue(false);

    const triggerText = '预览图片';
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} imageScale={{ max: 2, min: 0.5, step: 0.5 }} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });
    await mockDelay();

    const modalBox = document.querySelector('.t-image-viewer__modal-box') as HTMLElement;
    expect(modalBox).toBeTruthy();

    fireWheelEvent(-120);
    fireWheelEvent(-120);
    await mockDelay();

    const scaleText = document.querySelector('.t-image-viewer__utils-scale')?.textContent;
    expect(scaleText).toBe('200%');

    exceedsSpy.mockReturnValue(true);
    exceedsSpy.mockClear();

    fireWheelEvent(120);
    await mockDelay();

    expect(exceedsSpy).toHaveBeenCalled();

    const scaleTextAfter = document.querySelector('.t-image-viewer__utils-scale')?.textContent;
    expect(scaleTextAfter).toBe('150%');

    const translateAfter = parseTranslate(modalBox.style.transform);
    expect(translateAfter).toEqual({ x: 0, y: 0 });

    exceedsSpy.mockRestore();
  });

  test('图片在视口内时缩小走普通路径', async () => {
    const transformModule = await import('@tdesign/common-js/image-viewer/transform');
    const exceedsSpy = vi.spyOn(transformModule, 'isImageExceedsViewport').mockReturnValue(false);

    const triggerText = '预览图片2';
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} imageScale={{ max: 2, min: 0.5, step: 0.5 }} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });
    await mockDelay();

    const modalBox = document.querySelector('.t-image-viewer__modal-box') as HTMLElement;
    const translateBefore = parseTranslate(modalBox.style.transform);

    exceedsSpy.mockClear();

    fireWheelEvent(120);
    await mockDelay();

    expect(exceedsSpy).toHaveBeenCalled();

    const translateAfter = parseTranslate(modalBox.style.transform);
    expect(translateAfter).toEqual(translateBefore);

    exceedsSpy.mockRestore();
  });

  test('滚轮放大时走 onZoomIn 普通路径', async () => {
    const triggerText = '放大路径测试';
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} imageScale={{ max: 2, min: 0.5, step: 0.5 }} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });
    await mockDelay();

    const scaleText = document.querySelector('.t-image-viewer__utils-scale')?.textContent;
    expect(scaleText).toBe('100%');

    fireWheelEvent(-120);
    await mockDelay();

    const scaleTextAfter = document.querySelector('.t-image-viewer__utils-scale')?.textContent;
    expect(scaleTextAfter).toBe('150%');
  });

  test('滚轮事件调用 preventDefault', async () => {
    const triggerText = 'preventDefault测试';
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} />;
    };
    const { getByText } = render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(getByText(triggerText));
    });
    await mockDelay();

    const wheelEvent = new WheelEvent('wheel', { deltaY: -120, bubbles: true, cancelable: true });
    const preventDefaultSpy = vi.spyOn(wheelEvent, 'preventDefault');

    act(() => {
      document.dispatchEvent(wheelEvent);
    });

    expect(preventDefaultSpy).toHaveBeenCalled();

    preventDefaultSpy.mockRestore();
  });
});

describe('ImageViewerModal 向中心缩放动画', () => {
  const fireWheelEvent = (deltaY: number) => {
    act(() => {
      document.dispatchEvent(new WheelEvent('wheel', { deltaY, bubbles: true, cancelable: true }));
    });
  };

  const TRANSITIONING_CLASS = 't-image-viewer__modal-box--transitioning';

  test('向中心缩放时添加 transitioning class', async () => {
    const transformModule = await import('@tdesign/common-js/image-viewer/transform');
    const exceedsSpy = vi.spyOn(transformModule, 'isImageExceedsViewport').mockReturnValue(false);

    const triggerText = '动画测试1';
    render(
      <ImageViewer
        trigger={({ open }) => <span onClick={() => open()}>{triggerText}</span>}
        images={[imgUrl]}
        imageScale={{ max: 2, min: 0.5, step: 0.5 }}
      />,
    );

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    fireWheelEvent(-120);
    fireWheelEvent(-120);
    await mockDelay();

    exceedsSpy.mockReturnValue(true);

    fireWheelEvent(120);

    const box = document.querySelector('.t-image-viewer__modal-box') as HTMLElement;
    expect(box.classList.contains(TRANSITIONING_CLASS)).toBe(true);

    exceedsSpy.mockRestore();
  });

  test('transitionend 后移除 transitioning class', async () => {
    const transformModule = await import('@tdesign/common-js/image-viewer/transform');
    const exceedsSpy = vi.spyOn(transformModule, 'isImageExceedsViewport').mockReturnValue(false);

    render(
      <ImageViewer
        trigger={({ open }) => <span onClick={() => open()}>动画测试2</span>}
        images={[imgUrl]}
        imageScale={{ max: 2, min: 0.5, step: 0.5 }}
      />,
    );

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    fireWheelEvent(-120);
    fireWheelEvent(-120);
    await mockDelay();

    exceedsSpy.mockReturnValue(true);
    fireWheelEvent(120);

    const box = document.querySelector('.t-image-viewer__modal-box') as HTMLElement;
    expect(box.classList.contains(TRANSITIONING_CLASS)).toBe(true);

    act(() => {
      const e = new Event('transitionend', { bubbles: true });
      Object.defineProperty(e, 'propertyName', { value: 'transform' });
      box.dispatchEvent(e);
    });

    expect(box.classList.contains(TRANSITIONING_CLASS)).toBe(false);

    exceedsSpy.mockRestore();
  });

  test('fallback timer（350ms）超时后自动移除 transitioning class', async () => {
    vi.useFakeTimers();

    const transformModule = await import('@tdesign/common-js/image-viewer/transform');
    const exceedsSpy = vi.spyOn(transformModule, 'isImageExceedsViewport').mockReturnValue(false);

    render(
      <ImageViewer
        trigger={({ open }) => <span onClick={() => open()}>动画测试3</span>}
        images={[imgUrl]}
        imageScale={{ max: 2, min: 0.5, step: 0.5 }}
      />,
    );

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });

    act(() => {
      fireWheelEvent(-120);
      fireWheelEvent(-120);
    });

    exceedsSpy.mockReturnValue(true);
    act(() => {
      fireWheelEvent(120);
    });

    const box = document.querySelector('.t-image-viewer__modal-box') as HTMLElement;
    expect(box.classList.contains(TRANSITIONING_CLASS)).toBe(true);

    act(() => {
      vi.advanceTimersByTime(400);
    });
    expect(box.classList.contains(TRANSITIONING_CLASS)).toBe(false);

    vi.useRealTimers();
    exceedsSpy.mockRestore();
  });

  test('连续快速缩放：fallback timer 重置', async () => {
    vi.useFakeTimers();

    const transformModule = await import('@tdesign/common-js/image-viewer/transform');
    const exceedsSpy = vi.spyOn(transformModule, 'isImageExceedsViewport').mockReturnValue(false);

    render(
      <ImageViewer
        trigger={({ open }) => <span onClick={() => open()}>动画测试4</span>}
        images={[imgUrl]}
        imageScale={{ max: 2, min: 0.5, step: 0.5 }}
      />,
    );

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });

    act(() => {
      fireWheelEvent(-120);
      fireWheelEvent(-120);
    });

    exceedsSpy.mockReturnValue(true);

    act(() => {
      fireWheelEvent(120);
    });
    const box = document.querySelector('.t-image-viewer__modal-box') as HTMLElement;
    expect(box.classList.contains(TRANSITIONING_CLASS)).toBe(true);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    act(() => {
      fireWheelEvent(120);
    });
    expect(box.classList.contains(TRANSITIONING_CLASS)).toBe(true);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(box.classList.contains(TRANSITIONING_CLASS)).toBe(true);

    act(() => {
      vi.advanceTimersByTime(200);
    });
    expect(box.classList.contains(TRANSITIONING_CLASS)).toBe(false);

    vi.useRealTimers();
    exceedsSpy.mockRestore();
  });
});

describe('ImageViewer 工具栏操作快照', () => {
  const triggerText = '工具栏测试';

  const openViewer = async (images = [imgUrl]) => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={images} />;
    };
    const { getByText } = render(<BasicImageViewer />);
    act(() => {
      fireEvent.click(getByText(triggerText));
    });
    await mockDelay();
    return { getByText };
  };

  test('点击旋转按钮后快照', async () => {
    await openViewer();
    const rotateBtn = document.querySelector('.t-icon-rotation')?.closest('.t-image-viewer__modal-icon');
    expect(rotateBtn).toBeTruthy();
    act(() => {
      fireEvent.click(rotateBtn);
    });
    await mockDelay();
    expect(document.body).toMatchSnapshot('toolbar-after-rotate');
  });

  test('点击放大按钮后快照', async () => {
    await openViewer();
    const zoomInBtn = document.querySelector('.t-icon-zoom-in')?.closest('.t-image-viewer__modal-icon');
    expect(zoomInBtn).toBeTruthy();
    act(() => {
      fireEvent.click(zoomInBtn);
    });
    await mockDelay();
    expect(document.body).toMatchSnapshot('toolbar-after-zoom-in');
  });

  test('点击缩小按钮后快照', async () => {
    await openViewer();
    const zoomOutBtn = document.querySelector('.t-icon-zoom-out')?.closest('.t-image-viewer__modal-icon');
    expect(zoomOutBtn).toBeTruthy();
    act(() => {
      fireEvent.click(zoomOutBtn);
    });
    await mockDelay();
    expect(document.body).toMatchSnapshot('toolbar-after-zoom-out');
  });

  test('点击镜像按钮后快照', async () => {
    await openViewer();
    const mirrorBtn = document.querySelector('.t-icon-mirror')?.closest('.t-image-viewer__modal-icon');
    expect(mirrorBtn).toBeTruthy();
    act(() => {
      fireEvent.click(mirrorBtn);
    });
    await mockDelay();
    expect(document.body).toMatchSnapshot('toolbar-after-mirror');
  });

  test('点击原始大小按钮后快照', async () => {
    await openViewer();
    const resetBtn = document.querySelector('.t-icon-image')?.closest('.t-image-viewer__modal-icon');
    expect(resetBtn).toBeTruthy();
    act(() => {
      fireEvent.click(resetBtn);
    });
    await mockDelay();
    expect(document.body).toMatchSnapshot('toolbar-after-reset');
  });

  test('多图导航：上一张/下一张按钮快照', async () => {
    await openViewer([imgUrl, imgUrl2, imgUrl3]);

    const nextBtn = document.querySelector('.t-icon-chevron-right')?.closest('.t-image-viewer__modal-icon');
    expect(nextBtn).toBeTruthy();
    act(() => {
      fireEvent.click(nextBtn);
    });
    await mockDelay();
    expect(document.body).toMatchSnapshot('toolbar-navigate-next');

    const nextBtn2 = document.querySelector('.t-icon-chevron-right')?.closest('.t-image-viewer__modal-icon');
    expect(nextBtn2).toBeTruthy();
    act(() => {
      fireEvent.click(nextBtn2);
    });
    await mockDelay();

    const prevBtn = document.querySelector('.t-icon-chevron-left')?.closest('.t-image-viewer__modal-icon');
    expect(prevBtn).toBeTruthy();
    act(() => {
      fireEvent.click(prevBtn);
    });
    await mockDelay();
    expect(document.body).toMatchSnapshot('toolbar-navigate-prev');
  });
});

// ─── onClose trigger 来源验证 ───────────────────────────────────────────
describe('onClose trigger 来源', () => {
  const triggerText = '关闭来源测试';

  test('点击关闭按钮时 trigger 为 close-btn', async () => {
    const onClose = vi.fn();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} onClose={onClose} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const closeBtn = document.querySelector('.t-image-viewer__modal-close-bt');
    expect(closeBtn).toBeTruthy();
    act(() => {
      fireEvent.click(closeBtn);
    });
    expect(onClose).toHaveBeenCalledWith({ trigger: 'close-btn', e: expect.any(Object) });
  });

  test('点击遮罩时 trigger 为 overlay', async () => {
    const onClose = vi.fn();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} onClose={onClose} closeOnOverlay />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const mask = document.querySelector('.t-image-viewer__modal-mask');
    expect(mask).toBeTruthy();
    act(() => {
      fireEvent.click(mask);
    });
    expect(onClose).toHaveBeenCalledWith({ trigger: 'overlay', e: expect.any(Object) });
  });

  test('ESC 关闭时 trigger 为 esc', async () => {
    const user = userEvent.setup();
    const onClose = vi.fn();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} onClose={onClose} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    await user.type(document.body, '{Escape}');
    expect(onClose).toHaveBeenCalledWith({ trigger: 'esc', e: expect.any(Object) });
  });
});

// ─── onDownload 回调 ────────────────────────────────────────────────────
describe('onDownload 下载回调', () => {
  const triggerText = '下载测试';

  test('自定义 onDownload 时被调用', async () => {
    const onDownload = vi.fn();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} onDownload={onDownload} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const downloadBtn =
      document
        .querySelector('.t-image-viewer__modal-icon [data-td-icon="download"]')
        ?.closest('.t-image-viewer__modal-icon') ??
      document.querySelector('.t-icon-download')?.closest('.t-image-viewer__modal-icon');
    expect(downloadBtn).toBeTruthy();
    act(() => {
      fireEvent.click(downloadBtn);
    });
    expect(onDownload).toHaveBeenCalledWith(imgUrl);
  });

  test('currentImage.download 为 false 时不显示下载按钮', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={[{ mainImage: imgUrl, download: false }]} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const downloadIcon = document.querySelector('.t-icon-download');
    expect(downloadIcon).toBeNull();
  });
});

// ─── 受控模式 ──────────────────────────────────────────────────────────
describe('受控 visible/index', () => {
  test('受控 visible 打开/关闭', async () => {
    const ControlledViewer = () => {
      const [visible, setVisible] = React.useState(false);
      return (
        <>
          <button data-testid="open" onClick={() => setVisible(true)}>
            打开
          </button>
          <button data-testid="close" onClick={() => setVisible(false)}>
            关闭
          </button>
          <ImageViewer visible={visible} images={[imgUrl]} onClose={() => setVisible(false)} />
        </>
      );
    };
    render(<ControlledViewer />);

    expect(document.querySelector('.t-image-viewer-preview-image')).toBeNull();

    act(() => {
      fireEvent.click(document.querySelector('[data-testid="open"]'));
    });
    await mockDelay();
    expect(document.querySelector('.t-image-viewer-preview-image')).toBeTruthy();

    act(() => {
      fireEvent.click(document.querySelector('[data-testid="close"]'));
    });
    await mockTimeout(() => expect(document.querySelector('.t-image-viewer-preview-image')).toBeNull());
  });

  test('受控 index 切换图片', async () => {
    const ControlledViewer = () => {
      const [index, setIndex] = React.useState(0);
      return (
        <>
          <button data-testid="set-index" onClick={() => setIndex(2)}>
            跳转
          </button>
          <ImageViewer
            visible={true}
            index={index}
            images={[imgUrl, imgUrl2, imgUrl3]}
            onIndexChange={(i) => setIndex(i as number)}
          />
        </>
      );
    };
    render(<ControlledViewer />);
    await mockDelay();

    // 初始 index=0
    const indexText = document.querySelector('.t-image-viewer__modal-index');
    expect(indexText).toBeTruthy();

    // 外部修改 index 为 2
    act(() => {
      fireEvent.click(document.querySelector('[data-testid="set-index"]'));
    });
    await mockDelay();

    // 验证组件已更新到第 3 张
    const updatedIndexText = document.querySelector('.t-image-viewer__modal-index');
    expect(updatedIndexText?.textContent).toContain('3/3');
  });
});

// ─── 图片加载错误状态 ──────────────────────────────────────────────────
describe('图片加载错误状态', () => {
  const triggerText = '错误状态测试';

  test('图片加载失败显示错误 UI', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>{triggerText}</span>;
      return <ImageViewer trigger={trigger} images={['invalid-url.jpg']} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const img = document.querySelector('.t-image-viewer__modal-image') as HTMLImageElement;
    expect(img).toBeTruthy();

    act(() => {
      fireEvent.error(img);
    });
    await mockDelay();

    const errorEl = document.querySelector('.t-image-viewer__img-error');
    // In JSDOM, error UI may render; verify either error element appears or image is hidden
    const hasError =
      errorEl !== null || document.querySelector('.t-image-viewer__modal-image[style*="display: none"]') !== null;
    expect(hasError).toBe(true);
  });
});

// ─── open(index) 指定索引打开 ──────────────────────────────────────────
describe('open(index) 指定索引打开', () => {
  test('open 传入 index 后显示对应图片', async () => {
    const onIndexChange = vi.fn();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open(2)}>指定索引打开</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2, imgUrl3]} onIndexChange={onIndexChange} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const indexText = document.querySelector('.t-image-viewer__modal-index');
    expect(indexText?.textContent).toContain('3/3');
  });
});

// ─── 缩略图导航 ──────────────────────────────────────────────────────
describe('ImageViewerHeader 缩略图导航', () => {
  test('点击缩略图切换到对应图片', async () => {
    const onIndexChange = vi.fn();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>缩略图测试</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2, imgUrl3]} onIndexChange={onIndexChange} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const headerBoxes = document.querySelectorAll('.t-image-viewer__header-box');
    expect(headerBoxes.length).toBe(3);

    act(() => {
      fireEvent.click(headerBoxes[2]);
    });
    expect(onIndexChange).toHaveBeenCalledWith(2, { trigger: 'current' });
  });

  test('当前图片缩略图有 active 状态', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>缩略图测试</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2, imgUrl3]} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const headerBoxes = document.querySelectorAll('.t-image-viewer__header-box');
    expect(headerBoxes[0].classList.contains('t-is-active')).toBe(true);
    expect(headerBoxes[1].classList.contains('t-is-active')).toBe(false);
  });
});

// ─── closeBtn 为函数 ──────────────────────────────────────────────────
describe('closeBtn 为函数', () => {
  test('closeBtn 为函数时渲染自定义关闭按钮', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>函数关闭按钮</span>;
      return (
        <ImageViewer
          trigger={trigger}
          images={[imgUrl]}
          closeBtn={({ onClose }) => (
            <button data-testid="custom-close" onClick={() => onClose?.({ trigger: 'close-btn', e: {} as any })}>
              X
            </button>
          )}
        />
      );
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const customBtn = document.querySelector('[data-testid="custom-close"]');
    expect(customBtn).toBeTruthy();
    expect(customBtn?.textContent).toBe('X');
  });
});

// ─── DefaultTrigger 点击交互 ──────────────────────────────────────────
describe('DefaultTrigger 点击交互', () => {
  test('默认触发器点击后打开预览', async () => {
    render(<ImageViewer images={[imgUrl]} />);

    const triggerEl = document.querySelector('.t-image-viewer__trigger');
    expect(triggerEl).toBeTruthy();

    act(() => {
      fireEvent.click(triggerEl);
    });
    await mockDelay();

    expect(document.querySelector('.t-image-viewer-preview-image')).toBeTruthy();
  });
});

// ─── 切换图片重置状态 ────────────────────────────────────────────────
describe('切换图片后重置旋转/缩放/位移', () => {
  test('切换图片后缩放重置为 1', async () => {
    const user = userEvent.setup();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>重置测试</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2]} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    // 放大
    await user.type(document.body, '{ArrowUp}');
    await mockDelay();
    const scaleText = document.querySelector('.t-image-viewer__utils-scale')?.textContent;
    expect(scaleText).not.toBe('100%');

    // 切换到下一张
    await user.type(document.body, '{ArrowRight}');
    await mockDelay();

    const scaleTextAfter = document.querySelector('.t-image-viewer__utils-scale')?.textContent;
    expect(scaleTextAfter).toBe('100%');
  });
});

// ─── innerClassName 属性 ──────────────────────────────────────────────
describe('innerClassName 属性', () => {
  test('innerClassName 应用到图片容器', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>innerClassName测试</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} innerClassName="custom-inner" />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const picEl = document.querySelector('.t-image-viewer__modal-pic');
    expect(picEl?.classList.contains('custom-inner')).toBe(true);
  });
});

// ─── showOverlay 为 false ─────────────────────────────────────────────
describe('showOverlay 属性', () => {
  test('showOverlay 为 false 时不渲染遮罩', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>遮罩测试</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} showOverlay={false} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const mask = document.querySelector('.t-image-viewer__modal-mask');
    expect(mask).toBeNull();
  });
});

// ─── closeOnOverlay 为 false ──────────────────────────────────────────
describe('closeOnOverlay 属性', () => {
  test('closeOnOverlay 为 false 时点击遮罩不关闭', async () => {
    const onClose = vi.fn();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>遮罩不关闭测试</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl]} closeOnOverlay={false} onClose={onClose} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const mask = document.querySelector('.t-image-viewer__modal-mask');
    expect(mask).toBeTruthy();
    act(() => {
      fireEvent.click(mask);
    });
    expect(onClose).not.toHaveBeenCalled();
  });
});

// ─── title 为函数 ─────────────────────────────────────────────────────
describe('title 为 TNode', () => {
  test('title 为 ReactNode 时渲染自定义标题', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>标题测试</span>;
      return (
        <ImageViewer
          trigger={trigger}
          images={[imgUrl, imgUrl2]}
          title={<span className="custom-title-node">自定义标题</span>}
        />
      );
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const titleEl = document.querySelector('.custom-title-node');
    expect(titleEl).toBeTruthy();
    expect(titleEl?.textContent).toBe('自定义标题');
  });
});

// ─── 第一张/最后一张箭头 disabled ──────────────────────────────────────
describe('第一张/最后一张箭头 disabled 状态', () => {
  test('第一张图片时 prev 按钮有 disabled 样式', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>箭头测试</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2, imgUrl3]} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const prevBtn = document.querySelector('.t-image-viewer__modal-prev-bt');
    expect(prevBtn?.classList.contains('t-is-disabled')).toBe(true);

    const nextBtn = document.querySelector('.t-image-viewer__modal-next-bt');
    expect(nextBtn?.classList.contains('t-is-disabled')).toBe(false);
  });

  test('最后一张图片时 next 按钮有 disabled 样式', async () => {
    const user = userEvent.setup();
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>箭头测试2</span>;
      return <ImageViewer trigger={trigger} images={[imgUrl, imgUrl2]} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    await user.type(document.body, '{ArrowRight}');
    await mockDelay();

    const nextBtn = document.querySelector('.t-image-viewer__modal-next-bt');
    expect(nextBtn?.classList.contains('t-is-disabled')).toBe(true);
  });
});

// ─── 空图片数组 ───────────────────────────────────────────────────────
describe('空图片数组', () => {
  test('images 为空数组时不渲染弹窗', async () => {
    const BasicImageViewer = () => {
      const trigger = ({ open }) => <span onClick={() => open()}>空数组测试</span>;
      return <ImageViewer trigger={trigger} images={[]} />;
    };
    render(<BasicImageViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    expect(document.querySelector('.t-image-viewer-preview-image')).toBeNull();
  });
});

// ─── imageScale 动态变化重置 ──────────────────────────────────────────
describe('imageScale 动态变化重置缩放', () => {
  test('imageScale 变化后缩放重置', async () => {
    const DynamicScaleViewer = () => {
      const [scale, setScale] = React.useState({ max: 2, min: 0.5, step: 0.2 });
      const trigger = ({ open }) => <span onClick={() => open()}>动态缩放</span>;
      return (
        <>
          <button data-testid="change-scale" onClick={() => setScale({ max: 5, min: 0.1, step: 0.5 })}>
            修改缩放
          </button>
          <ImageViewer trigger={trigger} images={[imgUrl]} imageScale={scale} />
        </>
      );
    };
    render(<DynamicScaleViewer />);

    act(() => {
      fireEvent.click(document.querySelector('span'));
    });
    await mockDelay();

    const scaleText = document.querySelector('.t-image-viewer__utils-scale')?.textContent;
    expect(scaleText).toBe('100%');

    act(() => {
      fireEvent.click(document.querySelector('[data-testid="change-scale"]'));
    });
    await mockDelay();

    const scaleTextAfter = document.querySelector('.t-image-viewer__utils-scale')?.textContent;
    expect(scaleTextAfter).toBe('100%');
  });
});
