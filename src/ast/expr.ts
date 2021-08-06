import { SyntaxTreeNode, IdentifierToken, NumberToken, TextToken, Token, Caten, Match, Maybe, Or, Repeat } from 'lr-parser-typescript';

import { token } from './tokenizer.js';
import { AstFunction, equalsBodyBlockOp, equalsTypeExprLadder0 } from './ast-function.js';
import { equalsTypeExprLadder2, equalsExprExprLadder, AstLambda } from './ast-function.js';
import { equalsTypeExprLadder3, equalsDefaultArgExprLadder } from './ast-function.js';
import { AstVariable, equalsTypeExprLadder1, equalsValueExprLadder } from './ast-variable.js';
import { equalsTypeExprLadder4, AstClass } from './ast-class.js';


const equalsBlockOp = new Match( false, 'value', null! );
const equalsQuantifierOp = new Match( false, 'value', null! );
const equalsSetLiteral = new Match( false, 'value', null! );
const equalsObjectLiteral = new Match( false, 'value', null! );
const equalsFunctionCallOp = new Match( false, 'value', null! );
const equalsMemberAccessOp = new Match( false, 'value', null! );
const equalsTypeArgumentList = new Match( false, 'value', null! );
const equalsNegationOp = new Match( false, 'value', null! );
const equalsInverseOp = new Match( false, 'value', null! );
const equalsPowerOp = new Match( false, 'value', null! );
const equalsMulOp = new Match( false, 'value', null! );
const equalsDivOp = new Match( false, 'value', null! );
const equalsAddOp = new Match( false, 'value', null! );
const equalsSubOp = new Match( false, 'value', null! );
const equalsModuloOp = new Match( false, 'value', null! );
const equalsMagmaOp = new Match( false, 'value', null! );
const equalsComparisonOp = new Match( false, 'value', null! );
const equalsIntersectionOp = new Match( false, 'value', null! );
const equalsUnionOp = new Match( false, 'value', null! );
const equalsImplicationOp = new Match( false, 'value', null! );
const equalsConditionalOp = new Match( false, 'value', null! );
const equalsWhereOp = new Match( false, 'value', null! );
const equalsObjectRestriction = new Match( false, 'value', null! );

const equalsExprLadder = new Match( false, 'value', null! );
const equalsReturnOp = new Match( false, 'value', null! );

type BottomOrLower =
  | BlockOp
  | QuantifierOp
  | AstFunction
  | SetLiteral
  | ObjectLiteral
  | TextToken
  | NumberToken
  | IdentifierToken
  | FunctionCallOp
  | MemberAccessOp
  | TypeArgumentList
;

export class BottomOfLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    new Caten(
      token('('),
      new Or(
        equalsExprLadder,
        equalsReturnOp,
        new Match( false, 'value', AstLambda ),
      ),
      token(')'),
    ),
    equalsBlockOp,
    equalsQuantifierOp,
    new Match( false, 'value', AstFunction ),
    equalsSetLiteral,
    equalsObjectLiteral,
    new Match( false, 'value', token('text') ),
    new Match( false, 'value', token('number') ),
    new Match( false, 'value', token('identifier') ),
    equalsFunctionCallOp,
    equalsMemberAccessOp,
    equalsTypeArgumentList,
  );
}

type LeftUnaryOpsOrLower =
  | NegationOp
  | InverseOp
  | BottomOrLower
;

export class LeftUnaryOpsLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsNegationOp,
    equalsInverseOp,
    new Match( false, 'value', BottomOfLadder ),
  );
}

type PowerOpOrLower =
  | PowerOp
  | LeftUnaryOpsOrLower
;

export class PowerOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsPowerOp,
    new Match( false, 'value', LeftUnaryOpsLadder ),
  );
}

type MulDivOpsOrLower =
  | MulOp
  | DivOp
;

export class MulDivOpsLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsMulOp,
    equalsDivOp,
  );
}

type AddSubOpsOrLower =
  | AddOp
  | SubOp
  | MulDivOpsOrLower
;

export class AddSubOpsLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsAddOp,
    equalsSubOp,
    new Match( false, 'value', MulDivOpsLadder ),
  );
}

type AddSubModuloOpsOrLower =
  | AddSubOpsOrLower
  | ModuloOp
  | PowerOpOrLower
