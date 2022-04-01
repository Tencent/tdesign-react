import React, { useEffect, useState, useRef } from 'react';

export function useConfigChange(configList) {
  const defaultProps = configList.reduce((prev, curr) => {
    if (curr.defaultValue) Object.assign(prev, { [curr.name]: curr.defaultValue });
    return prev;
  }, {});

  const [changedProps, setChangedProps] = useState(defaultProps);

  function onConfigChange(e) {
    const { name, value } = e.detail;

    changedProps[name] = value;
    setChangedProps({...changedProps});
  }

  return {
    changedProps,
    onConfigChange,
  };
}

export default function BaseUsage(props) {
  const { code, configList, onConfigChange, children } = props;
  const usageRef = useRef();

  function handleConfigChange(e) {
    onConfigChange?.(e);
  }

  useEffect(() => {
    usageRef.current.configList = configList;
    usageRef.current.addEventListener('ConfigChange', handleConfigChange);
  }, [configList]);
  
  useEffect(() => {
    usageRef.current.code = code;
  }, [code]);

  return (
    <td-doc-usage ref={usageRef}>
      {children}
    </td-doc-usage>
  );
}
