import { AstModule, AstType, AstFunction, AstVariable } from "../ast/ast.js";
import { Path } from "../main.js";
import { PotpoType } from "./potpo-type.js";
import { PotpoFunction } from "./potpo-function.js";
import { Variable } from "./variable.js";


type Nameable = PotpoType | PotpoFunction | Variable;

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
      switch (def.constructor) {
        case AstType: this.defs.set(def.name.value, new PotpoType(def as AstType)); break;
        case AstFunction: this.defs.set(def.name.value, new PotpoFunction(def as AstFunction)); break;
        case AstVariable: this.defs.set(def.name.value, new Variable(def as AstVariable)); break;
        default: throw new Error('programmer error');
      }
    });
  }
  
  importPaths(): string[] {
    return [];
  }
}
