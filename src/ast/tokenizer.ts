import { Tokenizer } from 'lr-parser-typescript';


export const tokenizer = new Tokenizer(<const>[
  'identifier',
  'import',
  'return',
  'thelse',
  'number',
  'class',
  'thand',
  'where',
  'else',
  'text',
  'then',
  'with',
  'All',
  'let',
  '<->',
  'as',
  'Ex',
  'fn',
  '=>',
  '<=',
  '>=',
  '!=',
  '==',
  '**',
  '++',
  '->',
  '<-',
  '(',')','[',']','{','}','<','>',',','.','!','@','#','$', '=', '_',
  '%','^','&','*',';',':','\'','\\','|','/','?','`','~', '+', '-',
]);

export const token = tokenizer.token.bind(tokenizer);
