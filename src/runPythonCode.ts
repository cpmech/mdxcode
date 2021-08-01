import { maybeWriteFile } from '@cpmech/basic-sys';
import { execSync } from 'child_process';
import { IFilePaths } from './types';

const pltShowRegex = new RegExp(/plt\.show\(\)/, 'mg');

const headers = 'import numpy as np\nimport matplotlib.pyplot as plt\n';

const fixCodeForExecution = (
  code: string,
  outDir: string,
  fnKey: string,
): { exeCode: string; figPath: string } => {
  const match = code.match(pltShowRegex);
  if (match) {
    if (match.length !== 1) {
      throw new Error('code can contain at most one plt.show');
    }
    const figPath = `${outDir}/${fnKey}.png`;
    const updated = code.replace(pltShowRegex, `plt.savefig("${figPath}")`);
    return {
      exeCode: headers + updated,
      figPath,
    };
  }
  return {
    exeCode: headers + code,
    figPath: '',
  };
};

export const runPythonCode = (
  code: string,
  outDir: string,
  fnKey: string,
  tmpDir = '/tmp/processPythonCode',
): IFilePaths => {
  const result = { figPath: '', outPath: '' };
  const pyFile = `${tmpDir}/temporary.py`;
  const { exeCode, figPath } = fixCodeForExecution(code, outDir, fnKey);
  maybeWriteFile(true, pyFile, () => exeCode);
  try {
    const res = execSync(`python3 ${pyFile}`);
    const output = String(res);
    if (output) {
      result.outPath = `${outDir}/${fnKey}.out`;
      maybeWriteFile(true, result.outPath, () => output);
    }
    result.figPath = figPath;
  } catch {
    console.log('ERROR: python3 failed');
  }
  return result;
};
