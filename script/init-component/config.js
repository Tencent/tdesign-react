function getToBeCreatedFiles(component, pascalCaseName) {
  return {
    [`src/${component}`]: {
      // set up source code
      desc: 'component source code',
      files: [
        {
          file: 'index.ts',
          template: 'index.tsx.tpl',
        },
        {
          file: `${pascalCaseName}.tsx`,
          template: 'component.tsx.tpl',
        },
        {
          file: `api.md`,
          template: 'api.md.tpl',
        },
        {
          file: `README.md`,
          template: 'readme.md.tpl',
        },
      ],
    },
    [`src/${component}/_example`]: {
      // set up _example dir
      desc: 'component example dir',
      files: [
        {
          file: `base.jsx`,
          template: 'example.base.jsx.tpl',
        },
      ],
    },
    [`src/${component}/__tests__`]: {
      // set up __tests__ dir
      desc: 'component test root file',
      files: [
        {
          file: `${component}.test.tsx`,
          template: 'index.test.tsx.tpl',
        },
      ],
    },
    [`src/${component}/style`]: {
      // set up style dir
      desc: 'style dir in every component for tree-shaking',
      files: [
        {
          file: `css.js`,
          template: 'style.css.js.tpl',
        },
        {
          file: `index.js`,
          template: 'style.index.js.tpl',
        },
      ],
    },
  };
}

module.exports = {
  getToBeCreatedFiles,
};
