import { fileURLToPath } from 'url';
import path from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const targetFolder = path.resolve(path.join(__dirname, './sqlScripts'));

export function readSQLFiles() {
  try {
    const filenames = fs.readdirSync(targetFolder);

    return filenames
      .filter((x) => x.endsWith('sql'))
      .map((filename) => {
        const content = fs.readFileSync(
          path.join(targetFolder, filename),
          'utf-8'
        );

        return content.toString();
      });
  } catch (err) {
    console.log(err);
    return;
  }
}

export default function setupExecution() {
  return readSQLFiles().join('\r\n');
}
