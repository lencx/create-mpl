import dgh from 'dgh';
import chalk from 'chalk';

import { mplPrompts } from '../utils';
import { aboutScaffold } from '../about';

export default async function mplElectron(appName: string) {
  const result = await mplPrompts([
    {
      type: 'select',
      name: 'repo',
      message: 'Select a scaffold:',
      initial: 0,
      choices: [
        { title: 'Electron Quick Start', value: 'electron-quick-start' },
        { title: 'Electron Quick Start (TypeScript)', value: 'electron-quick-start-typescript' },
      ],
    },
  ]);

  const { repo } =  result;

  dgh({
    owner: 'electron',
    repo: repo,
    name: appName,
  })
    .on('end', () => {
      console.log(`\n${chalk.gray`$`} ${chalk.green`cd`} ${appName}`);
      aboutScaffold(appName, repo);
    });
}