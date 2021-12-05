import dgh from 'dgh';
import chalk from 'chalk';

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
    aboutScaffold(scaffold);
  }

  if (scaffold === 'chrome') {
    dgh({
      owner: 'metahot',
      repo: 'chrome-extension-quick-start',
      name: appName,
    })
      .on('overwrite', (files, fs) => {
        files.forEach((file: string) => {
          if (/\/manifest.json$/.test(file)) {
            const data = fs.readJSONSync(file);
            data.name = appName;
            fs.writeJSONSync(file, data, { spaces: 2 });
          }
        })
      })
      .on('end', () => {
        console.log(`\n${chalk.gray`$`} ${chalk.green`cd`} ${appName}`);
        aboutScaffold(scaffold);
      });
  }
}