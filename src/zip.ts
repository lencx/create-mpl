import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';

export default function extractZip(
  appName: string,
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
      if (/package.json$/.test(file)) {
        const data = fs.readJSONSync(file);
        data.name = appName;
        fs.writeJSONSync(file, data, { spaces: 2 });
      }
      // TODO: other ...
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
