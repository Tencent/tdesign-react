export default function copyText(text: string) {
  if ('clipboard' in navigator) {
    navigator.clipboard.writeText(text);
    return;
  }

  const textarea = document.createElement('textarea');
  textarea.textContent = text;
  textarea.style.width = '0px';
  textarea.style.height = '0px';
  document.body.appendChild(textarea);

  const selection = document.getSelection();
  const range = document.createRange();
  range.selectNode(textarea);
  selection.removeAllRanges();
  selection.addRange(range);

  document.execCommand('copy');
  selection.removeAllRanges();
  document.body.removeChild(textarea);
}
