import path from 'path';
import chalk from 'chalk';
import fs from 'fs-extra';
import prompts from 'prompts';
import minimist from 'minimist';
import { spawnSync } from 'child_process';
import pkgJSON from '../package.json';

import ghdownload from './github-download';
import { aboutScaffold } from './about';

const argv = minimist(process.argv.slice(2));
const cwd = process.cwd();

const SCAFFOLD_LIST = ['vite', 'cra', 'umi', 'vue', 'svelte', 'angular', 'github'];

async function init() {
  let targetDir = argv._[0];
  let _scaffold = argv._[1];
  const defaultProjectName = !targetDir ? 'mpl-project' : targetDir;
  let result: Record<string, string> = {};

  const help = argv.h || argv.help;
  const version = argv.v || argv.version;

  if (version) {
    console.log(pkgJSON.version);
    return;
  }

  if (help) {
    console.log(`mpl <command>
https://github.com/lencx/create-mpl

Usage:
mpl [project-name] [scaffold]
    -h, --help          quick help on <command>
    -v, --version       output the version number
`);
    return;
  }

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
        type: SCAFFOLD_LIST.includes(_scaffold) ? null : 'select',
        name: 'scaffold',
        message: () => {
          if (!_scaffold) return 'Select a scaffold:'
          return SCAFFOLD_LIST.includes(_scaffold)
            ? null
            : `${chalk.red(_scaffold)} is invalid, currently supports: \n`;
        },
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
          // custom: mpl-template-*
          { title: 'GitHub Template', value: 'github' },
        ],
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

  const { projectName, scaffold: _scaffold2 } = result;
  const scaffold = _scaffold2 || _scaffold;
  const appName = projectName || targetDir;
  const npxArgs = [];

  if (scaffold === 'vite') {
    npxArgs.push('init vite@latest', appName);
    spawnSync('npm', npxArgs, { shell: true, cwd, stdio: 'inherit' });
  }

  if (scaffold === 'vue') {
    npxArgs.push('@vue/cli create', appName);
    spawnSync('npx', npxArgs, { shell: true, cwd, stdio: 'inherit' });
  }

  if (scaffold === 'umi') {
    npxArgs.push('@umijs/create-umi-app', appName);
    const appPath = path.join(process.cwd(), appName);
    fs.mkdirs(appPath);
    spawnSync('npx', npxArgs, { shell: true, cwd: appPath, stdio: 'inherit' });
    console.log(`\n$ ${chalk.green(`cd ` + appName)}\n`);
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

  if (scaffold === 'angular') {
    npxArgs.push('@angular/cli new', appName);
    spawnSync('npx', npxArgs, { shell: true, cwd, stdio: 'inherit' });
    console.log(`\n$ ${chalk.green(`cd ` + appName)}\n`);
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
          aboutScaffold(scaffold);
        });

      return;
    }
  }

  aboutScaffold(scaffold);
}

init()
  .catch((e) => {
    console.error(e);
  });


function isEmpty(path: string) {
  return fs.readdirSync(path).length === 0;
}