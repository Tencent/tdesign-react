import React, { useRef, forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import { ChevronRightIcon } from 'tdesign-icons-react';

// hook
import useConfig from '../../_util/useConfig';
import useCommonClassName from '../../_util/useCommonClassName';
import useRipple from '../../_util/useRipple';

// common logic
import { getCascaderItemClass, getCascaderItemIconClass, getLabelIsEllipsis } from '../utils/item';
import { getFullPathLabel } from '../utils/helper';

// component
import TLoading from '../../loading';
import Tooltip from '../../tooltip/Tooltip';
import Checkbox from '../../checkbox/Checkbox';

// type
import { ContextType, CascaderItemProps, CascaderContextType } from '../interface';
import TreeNode from '../../_common/js/tree/tree-node';
import { TreeNodeValue } from '../../_common/js/tree/types';
import { CheckboxProps } from '../../checkbox';

const RenderLabelInner = (name: string, node: TreeNode, cascaderContext: CascaderContextType) => {
  const { filterActive, inputVal } = cascaderContext;
  const labelText = filterActive ? getFullPathLabel(node) : node.label;
  const isEllipsis = getLabelIsEllipsis(labelText, cascaderContext.size);
  const EllipsisNode = isEllipsis ? (
    <div className={`${name}-label--ellipsis`}>
      <Tooltip content={labelText} placement="top-left" />
    </div>
  ) : null;

  if (filterActive) {
    const texts = labelText.split(inputVal);
    const doms = [];
    for (let index = 0; index < texts.length; index++) {
      doms.push(<span key={index}>{texts[index]}</span>);
      if (index === texts.length - 1) break;
      doms.push(
        <span key={`${index}filter`} className={`${name}-label--filter`}>
          {inputVal}
        </span>,
      );
    }
    return (
      <>
        {doms}
        {EllipsisNode}
      </>
    );
  }
  return (
    <>
      {labelText}
      {EllipsisNode}
    </>
  );
};

const RenderLabelContent = (node: TreeNode, cascaderContext: CascaderContextType) => {
  const { classPrefix: prefix } = useConfig();
  const name = `${prefix}-cascader__item`;

  const label = RenderLabelInner(name, node, cascaderContext);

  return (
    <span className={`${name}-label`} role="label">
      {label}
    </span>
  );
};

const RenderCheckBox = (node: TreeNode, cascaderContext: CascaderContextType, handleChange) => {
  const { classPrefix: prefix } = useConfig();
  const name = `${prefix}-cascader__item`;

  const { checkProps, value, max } = cascaderContext;
  const label = RenderLabelInner(name, node, cascaderContext);
  return (
    <Checkbox
      {...checkProps}
      checked={node.checked}
      indeterminate={node.indeterminate}
      disabled={node.isDisabled() || (value && (value as TreeNodeValue[]).length >= max && max !== 0)}
      name={node.value}
      onChange={handleChange}
    >
      {label}
    </Checkbox>
  );
};

const Item = forwardRef((props: CascaderItemProps, ref: React.RefObject<HTMLLIElement>) => {
  const {
    node,
    cascaderContext: { multiple, loadingText },
    onClick,
    onChange,
    onMouseEnter,
    cascaderContext,
  } = props;
  const { classPrefix: prefix } = useConfig();

  const itemRef = useRef();
  useRipple(ref || itemRef);

  /**
   * class
   */
  const CLASSNAMES = useCommonClassName();

  const itemClass = useMemo(
    () => classNames(getCascaderItemClass(prefix, node, CLASSNAMES, cascaderContext)),
    [prefix, node, CLASSNAMES, cascaderContext],
  );

  const iconClass = useMemo(
    () => classNames(getCascaderItemIconClass(prefix, node, CLASSNAMES, cascaderContext)),
    [prefix, node, CLASSNAMES, cascaderContext],
  );

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    e?.nativeEvent?.stopImmediatePropagation?.();
    const ctx: ContextType = {
      e,
      node,
    };
    onClick(ctx);
  };

  const handleChange: CheckboxProps['onChange'] = (e) => {
    const ctx = {
      e,
      node,
    };
    onChange(ctx);
  };

  const handleMouseenter = (e: React.MouseEvent) => {
    e.stopPropagation();
    const ctx: ContextType = {
      e,
      node,
    };
    onMouseEnter(ctx);
  };

  return (
    <li ref={ref || itemRef} className={itemClass} onClick={handleClick} onMouseEnter={handleMouseenter}>
      {multiple ? RenderCheckBox(node, cascaderContext, handleChange) : RenderLabelContent(node, cascaderContext)}
      {node.children &&
        (node.loading ? (
          <TLoading className={iconClass} loading={true} text={loadingText} size="small" />
        ) : (
          <ChevronRightIcon className={iconClass} />
        ))}
    </li>
  );
});

export default Item;
