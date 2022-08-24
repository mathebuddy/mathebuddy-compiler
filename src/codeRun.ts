/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

/**
 * This file interprets SELL code.
 */

import * as math from 'mathjs';
import { SymTabEntry } from './code';

export class RunError extends Error {
  constructor(srcRow: number, srcCol: number, msg: string) {
    super('' + srcRow + ':' + srcCol + ':' + msg);
    this.name = 'RunError';
  }
}

export class SellInterpreter {
  public interpret(code: string, locals: SymTabEntry[]): void {
    // TODO: prevent infinite loops
    code += 'return [';
    let i = 0;
    for (const local of locals) {
      if (i > 0) code += ', ';
      code += local.id;
      i++;
    }
    code += '];';
    const f = Function('runtime', code);
    try {
      const res = f(this);
      const bp = 1337;
    } catch (e) {
      // TODO
      console.log(e);
    }
  }

  private _randIntMax(max: number): number {
    return Math.floor(Math.random() * (max + 1));
  }

  private _randIntMinMax(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  private _randIntMinMaxZ(min: number, max: number): number {
    let r = 0;
    while (r == 0) r = this._randIntMinMax(min, max);
    return r;
  }

  private _sin(x: number): number {
    return Math.sin(x);
  }

  private _cos(x: number): number {
    return Math.cos(x);
  }

  private _tan(x: number): number {
    return Math.tan(x);
  }

  private _asin(x: number): number {
    return Math.asin(x);
  }

  private _acos(x: number): number {
    return Math.acos(x);
  }

  private _atan(x: number): number {
    return Math.atan(x);
  }

  private _exp(x: number): number {
    return Math.exp(x);
  }

  private _sqrt(x: number): number {
    return Math.sqrt(x);
  }

  private _zeros(rows: number, cols: number): math.MathCollection {
    return math.zeros([rows, cols]);
  }

  private _ones(rows: number, cols: number): math.MathCollection {
    return math.ones([rows, cols]);
  }

  private _addMatrices(
    a: math.MathCollection,
    b: math.MathCollection,
    srcRow: number,
    srcCol: number,
  ): math.MathCollection {
    let c: math.MathCollection;
    try {
      c = math.add(a, b);
    } catch (e) {
      throw new RunError(srcRow, srcCol, 'dimensions do not match');
    }
    return c;
  }
}
