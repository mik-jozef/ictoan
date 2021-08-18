import { SyntaxTreeNode, IdentifierToken, NumberToken, TextToken, Token, Caten, Match, Maybe, Or, Repeat } from 'lr-parser-typescript';

import { token } from './tokenizer.js';
import { Import } from './import.js';


const equalsBlockOp = new Match( false, 'value', null! );
const equalsQuantifierOp = new Match( false, 'value', null! );
const equalsObjectLiteral = new Match( false, 'value', null! );
const equalsFunctionCallOp = new Match( false, 'value', null! );
const equalsMemberAccessOp = new Match( false, 'value', null! );
const equalsTypeArgumentList = new Match( false, 'value', null! );
const equalsNegationOp = new Match( false, 'value', null! );
const equalsConjunctionOp = new Match( false, 'value', null! );
const equalsDisjunctionOp = new Match( false, 'value', null! );
const equalsImplicationOp = new Match( false, 'value', null! );
const equalsComplementOp = new Match( false, 'value', null! );
const equalsIntersectionOp = new Match( false, 'value', null! );
const equalsUnionOp = new Match( false, 'value', null! );
const equalsTypeImplicationOp = new Match( false, 'value', null! );
const equalsConditionalOp = new Match( false, 'value', null! );
const equalsWhereOp = new Match( false, 'value', null! );

const equalsExprLadder = new Match( false, 'value', null! );
const equalsReturnOp = new Match( false, 'value', null! );

const equalsTypeExprLadder0 = new Match( false, 'type', null! );
const equalsTypeExprLadder1 = new Match( false, 'type', null! );
const equalsTypeExprLadder2 = new Match( false, 'type', null! );
const equalsTypeExprLadder3 = new Match( false, 'type', null! );

const equalsValueExprLadder = new Match( false, 'value', null! );
const equalsDefaultArgExprLadder = new Match( false, 'defaultArg', null! );
const equalsBodyBlockOp = new Match( false, 'body', null! );

class TypeMember extends SyntaxTreeNode {
  name!: IdentifierToken;
  type!: Expr;
  
  static rule = new Caten(
    new Match( false, 'name', token('identifier') ),
    token(':'),
    equalsTypeExprLadder0,
    token(';'),
  );
}

export class AstType extends SyntaxTreeNode {
  name!: IdentifierToken;
  members!: TypeMember;
  
  static rule = new Caten(
    token('type'),
    new Match( false, 'name', token('identifier') ),
    token('{'),
    new Repeat(
      new Match( true, 'members', TypeMember ),
    ),
    token('}'),
  );
}

class FunctionParam extends SyntaxTreeNode {
  name!: IdentifierToken;
  type!: Expr | null;
  body!: Expr[];
  
  static rule = new Caten(
    new Match( false, 'name', token('identifier') ),
    new Maybe(
      new Caten(
        token(':'),
        equalsTypeExprLadder1,
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

export class AstFunction extends SyntaxTreeNode {
  name!: IdentifierToken;
  returnType!: Expr | null;
  args!: FunctionParam[];
  body!: BlockOp;
  
  static rule = new Caten(
    token('fn'),
    new Match( false, 'name', token('identifier') ),
    token('('),
    new Repeat(
      new Match( true, 'args', FunctionParam ),
    ),
    token(')'),
    new Maybe(
      new Caten(
        token(':'),
        equalsTypeExprLadder2,
      ),
    ),
    equalsBodyBlockOp,
  );
}

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
        equalsTypeExprLadder3,
      ),
    ),
    token('='),
    equalsValueExprLadder,
  );
}

type BottomOrLower =
  | TextToken
  | NumberToken
  | IdentifierToken
  | BlockOp
  | QuantifierOp
  | ObjectLiteral
  | FunctionCallOp
  | MemberAccessOp
  | TypeArgumentList
  /*/ Functions and types are not values.
  | AstFunction
  | AstType
  /*/
