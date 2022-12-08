/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

// refer to the specification at https://app.f07-its.fh-koeln.de/docs-mbcl.html

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

// -------- COURSE --------

export class MBL_Course {
  single_level = true;
  title = '';
  author = '';
  mbcl_version = 1;
  date_modified = Math.floor(Date.now() / 1000);
  chapters: MBL_Chapter[] = [];
  postProcess(): void {
    for (const ch of this.chapters) ch.postProcess();
  }
  toJSON(): JSONValue {
    return {
      single_level: this.single_level,
      title: this.title,
      author: this.author,
      mbcl_version: this.mbcl_version,
      date_modified: this.date_modified,
      chapters: this.chapters.map((chapter) => chapter.toJSON()),
    };
  }
}

// -------- CHAPTER --------

export class MBL_Chapter {
  title = '';
  label = '';
  levels: MBL_Level[] = [];
  postProcess(): void {
    for (const l of this.levels) l.postProcess();
  }
  toJSON(): JSONValue {
    return {
      title: this.title,
      label: this.label,
      levels: this.levels.map((level) => level.toJSON()),
    };
  }
}

// -------- LEVEL --------

export class MBL_Level {
  title = '';
  label = '';
  pos_x = -1;
  pos_y = -1;
  requires: MBL_Level[] = [];
  items: MBL_LevelItem[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
  }
  toJSON(): JSONValue {
    return {
      title: this.title,
      label: this.label,
      pos_x: this.pos_x,
      pos_y: this.pos_y,
      requires: this.requires.map((req) => req.title),
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export abstract class MBL_LevelItem {
  abstract postProcess(): void;
  abstract toJSON(): JSONValue;
}

// -------- SECTION --------

export enum MBL_SectionType {
  Section = 'section',
  SubSection = 'subsection',
  SubSubSection = 'subsubsection',
}

export class MBL_Section extends MBL_LevelItem {
  type: MBL_SectionType;
  text = '';
  label = '';
  postProcess(): void {
    /* empty */
  }
  constructor(type: MBL_SectionType) {
    super();
    this.type = type;
  }
  toJSON(): JSONValue {
    return {
      type: this.type,
      text: this.text,
      label: this.label,
    };
  }
}

// -------- TEXT --------

export abstract class MBL_Text extends MBL_LevelItem {}

function simplifyText(items: MBL_Text[]): void {
  for (let i = 0; i < items.length; i++) {
    if (
      i > 0 &&
      items[i - 1] instanceof MBL_Text_Text &&
      items[i] instanceof MBL_Text_Text
    ) {
      let text = (<MBL_Text_Text>items[i]).value;
      if ('.,:!?'.includes(text) == false) text = ' ' + text;
      (<MBL_Text_Text>items[i - 1]).value += text;
      // TODO: next line is an ugly hack for TeX..
      (<MBL_Text_Text>items[i - 1]).value = (<MBL_Text_Text>(
        items[i - 1]
      )).value.replace(/\\ /g, '\\');
      items.splice(i, 1);
      i--;
    }
  }
}

export class MBL_Text_Paragraph extends MBL_Text {
  items: MBL_Text[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'paragraph',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_InlineMath extends MBL_Text {
  items: MBL_Text[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'inline_math',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Bold extends MBL_Text {
  items: MBL_Text[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'bold',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Italic extends MBL_Text {
  items: MBL_Text[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'italic',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Itemize extends MBL_Text {
  items: MBL_Text[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'itemize',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Enumerate extends MBL_Text {
  items: MBL_Text[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'enumerate',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_EnumerateAlpha extends MBL_Text {
  items: MBL_Text[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'enumerate_alpha',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Span extends MBL_Text {
  items: MBL_Text[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'span',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_AlignLeft extends MBL_Text {
  items: MBL_Text[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'align_left',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_AlignCenter extends MBL_Text {
  items: MBL_Text[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'align_center',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_AlignRight extends MBL_Text {
  items: MBL_Text[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'align_right',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Text extends MBL_Text {
  value = '';
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      type: 'text',
      value: this.value,
    };
  }
}

export class MBL_Text_Linefeed extends MBL_Text {
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      type: 'linefeed',
    };
  }
}

export class MBL_Text_Color extends MBL_Text {
  key = 0;
  items: MBL_Text[] = [];
  postProcess(): void {
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: 'color',
      key: this.key,
    };
  }
}

export class MBL_Text_Reference extends MBL_Text {
  label = '';
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      type: 'reference',
      label: this.label,
    };
  }
}

export class MBL_Text_Error extends MBL_Text {
  message = '';
  constructor(message: string) {
    super();
    this.message = message;
  }
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      type: 'error',
      message: this.message,
    };
  }
}

// -------- BLOCK ITEM --------

export abstract class MBL_BlockItem extends MBL_LevelItem {
  type: string;
  title = '';
  label = '';
  error = '';
}

// -------- EQUATION --------

export enum MBL_EquationOption {
  AlignLeft = 'align_left',
  AlignCenter = 'align_center',
  AlignRight = 'align_right',
  AlignEquals = 'align_equals',
}

export class MBL_Equation extends MBL_BlockItem {
  value = '';
  numbering = -1;
  options: MBL_EquationOption[] = [];
  postProcess(): void {
    // TODO
  }
  toJSON(): JSONValue {
    return {
      type: 'equation',
      title: this.title,
      label: this.label,
      error: this.error,
      value: this.value,
      numbering: this.numbering,
      options: this.options.map((option) => option.toString()),
    };
  }
}

// -------- ERROR --------

export class MBL_Error extends MBL_BlockItem {
  message = '';
  constructor() {
    super();
  }
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      type: 'error',
      title: this.title,
      label: this.label,
      error: this.error,
      message: this.message,
    };
  }
}

// -------- DEFINITION --------

export enum MBL_DefinitionType {
  Definition = 'definition',
  Theorem = 'theorem',
  Lemma = 'lemma',
  Corollary = 'corollary',
  Proposition = 'proposition',
  Conjecture = 'conjecture',
  Axiom = 'axiom',
  Claim = 'claim',
  Identity = 'identity',
  Paradox = 'paradox',
}

export class MBL_Definition extends MBL_BlockItem {
  type: MBL_DefinitionType;
  items: (MBL_Equation | MBL_Text)[] = [];
  constructor(type: MBL_DefinitionType) {
    super();
    this.type = type;
  }
  postProcess(): void {
    for (const i of this.items) i.postProcess();
  }
  toJSON(): JSONValue {
    return {
      type: this.type,
      title: this.title,
      label: this.label,
      error: this.error,
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

// -------- EXAMPLE --------

export class MBL_Example extends MBL_BlockItem {
  items: (MBL_Equation | MBL_Text)[] = [];
  postProcess(): void {
    for (const i of this.items) i.postProcess();
  }
  toJSON(): JSONValue {
    return {
      type: 'example',
      title: this.title,
      label: this.label,
      error: this.error,
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

// -------- EXERCISE --------

export class MBL_Exercise extends MBL_BlockItem {
  variables: { [id: string]: MBL_Exercise_Variable } = {};
  instances: MBL_Exercise_Instance[] = [];
  code = '';
  text: MBL_Exercise_Text = new MBL_Text_Paragraph();
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    const variablesJSON: { [id: string]: JSONValue } = {};
    for (const v in this.variables) {
      variablesJSON[v] = this.variables[v].toJSON();
    }
    // TODO: do NOT output code when "single_level" == false
    return {
      type: 'exercise',
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
  variableId = '';
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      variable: this.variableId,
    };
  }
}

export class MBL_Exercise_Text_Input extends MBL_Exercise_Text {
  type: MBL_Exercise_Text_Input_Type;
  variable = '';
  inputRequire: string[] = [];
  inputForbid: string[] = [];
  width = 0;
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      type: 'text_input',
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
  items: MBL_Exercise_Text_Single_or_Multi_Choice_Option[] = [];
  postProcess(): void {
    // TODO
  }
  toJSON(): JSONValue {
    return {
      type: 'multiple_choice',
      items: this.items.map((i) => i.toJSON()),
    };
  }
}

export class MBL_Exercise_Text_Single_or_Multi_Choice_Option {
  variable = '';
  text = '';
  toJSON(): JSONValue {
    return {
      variable: this.variable,
      text: this.text,
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

// -------- FIGURE --------

export class MBL_Figure extends MBL_BlockItem {
  path = '';
  caption = '';
  options: MBL_Figure_Option[] = [];
  postProcess(): void {
    // TODO
  }
  toJSON(): JSONValue {
    return {
      type: 'figure',
      title: this.title,
      label: this.label,
      error: this.error,
    };
  }
}

export enum MBL_Figure_Option {
  Width25 = 'width-25',
  Width33 = 'width-33',
  Width50 = 'width-50',
  Width66 = 'width-66',
  Width100 = 'width-100',
}

// -------- TABLE --------

export class MBL_Table extends MBL_BlockItem {
  head: string[] = [];
  rows: MBL_Table_Row[] = [];
  options: MBL_Table_Option[] = [];
  postProcess(): void {
    // TODO
  }
  toJSON(): JSONValue {
    return {
      type: 'table',
      title: this.title,
      label: this.label,
      error: this.error,
      head: this.head,
      rows: this.rows.map((row) => row.toJSON()),
      options: this.options.map((option) => option.toString()),
    };
  }
}

export class MBL_Table_Row {
  text: string[] = [];
  toJSON(): JSONValue {
    return {
      row: this.text,
    };
  }
}

export enum MBL_Table_Option {
  AlignLeft = 'align_left',
  AlignCenter = 'align_center',
  AlignRight = 'align_right',
}

// -------- NEWPAGE --------

export class MBL_NewPage extends MBL_LevelItem {
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      type: 'new_page',
    };
  }
}
