import { AstModule } from "../ast/ast-module.js";
import { Path } from "../main.js";
import { PotpoClass } from "./potpo-class.js";
import { PotpoFunction } from "./potpo-function.js";
import { Variable } from "./variable.js";
import { AstFunctionLambda, AstLambda, AstFunction } from "../ast/ast-function.js";
import { AstClass } from "../ast/ast-class.js";
import { AstVariable } from "../ast/ast-variable.js";


type Nameable = PotpoClass | PotpoFunction | Variable;

class Import {
  folder: string;
  file: string;
  base: string;
  ext: string;
  
  constructor(
    public path: string,
    public as: string | null,
  ) {
    const fileStart = path.lastIndexOf('/') + 1;
    const dot = path.lastIndexOf('.');
    
    this.folder = path.substring(0, fileStart);
    this.file = path.substring(fileStart);
    this.base = path.substring(fileStart, dot);
    this.ext = path.substring(dot + 1);
  }
}

export class Module {
  imports: Import[];
  defs = new Map<string, Nameable>();
  
  constructor(
    public path: Path,
    public isFolder: boolean,
    astModule: AstModule,
  ) {
    this.imports = astModule.imports.map(imp => new Import(imp.path.value, imp.as?.value || null));
    
    astModule.defs.forEach(def => {
      const name = def instanceof AstFunctionLambda ? def.head.name : def.name;
      
      if (this.defs.has(name.value)) {
        this.defs.get(name.value)!.insert(def);
      } else {
        switch (def.constructor) {
          case AstClass: this.defs.set(name.value, new PotpoClass(def as AstClass)); break;
          case AstFunction:
          case AstLambda: this.defs.set(name.value, new PotpoFunction(def as AstFunction | AstLambda)); break;
          case AstVariable: this.defs.set(name.value, new Variable(def as AstVariable)); break;
          default: throw new Error('programmer error');
        }
      }
    });
  }
  
  importPaths(): string[] {
    return [];
  }
}
