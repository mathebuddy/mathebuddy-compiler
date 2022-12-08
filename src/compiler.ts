/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import { Lexer } from '@multila/multila-lexer';
import { LexerTokenType } from '@multila/multila-lexer/lib/token';
import { BaseType } from '@mathebuddy/mathebuddy-smpl/src/symbol';

import { Block, BlockPart } from './block';
import {
  MBL_Chapter,
  MBL_Course,
  MBL_Exercise,
  MBL_Level,
  MBL_LevelItem,
  MBL_Section,
  MBL_SectionType,
  MBL_Text,
  MBL_Text_Bold,
  MBL_Text_Color,
  MBL_Text_Error,
  MBL_Text_InlineMath,
  MBL_Text_Italic,
  MBL_Text_Itemize,
  MBL_Text_Linefeed,
  MBL_Text_Paragraph,
  MBL_Text_Reference,
  MBL_Text_Span,
  MBL_Text_Text,
} from './data';

export class Compiler {
  private course: MBL_Course = null;
  private chapter: MBL_Chapter = null;
  private level: MBL_Level = null;

  private srcLines: string[] = [];
  private i = -1; // current line index (starting from 0)
  private line = ''; // current line
  private line2 = ''; // next line
  private paragraph = '';

  public getCourse(): MBL_Course {
    return this.course;
  }

