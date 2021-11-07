import chalk from 'chalk';

import ghdownload from '../download';
import { mplPrompts } from '../utils';
import { aboutScaffold } from '../about';

export default async function(appName: string) {
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

  ghdownload({
    owner: 'electron',
    repo: repo,
    ref: 'master',
    dir: appName,
  })
    .on('error', (err) => {
      console.log(`${chalk.red`[mpl::error]`}\n${err}`)
    })
    .on('end', () => {
      console.log(`${chalk.gray`$`} ${chalk.green`cd`} ${appName}\n`);
      aboutScaffold(repo);
    });
}