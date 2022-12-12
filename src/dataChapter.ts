/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { JSONValue } from './dataJSON';
import { MBL_Level } from './dataLevel';

// refer to the specification at https://app.f07-its.fh-koeln.de/docs-mbcl.html

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
