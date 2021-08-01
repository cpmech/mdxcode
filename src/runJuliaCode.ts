import { maybeWriteFile } from '@cpmech/basic-sys';
import { execSync } from 'child_process';
import { IFilePaths } from './types';

const pltSvgRegex = new RegExp(/SVG\(\)/, 'mg');

const fixCodeForExecution = (
  code: string,
  outDir: string,
  fnKey: string,
): { exeCode: string; figPath: string } => {
  const match = code.match(pltSvgRegex);
  if (match) {
    if (match.length !== 1) {
      throw new Error('code can contain at most one SVG command');
    }
    const figPath = `${outDir}/${fnKey}.svg`;
    const updated = code.replace(pltSvgRegex, `SVG("${figPath}")`);
    return {
      exeCode: updated,
      figPath,
    };
  }
  return {
    exeCode: code,
    figPath: '',
  };
};

export const runJuliaCode = (
  code: string,
  outDir: string,
  fnKey: string,
  tmpDir = '/tmp/processJuliaCode',
): IFilePaths => {
  const result = { figPath: '', outPath: '' };
  const pyFile = `${tmpDir}/temporary.jl`;
  const { exeCode, figPath } = fixCodeForExecution(code, outDir, fnKey);
  maybeWriteFile(true, pyFile, () => exeCode);
  try {
    const res = execSync(`julia ${pyFile}`);
    const output = String(res);
    if (output) {
      result.outPath = `${outDir}/${fnKey}.out`;
      maybeWriteFile(true, result.outPath, () => output);
    }
    result.figPath = figPath;
  } catch {
    console.log('ERROR: julia failed');
  }
  return result;
};
