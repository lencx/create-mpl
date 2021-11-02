
import chalk from 'chalk';

import type { ScaffoldInfo } from './types';

export const scaffoldInfos = {
  vite: {
    title: 'Vite',
    link: 'https://vitejs.dev/',
    description: 'Next Generation Frontend Tooling',
  },
  cra: {
    title: 'Create React App',
    link: 'https://create-react-app.dev/',
    description: 'Set up a modern web app by running one command.',
  },
  umi: {
    title: 'UmiJS',
    link: 'https://umijs.org/',
    description: '🍙 Extensible enterprise-level front-end application framework.',
  },
  vue: {
    title: 'Vue.js',
    link: 'https://vuejs.org/',
    description: 'The Progressive JavaScript Framework',
  },
  svelte: {
    title: 'Svelte',
    link: 'https://svelte.dev/',
    description: 'Cybernetically enhanced web apps',
  },
  angular: {
    title: 'Angular',
    link: 'https://angular.io/',
    description: 'The modern web developer\'s platform',
  },
  github: {
    title: 'Template',
    link: 'https://docs.github.com/en/repositories/creating-and-managing-repositories/creating-a-template-repository',
    description: 'Custom template based on github repository.',
  },
} as ScaffoldInfo;

export function aboutScaffold(type: string) {
  const data = scaffoldInfos[type];
  if (!data) return;
  return console.log(chalk.gray`
${'='.repeat(12)} More ${'='.repeat(12)}
[${data.title}](${chalk.cyan(data.link)})
${data.description}
`);
}