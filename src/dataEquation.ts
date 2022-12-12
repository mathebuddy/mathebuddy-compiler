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
