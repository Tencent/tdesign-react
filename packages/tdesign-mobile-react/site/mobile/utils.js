export function getRoute(list, docRoutes) {
  list.forEach((item) => {
    if (item.children) {
      return getRoute(item.children, docRoutes);
    }
    return docRoutes.push({
      ...item,
      path: `/${item.name}`
    });
  });
  return docRoutes;
}

export function getCurrentRoute(docRoutes, name) {
  const currentRoutes = docRoutes?.filter(item => item.name === name) || [];
  return currentRoutes.length > 0 ? currentRoutes[0] : {};
}
