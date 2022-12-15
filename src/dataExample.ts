/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { MBL_BlockItem } from './dataBlock';
import { MBL_Equation } from './dataEquation';
import { JSONValue } from './dataJSON';
import { MBL_Text } from './dataText';

// refer to the specification at https://app.f07-its.fh-koeln.de/docs-mbcl.html

// -------- EXAMPLE --------

export class MBL_Example extends MBL_BlockItem {
  type = 'example';
  items: (MBL_Equation | MBL_Text)[] = [];
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
