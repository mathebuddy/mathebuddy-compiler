/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { JSONValue } from './dataJSON';
import { MBL_LevelItem } from './dataLevel';

// refer to the specification at https://app.f07-its.fh-koeln.de/docs-mbcl.html

// -------- SECTION --------

export enum MBL_SectionType {
  Section = 'section',
  SubSection = 'subsection',
  SubSubSection = 'subsubsection',
}

export class MBL_Section extends MBL_LevelItem {
  type: MBL_SectionType;
  text = '';
  label = '';
  postProcess(): void {
    /* empty */
  }
  constructor(type: MBL_SectionType) {
    super();
    this.type = type;
  }
  toJSON(): JSONValue {
    return {
      type: this.type,
      text: this.text,
      label: this.label,
    };
  }
}
