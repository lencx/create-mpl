#!/usr/bin/env node

import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import prompts from 'prompts';
import minimist from 'minimist';
import { spawnSync } from 'child_process';

import ghdownload from './github-download';

const argv = minimist(process.argv.slice(2));
const cwd = process.cwd();

async function init() {
  let targetDir = argv._[0];
  const defaultProjectName = !targetDir ? 'mpl-project' : targetDir;
  let result: Record<string, string> = {};

  try {
    result = await prompts([
      {
        type: targetDir ? null : 'text',
        name: 'projectName',
        message: 'Project name:',
        initial: defaultProjectName,
        onState: (state) => (targetDir = state.value.trim() || defaultProjectName),
      },
      {
        type: () => !fs.existsSync(targetDir) || isEmpty(targetDir) ? null : 'confirm',
        name: 'overwrite',
        message: () => (
          targetDir === '.'
            ? 'Current directory'
            : `Target directory "${targetDir}"`) +
          ` is not empty. Remove existing files and continue?`,
      },
      {
        type: (_, { overwrite }: any = {}) => {
          if (overwrite === false) {
            throw new Error(chalk.red`✖` + ' Operation cancelled');
          }
          return null
        },
        name: 'overwriteChecker'
      },
      {
        type: 'select',
        name: 'scaffold',
        message: 'Select a scaffold:',
        initial: 0,
        choices: [
          // npm init vite@latest my-app
          { title: 'Vite', value: 'vite' },
          // npx create-react-app my-app
          { title: 'Create React App', value: 'cra' },
          // mkdir my-app && cd my-app
          // npx @umijs/create-umi-app
          { title: 'UmiJS', value: 'umi' },
          // npx @vue/cli create my-app
          { title: 'Vue', value: 'vue' },
          // npx degit sveltejs/template my-svelte-project
          { title: 'Svelte', value: 'svelte' },
          // custom: mpl-template-*
          { title: 'GitHub Template', value: 'github' },
        ]
      },
    ], {
      onCancel: () => {
        throw new Error(chalk.red`✖` + ' Operation cancelled')
      }
    })
  } catch(e) {
    console.error(e);
    return;
  }

  const { projectName, scaffold } = result;
  const npxArgs = [];
  const appName = projectName || targetDir;

  if (scaffold === 'vite') {
    npxArgs.push('init vite@latest', appName);
    spawnSync('npm', npxArgs, { shell: true, cwd, stdio: 'inherit' });
  }

  if (scaffold === 'vue') {
    console.log();
    console.log(`$ ${chalk.green`npm install -g @vue/cli`}`);
    console.log(`$ ${chalk.green(`vue create ` + appName)}`);
    console.log();
  }

  if (scaffold === 'umi') {
    npxArgs.push('@umijs/create-umi-app', appName);
    const appPath = path.join(process.cwd(), appName);
    fs.mkdirs(appPath);
    spawnSync('npx', npxArgs, { shell: true, cwd: appPath, stdio: 'inherit' });
  }

  if (scaffold === 'cra') {
    // https://create-react-app.dev/docs/custom-templates/
    npxArgs.push('create-react-app', appName);
    spawnSync('npx', npxArgs, { shell: true, cwd, stdio: 'inherit' });
  }

  if (scaffold === 'svelte') {
    npxArgs.push('degit sveltejs/template', appName);
    spawnSync('npx', npxArgs, { shell: true, cwd, stdio: 'inherit' });
  }

  if (scaffold === 'github') {
    const templateResult = await prompts([
      {
        type: 'text',
        name: 'owner',
        message: 'github owner:',
        initial: '',
        onState: (state) => state.value.trim(),
        validate: (v) => !!v,
      },
      {
        type: 'text',
        name: 'repo',
        message: 'github repo:',
        initial: 'mpl-template-',
        onState: (state) => state.value.trim(),
      },
      {
        type: 'text',
        name: 'branch',
        message: 'repo branch:',
        initial: 'master',
        onState: (state) => state.value.trim(),
      },
    ], {
      onCancel: () => {
        throw new Error(chalk.red`✖` + ' Operation cancelled')
      }
    });

    if (templateResult.owner && templateResult.repo) {
      ghdownload({
        owner: templateResult.owner,
        repo: templateResult.repo,
        ref: templateResult.branch,
        dir: appName,
      })
        .on('error', (err) => {
          console.log(`${chalk.red`[mpl::error]`}\n${err}`)
        })
        .on('end', () => {
          console.log(`$ ${chalk.green(`cd ` + appName)}\n`);
        });
    }
  }
}

init()
  .catch((e) => {
    console.error(e);
  });


function isEmpty(path: string) {
  return fs.readdirSync(path).length === 0;
}