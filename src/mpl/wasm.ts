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
        { title: 'wasm-react', value: 'vite-rsw-wasm-template/wasm-react' },
        { title: 'wasm-vue', value: 'vite-rsw-wasm-template/wasm-vue' },
      ],
    },
  ]);

  const { repo } =  result;
  const _repo = repo.split('/');

  dgh({
    owner: 'rwasm',
    repo: _repo[0],
    ref: 'main',
    name: appName,
    subdir: _repo[1],
  })
    .on('overwrite', (files, fs) => {
      files.forEach((file: string) => {
        if (/\/package.json$/.test(file)) {
          const data = fs.readJSONSync(file);
          data.name = appName;
          fs.writeJSONSync(file, data, { spaces: 2 });
        }
      });
    })
    .on('end', () => {
      console.log(`\n${chalk.gray`$`} ${chalk.green`cd`} ${appName}`);
      aboutScaffold(appName, 'wasm');
    });
}