import fs from 'fs';
import chalk from 'chalk';
import prompts from 'prompts';
import { spawnSync } from 'child_process';

const root = process.cwd();

export const mplPrompts = async (options: Array<prompts.PromptObject>) => await prompts(options, {
  onCancel: () => {
    throw new Error(chalk.red`✖` + ' Operation cancelled')
  }
});

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
