export function returnFileSize(number: number) {
  if (number < 1024) {
    return `${number} Bytes`;
  }
  if (number >= 1024 && number < 1048576) {
    return `${(number / 1024).toFixed(1)} KB`;
  }
  if (number >= 1048576) {
    return `${(number / 1048576).toFixed(1)} MB`;
  }
}

export function getCurrentDate() {
  const d = new Date();
  let month: string | number = d.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  return `${d.getFullYear()}-${month}-${d.getDate()} ${d.getHours()}:${d.getMinutes()}:${d.getSeconds()}`;
}

export const urlCreator = () => window.webkitURL || window.URL;

export function createFileURL(file: File) {
  return urlCreator()?.createObjectURL(file);
}

export function finishUpload(state) {
  return ['success', 'fail'].includes(state);
}

export function isSingleFile(multiple = false, theme: string) {
  return !multiple && ['file', 'file-input', 'image'].includes(theme);
}
