export default function hasScrollbar() {
  return document.body.scrollHeight > (window.innerHeight || document.documentElement.clientHeight);
}
