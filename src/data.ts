/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { assert } from 'console';
import { row } from 'mathjs';

export class Course {
  id = '';
  author = '';
  modifiedDate = '';
  documents: CourseDocument[] = [];
}

export class CourseDocument {
  title = '';
  alias = '';
  items: DocumentItem[] = [];
}

export abstract class DocumentItem {}

export class Exercise extends DocumentItem {
  title = '';
  code_raw = '';
  variables: Variable[] = [];
  text_raw = '';
  text: Text;
}

export class Matrix {
  rows = 1;
  cols = 1;
  values: number[] = [];
  constructor(rows = 1, cols = 1) {
    this.resize(rows, cols);
  }
  resize(rows: number, cols: number): void {
    this.rows = rows;
    this.cols = cols;
    this.values = [];
    const n = rows * cols;
    for (let i = 0; i < n; i++) this.values.push(0);
  }
  setValue(row: number, col: number, value: number): void {
    assert(row >= 0 && row < this.rows);
    assert(col >= 0 && col < this.cols);
    this.values[row * this.cols + col] = value;
  }
  getValue(row: number, col: number): number {
    assert(row >= 0 && row < this.rows);
    assert(col >= 0 && col < this.cols);
    return this.values[row * this.cols + col];
  }
}

export class Variable {
  name = '';
  type: VariableType;
  realValues: number[] = [];
  boolValues: boolean[] = [];
  matrixValues: Matrix[] = [];
}

export enum VariableType {
  Real = 'real',
  Bool = 'bool',
  Matrix = 'matrix',
}

export class Text extends DocumentItem {
  items: TextItem[] = [];
}

export abstract class TextItem {}

export class TextMath extends TextItem {
  value = '';
}

export class TextString extends TextItem {
  value = '';
}

export class TextMultichoice extends TextItem {
  items: TextMultichoiceItem[] = [];
}

export class TextMultichoiceItem extends TextItem {
  variable: Variable;
  text: Text;
}

export class TextItemize extends TextItem {
  items: TextItem[] = [];
}
