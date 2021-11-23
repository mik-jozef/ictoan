import { SyntaxTreeNode, IdentifierToken, Token, Caten, Match, Maybe, Or, Repeat } from 'lr-parser-typescript';

import { token } from './tokenizer.js';
import { Type, TypeDef, TypeLadder } from './type.js';

const matchBlock = new Match( false, 'value', null! );
const matchObjectLiteral = new Match( false, 'value', null! );
const matchFunctionCall = new Match( false, 'value', null! );
const matchMemberAccess = new Match( false, 'value', null! );
const matchTypeArgumentList = new Match( false, 'value', null! );
const matchNegation = new Match( false, 'value', null! );
const matchConjunction = new Match( false, 'value', null! );
const matchDisjunction = new Match( false, 'value', null! );
const matchConditional = new Match( false, 'value', null! );

const matchExprLadder = new Match( false, 'value', null! );
const matchReturn = new Match( false, 'value', null! );
const matchExprsVariable = new Match( true, 'exprs', null! );

type Expr =
  | IdentifierToken
  | Return
  | Block
  | ObjectLiteral
  | FunctionCall
  | MemberAccess
  | TypeArgumentList
  | Negation
  | Conjunction
  | Disjunction
  | Conditional
;

class BottomOfLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    new Match( false, 'value', token('identifier') ),
    matchBlock,
    matchObjectLiteral,
    matchFunctionCall,
    matchMemberAccess,
    matchTypeArgumentList,
    
    new Caten(
      token('('),
      new Or(
        matchExprLadder,
        matchReturn, // TODO perhaps only in the conditional operator?
      ),
      token(')'),
    ),
  );
}

class NegationLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    matchNegation,
    new Match( false, 'value', BottomOfLadder ),
  );
}

class ConjunctionLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    matchConjunction,
    new Match( false, 'value', NegationLadder ),
  );
}

class DisjunctionLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    matchDisjunction,
    new Match( false, 'value', ConjunctionLadder ),
  );
}

export class ExprLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule: Or = new Or(
    matchConditional,
    new Match( false, 'value', DisjunctionLadder ),
  );
}

// The end of the ladder section.

export class Return extends SyntaxTreeNode {
  expr!: Expr | null;
  
  static rule = new Caten(
    token('return'),
    new Maybe(
      new Match( false, 'expr', ExprLadder ),
    ),
  );
}

export class Block extends SyntaxTreeNode {
  exprs!: (Expr | Return | TypeDef | Variable)[];
  
  static rule = new Caten(
    token('{'),
    new Repeat(
      new Caten(
        new Or(
          new Match( true, 'exprs', ExprLadder ),
          new Match( true, 'exprs', Return ),
          new Match( true, 'exprs', TypeDef ),
          matchExprsVariable,
        ),
        token(';'),
      ),
      new Caten(),
      1,
    ),
    token('}'),
  );
}

class Property extends SyntaxTreeNode {
  name!: IdentifierToken;
  value!: Expr;
  
  static rule = new Caten(
    new Match( false, 'name', token("identifier") ),
    token(":"),
    new Match( false, 'value', ExprLadder ),
    token(","),
  );
}

export class ObjectLiteral extends SyntaxTreeNode {
  props!: Property[];
  
  static rule = new Caten(
    token('{'),
    new Repeat( new Match( true, 'props', Property ) ),
    token('}'),
  );
}

export class FunctionCall extends SyntaxTreeNode {
  expr!: IdentifierToken;
  typeArgs!: Type[];
  args!: Expr[];
  
  static rule = new Caten(
    new Match( false, 'expr', token('identifier') ),
    
    new Maybe(
      new Caten(
        token('['),
        new Repeat(
          new Caten(
            new Match( true, 'typeArgs', TypeLadder ),
            token(','),
          ),
        ),
        token(']'),
      ),
    ),
    
    token('('),
    new Repeat(
      new Caten(
        new Match( true, 'args', ExprLadder ),
        token(','),
      ),
    ),
    token(')'),
  );
}

export class MemberAccess extends SyntaxTreeNode {
  expr!: Expr;
  member!: IdentifierToken;
  
  static rule: Caten = new Caten(
    new Match( false, 'expr', BottomOfLadder ),
    token('.'),
    new Match( false, 'member', token('identifier') ),
  );
}

export class TypeArgumentList extends SyntaxTreeNode {
  expr!: Expr;
  args!: Type[];
  