;

export class BottomOfLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    new Caten(
      token('('),
      new Or(
        equalsExprLadder,
        equalsReturnOp, // TODO perhaps only allow inside a conditional?
      ),
      token(')'),
    ),
    new Match( false, 'value', token('text') ),
    new Match( false, 'value', token('number') ),
    new Match( false, 'value', token('identifier') ),
    equalsBlockOp,
    equalsQuantifierOp,
    equalsObjectLiteral,
    equalsFunctionCallOp,
    equalsMemberAccessOp,
    equalsTypeArgumentList,
    /*/ Functions and types are not values.
    new Match( false, 'value', AstFunction ),
    new Match( false, 'value', AstType ),
    /*/
  );
}

type NegationOpOrLower =
  | NegationOp
  | BottomOrLower
;

export class NegationOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsNegationOp,
    new Match( false, 'value', BottomOfLadder ),
  );
}

type ConjunctionOpOrLower =
  | ConjunctionOp
  | NegationOpOrLower
;

export class ConjunctionOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsConjunctionOp,
    new Match( false, 'value', NegationOpLadder ),
  );
}

type DisjunctionOpOrLower =
  | DisjunctionOp
  | ConjunctionOpOrLower
;

export class DisjunctionOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsDisjunctionOp,
    new Match( false, 'value', ConjunctionOpLadder ),
  );
}

type ImplicationOpOrLower =
  | ImplicationOp
  | DisjunctionOpOrLower
;

export class ImplicationOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsImplicationOp,
    new Match( false, 'value', DisjunctionOpLadder ),
  );
}

type ComplementOpOrLower =
  | ComplementOp
  | ImplicationOpOrLower
;

export class ComplementOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule: Or = new Or(
    equalsComplementOp,
    new Match( false, 'value', ImplicationOpLadder ),
  );
}

type IntersectionOpOrLower =
  | IntersectionOp
  | ComplementOpOrLower
;

export class IntersectionOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule: Or = new Or(
    equalsIntersectionOp,
    new Match( false, 'value', ComplementOpLadder ),
  );
}

type UnionOpOrLower =
  | UnionOp
  | IntersectionOpOrLower
;

export class UnionOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule: Or = new Or(
    equalsUnionOp,
    new Match( false, 'value', IntersectionOpLadder ),
  );
}

type TypeImplicationOpOrLower =
  | TypeImplicationOp
  | UnionOpOrLower
;

export class TypeImplicationOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule: Or = new Or(
    equalsTypeImplicationOp,
    new Match( false, 'value', UnionOpLadder ),
  );
}

export type Expr =
  | ConditionalOp
  | WhereOp
  | TypeImplicationOpOrLower
;

export class ExprLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule: Or = new Or(
    equalsConditionalOp,
    equalsWhereOp,
    new Match( false, 'value', TypeImplicationOpLadder ),
  );
}

// The end of the ladder section.

export class ReturnOp extends SyntaxTreeNode {
  expr!: Expr | null;
  
  static rule = new Caten(
    token('return'),
    new Maybe(
      new Match( false, 'expr', ExprLadder ),
    ),
  );
}

export class BlockOp extends SyntaxTreeNode {
  exprs!: (Expr | ReturnOp | AstVariable | AstType)[];
  
  static rule = new Caten(
    token('{'),
    new Repeat(
      new Caten(
        new Or(
          new Match( true, 'exprs', ExprLadder ),
          new Match( true, 'exprs', ReturnOp ),
          new Match( true, 'exprs', AstVariable ),
          new Match( true, 'exprs', AstType ),
        ),
        token(';'),
      ),
      new Caten(),
      1,
    ),
    token('}'),
  );
}

export class TypeParam extends SyntaxTreeNode {
  quantifier!: Token<'All'> | Token<'Ex'>;
  name!: IdentifierToken;
  type!: Expr;
  
