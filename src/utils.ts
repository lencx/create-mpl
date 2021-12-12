import fs from 'fs';
import path from 'path';
import chalk from 'chalk';
import prompts from 'prompts';
import { spawnSync } from 'child_process';

const root = process.cwd();

export const mplPrompts = async (options: Array<prompts.PromptObject>) => await prompts(options, {
  onCancel: () => {
    throw new Error(chalk.red`✖` + ' Operation cancelled')
  }
});

export const checkNodeModules = async (appName: string) => {
  const hasPkg = fs.existsSync(`${appName}/package.json`);
  const hasNodeModules = fs.existsSync(`${appName}/node_modules`);
  if (hasNodeModules || !hasPkg) return;
  console.log();

  const _pkgManager = pkgManager();
  const result = await mplPrompts([
    {
      type: 'confirm',
      name: 'install',
      message: `Do you want me to run \`${_pkgManager} install\`?`,
      initial: true,
    },
  ]);

  if (result.install) {
    spawnSync(_pkgManager, ['install'], { shell: true, cwd: path.join(process.cwd(), appName), stdio: 'inherit' });
  }
};

export const mplCmd = (args: Array<string>, options?: Partial<Record<'cmd' | 'cwd', string>>) => {
  const { cmd = 'npx', cwd = root } = options || {};
  spawnSync(cmd, args, { shell: true, cwd, stdio: 'inherit' });
}

export const isEmpty = (path: string) => fs.readdirSync(path).length === 0;

export const isExist = (path: string) => fs.existsSync(path);

export const pkgFromUserAgent = (userAgent: string) => {
  if (!userAgent) return undefined;
  const pkgSpec = userAgent.split(' ')[0];
  const pkgSpecArr = pkgSpec.split('/');
  return {
    name: pkgSpecArr[0],
    version: pkgSpecArr[1]
  };
}

export const pkgManager = () => {
  // process.env.npm_config_user_agent:
  // > yarn/1.22.15 npm/? node/v16.10.0 darwin x64
  // > npm/7.24.0 node/v16.10.0 darwin x64 workspaces/false
  // > pnpm/6.16.1 npm/? node/v16.10.0 darwin x64
  const pkgInfo = pkgFromUserAgent(process.env.npm_config_user_agent);
  return pkgInfo ? pkgInfo.name : 'npm';
}
