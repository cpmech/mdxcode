import marked, { Renderer } from 'marked';

export const runMarked = (md: string, runCode: boolean): string[] => {
  // create custom renderer
  const renderer = new Renderer();

  // set renderer function for code
  renderer.code = (code: string, language: string) => {
    console.log(code);

    return '';
  };

  // set options
  marked.setOptions({
    renderer,
  });

  // results
  const res = marked(md);
  console.log(res);
  return [];
};
