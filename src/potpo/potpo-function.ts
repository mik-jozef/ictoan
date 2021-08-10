import { AstFunction, AstLambda } from '../ast/ast.js';


export class PotpoFunction {
  name: string;
  
  constructor(ast: AstFunction | AstLambda) {
    this.name = ast.head.name.value;
    
    this.insert(ast);
  }
  
  insert(ast: ) {
    
  }
}
