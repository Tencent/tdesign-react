import React from 'react';
import ReactDOM from 'react-dom/client';

import { registerLocaleChange } from '@tdesign/site-components';
import '@tdesign/site-components/lib/styles/prism-theme-dark.less';
import '@tdesign/site-components/lib/styles/prism-theme.less';
import '@tdesign/site-components/lib/styles/style.css';

import '@tdesign/theme-generator';

import App from './App';
import '../style/web/index.less';

registerLocaleChange();

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
