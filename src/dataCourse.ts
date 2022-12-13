/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { MBL_Chapter } from './dataChapter';
import { JSONValue } from './dataJSON';

// refer to the specification at https://app.f07-its.fh-koeln.de/docs-mbcl.html

// -------- COURSE --------

export class MBL_Course {
  single_chapter = true;
  single_level = true;
  title = '';
  author = '';
  mbcl_version = 1;
  date_modified = Math.floor(Date.now() / 1000);
  chapters: MBL_Chapter[] = [];
  postProcess(): void {
    for (const ch of this.chapters) ch.postProcess();
  }
  toJSON(): JSONValue {
    return {
      single_chapter: this.single_chapter,
      single_level: this.single_level,
      title: this.title,
      author: this.author,
      mbcl_version: this.mbcl_version,
      date_modified: this.date_modified,
      chapters: this.chapters.map((chapter) => chapter.toJSON()),
    };
  }
}
