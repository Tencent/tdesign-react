import React, { forwardRef } from 'react';
import useConfig from 'src/_util/useConfig';

const Form = forwardRef(() => {
  const { classPrefix } = useConfig();
  const formClassPrefix = `${classPrefix}-form`;
  return <form className={formClassPrefix} />;
});

export default Form;
