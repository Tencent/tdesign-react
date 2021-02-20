import React, { forwardRef } from 'react';
import useConfig from '../_util/useConfig';

const FormItem = forwardRef(() => {
  const { classPrefix } = useConfig();
  const formClassPrefix = `${classPrefix}-form-item`;
  return <div className={formClassPrefix} />;
});

export default FormItem;
