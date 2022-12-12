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

// -------- NEWPAGE --------

export class MBL_NewPage extends MBL_LevelItem {
  postProcess(): void {
    /* empty */
  }
  toJSON(): JSONValue {
    return {
      type: 'new_page',
    };
  }
}
