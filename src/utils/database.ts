import fs from 'fs';

const path = './src/database.json';

export function readDB() {
  return JSON.parse(fs.readFileSync(path, 'utf8'));
}

export function writeDB(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
