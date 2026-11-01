import { readFile } from 'node:fs/promises';

// Load this dependency-free ES module even though CRA's package uses CommonJS defaults.
const source = await readFile(new URL('../src/v2/utils/rosterData.js', import.meta.url));
try {
  const { getRosterPhotoSources } = await import(`data:text/javascript;base64,${source.toString('base64')}`);
  console.log(JSON.stringify(getRosterPhotoSources(), null, 2));
} catch (error) {
  console.error(error.message);
  process.exitCode = 1;
}
