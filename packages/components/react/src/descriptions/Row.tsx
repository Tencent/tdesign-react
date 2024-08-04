import React, { useContext } from 'react';
import { TdDescriptionItemProps } from './type';
import { LayoutEnum } from '../common';
import useConfig from '../hooks/useConfig';
import { DescriptionsContext } from './DescriptionsContext';

export type RowProps = { row: TdDescriptionItemProps[] };

const Row: React.FC<RowProps> = (props) => {
  const { row } = props;

  const { classPrefix } = useConfig();
  const descriptionsContext = useContext(DescriptionsContext);

  const COMPONENT_NAME = `${classPrefix}-descriptions`;

  // label
  const label = (node: TdDescriptionItemProps, layout: LayoutEnum = LayoutEnum.HORIZONTAL, rowKey?: string) => {
    const { span } = node;
    const labelSpan = layout === LayoutEnum.HORIZONTAL ? 1 : span;
    return (
      <td
        key={rowKey}
        colSpan={labelSpan}
        className={`${COMPONENT_NAME}__label`}
        style={descriptionsContext.labelStyle}
      >
        {node.label}
        {descriptionsContext.colon && ':'}
      </td>
    );
  };

  // content
  const content = (node: TdDescriptionItemProps, layout: LayoutEnum = LayoutEnum.HORIZONTAL, rowKey?: string) => {
    const { span } = node;
    const contentSpan = span > 1 && layout === LayoutEnum.HORIZONTAL ? span * 2 - 1 : span;
    return (
      <td
        key={rowKey}
        colSpan={contentSpan}
        className={`${COMPONENT_NAME}__content`}
        style={descriptionsContext.contentStyle}
      >
        {node.content}
      </td>
    );
  };

  // 总共有四种布局
  // Layout horizontal vertical
  // itemLayout horizontal vertical

  const hh = () => (
    <tr>
      {row.map((node, i) => (
        <React.Fragment key={i}>
          {label(node)}
          {content(node)}
        </React.Fragment>
      ))}
    </tr>
  );

  const hv = () => (
    <>
      <tr>{row.map((node, i) => label(node, LayoutEnum.VERTICAL, `top_${i}`))}</tr>
      <tr>{row.map((node, i) => content(node, LayoutEnum.VERTICAL, `bottom_${i}`))}</tr>
    </>
  );

  const vh = () => (
    <>
      {row.map((node, i) => (
        <tr key={i}>
          {label(node)}
          {content(node)}
        </tr>
      ))}
    </>
  );

  const vv = () => (
    <>
      {row.map((node, i) => (
        <React.Fragment key={i}>
          <tr>{label(node)}</tr>
          <tr>{content(node)}</tr>
        </React.Fragment>
      ))}
    </>
  );

  if (descriptionsContext.layout === LayoutEnum.HORIZONTAL) {
    if (descriptionsContext.itemLayout === LayoutEnum.HORIZONTAL) {
      return hh();
    }
    return hv();
  }
  if (descriptionsContext.itemLayout === LayoutEnum.HORIZONTAL) {
    return vh();
  }
  return vv();
};

Row.displayName = 'DescriptionsRow';

export default Row;
