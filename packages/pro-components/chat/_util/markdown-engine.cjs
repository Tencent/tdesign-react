// Keep Cherry's synchronous browser API while deferring its DOM-only module
// initialization on the server. Rollup preserves the conditional require.
module.exports = function loadMarkdownEngine() {
  if (typeof window === 'undefined') {
    return class BrowserMarkdownEngine {
      constructor() {
        throw new Error('MarkdownEngine requires a browser DOM');
      }

      static createSyntaxHook() {
        throw new Error('MarkdownEngine extensions require a browser DOM');
      }
    };
  }
  // The conditional load keeps server imports free of browser-only initialization.
  // eslint-disable-next-line global-require
  return require('cherry-markdown/dist/cherry-markdown.stream.js').default;
};
