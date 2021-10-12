import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

import '@common/style/web/index.less';
import '@common/style/web/docs.less';

import '@common/site/lib/site.es.js';
// import '@common/site/lib/style.css';
import '@common/site/src/styles/main.less';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root'),
);
