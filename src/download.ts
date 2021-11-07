import path from 'path';
import fs from 'fs-extra';
import chalk from 'chalk';
import request from 'request';
import Spinners from 'spinnies';
import AdmZip from 'adm-zip';
import { v4 } from 'uuid';
import { EventEmitter } from 'events';

import type { GithubDownloaderOptions } from './types';

const spinners = new Spinners();
const cwd = process.cwd();

export class GithubDownloader extends EventEmitter {
  public owner: string;
  public repo: string;
  public ref: string;
  public dir: string;
  public overwrite: Function;
  private initURL: string;
  private initRef: string;
  private zipURL: string;

  constructor({ owner, repo, ref, dir, overwrite }: GithubDownloaderOptions) {
    super();
    this.owner = owner;
    this.repo = repo;
    this.ref = ref || 'master';
    this.dir = dir;
    this.overwrite = overwrite;
    this.initRef = this.ref ? `?ref=${this.ref}` : '';
    this.initURL = `https://api.github.com/repos/${this.owner}/${this.repo}/contents/`;
    this.zipURL = `https://nodeload.github.com/${this.owner}/${this.repo}/zip/${this.ref}`;
  }

  start() {
    // const target = path.join(process.cwd(), this.dir);
    // if (fs.existsSync(target)) {
    //   console.log(`\n${chalk.yellow`[mpl::warn]`} ${chalk.green(target)} already exists.\n`);
    //   process.exit();
    // }
    this.requestJSON(this.initURL + this.initRef);
    return this;
  }

  requestJSON(url: string) {
    spinners.add('cli', { text: `${chalk.gray`[mpl::download]`} ...`, color: 'white' });
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
          try {
            extractZip.call(this, this.dir, this.overwrite, zipFile, tmpdir, (extractedFolderName: string) => {
              const oldPath = path.join(tmpdir, extractedFolderName);

              fs.rename(oldPath, this.dir, (err) => {
                if (err) this.emit('error', err);

                fs.remove(tmpdir, (err) => {
                  if (err) this.emit('error', err);
                  console.log();
                  spinners.succeed('cli', { text: `${chalk.gray`[mpl::template]`} ${this.owner}/${this.repo}\n`, color: 'white' });
                  this.emit('end');
                });
              });
            })
          } catch (e) {
            spinners.fail('cli', { text: fs.readFileSync(zipFile), color: 'white' });
            console.log(chalk.red`\n[mpl::invalid]:`, chalk.blue`https://github.com/${this.owner}/${this.repo}/tree/${this.ref}\n`);
            fs.removeSync(tmpdir);
            process.exit(1);
          }
        }
      )
    })
  }

  generateTempDir(repo: string) {
    return path.join(cwd, `${repo}-${v4()}`);
  }
}

export default function GithubDownload(options: GithubDownloaderOptions) {
  options.dir = options.dir || process.cwd();
  const ghdownload = new GithubDownloader(options)
  return ghdownload.start();
}

export function extractZip(
  appName: string,
  overwrite: Function,
  zipFile: string | Buffer,
  outputDir: string,
  callback: (dirName: string) => void,
) {
  const zip = new AdmZip(zipFile);
  const entries = zip.getEntries();

  let total = entries.length;
  let pending = 0;
  const folderName = path.basename(entries[0].entryName);

  const checkDone = (err?: Error, file?: string) => {
    if (err) this.emit('error', err);

    if (file) {
      // nodejs
      if (/\/package.json$/.test(file)) {
        const data = fs.readJSONSync(file);
        data.name = appName;
        fs.writeJSONSync(file, data, { spaces: 2 });
      }
      // overwrite file
      if (overwrite) {
        overwrite(file);
      }
    }

    pending += 1;
    if (pending === total) {
      callback(folderName);
    }
  }

  entries.forEach((entry) => {
    if (entry.isDirectory) return checkDone();

    const file = path.resolve(outputDir, entry.entryName);
    fs.outputFile(file, entry.getData(), (err) => checkDone(err, file));
  })
}
