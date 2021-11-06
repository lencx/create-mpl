import chalk from 'chalk';
import minimist from 'minimist';

import pkgJSON from '../package.json';
import { mplPrompts, isEmpty, isExist } from './utils';

const argv = minimist(process.argv.slice(2));

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
        message: 'Select an application type:',
        initial: 0,
        choices: [
          { title: 'Web', value: 'web' },
          { title: 'Cross Platform', value: 'cross' },
          { title: 'Extension', value: 'ext' },
          // custom: mpl-template-*
          { title: 'GitHub Template', value: 'github' },
        ],
      },
    ])
  } catch(e) {
    console.error(e);
    return;
  }

  const { projectName, type } = result;
  const appName = projectName || targetDir;

  if (['web', 'cross', 'ext', 'github'].includes(type)) {
    require(`./mpl/${type}`).default(appName);
  }
}

init()
  .catch((e) => {
    console.error(e);
  });
