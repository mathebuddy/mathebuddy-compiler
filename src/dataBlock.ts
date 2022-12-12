/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { MBL_LevelItem } from './dataLevel';

// refer to the specification at https://app.f07-its.fh-koeln.de/docs-mbcl.html

// -------- BLOCK ITEM --------

export abstract class MBL_BlockItem extends MBL_LevelItem {
  type: string;
  title = '';
  label = '';
  error = '';
}
