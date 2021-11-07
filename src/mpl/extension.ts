import chalk from 'chalk';
import fs from 'fs-extra';

import ghdownload from '../download';
import { mplPrompts, mplCmd } from '../utils';
import { aboutScaffold } from '../about';

export default async function mplExtension(appName: string) {
  const result = await mplPrompts([
    {
      type: 'select',
      name: 'scaffold',
      message: 'Select a scaffold:',
      initial: 0,
      choices: [
        { title: 'Visual Studio Code', value: 'vscode' },
        { title: 'Chrome', value: 'chrome' },
      ],
    },
  ]);

  const { scaffold } =  result;

  if (scaffold === 'vscode') {
    mplCmd([
      '--package yo',
      '--package generator-code',
      '--',
      'yo code',
      appName,
    ]);
  }

  if (scaffold === 'chrome') {
    ghdownload({
      owner: 'metahot',
      repo: 'chrome-extension-quick-start',
      ref: 'main',
      dir: appName,
      overwrite: (file: string) => {
        if (/\/manifest.json$/.test(file)) {
          const data = fs.readJSONSync(file);
          data.name = appName;
          fs.writeJSONSync(file, data, { spaces: 2 });
        }
      },
    })
      .on('error', (err) => {
        console.log(`${chalk.red`[mpl::error]`}\n${err}`)
      })
      .on('end', () => {
        console.log(`${chalk.gray`$`} ${chalk.green`cd`} ${appName}\n`);
        aboutScaffold(scaffold);
      });
  }

  aboutScaffold(scaffold);
}