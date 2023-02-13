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
export function filterVersions(versions = [], deep = 1) {
  const versionMap = Object.create(null);

  versions.forEach((v) => {
    const nums = v.split('.');
    versionMap[nums[deep]] = v;
  });

  return Object.values(versionMap)
    .sort((a, b) => {
      return Number(a.split('.').slice(0, 2).join('.')) - Number(b.split('.').slice(0, 2).join('.'));
    })
    .filter((v) => !v.includes('alpha') && !v.includes('patch'));
}