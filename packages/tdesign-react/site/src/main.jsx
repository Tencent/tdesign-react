import React from 'react';
import { createRoot } from 'react-dom/client';
import { registerLocaleChange } from 'tdesign-site-components';
import App from './App';

// import tdesign style;
import '@tdesign/components/style/index.js';
import '@tdesign/common-style/web/docs.less';

import 'tdesign-site-components/lib/styles/style.css';
import 'tdesign-site-components/lib/styles/prism-theme.less';
import 'tdesign-site-components/lib/styles/prism-theme-dark.less';

import 'tdesign-icons-view';

import 'tdesign-theme-generator';

const rootElement = document.getElementById('app');
const root = createRoot(rootElement);

registerLocaleChange();

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
