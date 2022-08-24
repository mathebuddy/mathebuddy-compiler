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

export class RunError extends Error {
  constructor(srcRow: number, srcCol: number, msg: string) {
    super('' + srcRow + ':' + srcCol + ':' + msg);
    this.name = 'RunError';
  }
}

export class SellInterpreter {
  public interpret(code: string): void {
    // TODO: prevent infinite loops
    // TODO: get results via symbol table

    //const f = Function(code + 'console.log(x);');
    const f = Function('runtime', 'let x = runtime.rand(); console.log(x);');
    try {
      f(this);
    } catch (e) {
      // TODO
    }
  }

  private rand(min: number, max: number): number {
    return Math.floor(min + Math.random() * (max + 1 - min));
  }

  private randZ(min: number, max: number): number {
    let r = 0;
    while (r == 0) r = this.rand(min, max);
    return r;
  }

  private sin(x: number): number {
    return Math.sin(x);
  }

  private cos(x: number): number {
    return Math.cos(x);
  }

  private tan(x: number): number {
    return Math.tan(x);
  }

  private asin(x: number): number {
    return Math.asin(x);
  }

  private acos(x: number): number {
    return Math.acos(x);
  }

  private atan(x: number): number {
    return Math.atan(x);
  }

  private exp(x: number): number {
    return Math.exp(x);
  }

  private sqrt(x: number): number {
    return Math.sqrt(x);
  }

  private zeros(rows: number, cols: number): math.MathCollection {
    return math.zeros([rows, cols]);
  }

  private ones(rows: number, cols: number): math.MathCollection {
    return math.ones([rows, cols]);
  }

  private addMatrices(
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
