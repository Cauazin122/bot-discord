import fs from 'fs';
import path from 'path';

const dbPath = path.join(process.cwd(), 'database.json');

export function readDB() {
  if (!fs.existsSync(dbPath)) {
    return {
      avaliacoes: [],
      warns: {},
      antiLink: {},
      logs: {}
    };
  }

  const data = fs.readFileSync(dbPath, 'utf8');
  return JSON.parse(data);
}

export function writeDB(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}
