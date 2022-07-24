export const downloadFile = (path: string) => {
  const xhr = new XMLHttpRequest();
  xhr.open('get', path);
  xhr.responseType = 'blob';
  xhr.send();
  xhr.onerror = () => {
    window.open(path, '_blank');
  };
  xhr.onload = () => {
    if (xhr.status === 200 || xhr.status === 304) {
      const name = path.split('/').pop() || Math.random().toString(32).slice(2);
      const url = URL.createObjectURL(xhr.response);
      const a = document.createElement('a');
      a.href = url;
      a.download = name;
      a.click();
      URL.revokeObjectURL(url);
    }
  };
};
