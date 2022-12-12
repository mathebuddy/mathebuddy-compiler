/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { MBL_BlockItem } from './dataBlock';
import { JSONValue } from './dataJSON';

// refer to the specification at https://app.f07-its.fh-koeln.de/docs-mbcl.html

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
