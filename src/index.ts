import chalk from 'chalk';
import minimist from 'minimist';

import pkgJSON from '../package.json';
import { mplPrompts, isEmpty, isExist } from './utils';

const argv = minimist(process.argv.slice(2));

const appTypes = [
  { title: 'Web App', value: 'web' },
  { title: 'Mini Program', value: 'mini' },
  { title: 'WebAssembly', value: 'wasm' },
  { title: 'Extension', value: 'extension' },
  { title: 'Electron', value: 'electron' },
  // custom: mpl-template-*
  { title: 'GitHub Template', value: 'github' },
];

async function init() {
  let targetDir = argv._[0];
  let mplType = argv.type || argv.t;
  const defaultProjectName = !targetDir ? 'mpl-project' : targetDir;
  const hasType = appTypes.map(i => i.value).includes(mplType);
  let result: Record<string, string> = {};

  console.log('⚡️' + chalk.gray(`v${pkgJSON.version}`));

  try {
    result = await mplPrompts([
      {
        type: targetDir ? null : 'text',
        name: 'projectName',
        message: 'Project name:',
        initial: defaultProjectName,
        onState: (state) => (targetDir = state.value.trim() || defaultProjectName),
      },
      {
        type: () => (!isExist(targetDir) || isEmpty(targetDir)) ? null : 'confirm',
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
        type: hasType ? null : 'select',
        name: 'type',
        message: 'Select an application types:',
        initial: 0,
        choices: appTypes,
        onState: (state) => (mplType = state.value),
      },
    ])
  } catch(e) {
    console.error(e);
    return;
  }

  const { projectName, type } = result;
  const appName = projectName || targetDir;
  const appType = type || mplType;

  if (appTypes.map(i => i.value).includes(appType)) {
    require(`./mpl/${appType}`).default(appName);
  }
}

init()
  .catch((e) => {
    console.error(e);
  });