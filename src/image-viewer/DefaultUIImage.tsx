import React, { CSSProperties, useCallback, useEffect, useState } from 'react';
import classnames from 'classnames';
import useConfig from 'tdesign-react/_util/useConfig';
import { IconFont } from 'tdesign-icons-react';
import { Popup } from 'tdesign-react';

const LoadingError = ({ style, classPrefix }) => (
  <div style={style} className={`${classPrefix}-image-viewer-error ${classPrefix}-image-viewer-ui-image`}>
    {/* 脱离文档流 */}
    <div className={`${classPrefix}-image-viewer-error-content`}>
      <IconFont name="image" size="4em" />
      <div>加载失败</div>
    </div>
  </div>
);

interface ImageViewerIconListProps {
  list: { label: string }[];
  onClick: (value: { label: string }, index: number) => void;
}

const ImageViewerIconList = ({ list, onClick }: ImageViewerIconListProps) => {
  const { classPrefix } = useConfig();
  return (
    <ul className={`${classPrefix}-select__list`}>
      {list.map((it, index) => (
        <li key={index} className={`${classPrefix}-select-option`} onClick={() => onClick(it, index)}>
          <span>{it.label}</span>
        </li>
      ))}
    </ul>
  );
};

export type TitleIcons = ('browse' | 'ellipsis')[];

// 默认展示UI
interface DefaultUIImageProps {
  alt: string;
  src: string;
  title: string;
  style: CSSProperties;
  className: string;
  list: string[];
  titleIcons: TitleIcons;
  onOpen: () => void;
}
export const DefaultUIImage = ({
  list,
  alt,
  src,
  style,
  onOpen,
  className,
  title,
  titleIcons,
}: DefaultUIImageProps) => {
  const [error, setError] = useState(false);
  const { classPrefix } = useConfig();
  const onError = useCallback(() => {
    setError(true);
  }, []);

  useEffect(() => {
    setError(false);
  }, [src]);

  if (error) return <LoadingError classPrefix={classPrefix} style={style} />;

  return (
    <div style={style} className={`${classPrefix}-image-viewer-ui-image`}>
      <img
        alt={alt}
        src={src}
        onClick={onOpen}
        onError={onError}
        className={classnames(`${classPrefix}-image-viewer-ui-image-img`, className)}
      />
      {!!title && (
        <div className={`${classPrefix}-image-viewer-ui-image-footer`}>
          <span className={`${classPrefix}-image-viewer-ui-image-title`}>{title}</span>
          <span className={`${classPrefix}-image-viewer-ui-image-icons`}>
            {titleIcons.map((it) => {
              switch (it) {
                case 'browse':
                  return <IconFont name="browse" onClick={onOpen} />;
                // 操作查看器
                case 'ellipsis': {
                  const listCommon = (
                    <ImageViewerIconList
                      onClick={(value) => {
                        console.log(value);
                      }}
                      list={list.map((i, index) => ({ label: `图片${index}` }))}
                    />
                  );
                  return (
                    <Popup
                      trigger="click"
                      content={listCommon}
                      placement="right-bottom"
                      overlayStyle={{ width: '140px' }}
                      destroyOnClose
                    >
                      <IconFont name="ellipsis" />
                    </Popup>
                  );
                }
                default:
                  return null;
              }
            })}
          </span>
        </div>
      )}
    </div>
  );
};
