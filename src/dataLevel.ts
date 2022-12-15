/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { JSONValue } from './dataJSON';

// refer to the specification at https://app.f07-its.fh-koeln.de/docs-mbcl.html

// -------- LEVEL --------

export class MBL_Level {
  file_id = ''; // all references go here; label is only used for searching
  title = '';
  label = '';
  pos_x = -1;
  pos_y = -1;
  requires: MBL_Level[] = [];
  requires_tmp: string[] = []; // only used while compiling
  items: MBL_LevelItem[] = [];

  postProcess(): void {
    for (const i of this.items) i.postProcess();
  }

  toJSON(): JSONValue {
    return {
      file_id: this.file_id,
      title: this.title,
      label: this.label,
      pos_x: this.pos_x,
      pos_y: this.pos_y,
      requires: this.requires.map((req) => req.file_id),
      items: this.items.map((item) => item.toJSON()),
    };
  }
}

export abstract class MBL_LevelItem {
  abstract type: string;
  abstract postProcess(): void;
  abstract toJSON(): JSONValue;
}
