import React, { useEffect, useState } from 'react';
import { createRoot } from 'react-dom/client';
import { registerLocaleChange } from 'tdesign-site-components';
import App from './App';

// import tdesign style;
import 'tdesign-react/style/index.js';
import '@common/style/web/docs.less';

import 'tdesign-site-components/lib/styles/style.css';
import 'tdesign-site-components/lib/styles/prism-theme.less';
import 'tdesign-site-components/lib/styles/prism-theme-dark.less';

import 'tdesign-icons-view';

import 'tdesign-theme-generator';

import cnConfig from 'tdesign-vue-next/es/locale/zh_CN';
import enConfig from 'tdesign-vue-next/es/locale/en_US';


const rootElement = document.getElementById('app');
const root = createRoot(rootElement);

const [globalConfig, setGlobalConfig] = useState({});

useEffect(() => {
  setGlobalConfig(lang === 'en' ? enConfig : cnConfig);
  // const lang = localStorage.getItem('tdesign_site_lang');
  // if (lang) {
  //   setGlobalConfig(lang === 'en' ? enConfig : cnConfig);
  // }
}, []);

//  nextLang 'en' | 'zh'
document.addEventListener('tdesign_site_lang', ({ detail: nextLang }) => {
  // localStorage.setItem('tdesign_site_lang', nextLang);
  setGlobalConfig(lang === 'en' ? enConfig : cnConfig);
});

registerLocaleChange();

root.render(
  <React.StrictMode>
    <ConfigProvider globalConfig={globalConfig}>
      <App />
    </ConfigProvider>
  </React.StrictMode>,
);