;

export class AddSubModuloOpsLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    new Match( false, 'value', AddSubOpsLadder ),
    equalsModuloOp,
    new Match( false, 'value', PowerOpLadder ),
  );
}

type MagmaOpOrLower =
  | MagmaOp
  | AddSubModuloOpsOrLower
;

export class MagmaOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsMagmaOp,
    new Match( false, 'value', AddSubModuloOpsLadder ),
  );
}

type ComparisonIsOpsOrLower =
  | ComparisonOp
  | MagmaOpOrLower
;

export class ComparisonIsOpsLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsComparisonOp,
    new Match( false, 'value', MagmaOpLadder ),
  );
}

type IntersectionOpOrLower =
  | IntersectionOp
  | ComparisonIsOpsOrLower
;

export class IntersectionOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsIntersectionOp,
    new Match( false, 'value', ComparisonIsOpsLadder ),
  );
}

type UnionOpOrLower =
  | UnionOp
  | IntersectionOpOrLower
;

export class UnionOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsUnionOp,
    new Match( false, 'value', IntersectionOpLadder ),
  );
}

type ImplicationOpOrLower =
  | ImplicationOp
  | UnionOpOrLower
;

export class ImplicationOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsImplicationOp,
    new Match( false, 'value', UnionOpLadder ),
  );
}

type ConditionalOpOrLower =
  | ConditionalOp
  | ImplicationOpOrLower
;

export class ConditionalOpLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    equalsConditionalOp,
    new Match( false, 'value', ImplicationOpLadder ),
  );
}

export type Expr =
  | WhereOp
  | ObjectRestriction
  | ConditionalOpOrLower
;

