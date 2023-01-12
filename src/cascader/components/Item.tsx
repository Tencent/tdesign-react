import React, { forwardRef, useMemo } from 'react';
import classNames from 'classnames';
import { ChevronRightIcon as TdChevronRightIcon } from 'tdesign-icons-react';

import TLoading from '../../loading';
import Checkbox from '../../checkbox/Checkbox';

import useConfig from '../../hooks/useConfig';
import useGlobalIcon from '../../hooks/useGlobalIcon';
import useDomRefCallback from '../../hooks/useDomRefCallback';
import useCommonClassName from '../../_util/useCommonClassName';
import useRipple from '../../_util/useRipple';

import { getFullPathLabel } from '../core/helper';
import { getCascaderItemClass, getCascaderItemIconClass } from '../core/className';
import { CascaderContextType, TreeNodeValue, TreeNode } from '../interface';

const Item = forwardRef(
  (
    props: {
      node: TreeNode;
      cascaderContext: CascaderContextType;
      onClick: (ctx: TreeNode) => void;
      onChange: (ctx: TreeNode | { e: boolean; node: TreeNode }) => void;
      onMouseEnter: (ctx: TreeNode) => void;
    },
    ref: React.RefObject<HTMLLIElement>,
  ) => {
    const {
      node,
      cascaderContext: { multiple },
      onClick,
      onChange,
      onMouseEnter,
      cascaderContext,
    } = props;
    const { classPrefix: prefix } = useConfig();
    const { ChevronRightIcon } = useGlobalIcon({ ChevronRightIcon: TdChevronRightIcon });
    const COMPONENT_NAME = `${prefix}-cascader__item`;
    const [itemDom, setRefCurrent] = useDomRefCallback();

    useRipple(ref?.current || itemDom);

    /**
     * class
     */
    const { STATUS, SIZE } = useCommonClassName();

    const itemClass = useMemo(
      () => classNames(getCascaderItemClass(prefix, node, SIZE, STATUS, cascaderContext)),
      [prefix, node, SIZE, STATUS, cascaderContext],
    );

    const iconClass = useMemo(
      () => classNames(getCascaderItemIconClass(prefix, node, STATUS, cascaderContext)),
      [prefix, node, STATUS, cascaderContext],
    );

    const RenderLabelInner = (node: TreeNode, cascaderContext: CascaderContextType) => {
      const { inputVal } = cascaderContext;
      const labelText = inputVal ? getFullPathLabel(node) : node.label;

      if (inputVal) {
        const texts = labelText.split(inputVal as string);
        const doms = [];
        for (let index = 0; index < texts.length; index++) {
          doms.push(<span key={index}>{texts[index]}</span>);
          if (index === texts.length - 1) break;
          doms.push(
            <span key={`${index}filter`} className={`${COMPONENT_NAME}-label--filter`}>
              {inputVal}
            </span>,
          );
        }
        return doms;
      }
      return labelText;
    };

    const RenderLabelContent = (node: TreeNode, cascaderContext: CascaderContextType) => {
      const label = RenderLabelInner(node, cascaderContext);

      const labelCont = (
        <span
          title={cascaderContext.inputVal ? getFullPathLabel(node) : node.label}
          className={classNames(`${COMPONENT_NAME}-label`, `${COMPONENT_NAME}-label--ellipsis`)}
          role="label"
        >
          {label}
        </span>
      );

      return labelCont;
    };

    const RenderCheckBox = (node: TreeNode, cascaderContext: CascaderContextType) => {
      const { checkProps, value, max, inputVal } = cascaderContext;
      const label = RenderLabelInner(node, cascaderContext);
      return (
        <Checkbox
          checked={node.checked}
          indeterminate={node.indeterminate}
          disabled={node.isDisabled() || (value && (value as TreeNodeValue[]).length >= max && max !== 0)}
          name={String(node.value)}
          stopLabelTrigger={!!node.children}
          title={inputVal ? getFullPathLabel(node) : node.label}
          onChange={() => {
            onChange(node);
          }}
          {...checkProps}
        >
          {label}
        </Checkbox>
      );
    };

    return (
      <li
        ref={ref || setRefCurrent}
        className={itemClass}
        onClick={(e: React.MouseEvent) => {
          e.stopPropagation();
          e?.nativeEvent?.stopImmediatePropagation?.();

          onClick(node);
        }}
        onMouseEnter={(e: React.MouseEvent) => {
          e.stopPropagation();
          onMouseEnter(node);
        }}
      >
        {multiple ? RenderCheckBox(node, cascaderContext) : RenderLabelContent(node, cascaderContext)}
        {node.children &&
          (node.loading ? (
            <TLoading className={iconClass} loading={true} size="small" />
          ) : (
            <ChevronRightIcon className={iconClass} />
          ))}
      </li>
    );
  },
);

export default Item;