  static rule: Caten = new Caten(
    new Match( false, 'expr', BottomOfLadder ),
    token('.['), // This is a hack to avoid a grammar conflict.
    new Repeat(
      new Caten(
        new Match( true, 'args', TypeLadder ),
        token(','),
      ),
    ),
    token(']'),
  );
}

export class Negation extends SyntaxTreeNode {
  expr!: Expr;
  
  static rule: Caten = new Caten(
    token('!'),
    new Match( false, 'expr', NegationLadder ),
  );
}

export class Conjunction extends SyntaxTreeNode {
  left!: Expr;
  right!: Expr;
  
  static rule: Caten = new Caten(
    new Match( false, 'left', ConjunctionLadder ),
    token('&&'),
    new Match( false, 'right', NegationLadder ),
  );
}

export class Disjunction extends SyntaxTreeNode {
  left!: Expr;
  right!: Expr;
  
  static rule: Caten = new Caten(
    new Match( false, 'left', DisjunctionLadder ),
    token('||'),
    new Match( false, 'right', ConjunctionLadder ),
  );
}

export class Conditional extends SyntaxTreeNode {
  cond!: Expr;
  ifYes!: Expr;
  ifNo!: Expr;
  
  static rule: Caten = new Caten(
    new Match( false, 'cond', DisjunctionLadder ),
    token('then'),
    new Match( false, 'ifYes', ExprLadder ),
    token('else'),
    new Match( false, 'ifNo', Conditional ),
  );
}

class TypeParam extends SyntaxTreeNode {
  name!: IdentifierToken;
  type!: Token<'All'> | Token<'Ex'>;
  
  static rule = new Caten(
    new Or(
      new Match( false, 'type', token('All') ),
      new Match( false, 'type', token('Ex') ),
    ),
    new Match( false, 'name', token('identifier') ),
    token(','),
  );
}

class FunctionParam extends SyntaxTreeNode {
  name!: IdentifierToken;
  type!: Type | null;
  
  static rule = new Caten(
    new Match( false, 'name', token('identifier') ),
    new Maybe(
      new Caten(
        token(':'),
        new Match( false, 'type', TypeLadder),
      ),
    ),
    token(','),
  );
}

export class Function extends SyntaxTreeNode {
  name!: IdentifierToken;
  typeArgs!: FunctionParam[];
  returnType!: Type | null;
  args!: FunctionParam[];
  body!: Block;
  
  static rule = new Caten(
    token('fn'),
    new Match( false, 'name', token('identifier') ),
    
    new Maybe(
      new Caten(
        token('['),
        new Repeat( new Match( true, 'typeArgs', TypeParam ) ),
        token(']'),
      ),
    ),
    
    token('('),
    new Repeat( new Match( true, 'args', FunctionParam ) ),
    token(')'),
    
    new Maybe(
      new Caten(
        token(':'),
        new Match( false, 'type', TypeLadder ),
      ),
    ),
    new Match( false, 'body', Block ),
  );
}

export class Variable extends SyntaxTreeNode {
  name!: IdentifierToken;
  type!: Type | null;
  value!: Expr;
  
  static rule = new Caten(
    token('let'),
    new Match( false, 'name', token('identifier') ),
    new Maybe(
      new Caten(
        token(':'),
        new Match( false, 'type', TypeLadder ),
      ),
    ),
    token('='),
    new Match( false, 'value', ExprLadder ),
  );
}

export class Program extends SyntaxTreeNode {
  defs!: (TypeDef | Function | Variable)[];
  
  static rule = new Repeat(
    new Or(
      new Caten(
        new Match( true, 'defs', Variable ),
        token(';'),
      ),
      new Match( true, 'defs', Function ),
      new Match( true, 'defs', TypeDef ),
    ),
  );
  
  validate() {
    // TODO
  }
}

matchBlock.match = Block;
matchObjectLiteral.match = ObjectLiteral;
matchFunctionCall.match = FunctionCall;
matchMemberAccess.match = MemberAccess;
matchTypeArgumentList.match = TypeArgumentList;
matchNegation.match = Negation;
matchConjunction.match = Conjunction;
matchDisjunction.match = Disjunction;
matchConditional.match = Conditional;

matchExprLadder.match = ExprLadder;
matchReturn.match = Return;
matchExprsVariable.match = Variable;
