import React, { useEffect, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { Button } from '@tdesign/components';
import DraggableButton from './DraggableButton';

export const demoFiles = import.meta.glob('../../../../components/**/_example/*.tsx');

const demoObject = {};
Object.keys(demoFiles).forEach((key) => {
  const match = key.match(/([\w-]+)._example.([\w-]+).tsx/);
  const [, componentName, demoName] = match;

  demoObject[`${componentName}/${demoName}`] = demoFiles[key];
  if (demoObject[componentName]) {
    demoObject[componentName].push(demoName);
  } else {
    demoObject[componentName] = [demoName];
  }
});

const DynamicDemo = ({ componentName, demoName }) => {
  const [key, setKey] = useState(0);
  const [Demo, setDemo] = useState(null);

  useEffect(() => {
    const loadDemo = async () => {
      const demoLoader = demoObject[`${componentName}/${demoName}`];
      if (demoLoader) {
        const module = await demoLoader();
        setDemo(() => module.default);
      }
    };
    loadDemo();
  }, [componentName, demoName]);

  const handleReset = () => {
    setKey((prev) => prev + 1);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      // 快捷键：Option + R
      if (event.altKey && event.code === 'KeyR') {
        event.preventDefault();
        handleReset();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  if (!Demo) return;
  return (
    <>
      <DraggableButton onClick={handleReset}>重置状态</DraggableButton>
      <Demo key={key} />
    </>
  );
};

export default function Demo() {
  const location = useLocation();
  const match = location.pathname.match(/\/react\/demos\/([\w-]+)\/?([\w-]+)?/);
  const [, componentName, demoName] = match;

  const demoList = demoObject[componentName];
  const hasSpecificDemo = demoObject[`${componentName}/${demoName}`];

  return hasSpecificDemo ? (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        padding: '0 40px',
      }}
    >
      <div>
        <DynamicDemo componentName={componentName} demoName={demoName} />
      </div>
    </div>
  ) : (
    <ul style={{ margin: '48px 200px' }}>
      {demoList?.map((demoName) => (
        <li key={demoName}>
          <Link to={`/react/demos/${componentName}/${demoName}`}>
            <Button style={{ fontSize: 18 }} variant="text">
              {demoName}
            </Button>
          </Link>
        </li>
      ))}
    </ul>
  );
}
