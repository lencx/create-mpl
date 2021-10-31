import fs from 'fs-extra';
import path from 'path';
import AdmZip from 'adm-zip';

export default function extractZip(
  zipFile: string | Buffer,
  outputDir: string,
  callback: (dirName: string) => void,
) {
  const zip = new AdmZip(zipFile);
  const entries = zip.getEntries();


  let total = entries.length;
  let pending = 0;
  const folderName = path.basename(entries[0].entryName);

  const checkDone = (err?: Error) => {
    if (err) this.emit('error', err);
    pending += 1;
    if (pending === total) {
      callback(folderName);
    }
  }

  entries.forEach((entry) => {
    if (entry.isDirectory) return checkDone();

    const file = path.resolve(outputDir, entry.entryName);
    fs.outputFile(file, entry.getData(), checkDone);
  })
}
