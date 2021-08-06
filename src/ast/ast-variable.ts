import { SyntaxTreeNode, IdentifierToken, Caten, Match, Maybe } from 'lr-parser-typescript';

import { token } from './tokenizer.js';
import { Expr } from './expr.js';


export const equalsTypeExprLadder1 = new Match( false, 'type', null! );
export const equalsValueExprLadder = new Match( false, 'value', null! );

export class AstVariable extends SyntaxTreeNode {
  name!: IdentifierToken;
  type!: Expr | null;
  value!: Expr;
  
  static rule = new Caten(
    token('let'),
    new Match( false, 'name', token('identifier') ),
    new Maybe(
      new Caten(
        token(':'),
        equalsTypeExprLadder1,
      ),
    ),
    token('='),
    equalsValueExprLadder,
  );
}
