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

// -------- ERROR --------

export class MBL_Error extends MBL_BlockItem {
  type = 'error';
  message = '';
  constructor() {
    super();
  }
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      type: this.type,
      title: this.title,
      label: this.label,
      error: this.error,
      message: this.message,
    };
  }
}
