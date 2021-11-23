import { SyntaxTreeNode, IdentifierToken, Token, Caten, Match, Maybe, Or, Repeat } from 'lr-parser-typescript';

import { token } from './tokenizer.js';


const matchFunctionCall = new Match( false, 'value', null! );
const matchRecordTemplate = new Match( false, 'value', null! );
const matchMemberAccess = new Match( false, 'value', null! );
const matchExistentialQuantifier = new Match( false, 'value', null! );
const matchUniversalQuantifier = new Match( false, 'value', null! );
const matchComplement = new Match( false, 'value', null! );
const matchIntersection = new Match( false, 'value', null! );
const matchUnion = new Match( false, 'value', null! );

const matchBodyUniversalQuantifier = new Match( true, 'body', null! );
const matchTypeLadder = new Match( false, 'value', null! );

export type Type =
  | IdentifierToken
  | FunctionCall
  | RecordTemplate
  | MemberAccess
  | ExistentialQuantifier
  | UniversalQuantifier
  | Complement
  | Intersection
  | Union
;

class BottomOfLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule = new Or(
    new Match( false, 'value', token('identifier') ),
    matchFunctionCall,
    matchMemberAccess,
    matchExistentialQuantifier,
    matchUniversalQuantifier,
    
    new Caten(
      token('('),
      matchTypeLadder,
      token(')'),
    ),
  );
}

class ComplementLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule: Or = new Or(
    matchComplement,
    new Match( false, 'value', BottomOfLadder ),
  );
}

class IntersectionLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule: Or = new Or(
    matchIntersection,
    new Match( false, 'value', ComplementLadder ),
  );
}

export class TypeLadder extends SyntaxTreeNode {
  static hidden = true;
  
  static rule: Or = new Or(
    matchUnion,
    new Match( false, 'value', IntersectionLadder ),
  );
}

// The end of the ladder section.

export class FunctionCall extends SyntaxTreeNode {
  term!: IdentifierToken;
  typeArgs!: Type[];
  args!: Type[];
  
  static rule = new Caten(
    new Match( false, 'term', token('identifier') ),
    
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
        new Match( true, 'args', TypeLadder ),
        token(','),
      ),
    ),
    token(')'),
  );
}

class RecordMember extends SyntaxTreeNode {
  name!: IdentifierToken;
  type!: Type;
  
  static rule = new Caten(
    new Match( false, 'name', token('identifier') ),
    token(':'),
    new Match( false, 'type', TypeLadder ),
    token(';'),
  );
}

export class RecordTemplate extends SyntaxTreeNode {
  name!: IdentifierToken;
  members!: RecordMember;
  
  static rule = new Caten(
    token('record'),
    token('{'),
    new Repeat(
      new Match( true, 'members', RecordMember ),
    ),
    token('}'),
  );
}

export class MemberAccess extends SyntaxTreeNode {
  term!: Type;
  member!: IdentifierToken;
  
  static rule: Caten = new Caten(
    new Match( false, 'term', BottomOfLadder ),
    token('.'),
    new Match( false, 'member', token('identifier') ),
  );
}

export class ExistentialQuantifier extends SyntaxTreeNode {
  name!: IdentifierToken;
  domain!: Type;
  body!: Type;
  
  static rule: Caten = new Caten(
    token('Ex'),
    new Match( false, 'name', token('identifier') ),
    
    new Maybe(
      new Caten(
        token(':'),
        new Match( false, 'domain', TypeLadder ),
      ),
    ),
    token(','),
    
    new Or(
      new Match( true, 'body', ExistentialQuantifier ),
      matchBodyUniversalQuantifier,
      new Caten(
        token('{'),
        new Repeat(
          new Caten(
            new Match( true, 'body', TypeLadder ),
            token(';'),
          ),
        ),
        token('}'),
      ),
    ),
  );
}

export class UniversalQuantifier extends SyntaxTreeNode {
  name!: IdentifierToken;
  domain!: Type;
  body!: Type;
  
  static rule: Caten = new Caten(
    token('All'),
    new Match( false, 'name', token('identifier') ),
    
    new Maybe(
      new Caten(
        token(':'),
        new Match( false, 'domain', TypeLadder ),
      ),
    ),
    token(','),
    
    new Or(
      new Match( true, 'body', ExistentialQuantifier ),
      new Match( true, 'body', UniversalQuantifier ),
      new Caten(
        token('{'),
        new Repeat(
          new Caten(
            new Match( true, 'body', TypeLadder ),
            token(';'),
          ),
        ),
        token('}'),
      ),
    ),
  );
}

export class Complement extends SyntaxTreeNode {
  term!: Type;
  
  static rule: Caten = new Caten(
    token('~'),
    new Match( false, 'term', ComplementLadder ),
  );
}

export class Intersection extends SyntaxTreeNode {
  left!: Type;
  right!: Type;
  
  static rule: Caten = new Caten(
    new Match( false, 'left', IntersectionLadder ),
    token('&'),
    new Match( false, 'right', ComplementLadder ),
  );
}

export class Union extends SyntaxTreeNode {
  left!: Type;
  right!: Type;
  
  static rule: Caten = new Caten(
    new Match( false, 'left', IntersectionLadder ),
    token('|'),
    new Match( false, 'right', ComplementLadder ),
  );
}

export class TypeDef extends SyntaxTreeNode {
  name!: IdentifierToken;
  term!: Type;
  
  static rule = new Caten(
    token('type'),
    new Match( false, 'name', token('identifier') ),
    token('='),
    new Match( false, 'term', TypeLadder ),
  );
}

matchFunctionCall.match = FunctionCall;
matchRecordTemplate.match = RecordTemplate;
matchMemberAccess.match = MemberAccess;
matchExistentialQuantifier.match = ExistentialQuantifier;
matchUniversalQuantifier.match = UniversalQuantifier;
matchComplement.match = Complement;
matchIntersection.match = Intersection;
matchUnion.match = Union;

matchBodyUniversalQuantifier.match = UniversalQuantifier;
matchTypeLadder.match = TypeLadder;
