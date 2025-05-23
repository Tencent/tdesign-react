import React, { useEffect, useState } from 'react';
import { ConfigProvider, Pagination } from 'tdesign-react';
import type { GlobalConfigProvider } from 'tdesign-react';
import enConfig from 'tdesign-react/es/locale/en_US';
import { JumperProps } from '../type';

const GlobalJumper: React.FC<JumperProps> = ({ current, pageCount, onChange }) => {
  const [jumpValue, setJumpValue] = useState<number>(current);

  useEffect(() => {
    setJumpValue(current);
  }, [current]);

  return (
    <>
      <div className="t-pagination__jump">
        <input
          className="t-input__inner"
          type="text"
          style={{ width: 10 }}
          value={jumpValue}
          onChange={(e) => setJumpValue(Number(e.target.value))}
        />
        <span> / {pageCount} 页 </span>
        <button onClick={() => onChange(jumpValue)}> 跳转 </button>
      </div>
    </>
  );
};

export default function configDemo() {
  // 全局特性配置，可以引入英文默认配置 enConfig，还可以在默认配置的基础上进行自定义配置
  const globalConfig: GlobalConfigProvider = {
    ...enConfig,
    pagination: {
      itemsPerPage: '{size} / page',
      jumpTo: 'jump to',
      total: 'Total {total} items',
      jumper: GlobalJumper,
    },
  };

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <Pagination total={36} showJumper maxPageBtn={5} />
    </ConfigProvider>
  );
}