  static rule = new Caten(
    new Or(
      new Match( false, 'quantifier', token('All') ),
      new Match( false, 'quantifier', token('Ex') ),
    ),
    new Match( false, 'name', token('identifier') ),
    new Maybe(
      new Caten(
        token(':'),
        new Match( false, 'type', ExprLadder ),
      ),
    ),
    token(','),
  );
}

export class QuantifierOp extends SyntaxTreeNode {
  params!: TypeParam[];
  body!: Expr[];
  
  static rule = new Caten(
    new Repeat( new Match( true, 'params', TypeParam ), new Caten(), 1 ),
    token('{'),
    new Repeat(
      new Caten(
        new Match( true, 'body', ExprLadder ),
        token(';'),
      ),
    ),
    token('}'),
  );
}

class ObjectProp extends SyntaxTreeNode {
  name!: IdentifierToken;
  value!: Expr;
  
  static rule = new Caten(
    new Match( false, 'name', token("identifier") ),
    token(":"),
    equalsValueExprLadder,
    token(","),
  );
}

export class ObjectLiteral extends SyntaxTreeNode {
  props!: ObjectProp[];
  
  static rule = new Caten(
    token('{'),
    new Repeat(
      new Match( true, 'props', ObjectProp ),
      new Caten(),
      1,
    ),
    token('}'),
  );
}

export class FunctionCallOp extends SyntaxTreeNode {
  // IMPROVEMENT: first-class functions.
  // `expr!: Expr;`
  expr!: IdentifierToken;
  args!: Expr[];
  
