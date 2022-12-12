/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { aggregateMultipleChoice, aggregateSingleChoice } from './dataExercise';
import { JSONValue } from './dataJSON';
import { MBL_LevelItem } from './dataLevel';

// refer to the specification at https://app.f07-its.fh-koeln.de/docs-mbcl.html

// -------- TEXT --------

export abstract class MBL_Text extends MBL_LevelItem {}

function simplifyText(items: MBL_Text[]): void {
  // remove unnecessary line feeds
  while (items.length > 0 && items[0] instanceof MBL_Text_Linefeed) {
    items.shift();
  }
  while (
    items.length > 0 &&
    items[items.length - 1] instanceof MBL_Text_Linefeed
  ) {
    items.pop();
  }
  // concatenate consecutive text items
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
    aggregateMultipleChoice(this.items);
    aggregateSingleChoice(this.items);
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

export enum MBL_Text_Itemize_Type {
  Itemize = 'itemize',
  Enumerate = 'enumerate',
  EnumerateAlpha = 'enumerate_alpha',
}

export class MBL_Text_Itemize extends MBL_Text {
  type: MBL_Text_Itemize_Type;
  items: MBL_Text[] = [];
  constructor(type: MBL_Text_Itemize_Type) {
    super();
    this.type = type;
  }
  postProcess(): void {
    for (const i of this.items) i.postProcess();
    simplifyText(this.items);
  }
  toJSON(): JSONValue {
    return {
      type: this.type,
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

// TODO: aggregate next 3 classes into one!

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
      items: this.items.map((item) => item.toJSON()),
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
