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
  const versionMap = Object.create(null);

  versions.forEach((v) => {
    const nums = v.split('.');
    versionMap[nums[deep]] = v;
  });

  return Object.values(versionMap)
    .sort((a, b) => {
      return semver.gt(b, a) ? -1 : 1;
    })
    .filter((v) => !v.includes('alpha') && !v.includes('patch'));
}