export class ExprLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule: Or = new Or(
    equalsWhereOp,
    equalsObjectRestriction,
    new Match( false, 'value', ConditionalOpLadder ),
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
  exprs!: (Expr | ReturnOp | AstLambda | AstVariable)[];
  
  static rule = new Caten(
    token('{'),
    new Repeat(
      new Caten(
        new Or(
          new Match( true, 'exprs', ExprLadder ),
          new Match( true, 'exprs', ReturnOp ),
          new Match( true, 'exprs', AstLambda ),
          new Match( true, 'exprs', AstVariable ),
          new Match( true, 'exprs', AstClass ),
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
    
    /*/
      TODO the lambda version.
    
      token('=>'),
      new Match( false, 'body', ExprLadder ),
    /*/
  );
}

export class SetLiteral extends SyntaxTreeNode {
  
  // TODO. Do I want them?
  static rule: Caten = new Or();
}

const equalsNameIdentifier = new Match( false, 'name', token("identifier") );

class ObjectProp extends SyntaxTreeNode {
  name!: IdentifierToken;
  value!: Expr;
  
  static rule = new Caten(
    equalsNameIdentifier,
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
  expr!: BottomOrLower;
  args!: Expr[];
  
  static rule = new Caten(
    new Match( false, 'expr', BottomOfLadder ),
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
  expr!: BottomOrLower;
  member!: IdentifierToken;
  
  static rule: Caten = new Caten(
    new Match( false, 'expr', BottomOfLadder ),
    token('.'),
    new Match( false, 'member', token('identifier') ),
  );
}

export class TypeArgumentList extends SyntaxTreeNode {
  expr!: BottomOrLower;
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
  expr!: LeftUnaryOpsOrLower;
  
  static rule: Caten = new Caten(
    token('!'),
    new Match( false, 'expr', LeftUnaryOpsLadder ),
  );
}

export class InverseOp extends SyntaxTreeNode {
  expr!: LeftUnaryOpsOrLower;
  
  static rule: Caten = new Caten(
    token('-'),
    new Match( false, 'expr', LeftUnaryOpsLadder ),
  );
}

const leftEqualsLeftUnaryOpsLadder = new Match( false, 'left', LeftUnaryOpsLadder );

export class PowerOp extends SyntaxTreeNode {
  left!: LeftUnaryOpsOrLower;
  right!: LeftUnaryOpsOrLower;
  
  static rule: Caten = new Caten(
    leftEqualsLeftUnaryOpsLadder,
    token('**'),
    new Match( false, 'right', LeftUnaryOpsLadder ),
  );
}

const leftEqualsPowerOpLadder = new Match( false, 'left', PowerOpLadder );

const orLeftEqualsMulDivPowerOps = new Or(
  new Match( false, 'left', MulDivOpsLadder ),
  leftEqualsPowerOpLadder,
);

export class MulOp extends SyntaxTreeNode {
  left!: MulDivOpsOrLower | PowerOpOrLower;
  right!: PowerOpOrLower;
  
  static rule: Caten = new Caten(
    orLeftEqualsMulDivPowerOps,
    token('*'),
    new Match( false, 'right', PowerOpLadder ),
  );
}

export class DivOp extends SyntaxTreeNode {
  left!: MulDivOpsOrLower | PowerOpOrLower;
  right!: PowerOpOrLower;
  
  static rule: Caten = new Caten(
    orLeftEqualsMulDivPowerOps,
    token('/'),
    new Match( false, 'right', PowerOpLadder ),
  );
}

const orLeftEqualsAddSubPowerOps = new Or(
  new Match( false, 'left', AddSubOpsLadder ),
  leftEqualsPowerOpLadder,
);

export class AddOp extends SyntaxTreeNode {
  left!: AddSubOpsOrLower | PowerOpOrLower;
  right!: MulDivOpsOrLower | PowerOpOrLower;
  
  static rule: Caten = new Caten(
    orLeftEqualsAddSubPowerOps,
    token('+'),
    new Or(
      new Match( false, 'right', MulDivOpsLadder ),
      new Match( false, 'right', PowerOpLadder ),
    ),
  );
}

export class SubOp extends SyntaxTreeNode {
  left!: AddSubOpsOrLower | PowerOpOrLower;
  right!: MulDivOpsOrLower | PowerOpOrLower;
  
  static rule: Caten = new Caten(
    orLeftEqualsAddSubPowerOps,
    token('-'),
    new Or(
      new Match( false, 'right', MulDivOpsLadder ),
      new Match( false, 'right', PowerOpLadder ),
    ),
  );
}

export class ModuloOp extends SyntaxTreeNode {
  left!: LeftUnaryOpsOrLower;
  right!: LeftUnaryOpsOrLower;
  
  static rule: Caten = new Caten(
    leftEqualsLeftUnaryOpsLadder,
    token('%'),
    new Match( false, 'right', LeftUnaryOpsLadder ),
  );
}

export class MagmaOp extends SyntaxTreeNode {
  left!: MagmaOpOrLower;
  right!: AddSubModuloOpsOrLower | PowerOpOrLower;
  
  static rule: Caten = new Caten(
    new Match( false, 'left', MagmaOpLadder ),
    token('++'),
    new Match( false, 'right', AddSubModuloOpsLadder ),
  );
}

export class ComparisonOp extends SyntaxTreeNode {
  terms!: MagmaOpOrLower[];
  ops!: (
    | Token<'<'>
    | Token<'<='>
    | Token<'=='>
    | Token<'!='>
    | Token<'>'>
    | Token<'>='>
  )[];
  
  static rule = new Caten(
    new Repeat(
      new Match( true, 'terms', MagmaOpLadder ),
      new Or(
        new Match( true, 'ops', token('<')),
        new Match( true, 'ops', token('<=')),
        new Match( true, 'ops', token('==')),
        new Match( true, 'ops', token('!=')),
        new Match( true, 'ops', token('>')),
        new Match( true, 'ops', token('>=')),
      ),
      2,
    ),
  );
}

export class IntersectionOp extends SyntaxTreeNode {
  left!: IntersectionOpOrLower;
  right!: MagmaOpOrLower;
  
  static rule: Caten = new Caten(
    new Match( false, 'left', IntersectionOpLadder ),
    token('&'),
    new Match( false, 'right', MagmaOpLadder ),
  );
}

export class UnionOp extends SyntaxTreeNode {
  left!: UnionOpOrLower;
  right!: IntersectionOpOrLower;
  
  static rule: Caten = new Caten(
    new Match( false, 'left', UnionOpLadder ),
    token('|'),
    new Match( false, 'right', IntersectionOpLadder ),
  );
}

export class ImplicationOp extends SyntaxTreeNode {
  terms!: UnionOpOrLower;
  ops!: (
    | Token<'->'>
    | Token<'<-'>
    | Token<'<->'>
  );
  
  static rule = new Caten(
    new Repeat(
      new Match( true, 'terms', UnionOpLadder ),
      new Or(
        new Match( true, 'ops', token('->')),
        new Match( true, 'ops', token('<-')),
        new Match( true, 'ops', token('<->')),
      ),
      2,
    ),
  );
}

export class ConditionalOp extends SyntaxTreeNode {
  cond!: UnionOpOrLower;
  ifYes!: Expr | null;
  ifNo!: ConditionalOpOrLower | null;
  
  static rule: Caten = new Caten(
    new Match( false, 'cond', UnionOpLadder ),
    new Or(
      new Caten(
        token('then'),
        new Match( false, 'ifYes', ExprLadder ),
        token('else'),
        new Match( false, 'ifNo', ConditionalOpLadder ),
      ),
      new Caten(
        token('thand'),
        new Match( false, 'ifYes', ConditionalOpLadder ),
      ),
      new Caten(
        token('thelse'),
        new Match( false, 'ifNo', ConditionalOpLadder ),
      ),
    ),
  );
}

export class WhereOp extends SyntaxTreeNode {
  left!: UnionOpOrLower;
  right!: ConditionalOpOrLower;
  
  name!: IdentifierToken;
  
  static rule = new Caten(
    new Match( false, 'left', UnionOpLadder ),
    new Maybe(
      new Caten(
        token('as'),
        new Match( false, 'name', token('identifier') ),
      ),
    ),
    token('where'),
    new Match( false, 'right', ConditionalOpLadder ),
  );
}

class FieldRestriction extends SyntaxTreeNode {
  name!: IdentifierToken;
  value!: Expr;
  
  static rule = new Caten(
    equalsNameIdentifier,
    token(':'),
    equalsValueExprLadder,
    token(';'),
  );
}

export class ObjectRestriction extends SyntaxTreeNode {
  restrictions!: (FieldRestriction | Expr)[];
  expr!: Expr;
  
  static rule = new Caten(
    new Match( false, 'expr', ExprLadder ),
    token('with'),
    token('{'),
    new Repeat(
      new Or(
        new Match( true, 'restrictions', FieldRestriction ),
        new Caten(
          token('where'),
          new Match( true, 'restrictions', ExprLadder ),
          token(';'),
        ),
      ),
    ),
    token('}'),
  );
}

equalsBlockOp.match = BlockOp;
equalsQuantifierOp.match = QuantifierOp;
equalsSetLiteral.match = SetLiteral;
equalsObjectLiteral.match = ObjectLiteral;
equalsFunctionCallOp.match = FunctionCallOp;
equalsMemberAccessOp.match = MemberAccessOp;
equalsTypeArgumentList.match = TypeArgumentList;
equalsNegationOp.match = NegationOp;
equalsInverseOp.match = InverseOp;
equalsPowerOp.match = PowerOp;
equalsMulOp.match = MulOp;
equalsDivOp.match = DivOp;
equalsAddOp.match = AddOp;
equalsSubOp.match = SubOp;
equalsModuloOp.match = ModuloOp;
equalsMagmaOp.match = MagmaOp;
equalsComparisonOp.match = ComparisonOp;
equalsIntersectionOp.match = IntersectionOp;
equalsUnionOp.match = UnionOp;
equalsImplicationOp.match = ImplicationOp;
equalsConditionalOp.match = ConditionalOp;
equalsWhereOp.match = WhereOp;
equalsObjectRestriction.match = ObjectRestriction;

equalsExprLadder.match = ExprLadder;
equalsReturnOp.match = ReturnOp;

equalsBodyBlockOp.match = BlockOp;
equalsDefaultArgExprLadder.match = ExprLadder;
equalsExprExprLadder.match = ExprLadder;
equalsTypeExprLadder0.match = ExprLadder;
equalsTypeExprLadder1.match = ExprLadder;
equalsTypeExprLadder2.match = ExprLadder;
equalsTypeExprLadder3.match = ExprLadder;
equalsTypeExprLadder4.match = ExprLadder;
equalsValueExprLadder.match = ExprLadder;
