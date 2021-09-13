import ContributorsData from '@common/contributors/component-contributors.json';
import ContributorsInfo from '@common/contributors/contributors-info.json';

const taskReg = /api|interaction|design|ui|react|react-test/;

export function getContributors(name) {
  const componentInfo = ContributorsData.web.find((item) => item.name === name);
  if (!componentInfo) {
    return [];
  }

  let { tasks } = componentInfo;
  tasks = tasks.filter((item) => item.name.search(taskReg) !== -1 && item.contributors.length > 0);

  const members = {};
  tasks.forEach((c) => {
    ['contributors', 'pmcs'].forEach(key => {
      c[key].forEach((m) => {
        if (members[m]) {
          members[m].role.push(c.name);
          members[m].roleName.push(c.fullName);
        } else {
          members[m] = {
            role: [c.name],
            roleName: [c.fullName],
          };
        }
      });
    })
  });

  return Object.keys(members).map((username) => {
    const userInfo = ContributorsInfo[username] || {};
    if (userInfo.bgName) {
      const match = userInfo.bgName.match(/^[a-z]+/i);
      userInfo.bgName = match ? match[0] : userInfo.bgName;
      userInfo.department = `${userInfo.bgName}/${userInfo.departmentName}`;
    }
    return {
      username,
      roleNames: [...new Set(members[username].roleName)].join('/'),
      ...members[username],
      ...userInfo,
    };
  });
}

export function getRoute(list, docRoutes) {
  list.forEach((item) => {
    if (item.children) {
      return getRoute(item.children, docRoutes);
    }
    return docRoutes.push(item);
  });
  return docRoutes;
}
