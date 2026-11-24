import React, { useState } from 'react';
import { ConfigProvider, Upload } from 'tdesign-mobile-react';
import type { UploadRemoveContext } from 'tdesign-mobile-react';
import { merge } from 'lodash-es';
import enConfig from 'tdesign-mobile-react/es/locale/en_US';

export default function TableEn() {
  // 全局特性配置，可以引入英文默认配置 enConfig，还可以在默认配置的基础上进行自定义配置
  const globalConfig = merge(enConfig, {});

  const [files, setFiles] = useState([
    {
      url: 'https://tdesign.gtimg.com/mobile/demos/upload6.png',
      name: 'uploaded1.png',
      type: 'image',
    },
    {
      url: 'https://tdesign.gtimg.com/mobile/demos/upload4.png',
      name: 'uploaded1.png',
      type: 'image',
      percent: 68,
    },
    {
      url: 'https://tdesign.gtimg.com/mobile/demos/upload4.png',
      name: 'uploaded1.png',
      type: 'image',
    },
  ]);

  const handleRemove = (context: UploadRemoveContext) => {
    const { index } = context;
    setFiles(files.filter((item, idx) => index !== idx));
  };

  return (
    <ConfigProvider globalConfig={globalConfig}>
      <div className="upload-demo">
        <Upload
          accept="image/jpeg"
          files={files}
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          multiple
          onRemove={handleRemove}
        />
      </div>
    </ConfigProvider>
  );
}
