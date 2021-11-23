import { Tokenizer } from 'lr-parser-typescript';


export const tokenizer = new Tokenizer(<const>[
  'identifier',
  'import',
  'number',
  'record',
  'return',
  'else',
  'text',
  'then',
  'type',
  'All',
  'let',
  '!in',
  '...',
  'Ex',
  'fn',
  'in',
  '!=',
  '==',
  '&&',
  '||',
  '.[',
  '(',')','[',']','{','}','<','>',',','.','!','@','#','$', '=', '_',
  '%','^','&','*',';',':','\'','\\','|','/','?','`','~', '+', '-',
]);

export const token = tokenizer.token.bind(tokenizer);
