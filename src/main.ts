import { promises } from 'fs';
import { exit as processExit } from "process";
import { Parser } from 'lr-parser-typescript';

import { Program } from './ast/ast.js';
import { tokenizer } from './ast/tokenizer.js';


const parser = new Parser(tokenizer, Program);

export function exit(msg: string, ...rest: unknown[]): never {
  console.log(msg, ...rest);
  processExit();
}

async function main(path: string) {
  let src;
  
  try {
    src = await promises.readFile(path, 'utf8');
  } catch (e) {
    if ( e.code === 'ENOENT' ) exit(`File \`${path}\` does not exist.`);
    
    throw e;
  }
  
  const program = parser.parse(src);
  
  if (!(program instanceof Program)) {
    exit('Parse error in "' + path + '" at:', program);
  }
  
  program.validate();
}

if ( 3 <= process.argv.length && process.argv.length < 4 ) {
  main( process.argv[2] );
} else {
  console.log( "Usage: `node main.js path/to/program.nappl" );
}
