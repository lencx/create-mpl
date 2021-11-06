import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';

import { aboutScaffold } from '../about';
import { mplPrompts, mplCmd, pkgManager } from '../utils';

// const SCAFFOLD_LIST = ['vite', 'cra', 'umi', 'vue', 'svelte', 'angular', 'github'];

export default async function(appName: string) {
  const result = await mplPrompts([
    {
      type: 'select',
      name: 'scaffold',
      message: () => 'Select a scaffold:',
      initial: 0,
      choices: [
        // npm init vite@latest my-app
        { title: 'Vite', value: 'vite' },
        // npx create-react-app my-app
        { title: 'React', value: 'cra' },
        // mkdir my-app && cd my-app
        // npx @umijs/create-umi-app
        { title: 'UmiJS', value: 'umi' },
        // npx @vue/cli create my-app
        { title: 'Vue.js', value: 'vue' },
        // npx degit sveltejs/template my-svelte-project
        { title: 'Svelte', value: 'svelte' },
        // npx @angular/cli new my-app
        { title: 'Angular', value: 'angular' },
      ],
    },
  ]);

  const { scaffold } = result;
  const npxArgs = [];

  if (scaffold === 'vite') {
    mplCmd(['init vite@latest', appName], { cmd: 'npm' });
  }

  if (scaffold === 'vue') {
    mplCmd(['@vue/cli create', appName]);
  }

  if (scaffold === 'umi') {
    npxArgs.push('@umijs/create-umi-app', appName);
    const appPath = path.join(process.cwd(), appName);
    fs.mkdirs(appPath);
    mplCmd(['@umijs/create-umi-app', appName], { cwd: appPath });
    console.log(`\n$ ${chalk.green`cd`} ${appName}`);
    const _pkgManager = pkgManager();
    switch (_pkgManager) {
      case 'yarn':
        console.log(`$ ${chalk.green`yarn`}`);
        console.log(`$ ${chalk.green`yarn`} start`);
        break;
      default:
        console.log(`$ ${chalk.green(_pkgManager)} install`)
        console.log(`$ ${chalk.green(_pkgManager)} run start`)
        break;
    }
  }

  if (scaffold === 'cra') {
    // https://create-react-app.dev/docs/custom-templates/
    mplCmd(['create-react-app', appName]);
  }

  if (scaffold === 'svelte') {
    mplCmd(['degit sveltejs/template', appName]);
  }

  if (scaffold === 'angular') {
    mplCmd(['@angular/cli new', appName]);
    console.log(`\n$ ${chalk.green(`cd ` + appName)}\n`);
  }

  aboutScaffold(scaffold);
}