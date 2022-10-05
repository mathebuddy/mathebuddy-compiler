/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Course, Exercise, ParagraphItem, ParagraphItemType } from './data';
import { CourseDocument } from './data';
import { Lexer } from '@multila/multila-lexer';

import { LexerTokenType } from '@multila/multila-lexer/lib/token';
import { Block, BlockPart } from './parseBlock';

// TODO: use npm-package in future!
import { BaseType } from '@mathebuddy/mathebuddy-smpl/src/symbol';

export class Parser {
  private course: Course = null;
  private document: CourseDocument = null;

  private srcLines: string[] = [];
  private i = -1; // current line index (starting from 0)
  private line = ''; // current line
  private line2 = ''; // next line
  private paragraph = '';

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
      if (this.line.length == 0) {
        this.next();
      } else if (this.line2.startsWith('#####')) {
        this.pushParagraph();
        this.parseDocumentTitle();
      } else if (this.line2.startsWith('=====')) {
        this.pushParagraph();
        this.parseSectionTitle();
      } else if (this.line2.startsWith('-----')) {
        this.pushParagraph();
        this.parseSubSectionTitle();
      } else if (this.line === '---') {
        this.pushParagraph();
        this.parseBlock();
      } else {
        this.paragraph += this.line + '\n';
        this.next();
      }
    }
    this.pushParagraph();
    const bp = 1337;
  }

  private pushParagraph(): void {
    if (this.paragraph.trim().length > 0) {
      this.document.items.push(this.parseParagraph(this.paragraph));
      this.paragraph = '';
    }
  }

  private next(): void {
    this.i++;
    if (this.i < this.srcLines.length) {
      this.line = this.srcLines[this.i];
    } else this.line = '§END';
    if (this.i + 1 < this.srcLines.length) {
      this.line2 = this.srcLines[this.i + 1];
    } else this.line2 = '§END';
  }

  //G documentTitle = { CHAR } "@" { ID } NEWLINE "#####.." { "#" } NEWLINE;
  private parseDocumentTitle(): void {
    const tokens = this.line.split('@');
    this.document.title = tokens[0].trim();
    if (tokens.length > 1) {
      this.document.alias = tokens[1].trim();
    }
    this.next(); // skip document title
    this.next(); // skip '#####..'
    /*return {
      type: 'title',
      value: this.document.title,
    };*/
  }

  //G sectionTitle = { CHAR } "@" { ID } NEWLINE "=====.." { "#" } NEWLINE;
  private parseSectionTitle(): any {
    const tokens = this.line.split('@');
    const secTitle = tokens[0].trim();
    if (tokens.length > 1) {
      const secAlias = tokens[1].trim();
    }
    this.next(); // skip section title
    this.next(); // skip '=====..'
    return {
      type: 'section',
      value: secTitle,
    };
  }

  //G subSectionTitle = { CHAR } "@" { ID } NEWLINE "-----.." { "#" } NEWLINE;
  private parseSubSectionTitle(): void {
    const tokens = this.line.split('@');
    const subSecTitle = tokens[0].trim();
    if (tokens.length > 1) {
      const subSecAlias = tokens[1].trim();
    }
    this.next(); // skip section title
    this.next(); // skip '-----..'
  }

  //G block = "---" NEWLINE { "@" ID NEWLINE | LINE } "---" NEWLINE;
  private parseBlock(): void {
    const block = new Block(this);
    block.srcLine = this.i;
    this.next(); // skip "---"
    const tokens = this.line.split(' ');
    for (let k = 0; k < tokens.length; k++) {
      if (k == 0) block.type = tokens[k];
      else if (tokens[k].startsWith('@')) block.label = tokens[k];
      else block.title += tokens[k] + ' ';
    }
    block.title = block.title.trim();
    //block.type = tokens[0];
    //if (tokens.length > 1) block.label = tokens[1];
    this.next();
    let part: BlockPart = new BlockPart();
    part.name = 'global';
    block.parts.push(part);
    while (this.line !== '---' && this.line !== '§END') {
      if (this.line.startsWith('@')) {
        part = new BlockPart();
        block.parts.push(part);
        part.name = this.line.substring(1).trim();
        this.next();
      } else {
        part.lines.push(this.line);
        this.next();
      }
    }
    if (this.line === '---') this.next();
    else
      this.error(
        'block started in line ' + block.srcLine + ' must end with ---',
      );
    const docItem = block.process();
    if (docItem != null) this.document.items.push(docItem);
  }

  /*G
    paragraphCore =
       { paragraphPart };
    paragraphPart =
     | "**" paragraphCore "**"
     | "*" paragraphCore "*"
     | "[" paragraphCore "]" "@" ID
     | "$" inlineMath "$"
     | "#" ID
     | <START>"-" paragraphCore "\n"
     | <START>"-)" paragraphCore "\n"
     | ID
     | DEL;
  */
  public parseParagraph(raw: string, ex: Exercise = null): ParagraphItem {
    // skip empty paragraphs
    if (raw.trim().length == 0)
      return new ParagraphItem(ParagraphItemType.Text);
    // create lexer
    const lexer = new Lexer();
    lexer.enableEmitNewlines(true);
    lexer.pushSource('', raw);
    lexer.setTerminals(['**', '-)', '#.']);
    const paragraph = new ParagraphItem(ParagraphItemType.Paragraph);
    while (lexer.isNotEND()) {
      paragraph.subItems.push(this.parseParagraph_part(lexer, ex));
    }
    paragraph.simplify();
    //console.log(JSON.stringify(paragraph.toJSON(), null, 2));
    //this.document.items.push(paragraph);
    return paragraph;
  }

  private parseParagraph_part(lexer: Lexer, ex: Exercise): ParagraphItem {
    //let part: any = '';
    let part: ParagraphItem = null;
    if (lexer.getToken().col == 1 && lexer.isTER('-')) {
      // itemize
      part = new ParagraphItem(ParagraphItemType.Itemize);
      while (lexer.getToken().col == 1 && lexer.isTER('-')) {
        lexer.next();
        const item = new ParagraphItem(ParagraphItemType.Paragraph);
        part.subItems.push(item);
        while (lexer.isNotNEWLINE()) {
          item.subItems.push(this.parseParagraph_part(lexer, ex));
        }
        lexer.NEWLINE();
      }
    } else if (lexer.getToken().col == 1 && lexer.isTER('#.')) {
      // enumerate
      part = new ParagraphItem(ParagraphItemType.Enumerate);
      while (lexer.getToken().col == 1 && lexer.isTER('#.')) {
        lexer.next();
        const item = new ParagraphItem(ParagraphItemType.Paragraph);
        part.subItems.push(item);
        while (lexer.isNotNEWLINE()) {
          item.subItems.push(this.parseParagraph_part(lexer, ex));
        }
        lexer.NEWLINE();
      }
    } else if (lexer.isTER('**')) {
      // bold text
      lexer.next();
      const items: ParagraphItem[] = [];
      while (lexer.isNotTER('**')) {
        items.push(this.parseParagraph_part(lexer, ex));
      }
      if (lexer.isTER('**')) lexer.next();
      part = new ParagraphItem(ParagraphItemType.Bold);
      part.subItems = items;
    } else if (lexer.isTER('*')) {
      // italic text
      lexer.next();
      const items: ParagraphItem[] = [];
      while (lexer.isNotTER('*')) {
        items.push(this.parseParagraph_part(lexer, ex));
      }
      if (lexer.isTER('*')) lexer.next();
      part = new ParagraphItem(ParagraphItemType.Italic);
      part.subItems = items;
    } else if (lexer.isTER('$')) {
      // inline equation
      lexer.next();
      const items: ParagraphItem[] = [];
      while (lexer.isNotTER('$')) {
        const tk = lexer.getToken().token;
        const isId = lexer.getToken().type === LexerTokenType.ID;
        lexer.next();
        let item: ParagraphItem = null;
        if (isId && ex != null && ex.getVariable(tk) != null) {
          item = new ParagraphItem(ParagraphItemType.Variable);
        } else {
          item = new ParagraphItem(ParagraphItemType.Text);
        }
        item.value = tk;
        items.push(item);
      }
      if (lexer.isTER('$')) lexer.next();
      part = new ParagraphItem(ParagraphItemType.InlineMath);
      part.subItems = items;
    } else if (lexer.isTER('@')) {
      // reference
      lexer.next();
      let link = '';
      if (lexer.isID()) {
        link = lexer.getToken().token;
        lexer.next();
      }
      part = new ParagraphItem(ParagraphItemType.Reference);
      part.value = link;
    } else if (lexer.isTER('#')) {
      // input element(s)
      lexer.next();
      let id = '';
      let error = '';
      if (lexer.isID()) {
        id = lexer.ID();
        const v = ex.getVariable(id);
        if (v != null) {
          switch (v.type.base) {
            case BaseType.INT:
              part = new ParagraphItem(ParagraphItemType.IntegerInput);
              part.value = id;
              break;
            case BaseType.MATRIX:
              part = new ParagraphItem(ParagraphItemType.MatrixInput);
              part.value = id;
              break;
            default:
              error = 'UNIMPLEMENTED input type ' + v.type.base;
          }
        } else {
          error = 'there is no variable "' + id + '"';
        }
      } else {
        error = 'no variable for input field given';
      }
      if (error.length > 0) {
        part = new ParagraphItem(ParagraphItemType.Error);
        part.value = 'unknown variable for input field: "' + id + '"';
      }
    } else if (lexer.isTER('\n')) {
      // line feed
      lexer.next();
      part = new ParagraphItem(ParagraphItemType.Linefeed);
    } else if (lexer.isTER('[')) {
      // text properties: e.g. "[text in red color]@red"
      lexer.next();
      const items: ParagraphItem[] = [];
      while (lexer.isNotTER(']')) {
        items.push(this.parseParagraph_part(lexer, ex));
      }
      if (lexer.isTER(']')) lexer.next();
      if (lexer.isTER('@')) lexer.next();
      let type = ParagraphItemType.Unknown;
      let color = '';
      if (lexer.isID()) {
        const id = lexer.ID();
        lexer.next();
        switch (id) {
          case 'red':
          case 'blue':
            type = ParagraphItemType.Color;
            color = id;
            break;
        }
      }
      part = new ParagraphItem(type);
      part.value = color;
      part.subItems = items;
    } else {
      // text tokens (... or yet unimplemented paragraph items)
      const tk = lexer.getToken().token;
      lexer.next();
      part = new ParagraphItem(ParagraphItemType.Text);
      part.value = tk;
    }
    return part;
  }

  private error(message: string): void {
    console.error('ERROR:' + (this.i + 1) + ': ' + message);
    process.exit(-1);
  }
}
