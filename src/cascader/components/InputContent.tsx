import React, { useState, useMemo, useEffect, useRef } from 'react';
import classNames from 'classnames';
import isFunction from 'lodash/isFunction';
import { CloseCircleFilledIcon } from 'tdesign-icons-react';
import useConfig from '../../_util/useConfig';
import useCommonClassName from '../../_util/useCommonClassName';

// component
import Tag from '../../tag';
import Input from '../../input';
import FakeArrow from '../../common/FakeArrow';

// common logic
import {
  getCloseIconClass,
  getFakeArrowIconClass,
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

// types
import { InputContentProps, InnerContentProps, ContentProps, SuffixIconProps, TreeNode } from '../interface';

/**
 * SuffixIcon component
 */

const SuffixIcon = (props: SuffixIconProps) => {
  const {
    cascaderContext,
    listeners: { onChange },
    closeShow,
    fakeArrowIconClass,
    closeIconClass,
  } = props;
  const { visible, disabled, size } = cascaderContext;

  const closeIconClick = (e: React.MouseEvent) => {
    e.stopPropagation();

    closeIconClickEffect(cascaderContext, onChange);
  };

  if (closeShow) {
    return <CloseCircleFilledIcon className={closeIconClass} onClick={closeIconClick} size={size} />;
  }

  return <FakeArrow overlayClassName={fakeArrowIconClass} isActive={visible} disabled={disabled} />;
};

const InnerContent: React.FC<InnerContentProps> = (props: InnerContentProps) => {
  const { cascaderContext, listeners, placeholder, collapsedItems } = props;
  const { classPrefix: prefix } = useConfig();
  const { multiple, size, disabled, filterable, setFilterActive, visible, inputVal, setInputVal, minCollapsedNum } =
    cascaderContext;
  const { onFocus, onBlur, onRemove } = listeners;

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
        handleRemoveTagEffect(cascaderContext, node, onRemove);
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
      {minCollapsedNum > 0 && multipleContent.length > minCollapsedNum ? (
        <>
          {multipleContent.slice(0, minCollapsedNum).map((node: TreeNode, index: number) => renderSelfTag(node, index))}
          {!collapsedItems ? (
            <Tag size={size} disabled={disabled}>
              +{multipleContent.length - minCollapsedNum}
            </Tag>
          ) : (
            collapsedItems
          )}
        </>
      ) : (
        multipleContent.map((node: TreeNode, index: number) => renderSelfTag(node, index))
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

const Content: React.FC<ContentProps> = (props: ContentProps) => {
  const { placeholder, cascaderContext, listeners, isHover, collapsedItems } = props;
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
    <InnerContent
      isHover={isHover}
      cascaderContext={cascaderContext}
      listeners={listeners}
      collapsedItems={collapsedItems}
      placeholder={placeholder}
    />
  ) : (
    <span className={`${prefix}-cascader-placeholder`}>{placeholder || '请选择'}</span>
  );
  return content;
};

const InputContent: React.FC<InputContentProps> = (props: InputContentProps) => {
  const { cascaderContext, className, style, placeholder, listeners, collapsedItems } = props;

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

  const closeIconClass = useMemo(
    () => classNames(getCloseIconClass(prefix, CLASSNAMES, cascaderContext)),
    [prefix, CLASSNAMES, cascaderContext],
  );

  const fakeArrowIconClass = useMemo(
    () => classNames(getFakeArrowIconClass(prefix, CLASSNAMES, cascaderContext)),
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
      <Content
        cascaderContext={cascaderContext}
        isHover={isHover}
        collapsedItems={collapsedItems}
        placeholder={placeholder}
        listeners={listeners}
      />
      <SuffixIcon
        cascaderContext={cascaderContext}
        closeShow={closeShow}
        closeIconClass={closeIconClass}
        fakeArrowIconClass={fakeArrowIconClass}
        listeners={listeners}
      />
    </div>
  );
};

export default InputContent;
