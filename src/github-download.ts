import ora from 'ora';
import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import request from 'request';
import { EventEmitter } from 'events';

import extractZip from './zip';
import type { GithubDownloaderOptions } from './types';

const downloadLoading = ora(`${chalk.gray`[mpl::download]`} ...`);
const cwd = process.cwd();

export class GithubDownloader extends EventEmitter {
  public owner: string;
  public repo: string;
  public ref: string;
  public dir: string;
  private initURL: string;
  private initRef: string;
  private zipURL: string;

  constructor({ owner, repo, ref, dir }: GithubDownloaderOptions) {
    super();
    this.owner = owner;
    this.repo = repo;
    this.ref = ref || 'master';
    this.dir = dir;
    this.initRef = this.ref ? `?ref=${this.ref}` : '';
    this.initURL = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/`;
    this.zipURL = `https://nodeload.github.com/${this.owner}/${this.repo}/zip/${this.ref}`;
  }

  start() {
    const target = path.join(process.cwd(), this.dir);
    if (fs.existsSync(target)) {
      console.log(`\n${chalk.yellow`[mpl::warn]`} ${chalk.green(target)} already exists.\n`);
      process.exit();
    }
    this.requestJSON(this.initURL + this.initRef);
    return this;
  }

  requestJSON(url: string) {
    downloadLoading.start();
    request({ url }, (err, resp) => {
      if (err) return this.emit('error', err);
      if (resp.statusCode === 403) return this.downloadZip();
      if (resp.statusCode !== 200) this.emit('error', new Error(`${url}: returned ${resp.statusCode}`));
    });
  }

  downloadZip() {
    const tmpdir = this.generateTempDir(this.repo);
    const zipBaseDir = `${this.repo}-${this.ref}`;
    const zipFile = path.join(tmpdir, `${zipBaseDir}.zip`);

    this.emit('zip', this.zipURL);

    fs.mkdir(tmpdir, (err) => {
      if (err) this.emit('error', err)
      request.get(this.zipURL).pipe(
        fs.createWriteStream(zipFile)).on('close', () => {
          extractZip.call(this, zipFile, tmpdir, (extractedFolderName: string) => {
            const oldPath = path.join(tmpdir, extractedFolderName);

            fs.rename(oldPath, this.dir, (err) => {
              if (err) this.emit('error', err);

              fs.remove(tmpdir, (err) => {
                if (err) this.emit('error', err);
                console.log();
                downloadLoading.succeed(`${chalk.gray`[mpl::template]`} ${this.owner}/${this.repo}\n`);
                this.emit('end');
              });
            });
          })
        }
      )
    })
  }

  generateTempDir(repo: string) {
    return path.join(cwd, `${repo}-${Date.now().toString(16)}`);
  }
}

export default function GithubDownload(options: GithubDownloaderOptions) {
  options.dir = options.dir || process.cwd();
  const ghdownload = new GithubDownloader(options)
  return ghdownload.start();
}
