import React, { useState, useEffect, useCallback, Dispatch, SetStateAction, WheelEventHandler } from 'react';
import useConfig from 'tdesign-react/_util/useConfig';
import { isArray } from 'lodash';
import { IconFont } from 'tdesign-icons-react';
import classNames from 'classnames';
import { downloadFile, positionType, usePosition } from './usePosition';

interface ImageModelItemProps {
  rotateZ: number;
  scale: number;
  position: positionType;
  setPosition: Dispatch<SetStateAction<positionType>>;
  src: string;
}

// 单个弹窗实例
const ImageModelItem = ({ rotateZ, scale, position, setPosition, src }: ImageModelItemProps) => {
  const [_position, onMouseDown] = usePosition({ initPosition: [0, 0] });
  const { classPrefix } = useConfig();

  useEffect(() => {
    setPosition(_position);
  }, [_position, setPosition]);

  const imgStyle = { transform: `rotateZ(${rotateZ}deg) scale(${scale})` };
  return (
    <div className={`${classPrefix}-image-viewer-modal__pic`}>
      <div
        className={`${classPrefix}-image-viewer-modal__box`}
        style={{ transform: `translate(${position[0]}px, ${position[1]}px)` }}
      >
        <img
          className={`${classPrefix}-image-viewer-modal__image`}
          key={src}
          onMouseDown={(event) => {
            event.stopPropagation();
            onMouseDown(event);
          }}
          src={src}
          style={imgStyle}
          data-testid="img-drag"
          alt="image"
          draggable="false"
        />
      </div>
    </div>
  );
};

// 旋转角度单位
const ROTATE_COUNT = 90;

interface ImageModelIconProps {
  name: string;
  size?: string;
  label?: string;
  className?: string;
  disabled?: boolean;
  isRange?: boolean;
  onClick?: () => void;
}

const ImageModelIcon = ({ onClick, className, disabled, isRange, name, label, size = '3em' }: ImageModelIconProps) => {
  const { classPrefix } = useConfig();
  return (
    <div
      className={classNames(`${classPrefix}-image-viewer-modal__icon`, className, {
        [`${classPrefix}-is-disabled`]: disabled,
      })}
      onClick={onClick}
    >
      <IconFont size={size} name={name} className={isRange ? 'is-range' : null} />
      {label && <span className={`${classPrefix}-image-viewer-modal__icon-label`}>{label}</span>}
    </div>
  );
};

interface ImageModalProps {
  closeOnMark: boolean;
  startIndex: number;
  list: string[];
  onClose: () => void;
  maxScale: number;
  scaleStep: number;
  zIndex: number;
  isMini: boolean;
  miniWidth: number;
  miniHeight: number;
  movable: boolean;
}

