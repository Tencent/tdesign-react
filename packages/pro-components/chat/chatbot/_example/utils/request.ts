export const endpoint = (() => {
  const isLocal = ['localhost', '127.0.0.1'].includes(window.location.hostname);
  return isLocal ? 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com' : 'https://1257786608-9i9j1kpa67.ap-guangzhou.tencentscf.com';
})();
