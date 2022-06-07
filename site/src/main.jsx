import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ReloadPrompt from './components/ReloadPrompt';

// import tdesign style;
import 'tdesign-react/style/index.js';
import '@common/style/web/docs.less';

import 'tdesign-site-components';
import 'tdesign-site-components/lib/styles/style.css';
import 'tdesign-site-components/lib/styles/prism-theme.less';
import 'tdesign-site-components/lib/styles/prism-theme-dark.less';

import 'tdesign-icons-view';

import 'tdesign-theme-generator';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <ReloadPrompt />
  </React.StrictMode>,
  document.getElementById('app'),
);
