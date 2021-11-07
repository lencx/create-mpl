import chalk from 'chalk';
import minimist from 'minimist';

import pkgJSON from '../package.json';
import { mplPrompts, isEmpty, isExist } from './utils';

const argv = minimist(process.argv.slice(2));

const appTypes = [
  { title: 'Web App', value: 'web' },
  { title: 'Mini Program', value: 'mini' },
  { title: 'Extension', value: 'extension' },
  { title: 'Electron', value: 'electron' },
  // custom: mpl-template-*
  { title: 'GitHub Template', value: 'github' },
];

async function init() {
  let targetDir = argv._[0];
  const defaultProjectName = !targetDir ? 'mpl-project' : targetDir;
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
        type: 'select',
        name: 'type',
        message: 'Select an application types:',
        initial: 0,
        choices: appTypes,
      },
    ])
  } catch(e) {
    console.error(e);
    return;
  }

  const { projectName, type } = result;
  const appName = projectName || targetDir;

  if (appTypes.map(i => i.value).includes(type)) {
    require(`./mpl/${type}`).default(appName);
  }
}

async function cli() {
  try {
    await init();
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
}

if (require.main === module) cli();