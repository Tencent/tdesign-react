export function getRoute(list, docRoutes) {
  list.forEach((item) => {
    if (item.children) {
      return getRoute(item.children, docRoutes);
    }
    return docRoutes.push(item);
  });
  return docRoutes;
}

// 过滤小版本号
export function filterVersions(versions = []) {
  const versionMap = new Map();

  versions.forEach((v) => {
    if (v.includes('-')) return false;
    const nums = v.split('.');
    versionMap.set(`${nums[0]}.${nums[1]}`, v);
  });

  return [...versionMap.values()].sort((a, b) => {
    return Number(a.split('.').slice(0, 2).join('.')) - Number(b.split('.').slice(0, 2).join('.'));
  });
}
