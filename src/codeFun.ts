/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

/**
 * This file populates the symbol table with function prototypes.
 * Each function must be implemented in file run.ts.
 */

import { BaseType, SymbolKind, SymTabEntry, Type } from './code';
import { Lexer } from './lex';

// TODO: write documentation for each function + extract it

//G prototype = ID [ "<" params ">" ] "(" [ params ] ")" ":" type "->" ID ";";
//G params = "ID" ":" type { "," "ID" ":" type };
//G type = "INT" | "REAL" | "COMPLEX" | "MATRIX";
const functions = `
  abs(x:INT):INT -> absInt;
  abs(x:REAL):REAL -> absReal;
  abs(x:COMPLEX): REAL -> absComplex;
  # calculates the absolute value
  exp(x:INT):REAL -> exp;
  exp(x:REAL):REAL -> exp;
  exp(x:COMPLEX):COMPLEX -> expComplex;
  sqrt(x:REAL): REAL -> sqrt;
  sqrt(x:COMPLEX): COMPLEX -> sqrtComplex;
  sin(x:INT): REAL -> sin;
  sin(x:REAL): REAL -> sin;
  cos(x:INT): REAL -> cos;
  cos(x:REAL): REAL -> cos;
  tan(x:INT): REAL -> tan;
  tan(x:REAL): REAL -> tan;
  asin(x:INT): REAL -> asin;
  asin(x:REAL): REAL -> asin;
  acos(x:INT): REAL -> acos;
  acos(x:REAL): REAL -> acos;
  atan(x:INT): REAL -> atan;
  atan(x:REAL): REAL -> atan;
  floor(x:INT): INT -> floor;
  floor(x:REAL): INT -> floor;
  ceil(x:INT): INT -> ceil;
  ceil(x:REAL): INT -> ceil;
  round(x:INT): INT -> round;
  round(x:REAL): INT -> round;
  sign(x:INT): INT -> sign;
  sign(x:REAL): INT -> sign;
  rand(max:INT): INT -> randIntMax;
  rand(min:INT,max:INT): INT -> randIntMinMax;
  randZ(max:INT): INT -> randZIntMax;
  randZ(min:INT,max:INT): INT -> randZIntMinMax;
  rand<rows:INT,columns:INT>(min:INT,max:INT): MATRIX -> randMatrix;
  randZ<rows:INT,columns:INT>(min:INT,max:INT): MATRIX -> randZMatrix;
  binomial(n:INT,k:INT): INT -> binomial;
  min(x:MATRIX): REAL -> minMatrix;
  max(x:MATRIX): REAL -> maxMatrix;
`;

function getBaseType(lex: Lexer, str: string): BaseType {
  if (str === 'BOOL') return BaseType.BOOL;
  else if (str === 'INT') return BaseType.INT;
  else if (str === 'REAL') return BaseType.REAL;
  else if (str === 'COMPLEX') return BaseType.COMPLEX;
  else if (str === 'MATRIX') return BaseType.MATRIX;
  else lex.error('unknown base type ' + str);
}

export function createFunctionPrototypes(): SymTabEntry[] {
  // set up lexer
  const lex = new Lexer({
    singleLineCommentStart: '#',
    multiLineCommentStart: '',
    multilineCommentEnd: '',
    parseNewlineEnabled: false,
    parseIndentationEnabled: false,
    lexerFilePositionPrefix: '!<',
    backslashLineBreaksEnabled: false,
  });
  lex.setTerminals(['->']);
  lex.pushSource('INTERNAL', functions);
  // parse
  const symTab: SymTabEntry[] = [];
  while (lex.isNotEND()) {
    // (a) read properties
    const funID = lex.ID();
    const dimIDs: string[] = [];
    const dimTypes: BaseType[] = [];
    if (lex.isTER('<')) {
      lex.next();
      let i = 0;
      while (lex.isNotTER('>')) {
        if (i > 0) lex.TER(',');
        dimIDs.push(lex.ID());
        lex.TER(':');
        dimTypes.push(getBaseType(lex, lex.ID()));
        i++;
      }
      lex.TER('>');
    }
    const paramIDs: string[] = [];
    const paramTypes: BaseType[] = [];
    lex.TER('(');
    let i = 0;
    while (lex.isNotTER(')')) {
      if (i > 0) lex.TER(',');
      paramIDs.push(lex.ID());
      lex.TER(':');
      paramTypes.push(getBaseType(lex, lex.ID()));
      i++;
    }
    lex.TER(')');
    lex.TER(':');
    const returnType = getBaseType(lex, lex.ID());
    lex.TER('->');
    const runtimeID = lex.ID();
    lex.TER(';');
    // (b) populate symbol table
    const subSymbols: SymTabEntry[] = [];
    for (let i = 0; i < dimIDs.length; i++) {
      const dim = new SymTabEntry(
        dimIDs[i],
        SymbolKind.Parameter,
        new Type(dimTypes[i]),
        1,
        [],
      );
      subSymbols.push(dim);
    }
    for (let i = 0; i < paramIDs.length; i++) {
      const param = new SymTabEntry(
        paramIDs[i],
        SymbolKind.Parameter,
        new Type(paramTypes[i]),
        1,
        [],
      );
      subSymbols.push(param);
    }
    const s = new SymTabEntry(
      funID,
      SymbolKind.Function,
      new Type(returnType),
      0,
      subSymbols,
    );
    s.runtimeId = runtimeID;
    // function overloading?
    for (let i = symTab.length - 1; i >= 0; i--) {
      // TODO: this is slow: use a dictionary with ref to last entry for every id
      if (symTab[i].id === funID) {
        symTab[i].functionOverloadSuccessor = s;
      }
    }
    // finally push symbol to symbol table
    symTab.push(s);
  }
  // return result
  return symTab;
}
