import React, { FC } from 'react';
import { UploadIcon as TdUploadIcon } from 'tdesign-icons-react';
import useConfig from '../hooks/useConfig';
import useGlobalIcon from '../hooks/useGlobalIcon';
import { useLocaleReceiver } from '../locale/LocalReceiver';
import { UploadConfig } from '../config-provider/type';

import Button from '../button';

export interface UploadTriggerProps {
  onClick?: () => void;
  localeFromProps?: UploadConfig;
}

const UploadTrigger: FC<UploadTriggerProps> = (props) => {
  const { classPrefix } = useConfig();
  const { UploadIcon } = useGlobalIcon({
    UploadIcon: TdUploadIcon,
  });
  const [locale, t] = useLocaleReceiver('upload');

  return (
    <div className={`${classPrefix}-upload__trigger`} onClick={props.onClick}>
      {props.children ? (
        props.children
      ) : (
        <Button icon={<UploadIcon />} variant="outline">
          {props?.localeFromProps?.triggerUploadText?.fileInput || t(locale.triggerUploadText.fileInput)}
        </Button>
      )}
    </div>
  );
};

export default UploadTrigger;
