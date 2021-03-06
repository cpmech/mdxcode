import fs from 'fs';
import path from 'path';
import { maybeWriteFile } from '@cpmech/basic-sys';
import { extractCode } from './extractCode';
import { runPythonCode } from './runPythonCode';
import { IFilePaths } from './types';
import { runJuliaCode } from './runJuliaCode';

const showHelp = (errorMsg: string) => {
  console.log(`
  ERROR: ${errorMsg}

  usage:
          mdxcode filename.md outputDir {true,false}

  where:
          {true,false} indicates to run the code or not
  `);
};

const main = async () => {
  // arguments
  const args = process.argv.slice(2);
  if (args.length < 1) {
    showHelp('filename.md is missing');
    return;
  }
  if (args.length < 2) {
    showHelp('outputDir is missing');
    return;
  }
  const filepath = args[0];
  const outDir = args[1];
  const runCode = args[2] && args[2] === 'true';
  const dirname = path.dirname(filepath);
  const mdKey = path.basename(filepath).replace(/\.md/, '');
  if (!mdKey) {
    throw new Error(`cannot extract mdKey from ${filepath}`);
  }
  if (!outDir) {
    throw new Error(`output dir <${outDir}> is invalid`);
  }

  // read file
  console.log(`Processing "${mdKey}" in "${dirname}"`);
  const mdText = fs.readFileSync(filepath, 'utf-8');

  // extract code
  const res = extractCode(mdText);

  // save files
  let index = 0;
  for (const [key, array] of Object.entries(res)) {
    const ext = key.match(/(julia)/) ? 'jl' : key.match(/(python)/) ? 'py' : 'txt';
    array.forEach((code) => {
      const fnKey = `${mdKey}-code${index}`;
      const codePath = `${outDir}/${fnKey}.${ext}`;
      maybeWriteFile(true, codePath, () => code);
      console.log(`file <${codePath}> written`);
      if (runCode) {
        let res: IFilePaths = { figPath: '', outPath: '' };
        if (ext === 'py') {
          res = runPythonCode(code, outDir, fnKey);
        }
        if (ext === 'jl') {
          res = runJuliaCode(code, outDir, fnKey);
        }
        if (res.figPath) {
          console.log(`file <${res.figPath}> written`);
        }
        if (res.outPath) {
          console.log(`file <${res.outPath}> written`);
        }
      }
      index += 1;
    });
  }
};

(async () => {
  try {
    await main();
  } catch (error) {
    console.warn(error);
  }
})();
