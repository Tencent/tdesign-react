import React from 'react';
import TDemoBlock from '../../../site/mobile/components/DemoBlock';
import TDemoHeader from '../../../site/mobile/components/DemoHeader';
import BaseExample from './base';
import ScrollExample from './scroll';
import StripeExample from './stripe';
import BorderedExample from './bordered';
import EllipsisExample from './ellipsis';
import CustomRowStyleExample from './custom-row-style';
import RowspanColspanExample from './rowspan-colspan';
import DragSortExample from './drag-sort';
import LoadingExample from './loading';
import SelectExample from './select';
import FilterSortExample from './filter-sort';

import './style/index.less';

export default function Base() {
  return (
    <div className="tdesign-mobile-demo">
      <TDemoHeader
        title="Table 表格"
        summary=" 表格常用于展示同类结构下的多种数据，易于组织、对比和分析等，并可对数据进行搜索、筛选、排序等操作。一般包括表头、数据行和表尾三部分。 "
      />
      <TDemoBlock title="01 组件类型" summary="基础表格" padding={true}>
        <BaseExample />
      </TDemoBlock>

      <TDemoBlock summary="横向平铺可滚动表格" padding={true}>
        <ScrollExample />
      </TDemoBlock>

      <TDemoBlock title="02 组件状态" summary="单元格超出省略的表格" padding={true}>
        <EllipsisExample />
      </TDemoBlock>

      <TDemoBlock title="03 组件样式" summary="带斑马纹表格" padding={true}>
        <StripeExample />
      </TDemoBlock>

      <TDemoBlock summary="带边框表格" padding={true}>
        <BorderedExample />
      </TDemoBlock>

      <TDemoBlock summary="可自定义样式的表格" padding={true}>
        <CustomRowStyleExample />
      </TDemoBlock>

      <TDemoBlock summary="带合并单元格的表格" padding={true}>
        <RowspanColspanExample />
      </TDemoBlock>

      <TDemoBlock summary="带拖拽的表格" padding={true}>
        <DragSortExample />
      </TDemoBlock>

      <TDemoBlock summary="带加载的表格" padding={true}>
        <LoadingExample />
      </TDemoBlock>

      <TDemoBlock summary="带选择的表格" padding={true}>
        <SelectExample />
      </TDemoBlock>

      <TDemoBlock summary="带筛选的表格" padding={true}>
        <FilterSortExample />
      </TDemoBlock>
    </div>
  );
}
