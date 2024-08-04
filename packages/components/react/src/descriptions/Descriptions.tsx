import React from 'react';
import classNames from 'classnames';
import isArray from 'lodash/isArray';
import assign from 'lodash/assign';
import { TdDescriptionItemProps, TdDescriptionsProps } from './type';
import { descriptionItemDefaultProps, descriptionsDefaultProps } from './defaultProps';
import useDefaultProps from '../hooks/useDefaultProps';
import useConfig from '../hooks/useConfig';
import useCommonClassName from '../hooks/useCommonClassName';
import { LayoutEnum, StyledProps } from '../common';
import { DescriptionsContext } from './DescriptionsContext';
import DescriptionsItem from './DescriptionsItem';
import Row from './Row';

/**
 * 实现思路
 * 1. 基于 table tbody tr td 来实现布局
 * 2. 通过 span 计算总共有几行以及每一行的 item 个数，特别注意最后一行，要填充满
 * 3. 整体布局：左右布局（column 和 span 生效）/上下布局（column 和 span 失效，一行一个 item）
 * 4. item 布局：左右布局/上下布局
 */

/**
 * TDescriptions：承载 header（title） 和 body（table, tbody）
 * TDescriptionsRow：承载每一行（tr）
 * TDescriptionsItem：获取 item 数据（span, label, content）
 */

export type DescriptionsProps = TdDescriptionsProps &
  StyledProps & {
    children?: React.ReactNode;
  };

const Descriptions = (DescriptionsProps: DescriptionsProps) => {
  const props = useDefaultProps<DescriptionsProps>(DescriptionsProps, descriptionsDefaultProps);

  const { className, style, title, bordered, column, layout, items: rowItems, children } = props;

  const { classPrefix } = useConfig();

  const COMPONENT_NAME = `${classPrefix}-descriptions`;

  const { SIZE } = useCommonClassName();

  // 计算渲染的行内容
  const getRows = () => {
    // 1. 两种方式：a. props 传 items b. slots t-descriptions-item; a 优先级更高

    let items: TdDescriptionItemProps[] = [];

    if (isArray(rowItems)) {
      /**
       * 2.1 a 方式获取 items
       * ! 这里要支持 label: string / <div></div> / () =>  <div></div>
       * ! 暂时没有这样一个全局的方法，所以先在组件内部写一个临时方法，无论之后是有了更好的处理方式要删除掉，还是其它组件也需要时再放到公共方法里面，都是可行的
       */
      items = rowItems.map((item) => {
        const { span } = assign({}, descriptionItemDefaultProps, item);
        return {
          label: item.label,
          content: item.content,
          span,
        };
      });
    } else {
      // 2.2 b 方式 获取 TDescriptionsItem
      const childrenList = React.Children.toArray(children).filter(
        (child: JSX.Element) => child.type.displayName === DescriptionsItem.displayName,
      );

      if (childrenList.length !== 0) {
        items = (childrenList as React.ReactElement[]).map(({ props: child }) => {
          const { span } = assign({}, descriptionItemDefaultProps, child);

          return {
            label: child.label,
            content: child.content ?? child.children,
            span,
          };
        });
      }
    }

    // 2. 判断布局，如果整体布局为 LayoutEnum.VERTICAL，那么直接返回即可。
    if (layout === LayoutEnum.VERTICAL) {
      return [items];
    }
    // 3. 布局为 LayoutEnum.HORIZONTAL 时，需要计算每一行的 item 个数
    let temp: TdDescriptionItemProps[] = [];
    let reset = column;
    // 4. 记录结果
    const res: TdDescriptionItemProps[][] = [];
    items.forEach((item, index) => {
      const { span } = item;
      if (reset >= span) {
        // 当前行还剩余空间
        temp.push(item);
        reset -= span;
      } else {
        // 当前行放不下了，放下一行
        res.push(temp);
        temp = [item];
        reset = column - span;
      }

      if (index === items.length - 1) {
        // 最后一个
        Reflect.set(item, 'span', span + reset);
        res.push(temp);
      }
    });

    return res;
  };

  // Header
  const renderHeader = () => (title ? <div className={`${COMPONENT_NAME}__header`}>{title}</div> : '');

  // Body
  const renderBody = () => {
    const tableClass = [`${COMPONENT_NAME}__body`, SIZE[props.size], { [`${COMPONENT_NAME}__body--border`]: bordered }];
    return (
      <table className={classNames(tableClass)}>
        <tbody>
          {getRows().map((row, i) => (
            <Row row={row} key={i} />
          ))}
        </tbody>
      </table>
    );
  };

  return (
    <DescriptionsContext.Provider value={props}>
      <div className={classNames(className, COMPONENT_NAME)} style={style}>
        {renderHeader()}
        {renderBody()}
      </div>
    </DescriptionsContext.Provider>
  );
};

Descriptions.displayName = 'Descriptions';

Descriptions.DescriptionsItem = DescriptionsItem;

export default Descriptions;
