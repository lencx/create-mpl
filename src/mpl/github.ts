import chalk from 'chalk';

import ghdownload from '../download';
import { mplPrompts } from '../utils';
import { aboutScaffold } from '../about';

export default async function mplGithub(appName: string) {
  const result = await mplPrompts([
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
  ]);

  if (result.owner && result.repo) {
    ghdownload({
      owner: result.owner,
      repo: result.repo,
      ref: result.branch,
      dir: appName,
    })
      .on('error', (err) => {
        console.log(`${chalk.red`[mpl::error]`}\n${err}`)
      })
      .on('end', () => {
        console.log(`${chalk.gray`$`} ${chalk.green`cd`} ${appName}\n`);
        aboutScaffold('github');
      });
  }
}