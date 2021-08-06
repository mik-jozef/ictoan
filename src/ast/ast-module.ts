import { SyntaxTreeNode, Caten, Match, Or, Repeat } from 'lr-parser-typescript';

import { token } from './tokenizer.js';
import { AstVariable } from './ast-variable.js';
import { AstFunction, AstLambda } from './ast-function.js';
import { AstClass } from './ast-class.js';
import { Import } from './import.js';

import './expr.js';


export class AstModule extends SyntaxTreeNode {
  imports!: Import[];
  defs!: (AstClass | AstFunction | AstLambda | AstVariable)[];
  
  static rule = new Caten(
    new Repeat(
      new Match( true, 'imports', Import ),
    ),
    new Repeat(
      new Or(
        new Caten(
          new Match( true, 'defs', AstLambda ),
          token(';'),
        ),
        new Caten(
          new Match( true, 'defs', AstVariable ),
          token(';'),
        ),
        new Match( true, 'defs', AstFunction ),
        new Match( true, 'defs', AstClass ),
      ),
    ),
  );
}
