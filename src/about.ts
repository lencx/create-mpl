
import chalk from 'chalk';

import { checkNodeModules } from './utils';
import type { ScaffoldInfo } from './types';

export const scaffoldInfos = {
  // --- GitHub Template ---
  github: {
    title: 'mpl template',
    link: 'https://github.com/lencx/awesome/blob/main/mpl.md',
    description: 'Awesome mpl template.',
  },

  // --- Web App ---
  remix: {
    title: 'Remix - Build Better Websites',
    link: 'https://remix.run/',
    description: 'Remix is a full stack web framework that lets you focus on the user interface and work back through web fundamentals to deliver a fast, slick, and resilient user experience. People are gonna love using your stuff.',
  },
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

  // --- Cross Platform ---
  // --- mini
  taro: {
    title: 'Taro',
    link: 'https://github.com/NervJS/taro',
    description: '多端统一开发解决方案',
  },
  uni: {
    title: 'uni-app',
    link: 'https://uniapp.dcloud.io',
    description: '一个使用 Vue.js 开发跨平台应用的前端框架',
  },
  // kbone: {
  //   title: 'Kbone',
  //   link: 'https://github.com/Tencent/kbone',
  //   description: '一个致力于微信小程序和 Web 端同构的解决方案',
  // },
  // --- electron
  'electron-quick-start': {
    title: 'electron-quick-start',
    link: 'https://github.com/electron/electron-quick-start',
    description: 'Clone to try a simple Electron app',
  },
  'electron-quick-start-typescript': {
    title: 'electron-quick-start',
    link: 'https://github.com/electron/electron-quick-start-typescript',
    description: 'Clone to try a simple Electron app (in TypeScript)',
  },

  // --- Extension ---
  vscode: {
    title: 'Extension API',
    link: 'https://code.visualstudio.com/api',
    description: 'Visual Studio Code has a rich extension API. Learn how to create your own extensions for VS Code.',
  },
  chrome: {
    title: 'chrome-extension-quick-start',
    link: 'https://github.com/metahot/chrome-extension-quick-start',
    description: 'Clone to try a simple chrome extension',
  },

  // --- WebAssembly ---
  wasm: {
    title: 'WebAssembly',
    link: 'https://webassembly.org/',
    description: 'WebAssembly (abbreviated Wasm) is a binary instruction format for a stack-based virtual machine. Wasm is designed as a portable compilation target for programming languages, enabling deployment on the web for client and server applications.',
  }
} as ScaffoldInfo;

export async function aboutScaffold(appName: string, type: string) {
  if (!['remix'].includes(type)) await checkNodeModules(appName);

  const data = scaffoldInfos[type];
  if (!data) return;
  return console.log(chalk.gray`
${'='.repeat(12)} More ${'='.repeat(12)}
[${data.title}](${chalk.cyan(data.link)})
${data.description}
`);
}