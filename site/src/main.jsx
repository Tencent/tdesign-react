import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import ReloadPrompt from './components/ReloadPrompt';

import '@common/style/web/index.less';
import '@common/style/web/docs.less';

import 'tdesign-site-components';
import 'tdesign-site-components/lib/styles/style.css';

ReactDOM.render(
  <React.StrictMode>
    <App />
    <ReloadPrompt />
  </React.StrictMode>,
  document.getElementById('root'),
);
