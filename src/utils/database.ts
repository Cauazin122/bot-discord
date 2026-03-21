import fs from 'fs';

const path = './database.json';

export function readDB() {
  const data = fs.readFileSync(path, 'utf-8');
  return JSON.parse(data);
}

export function writeDB(data) {
  fs.writeFileSync(path, JSON.stringify(data, null, 2));
}
