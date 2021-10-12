import React, { useState, useMemo, useEffect, useRef } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';

import useConfig from '../../_util/useConfig';
import useCommonClassName from '../../_util/useCommonClassName';

// common logic
import {
  getIconClass,
  getCascaderInnerClasses,
  getCloseShow,
  getPlaceholderShow,
  getSingleContent,
  getMultipleContent,
  outerClickListenerEffect,
  closeIconClickEffect,
  handleRemoveTagEffect,
  innerContentClickEffect,
} from '../utils/inputContent';

// component
import Tag from '../../tag';
import Input from '../../input';
import CloseCircleFilledIcon from '../../icon/icons/CloseCircleFilledIcon';
import FakeArrow from '../../common/FakeArrow';

// types
import { InputContentProps, InnerContentProps, ContentProps, SuffixIconProps, TreeNode } from '../interface';

const InputContent: React.FC<InputContentProps> = (props: InputContentProps) => {
  const { cascaderContext, className, style, placeholder, listeners } = props;

  const { classPrefix: prefix } = useConfig();

  const [isHover, setIsHover] = useState(false);

  // inner class
  const CLASSNAMES = useCommonClassName();
  const cascaderInnerClasses = useMemo(
    () => classNames(getCascaderInnerClasses(prefix, CLASSNAMES, cascaderContext), className),
    [prefix, CLASSNAMES, cascaderContext, className],
  );

  /**
   * outside click
   */
  const selectRef = useRef(null);
  // handle click outside
  useEffect(() => {
    const outerClickListenerFn = (event: MouseEvent | TouchEvent) =>
      outerClickListenerEffect(selectRef.current as HTMLElement, cascaderContext, event);

    document.addEventListener('click', outerClickListenerFn);
    return () => {
      document.removeEventListener('click', outerClickListenerFn);
    };
  }, [cascaderContext]);

  const iconClass = useMemo(
    () => classNames(getIconClass(prefix, CLASSNAMES, cascaderContext)),
    [prefix, CLASSNAMES, cascaderContext],
  );

  const closeShow = useMemo(() => getCloseShow(isHover, cascaderContext), [isHover, cascaderContext]);

  return (
    <div
      className={cascaderInnerClasses}
      style={style}
      onMouseEnter={() => {
        setIsHover(true);
      }}
      onMouseLeave={() => {
        setIsHover(false);
      }}
      ref={selectRef}
      onClick={(e: React.MouseEvent) => {
        e.preventDefault();
        innerContentClickEffect(cascaderContext);
      }}
    >
      <Content cascaderContext={cascaderContext} isHover={isHover} placeholder={placeholder} listeners={listeners} />
      <SuffixIcon cascaderContext={cascaderContext} closeShow={closeShow} iconClass={iconClass} listeners={listeners} />
    </div>
  );
};

/**
 * SuffixIcon component
 */

const SuffixIcon = (props: SuffixIconProps) => {
  const {
    cascaderContext,
    listeners: { onChange },
    closeShow,
    iconClass,
  } = props;
  const { visible, disabled, multiple, size } = cascaderContext;
  const { classPrefix: prefix } = useConfig();
  const name = `${prefix}-cascader`;

  const closeIconClick = (e) => {
    e.stopPropagation();

    closeIconClickEffect(cascaderContext);

    if (onChange && isFunction(onChange)) {
      onChange(multiple ? [] : '', { e });
    }
  };

  if (closeShow) {
    return <CloseCircleFilledIcon className={iconClass} onClick={closeIconClick} size={size} />;
  }

  return <FakeArrow overlayClassName={`${name}-icon`} isActive={visible} disabled={disabled} />;
};

const Content: React.FC<ContentProps> = (props: ContentProps) => {
  const { placeholder, cascaderContext, listeners, isHover } = props;
  const { classPrefix: prefix } = useConfig();

  // single select content
  const singleContent = useMemo(() => getSingleContent(cascaderContext), [cascaderContext]);

  // multiple select content
  const multipleContent = useMemo(() => getMultipleContent(cascaderContext), [cascaderContext]);

  const showPlaceholder = useMemo(
    () => getPlaceholderShow(cascaderContext, singleContent, multipleContent),
    [cascaderContext, singleContent, multipleContent],
  );

  const content = !showPlaceholder ? (
    <InnerContent isHover={isHover} cascaderContext={cascaderContext} listeners={listeners} placeholder={placeholder} />
  ) : (
    <span className={`${prefix}-cascader-placeholder`}>{placeholder || '请选择'}</span>
  );
  return content;
};

const InnerContent: React.FC<InnerContentProps> = (props: InnerContentProps) => {
  const { cascaderContext, listeners, placeholder } = props;
  const { classPrefix: prefix } = useConfig();
  const { multiple, size, disabled, filterable, setFilterActive, visible, inputVal, setInputVal, collapseTags } =
    cascaderContext;
  const { onFocus, onBlur } = listeners;

  // single select content
  const singleContent = useMemo(() => getSingleContent(cascaderContext), [cascaderContext]);

  // multiple select content
  const multipleContent = useMemo(() => getMultipleContent(cascaderContext), [cascaderContext]);

  const renderSelfTag = (node: TreeNode, index: number) => (
    <Tag
      closable
      key={index}
      disabled={disabled}
      onClose={(ctx) => {
        ctx.e.stopPropagation();
        handleRemoveTagEffect(cascaderContext, node);
      }}
      size={size}
    >
      {node.label}
    </Tag>
  );

  const generalContent = !multiple ? (
    <span className={`${prefix}-cascader-content`}>{singleContent}</span>
  ) : (
    <>
      {collapseTags && multipleContent.length > 1 ? (
        <>
          {renderSelfTag(multipleContent[0], 0)}
          <Tag size={size} disabled={disabled}>
            +{multipleContent.length - 1}
          </Tag>
        </>
      ) : (
        multipleContent.map((node: TreeNode, index) => renderSelfTag(node, index))
      )}
    </>
  );

  const inputPlaceholder = multiple ? multipleContent.map((node) => node.label).join('、') : singleContent;

  const filterContent = (
    <Input
      placeholder={inputPlaceholder || placeholder}
      value={inputVal}
      onChange={(value: string) => {
        setInputVal(value);
        setFilterActive(!!value);
      }}
      autofocus
      onFocus={(v, context) => isFunction(onFocus) && onFocus({ inputVal, e: context?.e })}
      onBlur={(v, context) => isFunction(onBlur) && onBlur({ inputVal, e: context?.e })}
    />
  );

  const showFilter = useMemo(() => filterable && visible, [filterable, visible]);
  return showFilter ? filterContent : generalContent;
};

export default InputContent;
