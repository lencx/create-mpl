import { aboutScaffold } from '../about';
import { mplPrompts, mplCmd } from '../utils';

export default async function mplMini(appName: string) {
  const result = await mplPrompts([
    {
      type: 'select',
      name: 'scaffold',
      message: () => 'Select a scaffold:',
      initial: 0,
      choices: [
        // npx @tarojs/cli init my-app
        { title: 'Taro', value: 'taro' },
        // npx @vue/cli create -p dcloudio/uni-preset-vue my-app
        { title: 'uni-app', value: 'uni' },
        // npx kbone-cli init my-app
        // { title: 'Kbone', value: 'kbone' },
      ],
    },
  ]);

  const { scaffold } = result;

  if (scaffold === 'taro') {
    mplCmd(['@tarojs/cli init', appName]);
  }

  if (scaffold === 'uni') {
    mplCmd(['@vue/cli create -p dcloudio/uni-preset-vue', appName]);
  }

  aboutScaffold(scaffold);
}