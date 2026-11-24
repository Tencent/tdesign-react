import React from 'react';
import { Message, Upload } from 'tdesign-mobile-react';
import { CameraIcon } from 'tdesign-icons-react';

export default function CustomDemo() {
  const onValidate = (context: any) => {
    if (context.type === 'FILE_OVER_SIZE_LIMIT') {
      Message.warning('文件大小超出上限');
    }
  };
  return (
    <div className="upload-demo">
      <div className="upload-title">请上传身份证人像面</div>
      <div className="upload-content">
        <Upload
          className="front"
          accept="image/png"
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          addContent={
            <div className="add-content">
              <CameraIcon strokeColor="#0152d9" size="32" />
            </div>
          }
          defaultFiles={[]}
          multiple={false}
          max={1}
          sizeLimit={{ size: 3000000, unit: 'B' }}
          onValidate={onValidate}
        />
      </div>
      <div className="upload-title">请上传身份证国徽面</div>
      <div className="upload-content">
        <Upload
          className="reverse"
          addContent={
            <div className="add-content">
              <CameraIcon strokeColor="#0152d9" size="32" />
            </div>
          }
          accept="image/png"
          action="//service-bv448zsw-1257786608.gz.apigw.tencentcs.com/api/upload-demo"
          defaultFiles={[]}
          multiple={false}
          max={1}
          sizeLimit={{ size: 3000000, unit: 'B' }}
          onValidate={onValidate}
        />
      </div>
    </div>
  );
}
