/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

//import * as assert from 'assert';

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export class Course {
  id = '';
  author = '';
  modifiedDate = '';
  documents: CourseDocument[] = [];

  toJSON(): JSONValue {
    const docs: JSONValue = [];
    for (const d of this.documents) {
      docs.push(d.toJSON());
    }
    return {
      id: this.id,
      author: this.author,
      modifiedDate: this.modifiedDate,
      documents: docs,
    };
  }
}

export class CourseDocument {
  title = '';
  alias = '';
  items: DocumentItem[] = [];

  toJSON(): JSONValue {
    const items: JSONValue = [];
    for (const item of this.items) {
      items.push(item.toJSON());
    }
    return {
      title: this.title,
      alias: this.alias,
      items: items,
    };
  }
}

export abstract class DocumentItem {
  toJSON(): JSONValue {
    return {}; // overwritten by derived classes
  }
}

export enum ParagraphItemType {
  Unknown = 'unknown',
  Paragraph = 'paragraph',
  Bold = 'bold',
  Italic = 'italic',
  Text = 'text',
  Linefeed = 'linefeed',
  Color = 'color',
  Equation = 'equation',
  Itemize = 'itemize',
  Enumerate = 'enumerate',
  Reference = 'reference',
  InlineMath = 'inline-math',
}

export class ParagraphItem extends DocumentItem {
  type: ParagraphItemType;
  subItems: ParagraphItem[] = [];
  value = '';
  constructor(type: ParagraphItemType) {
    super();
    this.type = type;
  }
  toJSON(): JSONValue {
    const items: JSONValue = [];
    for (const item of this.subItems) {
      items.push(item.toJSON());
    }
    switch (this.type) {
      case ParagraphItemType.Paragraph:
      case ParagraphItemType.Bold:
      case ParagraphItemType.Italic:
      case ParagraphItemType.Itemize:
      case ParagraphItemType.Enumerate:
        return {
          type: this.type,
          items: items,
        };
      case ParagraphItemType.Color:
        return {
          type: this.type,
          value: this.value,
          items: items,
        };
      case ParagraphItemType.Text:
      case ParagraphItemType.Equation:
      case ParagraphItemType.InlineMath:
      case ParagraphItemType.Reference:
        return {
          type: this.type,
          value: this.value,
        };
      case ParagraphItemType.Linefeed:
      case ParagraphItemType.Unknown:
        return {
          type: this.type,
        };
      default:
        console.log('UNIMPLEMENTED toJSON(..) for "' + this.type + '"');
        return {};
    }
  }
  /**
   * this methods concatenates text items
   */
  simplify(): void {
    for (let i = 0; i < this.subItems.length; i++) {
      if (
        i > 0 &&
        this.subItems[i - 1].type === ParagraphItemType.Text &&
        this.subItems[i].type === ParagraphItemType.Text
      ) {
        let text = this.subItems[i].value;
        if ('.,:'.includes(text) == false) text = ' ' + text;
        this.subItems[i - 1].value += text;
        this.subItems.splice(i, 1);
        i--;
      } else {
        this.subItems[i].simplify();
      }
    }
  }
}

/*export abstract class ParagraphItem {
  toJSON(): JSONValue {
    return {};
  }
}

export class Paragraph {
  items: ParagraphItem[] = [];
  toJSON(): JSONValue {
    const items: JSONValue = [];
    for (const item of this.items) {
      items.push(item.toJSON());
    }
    return {
      type: 'paragraph',
      items: items,
    };
  }
}

export class Text extends ParagraphItem {
  value = '';
  toJSON(): JSONValue {
    return {
      type: 'text',
      value: this.value,
    };
  }
}*/

export class Exercise extends DocumentItem {
  title = '';
  code_raw = '';
  variables: Variable[] = [];
  text_raw = '';
  text: ParagraphItem = null;

  toJSON(): JSONValue {
    const vars: JSONValue = [];
    for (const v of this.variables) {
      vars.push(v.toJSON());
    }
    return {
      type: 'exercise',
      title: this.title,
      variables: vars,
      //TODO text: this.text.toJSON(),
    };
  }
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
    //TODO assert.ok(row >= 0 && row < this.rows);
    //TODO assert.ok(col >= 0 && col < this.cols);
    this.values[row * this.cols + col] = value;
  }

  getValue(row: number, col: number): number {
    //TODO assert.ok(row >= 0 && row < this.rows);
    //TODO assert.ok(col >= 0 && col < this.cols);
    return this.values[row * this.cols + col];
  }

  toJSON(): JSONValue {
    return {
      rows: this.rows,
      cols: this.cols,
      values: this.values,
    };
  }
}

export class Variable {
  name = '';
  type: VariableType;

  //TODO: better to NOT create arrays here???;

  realValues: number[] = [];
  boolValues: boolean[] = [];
  matrixValues: Matrix[] = [];

  toJSON(): JSONValue {
    let values: JSONValue = [];
    switch (this.type) {
      case VariableType.Bool:
        values = this.boolValues;
        break;
      case VariableType.Real:
        values = this.realValues;
        break;
      case VariableType.Matrix:
        for (const v of this.matrixValues) {
          values.push(v.toJSON());
        }
        break;
      default:
        console.error('Variable.toJSON(..): unimplemented type ' + this.type);
        process.exit(-1);
    }
    return {
      name: this.name,
      type: this.type,
      values: values,
    };
  }
}

export enum VariableType {
  Real = 'real',
  Bool = 'bool',
  Matrix = 'matrix',
}
