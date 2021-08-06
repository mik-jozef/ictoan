import { SyntaxTreeNode, IdentifierToken, Caten, Match, Repeat } from 'lr-parser-typescript';

import { token } from './tokenizer.js';
import { Expr } from './expr.js';


export const equalsTypeExprLadder4 = new Match( false, 'type', null! );

class Member extends SyntaxTreeNode {
  name!: IdentifierToken;
  type!: Expr;
  
  static rule = new Caten(
    new Match( false, 'name', token('identifier') ),
    token(':'),
    equalsTypeExprLadder4,
    token(';'),
  );
}

export class AstClass extends SyntaxTreeNode {
  name!: IdentifierToken;
  members!: Member;
  
  static rule = new Caten(
    token('class'),
    new Match( false, 'name', token('identifier') ),
    token('{'),
    new Repeat(
      new Match( true, 'members', Member ),
    ),
    token('}'),
  );
}
