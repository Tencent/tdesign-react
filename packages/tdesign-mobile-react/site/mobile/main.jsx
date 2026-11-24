import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '../style/mobile/index.less';

import '../../src/_common/style/mobile/_reset.less';

import '../../src/_common/style/mobile/theme/_index.less';

const root = ReactDOM.createRoot(document.getElementById('app'));

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
