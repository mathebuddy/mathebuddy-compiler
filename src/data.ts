/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

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

export class Variable {
  name = '';
  type: VariableType;
  realValues: number[] = [];
  boolValues: boolean[] = [];
}

export enum VariableType {
  Real = 'real',
  Bool = 'bool',
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
