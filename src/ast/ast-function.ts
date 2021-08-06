import { SyntaxTreeNode, IdentifierToken, Caten, Match, Maybe, Repeat } from 'lr-parser-typescript';

import { token } from './tokenizer.js';
import { Expr, BlockOp } from './expr.js';


export const equalsDefaultArgExprLadder = new Match( false, 'defaultArg', null! );
export const equalsTypeExprLadder3 = new Match( false, 'type', null! );

export const equalsBodyBlockOp = new Match( true, 'body', null! );
export const equalsTypeExprLadder0 = new Match( false, 'type', null! );

export const equalsExprExprLadder = new Match( false, 'expr', null! );
export const equalsTypeExprLadder2 = new Match( false, 'type', null! );

class Param extends SyntaxTreeNode {
  name!: IdentifierToken;
  type!: Expr | null;
  body!: Expr[];
  
  static rule = new Caten(
    new Match( false, 'name', token('identifier') ),
    new Maybe(
      new Caten(
        token(':'),
        equalsTypeExprLadder3,
      ),
    ),
    new Maybe(
      new Caten(
        token('='),
        equalsDefaultArgExprLadder,
      ),
    ),
    token(','),
  );
}

class FunctionHead extends SyntaxTreeNode {
  name!: IdentifierToken;
  type!: Expr | null;
  args!: Param[];
  
  static rule = new Caten(
    token('fn'),
    new Match( false, 'name', token('identifier') ),
    token('('),
    new Repeat(
      new Match( true, 'args', Param ),
    ),
    token(')'),
    new Maybe(
      new Caten(
        token(':'),
        equalsTypeExprLadder0,
      ),
    ),
  );
}

export abstract class AstFunctionLambda extends SyntaxTreeNode {}

export class AstFunction extends AstFunctionLambda {
  head!: FunctionHead;
  body!: BlockOp[];
  
  static rule = new Caten(
    new Match( false, 'head', FunctionHead ),
    equalsBodyBlockOp,
  );
}

export class AstLambda extends AstFunctionLambda {
  head!: FunctionHead;
  expr!: Expr;
  
  static rule = new Caten(
    new Match( false, 'head', FunctionHead ),
    token('=>'),
    equalsExprExprLadder,
  );
}
