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
    setChangedProps({ ...changedProps });
  }

  return {
    changedProps,
    onConfigChange,
  };
}

export function usePanelChange(panelList) {
  const [panel, setPanel] = useState(panelList[0]?.value);

  function onPanelChange(e) {
    const { value } = e.detail;
    setPanel(value);
  }

  return {
    panel,
    onPanelChange,
  };
}

export default function BaseUsage(props) {
  const { code, configList, panelList, onConfigChange, onPanelChange, children } = props;
  const usageRef = useRef();

  function handleConfigChange(e) {
    onConfigChange?.(e);
  }

  function handlePanelChange(e) {
    onPanelChange?.(e);
  }

  useEffect(() => {
    usageRef.current.panelList = panelList;
    usageRef.current.configList = configList;
    usageRef.current.addEventListener('ConfigChange', handleConfigChange);
    usageRef.current.addEventListener('PanelChange', handlePanelChange);

    return () => {
      usageRef.current?.removeEventListener('ConfigChange', handleConfigChange);
      usageRef.current?.removeEventListener('PanelChange', handlePanelChange);
    };
  }, [configList, panelList]);

  useEffect(() => {
    usageRef.current.code = code;
  }, [code]);

  return (
    <td-doc-usage ref={usageRef}>
      {panelList.map((item) => (
        <div
          key={item.value}
          slot={item.value}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {children}
        </div>
      ))}
    </td-doc-usage>
  );
}
