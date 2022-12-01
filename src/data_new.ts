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
  id = '';
  author = '';
  mbcl_version = 1;
  date_modified = Date.now();
  chapters: MBL_Chapter[] = [];
  toJSON(): JSONValue {
    return {
      id: this.id,
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
  alias = '';
  levels: MBL_Level[] = [];
  toJSON(): JSONValue {
    return {
      title: this.title,
      alias: this.alias,
      levels: this.levels.map((level) => level.toJSON()),
    };
  }
}

// -------- LEVEL --------

export class MBL_Level {
  id = '';
  pos_x = -1;
  pos_y = -1;
  requires: MBL_Level[] = [];
  items: MBL_LevelItem[] = [];
  toJSON(): JSONValue {
    return {
      id: this.id,
      pos_x: this.pos_x,
      pos_y: this.pos_y,
      requires: this.requires.map((req) => req.id),
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export abstract class MBL_LevelItem {
  abstract toJSON(): JSONValue;
}

// -------- SECTION --------

enum MBL_SectionType {
  Title = 'title',
  Section = 'section',
  SubSection = 'subsection',
  SubSubSection = 'subsubsection',
}

export class MBL_Section extends MBL_LevelItem {
  type: MBL_SectionType;
  text = '';
  label = '';
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

export class MBL_Text_Paragraph extends MBL_Text {
  items: MBL_Text[] = [];
  toJSON(): JSONValue {
    return {
      type: 'paragraph',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_InlineMath extends MBL_Text {
  items: MBL_Text[] = [];
  toJSON(): JSONValue {
    return {
      type: 'inline_math',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Bold extends MBL_Text {
  items: MBL_Text[] = [];
  toJSON(): JSONValue {
    return {
      type: 'bold',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Italic extends MBL_Text {
  items: MBL_Text[] = [];
  toJSON(): JSONValue {
    return {
      type: 'italic',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Itemize extends MBL_Text {
  items: MBL_Text[] = [];
  toJSON(): JSONValue {
    return {
      type: 'itemize',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Enumerate extends MBL_Text {
  items: MBL_Text[] = [];
  toJSON(): JSONValue {
    return {
      type: 'enumerate',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_EnumerateAlpha extends MBL_Text {
  items: MBL_Text[] = [];
  toJSON(): JSONValue {
    return {
      type: 'enumerate_alpha',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Span extends MBL_Text {
  items: MBL_Text[] = [];
  toJSON(): JSONValue {
    return {
      type: 'span',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_AlignLeft extends MBL_Text {
  items: MBL_Text[] = [];
  toJSON(): JSONValue {
    return {
      type: 'align_left',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_AlignCenter extends MBL_Text {
  items: MBL_Text[] = [];
  toJSON(): JSONValue {
    return {
      type: 'align_center',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_AlignRight extends MBL_Text {
  items: MBL_Text[] = [];
  toJSON(): JSONValue {
    return {
      type: 'align_right',
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export class MBL_Text_Text extends MBL_Text {
  value = '';
  toJSON(): JSONValue {
    return {
      type: 'text',
      value: this.value,
    };
  }
}

export class MBL_Text_Linefeed extends MBL_Text {
  toJSON(): JSONValue {
    return {
      type: 'linefeed',
    };
  }
}

export class MBL_Text_Color extends MBL_Text {
  value = 0;
  toJSON(): JSONValue {
    return {
      type: 'color',
      value: this.value,
    };
  }
}

export class MBL_Text_Reference extends MBL_Text {
  label = '';
  toJSON(): JSONValue {
    return {
      type: 'reference',
      label: this.label,
    };
  }
}

// -------- BLOCK ITEM --------

export abstract class MBL_BlockItem extends MBL_LevelItem {
  type: string;
  title: string;
  label: string;
  error: string;
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
  items: MBL_BlockItem[] = [];
  constructor(type: MBL_DefinitionType) {
    super();
    this.type = type;
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
  items: MBL_BlockItem[] = [];
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
  text: MBL_Exercise_Text = new MBL_Text_Paragraph();
  toJSON(): JSONValue {
    const variablesJSON: { [id: string]: JSONValue } = {};
    for (const v in this.variables) {
      variablesJSON[v] = this.variables[v].toJSON();
    }
    return {
      type: 'exercise',
      title: this.title,
      label: this.label,
      error: this.error,
      variables: variablesJSON,
      instances: this.instances.map((instance) => instance.toJSON()),
      text: this.text.toJSON(),
    };
  }
}

export enum MBL_Exercise_VariableType {
  Int = 'int',
  IntSet = 'int_set',
  Real = 'real',
  RealSet = 'real_set',
  Complex = 'complex',
  ComplexSet = 'complex_set',
  Vector = 'vector',
  Matrix = 'matrix',
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
  value: { [id: string]: string } = {};
  toJSON(): JSONValue {
    return this.value;
  }
}

export abstract class MBL_Exercise_Text extends MBL_Text {}

export class MBL_Exercise_Text_Variable extends MBL_Exercise_Text {
  variableId = '';
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
  toJSON(): JSONValue {
    return {
      type: 'text_input',
      input_type: this.type.toString(),
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
  toJSON(): JSONValue {
    return {
      type: 'new_page',
    };
  }
}
