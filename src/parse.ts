/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Course, DocumentItem, Exercise } from './data';
import { CourseDocument } from './data';
import { Lexer } from '@multila/multila-lexer';
import * as SMPL from '@mathebuddy/mathebuddy-smpl';

class Block {
  type = '';
  title = '';
  label = '';
  parts: BlockPart[] = [];
  srcLine = 0;

  private parser: Parser = null;

  constructor(parser: Parser) {
    this.parser = parser;
  }

  process(): DocumentItem {
    //console.log('BLOCK TYPE: ' + this.type);
    //console.log('BLOCK TITLE: ' + this.title);
    //console.log('BLOCK LABEL: ' + this.label);
    //console.log('');
    if (this.type === 'EXERCISE') {
      const exercise = new Exercise();
      exercise.title = this.title;
      for (const part of this.parts) {
        if (part.name === 'code') {
          exercise.code_raw = part.lines.join('\n');
        } else if (part.name === 'text') {
          exercise.text_raw = part.lines.join('\n');
        }
        // TODO: else: warning/error
      }

      // TODO: catch errors
      try {
        const variables = SMPL.interpret(exercise.code_raw);
        for (const local of variables) {
          console.log(local.id + ' = ' + local.value.toString());
        }
      } catch (e) {
        this.error(e.toString());
      }

      /*const sc = new SellCode();
      try {
        const generatedCode = sc.parse(exercise.code_raw);
        const int = new SellInterpreter();

        // interpret multiple times to get various exercises
        int.interpret(generatedCode, sc.getLocalSymbols());
        for (const local of sc.getLocalSymbols()) {
          console.log(local.id + ' = ' + local.value.toString());
        }
      } catch (e) {
        this.error(e.toString());
      }*/
      return exercise;
    } /*TODO: else {
      this.error('unknown block type "' + this.type + '"');
      // -> TODO: just a warning and do not process just this block??
    }*/
    return null;
  }

  private error(message: string): void {
    console.error('ERROR:' + (this.srcLine + 1) + ': ' + message);
    process.exit(-1);
  }
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
        this.parseParagraph();
        this.parseDocumentTitle();
      } else if (this.line2.startsWith('=====')) {
        this.parseParagraph();
        this.parseSectionTitle();
      } else if (this.line2.startsWith('-----')) {
        this.parseParagraph();
        this.parseSubSectionTitle();
      } else if (this.line === '---') {
        this.parseParagraph();
        this.parseBlock();
      } else {
        this.paragraph += this.line + '\n';
        this.next();
      }
    }
    this.parseParagraph();
    const bp = 1337;
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
  }

  //G sectionTitle = { CHAR } "@" { ID } NEWLINE "=====.." { "#" } NEWLINE;
  private parseSectionTitle(): void {
    const tokens = this.line.split('@');
    const secTitle = tokens[0].trim();
    if (tokens.length > 1) {
      const secAlias = tokens[1].trim();
    }
    this.next(); // skip section title
    this.next(); // skip '=====..'
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
     | ID
     | DEL;
  */
  private parseParagraph(): void {
    // skip empty paragraphs
    if (this.paragraph.trim().length == 0) return;
    // create lexer
    const lexer = new Lexer();
    lexer.enableEmitNewlines(true);
    lexer.pushSource('', this.paragraph);
    lexer.setTerminals(['**']);
    const items = this.parseParagraph_core(lexer);
    const bp = 1337;
  }

  private parseParagraph_core(lexer: Lexer): any {
    const items: any[] = [];
    while (lexer.isNotEND()) {
      items.push(this.parseParagraph_part(lexer));
    }
    return items;
  }

  private parseParagraph_part(lexer: Lexer): any {
    if (lexer.isTER('**')) {
      // bold text
      lexer.next();
      const items: any[] = [];
      while (lexer.isNotTER('**')) {
        items.push(this.parseParagraph_part(lexer));
      }
      if (lexer.isTER('**')) lexer.next();
      return {
        type: 'bold',
        items: items,
      };
    } else if (lexer.isTER('*')) {
      // italic text
      lexer.next();
      const items: any[] = [];
      while (lexer.isNotTER('*')) {
        items.push(this.parseParagraph_part(lexer));
      }
      if (lexer.isTER('*')) lexer.next();
      return {
        type: 'italic',
        items: items,
      };
    } else if (lexer.isTER('@')) {
      // reference
      lexer.next();
      let link = '';
      if (lexer.isID()) {
        link = lexer.getToken().token;
        lexer.next();
      }
      return {
        type: 'reference',
        link: link,
      };
    } else if (lexer.isTER('\n')) {
      // line feed
      lexer.next();
      return {
        type: 'linefeed',
      };
    } else if (lexer.isTER('[')) {
      lexer.next();
      const items: any[] = [];
      while (lexer.isNotTER(']')) {
        items.push(this.parseParagraph_part(lexer));
      }
      if (lexer.isTER(']')) lexer.next();
      if (lexer.isTER('@')) lexer.next();
      let type = 'unknown';
      if (lexer.isID()) {
        const id = lexer.ID();
        lexer.next();
        switch (id) {
          case 'red':
            type = 'color-red';
            break;
          case 'blue':
            type = 'color-blue';
            break;
        }
      }
      return {
        type: type,
        items: items,
      };
    } else {
      // text tokens (... or yet unimplemented paragraph items)
      const tk = lexer.getToken().token;
      lexer.next();
      return {
        type: 'text',
        value: tk,
      };
    }
  }

  private error(message: string): void {
    console.error('ERROR:' + (this.i + 1) + ': ' + message);
    process.exit(-1);
  }
}
