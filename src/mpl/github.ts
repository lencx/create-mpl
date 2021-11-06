import chalk from 'chalk';

import { mplPrompts } from '../utils';
import ghdownload from '../download';
import { aboutScaffold } from '../about';

export default async function(appName: string) {
  const templateResult = await mplPrompts([
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
        aboutScaffold('github');
      });
  }
}