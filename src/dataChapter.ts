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
  author = '';
  label = '';
  pos_x = -1;
  pos_y = -1;
  requires: MBL_Chapter[] = [];
  levels: MBL_Level[] = [];
  postProcess(): void {
    for (const l of this.levels) l.postProcess();
  }
  toJSON(): JSONValue {
    return {
      title: this.title,
      author: this.author,
      label: this.label,
      pos_x: this.pos_x,
      pos_y: this.pos_y,
      requires: this.requires.map((req) => req.label),
      levels: this.levels.map((level) => level.toJSON()),
    };
  }
}
