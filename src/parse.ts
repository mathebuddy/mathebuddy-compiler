/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Course } from './data';
import { CourseDocument } from './data';

class Block {
  type = '';
  label = '';
  parts: BlockPart[] = [];
}

class BlockPart {
  name = '';
  lines: string[] = [];
}

export class Parser {
  private course: Course = null;
  private document: CourseDocument = null;

  private srcLines: string[] = [];
  private i = -1; // current line index (starting from 0)
  private line = ''; // current line
  private line2 = ''; // next line

  private next(): void {
    this.i++;
    if (this.i < this.srcLines.length) {
      this.line = this.srcLines[this.i];
    } else this.line = '§END';
    if (this.i + 1 < this.srcLines.length) {
      this.line2 = this.srcLines[this.i + 1];
    } else this.line2 = '§END';
  }

  public getCourse(): Course {
    return this.course;
  }

  public run(src: string): void {
    // TODO: parse course vs document
    this.course = new Course();
    this.document = new CourseDocument();
    this.course.documents.push(this.document);
    // set source, split it into lines, trim these lines and
    // filter out comments of each line
    this.srcLines = src.split('\n');
    for (let k = 0; k < this.srcLines.length; k++) {
      const line = this.srcLines[k].trim();
      const tokens = line.split('%');
      this.srcLines[k] = tokens[0];
    }
    // init lexer
    this.i = -1;
    this.next();
    // parse
    while (this.line !== '§END') {
      if (this.line.length == 0) this.next();
      else if (this.line2.startsWith('###')) this.parseDocumentTitle();
      else if (this.line.startsWith('---')) this.parseBlock();
      //else this.error('unexpected tokens');
      else this.parseParagraph();
    }
  }

  // documentTitle = { CHAR } "@" { ID } NEWLINE "###" { "#" } NEWLINE;
  private parseDocumentTitle(): void {
    const tokens = this.line.split('@');
    this.document.title = tokens[0].trim();
    if (tokens.length > 1) this.document.alias = tokens[1].trim();
    this.next(); // skip document title
    this.next(); // skip '############'
  }

  // block = "---" NEWLINE { "@" ID NEWLINE | LINE } "---" NEWLINE;
  private parseBlock(): void {
    const block = new Block();
    this.next(); // skip "---"
    const tokens = this.line.split('@');
    block.type = tokens[0];
    if (tokens.length > 1) block.label = tokens[1];
    this.next();
    let part: BlockPart = new BlockPart();
    part.name = 'global';
    block.parts.push(part);
    while (this.line.startsWith('---') == false && this.line !== '§END') {
      if (this.line.startsWith('@')) {
        part = new BlockPart();
        block.parts.push(part);
        part.name = this.line.substring(1);
        this.next();
      } else {
        part.lines.push(this.line);
        this.next();
      }
    }
    if (this.line.startsWith('---')) this.next();
    else this.error('block must end with ---');
  }

  // paragraph =
  //     { paragraphPart };
  // paragraphPart =
  //     ID
  //   | "**" paragraph('bold') "**"
  //   | "*" paragraph('italic') "*"
  //   | "[" paragraph('format') "]" "@" ID
  //   | "$" inlineMath('math') "$";
  private parseParagraph(mode = ''): void {
    //const lexer = new Lexer(this.line);
    const bp = 1337;
  }

  private error(message: string): void {
    console.error('ERROR:' + (this.i + 1) + ': ' + message);
    process.exit(-1);
  }
}
