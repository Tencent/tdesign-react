<p align="center">
  <a href="https://tdesign.tencent.com/" target="_blank">
    <img alt="TDesign Logo" width="200" src="https://tdesign.gtimg.com/site/TDesign.png" />
  </a>
</p>

<p align="center">
   <a href="https://www.npmjs.com/package/@tdesign-react/chat">
    <img src="https://img.shields.io/npm/l/@tdesign-react/chat.svg?sanitize=true" alt="License" />
  </a>
  <a href="https://app.codecov.io/gh/Tencent/@tdesign-react/chat">
    <img src="https://img.shields.io/codecov/c/github/Tencent/@tdesign-react/chat/develop.svg?style=flat-square" alt="codecov">
  </a>
  <a href="https://www.npmjs.com/package/@tdesign-react/chat">
    <img src="https://img.shields.io/npm/v/@tdesign-react/chat.svg?sanitize=true" alt="Version">
  </a>
  <a href="https://www.npmjs.com/package/@tdesign-react/chat">
    <img src="https://img.shields.io/npm/dm/@tdesign-react/chat.svg?sanitize=true" alt="Downloads" />
  </a>
</p>

TDesign AIGC Components for React Framework

# 📦 Installation

```shell
npm i @tdesign-react/chat
```

```shell
yarn add @tdesign-react/chat
```

```shell
pnpm add @tdesign-react/chat
```

# 🔨 Usage

```tsx
import React from 'react';
import { ChatBot } from '@tdesign-react/chat';
import '@tdesign-react/chat/es/style/index.js';

function App() {
  return (
    <div style={{ height: '600px' }}>
      <ChatBot
        chatServiceConfig={{
          endpoint: 'https://your-api-endpoint.com/chat',
        }}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('app')).render(<App />);
```

# Browser Support

| [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/edge/edge_48x48.png" alt="IE / Edge" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/> IE / Edge | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/firefox/firefox_48x48.png" alt="Firefox" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Firefox | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/chrome/chrome_48x48.png" alt="Chrome" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Chrome | [<img src="https://raw.githubusercontent.com/alrra/browser-logos/master/src/safari/safari_48x48.png" alt="Safari" width="24px" height="24px" />](http://godban.github.io/browsers-support-badges/)<br/>Safari |
| ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Edge >=84                                                                                                                                                                                                        | Firefox >=83                                                                                                                                                                                                      | Chrome >=84                                                                                                                                                                                                   | Safari >=14.1                                                                                                                                                                                                 |

Read our [browser compatibility](https://github.com/Tencent/tdesign/wiki/Browser-Compatibility) for more details.


# Contributing

Contributing is welcome. Read [guidelines for contributing](https://github.com/Tencent/tdesign-react/blob/develop/CONTRIBUTING.md) before submitting your [Pull Request](https://github.com/Tencent/tdesign-react/pulls).


# Feedback

Create your [Github issues](https://github.com/Tencent/tdesign-react/issues) or scan the QR code below to join our user groups

<img src="https://raw.githubusercontent.com/Tencent/tdesign/main/packages/components/src/images/groups/react-group.png" width="200" />

# License

The MIT License. Please see [the license file](./LICENSE) for more information.