  static rule = new Caten(
    // new Match( false, 'expr', BottomOfLadder ),
    new Match( false, 'expr', token('identifier') ),
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

export class MemberAccessOp extends SyntaxTreeNode {
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
  types!: Expr[];
  
  static rule: Caten = new Caten(
    new Match( false, 'expr', BottomOfLadder ),
    token('['),
    new Repeat(
      new Caten(
        new Match( true, 'types', ExprLadder ),
        token(','),
      ),
    ),
    token(']'),
  );
}

export class NegationOp extends SyntaxTreeNode {
  expr!: Expr;
  
  static rule: Caten = new Caten(
    token('!'),
    new Match( false, 'expr', NegationOpLadder ),
  );
}

export class ConjunctionOp extends SyntaxTreeNode {
  left!: Expr;
  right!: Expr;
  
  static rule: Caten = new Caten(
    new Match( false, 'left', ConjunctionOpLadder ),
    token('&&'),
    new Match( false, 'right', NegationOpLadder ),
  );
}

export class DisjunctionOp extends SyntaxTreeNode {
  left!: Expr;
  right!: Expr;
  
  static rule: Caten = new Caten(
    new Match( false, 'left', DisjunctionOpLadder ),
    token('||'),
    new Match( false, 'right', ConjunctionOpLadder ),
  );
}

export class ImplicationOp extends SyntaxTreeNode {
  terms!: Expr;
  ops!: (
    | Token<'-->'>
    | Token<'<--'>
    | Token<'<->'>
  );
  
  static rule = new Caten(
    new Repeat(
      new Match( true, 'terms', DisjunctionOpLadder ),
      new Or(
        new Match( true, 'ops', token('-->')),
        new Match( true, 'ops', token('<--')),
        new Match( true, 'ops', token('<->')),
      ),
      2,
    ),
  );
}

export class ComplementOp extends SyntaxTreeNode {
  expr!: Expr;
  
  static rule: Caten = new Caten(
    token('~'),
    new Match( false, 'expr', ComplementOpLadder ),
  );
}

export class IntersectionOp extends SyntaxTreeNode {
  left!: Expr;
  right!: Expr;
  
  static rule: Caten = new Caten(
    new Match( false, 'left', IntersectionOpLadder ),
    token('&'),
    new Match( false, 'right', ComplementOpLadder ),
  );
}

export class UnionOp extends SyntaxTreeNode {
  left!: Expr;
  right!: Expr;
  
  static rule: Caten = new Caten(
    new Match( false, 'left', IntersectionOpLadder ),
    token('|'),
    new Match( false, 'right', ComplementOpLadder ),
  );
}

export class TypeImplicationOp extends SyntaxTreeNode {
  terms!: Expr;
  ops!: (
    | Token<'->'>
    | Token<'<-'>
    | Token<'<>'>
  );
  
  static rule = new Caten(
    new Repeat(
      new Match( true, 'terms', UnionOpLadder ),
      new Or(
        new Match( true, 'ops', token('->')),
        new Match( true, 'ops', token('<-')),
        new Match( true, 'ops', token('<>')),
      ),
      2,
    ),
  );
}

export class ConditionalOp extends SyntaxTreeNode {
  cond!: Expr;
  ifYes!: Expr | null;
  ifNo!: Expr | null;
  
  static rule: Caten = new Caten(
    new Match( false, 'cond', TypeImplicationOpLadder ),
    new Or(
      new Caten(
        token('then'),
        new Match( false, 'ifYes', ExprLadder ),
        token('else'),
        new Match( false, 'ifNo', TypeImplicationOpLadder ),
      ),
      new Caten(
        token('thand'),
        new Match( false, 'ifYes', TypeImplicationOpLadder ),
      ),
      new Caten(
        token('thelse'),
        new Match( false, 'ifNo', TypeImplicationOpLadder ),
      ),
    ),
  );
}

export class WhereOp extends SyntaxTreeNode {
  left!: Expr;
  right!: Expr;
  
  name!: IdentifierToken;
  
  static rule = new Caten(
    new Match( false, 'left', TypeImplicationOpLadder ),
    new Maybe(
      new Caten(
        token('as'),
        new Match( false, 'name', token('identifier') ),
      ),
    ),
    token('where'),
    new Match( false, 'right', TypeImplicationOpLadder ),
  );
}

export class AstModule extends SyntaxTreeNode {
  imports!: Import[];
  defs!: (AstType | AstFunction | AstVariable)[];
  
  static rule = new Caten(
    new Repeat(
      new Match( true, 'imports', Import ),
    ),
    new Repeat(
      new Or(
        new Caten(
          new Match( true, 'defs', AstVariable ),
          token(';'),
        ),
        new Match( true, 'defs', AstFunction ),
        new Match( true, 'defs', AstType ),
      ),
    ),
  );
}

equalsBlockOp.match = BlockOp;
equalsQuantifierOp.match = QuantifierOp;
equalsObjectLiteral.match = ObjectLiteral;
equalsFunctionCallOp.match = FunctionCallOp;
equalsMemberAccessOp.match = MemberAccessOp;
equalsTypeArgumentList.match = TypeArgumentList;
equalsNegationOp.match = NegationOp;
equalsConjunctionOp.match = ConjunctionOp;
equalsDisjunctionOp.match = DisjunctionOp;
equalsImplicationOp.match = ImplicationOp;
equalsComplementOp.match = ComplementOp;
equalsIntersectionOp.match = IntersectionOp;
equalsUnionOp.match = UnionOp;
equalsTypeImplicationOp.match = TypeImplicationOp;
equalsConditionalOp.match = ConditionalOp;
equalsWhereOp.match = WhereOp;


equalsExprLadder.match = ExprLadder;
equalsReturnOp.match = ReturnOp;

equalsBodyBlockOp.match = BlockOp;
equalsDefaultArgExprLadder.match = ExprLadder;
equalsTypeExprLadder0.match = ExprLadder;
equalsTypeExprLadder1.match = ExprLadder;
equalsTypeExprLadder2.match = ExprLadder;
equalsTypeExprLadder3.match = ExprLadder;
equalsValueExprLadder.match = ExprLadder;
