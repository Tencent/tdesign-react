export function attachMethodsToComponent(component: any, methods: any) {
  const comp = component;
  // eslint-disable-next-line guard-for-in
  for (const method in methods) {
    comp[method] = methods[method];
  }
  return comp;
}
