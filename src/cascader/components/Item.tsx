import React, { useRef, forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import { ChevronRightIcon, LoadingIcon } from '@tencent/tdesign-icons-react';

// hook
import useConfig from '../../_util/useConfig';
import useCommonClassName from '../../_util/useCommonClassName';
import useRipple from '../../_util/useRipple';

// common logic
import { getCascaderItemClass, getCascaderItemIconClass, getLabelIsEllipsis } from '../utils/item';
import { getFullPathLabel } from '../utils/helper';

// component
import Tooltip from '../../tooltip/Tooltip';
import Checkbox from '../../checkbox/Checkbox';

// type
import { ContextType, CascaderItemProps, CascaderContextType } from '../interface';
import TreeNode from '../../_common/js/tree/tree-node';
import { TreeNodeValue } from '../../_common/js/tree/types';
import { CheckboxProps } from '../../checkbox/index';

const RenderLabelInner = (name: string, node: TreeNode, cascaderContext: CascaderContextType) => {
  const { filterActive, inputVal } = cascaderContext;
  const labelText = filterActive ? getFullPathLabel(node) : node.label;

  if (filterActive) {
    const ctx = labelText.split(inputVal);
    return (() => (
      <>
        {ctx[0]}
        <span className={`${name}__label--filter`}>{inputVal}</span>
        {ctx[1]}
      </>
    ))();
  }
  return (() => <>{labelText}</>)();
};

const RenderLabelContent = (node: TreeNode, cascaderContext: CascaderContextType) => {
  const { classPrefix: prefix } = useConfig();
  const name = `${prefix}-cascader-item`;

  const label = RenderLabelInner(name, node, cascaderContext);
  const isEllipsis = getLabelIsEllipsis(node, cascaderContext.size);

  if (isEllipsis) {
    return (
      <Tooltip content={label} placement="top-left">
        <span className={`${name}__label`}>{label}</span>
      </Tooltip>
    );
  }
  return <span className={`${name}__label`}>{label}</span>;
};

const RenderCheckBox = (node: TreeNode, cascaderContext: CascaderContextType, handleChange) => {
  const { classPrefix: prefix } = useConfig();
  const name = `${prefix}-cascader-item`;

  const { checkProps, value, max } = cascaderContext;
  const label = RenderLabelInner(name, node, cascaderContext);
  return (
    <Checkbox
      {...checkProps}
      checked={node.checked}
      indeterminate={node.indeterminate}
      disabled={node.isDisabled() || ((value as TreeNodeValue[]).length >= max && max !== 0)}
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
    cascaderContext: { multiple },
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
        (node.loading ? <LoadingIcon className={iconClass} /> : <ChevronRightIcon className={iconClass} />)}
    </li>
  );
});

export default Item;
