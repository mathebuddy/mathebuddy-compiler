/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { MBL_BlockItem } from './dataBlock';
import { JSONValue } from './dataJSON';
import { MBL_Text, MBL_Text_Paragraph } from './dataText';

// refer to the specification at https://app.f07-its.fh-koeln.de/docs-mbcl.html

export class MBL_Exercise extends MBL_BlockItem {
  type = 'exercise';
  variables: { [id: string]: MBL_Exercise_Variable } = {};
  instances: MBL_Exercise_Instance[] = [];
  code = '';
  text: MBL_Exercise_Text = new MBL_Text_Paragraph();
  staticVariableCounter = 0;

  addStaticBooleanVariable(value: boolean): string {
    const varId = '__bool__' + this.staticVariableCounter++;
    const v = new MBL_Exercise_Variable();
    v.type = MBL_Exercise_VariableType.Bool;
    this.variables[varId] = v;
    const NUM_INST = 3; // TODO!!
    if (this.instances.length == 0)
      for (let i = 0; i < NUM_INST; i++)
        this.instances.push(new MBL_Exercise_Instance());
    for (let i = 0; i < NUM_INST; i++)
      this.instances[i].values[varId] = value ? 'true' : 'false';
    return varId;
  }

  postProcess(): void {
    this.text.postProcess();
  }

  toJSON(): JSONValue {
    const variablesJSON: { [id: string]: JSONValue } = {};
    for (const v in this.variables) {
      variablesJSON[v] = this.variables[v].toJSON();
    }
    // TODO: do NOT output code when "single_level" == false
    return {
      type: this.type,
      title: this.title,
      label: this.label,
      error: this.error,
      code: this.code,
      variables: variablesJSON,
      instances: this.instances.map((instance) => instance.toJSON()),
      text: this.text.toJSON(),
    };
  }
}

export enum MBL_Exercise_VariableType {
  Bool = 'bool',
  Int = 'int',
  IntSet = 'int_set',
  Real = 'real',
  RealSet = 'real_set',
  Complex = 'complex',
  ComplexSet = 'complex_set',
  Vector = 'vector',
  Matrix = 'matrix',
  Term = 'term',
}

export class MBL_Exercise_Variable {
  type: MBL_Exercise_VariableType;
  toJSON(): JSONValue {
    return {
      type: this.type.toString(),
    };
  }
}

export class MBL_Exercise_Instance {
  values: { [id: string]: string } = {};
  toJSON(): JSONValue {
    return this.values;
  }
}

export abstract class MBL_Exercise_Text extends MBL_Text {}

export class MBL_Exercise_Text_Variable extends MBL_Exercise_Text {
  type = 'variable';
  variableId = '';
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      type: this.type,
      variable: this.variableId,
    };
  }
}

export class MBL_Exercise_Text_Input extends MBL_Exercise_Text {
  type = 'text_input';
  input_type: MBL_Exercise_Text_Input_Type;
  variable = '';
  inputRequire: string[] = [];
  inputForbid: string[] = [];
  width = 0;
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      type: this.type,
      input_type: this.type,
      input_require: this.inputRequire.map((i) => i.toString()),
      input_forbid: this.inputForbid.map((i) => i.toString()),
      variable: this.variable,
      width: this.width,
    };
  }
}

// TODO: export class MBL_Exercise_Text_Choices_Input

export class MBL_Exercise_Text_Multiple_Choice extends MBL_Exercise_Text {
  type = 'multiple_choice';
  items: MBL_Exercise_Text_Single_or_Multi_Choice_Option[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
  }
  toJSON(): JSONValue {
    return {
      type: this.type,
      items: this.items.map((i) => i.toJSON()),
    };
  }
}

export class MBL_Exercise_Text_Single_Choice extends MBL_Exercise_Text {
  type = 'single_choice';
  items: MBL_Exercise_Text_Single_or_Multi_Choice_Option[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
  }
  toJSON(): JSONValue {
    return {
      type: this.type,
      items: this.items.map((i) => i.toJSON()),
    };
  }
}

export class MBL_Exercise_Text_Single_or_Multi_Choice_Option {
  variable = '';
  text: MBL_Text;
  postProcess(): void {
    this.text.postProcess();
  }
  toJSON(): JSONValue {
    return {
      variable: this.variable,
      text: this.text.toJSON(),
    };
  }
}

export enum MBL_Exercise_Text_Input_Type {
  Int = 'int',
  Real = 'real',
  ComplexNormal = 'complex_normal',
  ComplexPolar = 'complex_polar',
  IntSet = 'int_set',
  IntSetNArts = 'int_set_n_args',
  Vector = 'vector',
  VectorFlex = 'vector_flex',
  Matrix = 'matrix',
  MatrixFlexRows = 'matrix_flex_rows',
  MatrixFlexCols = 'matrix_flex_cols',
  MatrixFlex = 'matrix_flex',
  Term = 'term',
}

export function aggregateMultipleChoice(items: MBL_Text[]): void {
  for (let i = 0; i < items.length; i++) {
    if (
      i > 0 &&
      items[i - 1] instanceof MBL_Exercise_Text_Multiple_Choice &&
      items[i] instanceof MBL_Exercise_Text_Multiple_Choice
    ) {
      const u = <MBL_Exercise_Text_Multiple_Choice>items[i - 1];
      const v = <MBL_Exercise_Text_Multiple_Choice>items[i];
      u.items = u.items.concat(v.items);
      items.splice(i, 1);
      i--;
    }
  }
}

export function aggregateSingleChoice(items: MBL_Text[]): void {
  for (let i = 0; i < items.length; i++) {
    if (
      i > 0 &&
      items[i - 1] instanceof MBL_Exercise_Text_Single_Choice &&
      items[i] instanceof MBL_Exercise_Text_Single_Choice
    ) {
      const u = <MBL_Exercise_Text_Multiple_Choice>items[i - 1];
      const v = <MBL_Exercise_Text_Multiple_Choice>items[i];
      u.items = u.items.concat(v.items);
      items.splice(i, 1);
      i--;
    }
  }
}
