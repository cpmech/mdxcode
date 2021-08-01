import fs from 'fs';
import path from 'path';
import { runMarked } from './extractCode';

const main = async () => {
  // arguments
  const args = process.argv.slice(2);
  if (args.length < 1) {
    throw new Error('ERROR: filename.md is required');
  }
  const filepath = args[0];
  const dirname = path.dirname(filepath);
  const mdKey = path.basename(filepath).replace(/\.md/, '');
  if (!mdKey) {
    throw new Error(`cannot extract mdKey from ${filepath}`);
  }

  // read file
  console.log(`Processing "${mdKey}" in "${dirname}"`);
  const mdText = fs.readFileSync(filepath, 'utf-8');

  const res = runMarked(mdText, false);
  console.log('> res =', res);
};

(async () => {
  try {
    await main();
  } catch (error) {
    console.warn(error);
  }
})();
