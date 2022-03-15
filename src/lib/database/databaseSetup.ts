import path from 'path';
import fs from 'fs';

const targetFolder = 'src/lib/database/sqlScripts';

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
