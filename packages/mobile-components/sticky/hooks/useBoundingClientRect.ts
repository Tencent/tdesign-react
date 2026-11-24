export default function useBoundingClientRect(dom: Element) {
    const { top, height } = dom.getBoundingClientRect();
    return {
        top,
        height
    }
}
