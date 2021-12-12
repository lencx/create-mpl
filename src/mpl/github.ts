import dgh from 'dgh';
import chalk from 'chalk';

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
      initial: 'HEAD',
      onState: (state) => state.value.trim(),
    },
    {
      type: 'text',
      name: 'subdir',
      message: 'sub dir:',
      initial: '/',
      onState: (state) => state.value.trim(),
    },
  ]);

  if (result.owner && result.repo) {
    const subdir = result.subdir.split(/^\//)[1] || '';

    dgh({
      owner: result.owner,
      repo: result.repo,
      ref: result.branch,
      name: appName,
      subdir,
    })
      .on('end', () => {
        console.log(`\n${chalk.gray`$`} ${chalk.green`cd`} ${appName}`);
        aboutScaffold(appName, 'github');
      });
  }
}