// 弹窗基础组件
export const ImageModal = (props: ImageModalProps) => {
  const {
    closeOnMark,
    startIndex,
    zIndex,
    list = [],
    onClose,
    // isMini,
    // miniWidth,
    // miniHeight,
    // movable,
    maxScale,
    scaleStep,
  } = props;
  const { classPrefix } = useConfig();

  const [index, setIndex] = useState(startIndex);
  const [rotateZ, setRotateZ] = useState(0);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState<positionType>([0, 0]);
  const [isExpand, setIsExpand] = useState(false);

  const onReset = useCallback(() => {
    setScale(1);
    setRotateZ(0);
    setPosition([0, 0]);
  }, []);

  const onScroll: WheelEventHandler<HTMLDivElement> = (e) => {
    const { deltaY } = e;
    setScale((scale) => {
      const newScale = scale - deltaY / 200;
      if (newScale < 0.5) return 0.5;
      if (newScale > maxScale) return maxScale;
      return newScale;
    });
  };

  const onRotate = (ROTATE_COUNT: number) => {
    setRotateZ((rotateZ) => rotateZ + ROTATE_COUNT);
  };

  const next = useCallback(() => {
    setIndex((index) => {
      const newIndex = index + 1;
      if (newIndex >= list.length) return index;
      return newIndex;
    });
  }, [list.length]);

  const prev = useCallback(() => {
    setIndex((index) => (index - 1 > 0 ? index - 1 : 0));
  }, []);

  const zoom = useCallback(() => {
    setScale((scale) => {
      const newScale = scale + scaleStep;
      if (newScale < 0.5) return 0.5;
      if (newScale > maxScale) return maxScale;
      return newScale;
    });
  }, [maxScale, scaleStep]);

  const zoomOut = useCallback(() => {
    setScale((scale) => {
      const newScale = scale - scaleStep;
      if (newScale < 0.5) return 0.5;
      if (newScale > maxScale) return maxScale;
      return newScale;
    });
  }, [maxScale, scaleStep]);

  const onKeyDown = useCallback(
    (event) => {
      switch (event.code) {
        case 'ArrowRight':
          return next();
        case 'ArrowLeft':
          return prev();
        case 'ArrowUp':
          return zoom();
        case 'ArrowDown':
          return zoomOut();
        case 'Escape':
          return onClose && onClose();
      }
    },
    [next, onClose, prev, zoom, zoomOut],
  );

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [onKeyDown]);

  useEffect(() => {
    onReset();
  }, [index, onReset]);

  if (!isArray(list) || list.length < 1) return null;

  const item = list[index];

  // if (isMini) {
  //   return (
  //     <ImageModelMini
  //       index={index}
  //       movable={movable}
  //       list={list}
  //       onScroll={onScroll}
  //       onClose={onClose}
  //       scale={scale}
  //       position={position}
  //       setPosition={setPosition}
  //       rotateZ={rotateZ}
  //       src={item}
  //       prev={prev}
  //       next={next}
  //       zoom={zoom}
  //       zoomOut={zoomOut}
  //       onReset={onReset}
  //       onRotate={onRotate}
  //       miniWidth={miniWidth}
  //       miniHeight={miniHeight}
  //       zIndex={zIndex}
  //     />
  //   )
  // }

  return (
    <div className={`${classPrefix}-image-viewer-preview-image`} onWheel={onScroll} style={{ zIndex }}>
      <div className={`${classPrefix}-image-viewer-modal-mask`} onClick={() => closeOnMark && onClose && onClose()} />
      {list.length > 1 && (
        <>
          <div className={`${classPrefix}-image-viewer-modal-index`}>{`${index + 1}/${list.length}`}</div>
          <ImageModelIcon
            name="chevron-left-circle"
            className={`${classPrefix}-image-viewer-modal-prev-bt`}
            onClick={prev}
            disabled={index <= 0}
          />
          <ImageModelIcon
            name="chevron-right-circle"
            className={`${classPrefix}-image-viewer-modal-next-bt`}
            onClick={next}
            disabled={index >= list.length - 1}
          />
        </>
      )}
      <ImageModelIcon
        name="close"
        className={`${classPrefix}-image-viewer-modal-close-bt`}
        onClick={() => onClose && onClose()}
      />
      <div className={`${classPrefix}-image-viewer-modal-footer`}>
        <div className={`${classPrefix}-image-viewer-footer__content`}>
          <ImageModelIcon size="1.8em" name="history" onClick={() => onRotate(-ROTATE_COUNT)} />
          <ImageModelIcon size="2em" name="zoom-in" onClick={zoom} />
          <ImageModelIcon size="2em" name="zoom-out" onClick={zoomOut} />
          <ImageModelIcon
            size="1.5em"
            name="image"
            label="原始大小"
            onClick={() => {
              onReset();
            }}
          />
          <ImageModelIcon
            size="1.5em"
            name="download"
            label="保存图片"
            onClick={() => {
              downloadFile(item);
            }}
          />
          {list.length > 1 && (
            <ImageModelIcon
              size="1.5em"
              name="chevron-down-circle"
              isRange={isExpand}
              label="展开图片列表"
              onClick={() => {
                setIsExpand(!isExpand);
              }}
            />
          )}
        </div>
        {isExpand && (
          <div className={`${classPrefix}-image-viewer-footer__prev`}>
            {list.map((src, index) => (
              <img
                key={src}
                alt=""
                src={src}
                className={`${classPrefix}-image-viewer-footer__img`}
                onClick={() => setIndex(index)}
              />
            ))}
          </div>
        )}
        {/* <IconFont size="3em" name="page-last" onClick={() => onRotate(ROTATE_COUNT)} /> */}
      </div>
      <ImageModelItem scale={scale} position={position} setPosition={setPosition} rotateZ={rotateZ} src={item} />
    </div>
  );
};
