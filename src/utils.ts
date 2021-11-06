
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
  const { cmd = 'npx', cwd = root } = options;
  spawnSync(cmd, args, { shell: true, cwd, stdio: 'inherit' });
}

export const isEmpty = (path: string) => fs.readdirSync(path).length === 0;

export const isExist = (path: string) => fs.existsSync(path);