  public run(src: string): void {
    // TODO: parse index files, i.e. complete courses
    this.course = new MBL_Course();
    this.chapter = new MBL_Chapter();
    this.course.chapters.push(this.chapter);
    this.level = new MBL_Level();
    this.chapter.levels.push(this.level);

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
        this.parseLevelTitle();
      } else if (this.line2.startsWith('=====')) {
        this.pushParagraph();
        this.level.items.push(this.parseSectionTitle());
      } else if (this.line2.startsWith('-----')) {
        this.pushParagraph();
        this.level.items.push(this.parseSubSectionTitle());
      } else if (this.line === '---') {
        this.pushParagraph();
        this.level.items.push(this.parseBlock(false));
      } else {
        this.paragraph += this.line + '\n';
        this.next();
      }
    }
    this.pushParagraph();

    this.course.postProcess();
  }

  private pushParagraph(): void {
    if (this.paragraph.trim().length > 0) {
      this.level.items.push(this.parseParagraph(this.paragraph));
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

  //G levelTitle = { CHAR } "@" { ID } NEWLINE "#####.." { "#" } NEWLINE;
  private parseLevelTitle(): void {
    const tokens = this.line.split('@');
    this.level.title = tokens[0].trim();
    if (tokens.length > 1) {
      this.level.label = tokens[1].trim();
    }
    this.next(); // skip document title
    this.next(); // skip '#####..'
  }

  //G sectionTitle = { CHAR } "@" { ID } NEWLINE "=====.." { "#" } NEWLINE;
  private parseSectionTitle(): MBL_Section {
    const section = new MBL_Section(MBL_SectionType.Section);
    const tokens = this.line.split('@');
    section.text = tokens[0].trim();
    if (tokens.length > 1) {
      section.label = tokens[1].trim();
    }
    this.next(); // skip section title
    this.next(); // skip '=====..'
    return section;
  }

  //G subSectionTitle = { CHAR } "@" { ID } NEWLINE "-----.." { "#" } NEWLINE;
  private parseSubSectionTitle(): MBL_Section {
    const subSection = new MBL_Section(MBL_SectionType.SubSection);
    const tokens = this.line.split('@');
    subSection.text = tokens[0].trim();
    if (tokens.length > 1) {
      subSection.label = tokens[1].trim();
    }
    this.next(); // skip subSection title
    this.next(); // skip '-----..'
    return subSection;
  }

  //G block = "---" NEWLINE { "@" ID NEWLINE | LINE } "---" NEWLINE;
  // TODO: grammar for subblocks
  private parseBlock(parseSubBlock: boolean): MBL_LevelItem {
    const block = new Block(this);
    block.srcLine = this.i;
    if (!parseSubBlock) this.next(); // skip "---"
    const tokens = this.line.split(' ');
    for (let k = 0; k < tokens.length; k++) {
      if (k == 0) block.type = tokens[k];
      else if (tokens[k].startsWith('@')) block.label = tokens[k];
      else block.title += tokens[k] + ' ';
    }
    block.title = block.title.trim();
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
      } else if (
        this.line.length >= 3 &&
        this.line.substring(0, 3) === this.line.toUpperCase().substring(0, 3)
      ) {
        if (parseSubBlock) break;
        else block.parts.push(this.parseBlock(true));
      } else {
        part.lines.push(this.line);
        this.next();
      }
    }
    if (!parseSubBlock) {
      if (this.line === '---') this.next();
      else
        this.error(
          'block started in line ' + block.srcLine + ' must end with ---',
        );
    }
    return block.process();
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
  public parseParagraph(raw: string, ex: MBL_Exercise = null): MBL_Text {
    // TODO: this method should NOT be visible at API-side...

    // skip empty paragraphs
    if (raw.trim().length == 0)
      //return new ParagraphItem(ParagraphItemType.Text);
      return new MBL_Text_Text(); // TODO: OK??
    // create lexer
    const lexer = new Lexer();
    lexer.enableEmitNewlines(true);
    lexer.pushSource('', raw);
    lexer.setTerminals(['**', '-)']);
    const paragraph = new MBL_Text_Paragraph();
    while (lexer.isNotEND()) {
      paragraph.items.push(this.parseParagraph_part(lexer, ex));
    }
    //paragraph.simplify(); TODO!!!!!
    return paragraph;
  }

  private parseParagraph_part(lexer: Lexer, ex: MBL_Exercise): MBL_Text {
    if (lexer.getToken().col == 1 && (lexer.isTER('-') || lexer.isTER('#'))) {
      // itemize or enumerate
      const type = lexer.getToken().token; // '-' for itemize; '#' for enumerate
      const itemize = new MBL_Text_Itemize();
      while (lexer.getToken().col == 1 && lexer.isTER(type)) {
        lexer.next();
        const span = new MBL_Text_Span();
        itemize.items.push(span);
        while (lexer.isNotNEWLINE())
          span.items.push(this.parseParagraph_part(lexer, ex));
        lexer.NEWLINE();
      }
      return itemize;
    } else if (lexer.isTER('**')) {
      // bold text
      lexer.next();
      const bold = new MBL_Text_Bold();
      while (lexer.isNotTER('**'))
        bold.items.push(this.parseParagraph_part(lexer, ex));
      if (lexer.isTER('**')) lexer.next();
      return bold;
    } else if (lexer.isTER('*')) {
      // italic text
      lexer.next();
      const italic = new MBL_Text_Italic();
      while (lexer.isNotTER('*'))
        italic.items.push(this.parseParagraph_part(lexer, ex));
      if (lexer.isTER('*')) lexer.next();
      return italic;
    } else if (lexer.isTER('$')) {
      // inline equation
      lexer.next();
      const inlineMath = new MBL_Text_InlineMath();
      while (lexer.isNotTER('$')) {
        const tk = lexer.getToken().token;
        const isId = lexer.getToken().type === LexerTokenType.ID;
        lexer.next();
        // TODO: exercise variable IDs!!
        /*if (isId && ex != null && ex.getVariable(tk) != null) {
          // TODO: handle ALL types!
          if (ex.getVariable(tk).type.base === BaseType.MATRIX)
            item = new ParagraphItem(ParagraphItemType.MatrixVariable);
          else item = new ParagraphItem(ParagraphItemType.Variable);
        } else {*/
        const text = new MBL_Text_Text();
        text.value = tk;
        inlineMath.items.push(text);
        /*}*/
      }
      if (lexer.isTER('$')) lexer.next();
      return inlineMath;
    } else if (lexer.isTER('@')) {
      // reference
      lexer.next();
      const ref = new MBL_Text_Reference();
      if (lexer.isID()) {
        ref.label = lexer.getToken().token;
        lexer.next();
      }
      return ref;
    } else if (lexer.isTER('#')) {
      // input element(s)
      // TODO!!!!!
      lexer.next();
      /*let id = '';
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
      }*/
      throw new Error('unimplemented!');
    } else if (lexer.isTER('\n')) {
      // line feed
      lexer.next();
      return new MBL_Text_Linefeed();
    } else if (lexer.isTER('[')) {
      // text properties: e.g. "[text in red color]@color1"
      // TODO: make sure, that errors are not too annoying...
      lexer.next();
      const items: MBL_Text[] = [];
      while (lexer.isNotTER(']'))
        items.push(this.parseParagraph_part(lexer, ex));
      if (lexer.isTER(']')) lexer.next();
      else return new MBL_Text_Error('expected ]');
      if (lexer.isTER('@')) lexer.next();
      else return new MBL_Text_Error('expected @');
      if (lexer.isID()) {
        const id = lexer.ID();
        lexer.next();
        if (id === 'bold') {
          const bold = new MBL_Text_Bold();
          bold.items = items;
          return bold;
        } else if (id === 'italic') {
          const italic = new MBL_Text_Italic();
          italic.items = items;
          return italic;
        } else if (id.startsWith('color')) {
          const color = new MBL_Text_Color();
          color.key = parseInt(id.substring(5)); // TODO: check if INT
          color.items = items;
          return color;
        } else {
          return new MBL_Text_Error('unknown property ' + id);
        }
      }
    } else {
      // text tokens (... or yet unimplemented paragraph items)
      const text = new MBL_Text_Text();
      text.value = lexer.getToken().token;
      lexer.next();
      return text;
    }
    throw new Error('this should never happen!');
  }

  private error(message: string): void {
    console.error('ERROR:' + (this.i + 1) + ': ' + message);
    process.exit(-1);
  }
}
