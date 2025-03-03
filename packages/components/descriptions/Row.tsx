import React, { useContext } from 'react';
import { TdDescriptionItemProps } from './type';
import { LayoutEnum } from '../common';
import useConfig from '../hooks/useConfig';
import { DescriptionsContext } from './DescriptionsContext';
import { useLocaleReceiver } from '../locale/LocalReceiver';

export type RowProps = { row: TdDescriptionItemProps[] };

const Row: React.FC<RowProps> = (props) => {
  const { row } = props;

  const { classPrefix } = useConfig();
  const [locale, t] = useLocaleReceiver('descriptions');
  const descriptionsContext = useContext(DescriptionsContext);

  const COMPONENT_NAME = `${classPrefix}-descriptions`;

  // label
  const label = (node: TdDescriptionItemProps, layout: LayoutEnum = 'horizontal', rowKey?: string) => {
    const { span } = node;
    const labelSpan = layout === 'horizontal' ? 1 : span;
    return (
      <td
        key={rowKey}
        colSpan={labelSpan}
        className={`${COMPONENT_NAME}__label`}
        style={descriptionsContext.labelStyle}
      >
        {node.label}
        {descriptionsContext.colon && t(locale.colonText)}
      </td>
    );
  };

  // content
  const content = (node: TdDescriptionItemProps, layout: LayoutEnum = 'horizontal', rowKey?: string) => {
    const { span } = node;
    const contentSpan = span > 1 && layout === 'horizontal' ? span * 2 - 1 : span;
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
      <tr>{row.map((node, i) => label(node, 'vertical', `top_${i}`))}</tr>
      <tr>{row.map((node, i) => content(node, 'vertical', `bottom_${i}`))}</tr>
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

  if (descriptionsContext.layout === 'horizontal') {
    if (descriptionsContext.itemLayout === 'horizontal') {
      return hh();
    }
    return hv();
  }
  if (descriptionsContext.itemLayout === 'horizontal') {
    return vh();
  }
  return vv();
};

Row.displayName = 'DescriptionsRow';

export default Row;
