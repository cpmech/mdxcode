import { hasProp } from '@cpmech/basic';
import marked, { Renderer } from 'marked';

export type ICodes = { [language: string]: string[] };

export const extractCode = (md: string): ICodes => {
  // output
  const output: ICodes = {};

  // create custom renderer
  const renderer = new Renderer();

  // set renderer function for code
  renderer.code = (code: string, language: string) => {
    if (hasProp(output, language)) {
      output[language].push(code);
    } else {
      output[language] = [code];
    }
    return '';
  };

  // set options
  marked.setOptions({
    renderer,
  });

  // results
  marked(md);
  return output;
};
