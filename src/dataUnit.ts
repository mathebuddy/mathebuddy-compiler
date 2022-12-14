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

// -------- UNIT --------

export class MBL_Unit {
  title = '';
  levels: MBL_Level[] = [];

  toJSON(): JSONValue {
    return {
      title: this.title,
      levels: this.levels.map((level) => level.file_id),
    };
  }
}
