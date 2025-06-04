const {rmSync, existsSync} = require('fs');
const {join} = require('path');

const clientCache = join(__dirname, '..', 'client', 'node_modules', '.cache');
const serverCache = join(__dirname, '..', 'server', 'node_modules', '.cache');

if (existsSync(clientCache)) {
  rmSync(clientCache, {recursive: true, force: true});

  console.log(`Папка "${clientCache}" удалена`);
} else {
  console.log(`Папки "${clientCache}" не существует`);
}

if (existsSync(serverCache)) {
  rmSync(serverCache, {recursive: true, force: true});

  console.log(`Папка "${serverCache}" удалена`);
} else {
  console.log(`Папки "${serverCache}" не существует`);
}