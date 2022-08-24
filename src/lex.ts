/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 *
 * Copyright info:
 *   Large parts of this file are taken from multila.org
 *   The author permits usage only in projects that open source
 *   and redistribute source code (GPL-3.0-or-later).
 */

export enum LexerTokenType {
  DEL = 'DEL',
  TER = 'TER',
  INT = 'INT',
  BIGINT = 'BIGINT',
  REAL = 'REAL',
  HEX = 'HEX',
  STR = 'STR',
  ID = 'ID',
  END = 'END',
}

export class LexerToken {
  token = '';
  type = LexerTokenType.TER;
  value = 0; // value
  valueBigint = 0n;
  fileID = '';
  row = 0;
  col = 0;

  toString(): string {
    let tk = this.token;
    tk = tk.replace(/\n/g, '\\n');
    tk = tk.replace(/\t/g, '\\t');
    let s = this.fileID + ':' + this.row + ':' + this.col;
    s += ': "' + tk + '" (' + this.type + ')';
    return s;
  }

  copy(): LexerToken {
    const bak = new LexerToken();
    bak.token = this.token;
    bak.type = this.type;
    bak.value = this.value;
    bak.fileID = this.fileID;
    bak.row = this.row;
    bak.col = this.col;
    return bak;
  }
}

export class LexerState {
  i = 0; // current character index
  n = -1; // number of characters
  row = 1;
  col = 1;
  indent = 0;
  lastIndent = 0;
  stack: LexerToken[] = []; // tokens that must be put in subsequent next()-calls

  copy(): LexerState {
    const bak = new LexerState();
    bak.i = this.i;
    bak.n = this.n;
    bak.row = this.row;
    bak.col = this.col;
    bak.indent = this.indent;
    bak.lastIndent = this.lastIndent;
    for (let i = 0; i < this.stack.length; i++)
      bak.stack.push(this.stack[i].copy());
    return bak;
  }
}

export class LexerFile {
  stateBackup: LexerState = null;
  tokenBackup: LexerToken = null;
  id = '';
  sourceCode = '';
}

export interface LexerBackup {
  state: LexerState;
  token: LexerToken;
}

export interface LexerProperties {
  // TODO: rename!!
  singleLineCommentStart: string;
  multiLineCommentStart: string;
  multilineCommentEnd: string;
  parseNewlineEnabled: boolean;
  parseIndentationEnabled: boolean;
  lexerFilePositionPrefix: string;
  backslashLineBreaksEnabled: boolean;
}

export class ParseError extends Error {
  constructor(msg: string) {
    super(msg);
    this.name = 'ParseError';
  }
}

export class Lexer {
  private terminals = new Set<string>();

  private fileStack: LexerFile[] = [];
  private token: LexerToken = null;
  private lastToken: LexerToken = null;
  private state: LexerState = null;

  private singleLineCommentStart = '';
  private multiLineCommentStart = '';
  private multilineCommentEnd = '';
  private parseNewlineEnabled = false;
  private parseHexEnabled = true;
  private parseIntEnabled = true;
  private parseRealEnabled = true;
  private parseBigintEnabled = true;
  private parseDoubleQuotesEnabled = true;
  private parseIndentationEnabled = false;
  private lexerFilePositionPrefix = '';
  private backslashLineBreaksEnabled = false;

  private putTrailingSemicolon: LexerToken[] = [];
  private multicharDelimiters: string[] = [];

  constructor(props: LexerProperties) {
    this.singleLineCommentStart = props.singleLineCommentStart;
    this.multiLineCommentStart = props.multiLineCommentStart;
    this.multilineCommentEnd = props.multilineCommentEnd;
    this.parseNewlineEnabled = props.parseNewlineEnabled;
    this.parseIndentationEnabled = props.parseIndentationEnabled;
    this.lexerFilePositionPrefix = props.lexerFilePositionPrefix;
    this.backslashLineBreaksEnabled = props.backslashLineBreaksEnabled;
  }

  isEND(): boolean {
    return this.token.type === LexerTokenType.END;
  }

  isNotEND(): boolean {
    return this.token.type !== LexerTokenType.END;
  }

  END(): void {
    if (this.token.type === LexerTokenType.END) {
      this.next();
    } else throw new ParseError(this.err_pos() + 'expected END');
  }

  isID(): boolean {
    return this.token.type === LexerTokenType.ID;
  }

  ID(): string {
    let res = '';
    if (this.token.type === LexerTokenType.ID) {
      res = this.token.token;
      this.next();
    } else throw new ParseError(this.err_pos() + 'expected ID');
    return res;
  }

  isINT(): boolean {
    return this.token.type === LexerTokenType.INT;
  }

  INT(): number {
    let res = 0;
    if (this.token.type === LexerTokenType.INT) {
      res = this.token.value;
      this.next();
    } else throw new ParseError(this.err_pos() + 'expected INT');
    return res;
  }

  isBIGINT(): boolean {
    return this.token.type === LexerTokenType.BIGINT;
  }

  BIGINT(): bigint {
    let res = 0n;
    if (this.token.type === LexerTokenType.BIGINT) {
      res = this.token.valueBigint;
      this.next();
    } else throw new ParseError(this.err_pos() + 'expected BIGINT');
    return res;
  }

  isREAL(): boolean {
    return this.token.type === LexerTokenType.REAL;
  }

  REAL(): number {
    let res = 0.0;
    if (this.token.type === LexerTokenType.REAL) {
      res = this.token.value;
      this.next();
    } else throw new ParseError(this.err_pos() + 'expected REAL');
    return res;
  }

  isHEX(): boolean {
    return this.token.type === LexerTokenType.HEX;
  }

  HEX(): string {
    let res = '';
    if (this.token.type === LexerTokenType.HEX) {
      res = this.token.token;
      this.next();
    } else throw new ParseError(this.err_pos() + 'expected HEX');
    return res;
  }

  isSTR(): boolean {
    return this.token.type === LexerTokenType.STR;
  }

  STR(): string {
    let res = '';
    if (this.token.type === LexerTokenType.STR) {
      res = this.token.token;
      this.next();
    } else throw new ParseError(this.err_pos() + 'expected STR');
    return res;
  }

  isTER(t: string): boolean {
    return (
      (this.token.type === LexerTokenType.DEL && this.token.token === t) ||
      (this.token.type === LexerTokenType.ID && this.token.token === t)
    );
  }

  isNotTER(t: string): boolean {
    return this.isTER(t) == false && this.token.type != LexerTokenType.END;
  }

  TER(t: string): void {
    if (
      (this.token.type === LexerTokenType.DEL && this.token.token === t) ||
      (this.token.type === LexerTokenType.ID && this.token.token === t)
    ) {
      this.next();
    } else throw new ParseError(this.err_pos() + "expected '" + t + "'");
  }

  // end of statement
  isEOS(): boolean {
    // TODO: ';' OR newline
    return this.token.token === ';';
  }

  // end of statement
  EOS(): void {
    // TODO: ';' OR newline
    if (this.token.token === ';') this.next();
    else throw new ParseError(this.err_pos() + "expected '" + ';' + "'");
  }

  isINDENT(): boolean {
    return this.token.type == LexerTokenType.DEL && this.token.token === '\t+';
  }

  isNotINDENT(): boolean {
    return !(
      this.token.type === LexerTokenType.DEL && this.token.token === '\t+'
    );
  }

  INDENT(): void {
    if (this.token.type == LexerTokenType.DEL && this.token.token === '\t+') {
      this.next();
    } else throw new ParseError(this.err_pos() + 'expected INDENT');
  }

  isOUTDENT(): boolean {
    return this.token.type == LexerTokenType.DEL && this.token.token === '\t-';
  }

  isNotOUTDENT(): boolean {
    if (this.token.type === LexerTokenType.END) return false; // TODO: must do this for ALL "not" methods
    return !(
      this.token.type === LexerTokenType.DEL && this.token.token === '\t-'
    );
  }

  OUTDENT(): void {
    if (this.token.type == LexerTokenType.DEL && this.token.token === '\t-') {
      this.next();
    } else throw new ParseError(this.err_pos() + 'expected OUTDENT');
  }

  isNEWLINE(): boolean {
    return (
      this.isOUTDENT() ||
      (this.token.type == LexerTokenType.DEL && this.token.token === '\n')
    );
  }

  isNotNEWLINE(): boolean {
    return (
      !this.isOUTDENT() &&
      !(this.token.type === LexerTokenType.DEL && this.token.token === '\n')
    );
  }

  NEWLINE(): void {
    if (this.isOUTDENT()) return;
    if (this.token.type == LexerTokenType.DEL && this.token.token === '\n') {
      this.next();
    } else throw new ParseError(this.err_pos() + 'expected NEWLINE');
  }

  error(s: string, tk: LexerToken = null): void {
    throw new ParseError(this.err_pos(tk) + s);
  }

  errorTypes(op: string, t1: string, t2: string): void {
    const s =
      'Operator ' + op + ' is incompatible for types ' + t1 + ' and ' + t2;
    this.error(s);
  }

  errorExpected(terminals: string[]): void {
    let s = 'expected one of ';
    for (let i = 0; i < terminals.length; i++) {
      if (i > 0) s += ', ';
      s += terminals[i];
    }
    s += '.';
    this.error(s);
  }

  errorConditionNotBoolean(): void {
    const s = 'condition must be boolean';
    this.error(s);
  }

  private err_pos(tk: LexerToken = null): string {
    if (tk == null) tk = this.token;
    return tk.fileID + ':' + tk.row + ':' + tk.col + ': ';
  }

  addPutTrailingSemicolon(type: LexerTokenType, terminal = ''): void {
    const tk = new LexerToken();
    tk.type = type;
    tk.token = terminal;
    this.putTrailingSemicolon.push(tk);
  }

  /**
   * Sets a set of terminals consisting of identifiers and delimiters.
   * @param terminals
   */
  setTerminals(terminals: string[]): void {
    this.terminals.clear();
    this.multicharDelimiters = [];
    for (const ter of terminals) {
      if (ter.length == 0) continue;
      if (
        (ter[0] >= 'A' && ter[0] <= 'Z') ||
        (ter[0] >= 'a' && ter[0] <= 'z') ||
        ter[0] == '_'
      )
        this.terminals.add(ter);
      else this.multicharDelimiters.push(ter);
    }
    // must sort delimiters by ascending length (e.g. "==" must NOT be tokenized to "=", "=")
    this.multicharDelimiters.sort(function (a, b) {
      return b.length - a.length;
    });
  }

  getTerminals(): string[] {
    return Array.from(this.terminals);
  }

  getMulticharDelimiters(): string[] {
    return this.multicharDelimiters;
  }

  getToken(): LexerToken {
    return this.token;
  }

  private isNext(str: string): boolean {
    const src = this.fileStack.slice(-1)[0].sourceCode;
    const s = this.state;
    const n = str.length;
    if (s.i + n >= s.n) return false;
    for (let k = 0; k < n; k++) {
      const ch = str[k];
      if (src[s.i + k] != ch) return false;
    }
    return true;
  }

  next(): void {
    this.lastToken = this.token;
    const src = this.fileStack.slice(-1)[0].sourceCode;
    const file_id = this.fileStack.slice(-1)[0].id;
    let s = this.state;
    if (s.stack.length > 0) {
      this.token = s.stack[0];
      s.stack.shift(); // remove first element
      return;
    }
    this.token = new LexerToken();
    this.token.fileID = file_id;
    // white spaces and comments
    s.indent = -1; // indents are disallowed, until a newline-character is read
    let outputLinefeed = false; // token == "\n"?
    for (;;) {
      // newline
      if (s.i < s.n && src[s.i] === '\n') {
        s.indent = 0;
        outputLinefeed = this.nextTokenLinefeed(s);
      }
      // space
      else if (s.i < s.n && src[s.i] === ' ') {
        s.i++;
        s.col++;
        if (s.indent >= 0) s.indent++;
      }
      // tab
      else if (s.i < s.n && src[s.i] === '\t') {
        s.i++;
        s.col += 4;
        if (s.indent >= 0) s.indent += 4;
      }
      // backslash line break -> consume all following whitespace
      else if (
        this.backslashLineBreaksEnabled &&
        s.i < s.n &&
        src[s.i] === '\\'
      ) {
        s.i++;
        while (s.i < s.n) {
          if (src[s.i] == ' ') s.col++;
          else if (src[s.i] == '\t') s.col += 4;
          else if (src[s.i] == '\n') {
            s.row++;
            s.col = 1;
          } else break;
          s.i++;
        }
      }
      // single line comment (slc)
      else if (
        this.singleLineCommentStart.length > 0 &&
        this.isNext(this.singleLineCommentStart)
      ) {
        if (this.parseIndentationEnabled && s.indent >= 0) break;
        const n = this.singleLineCommentStart.length;
        s.i += n;
        s.col += n;
        while (s.i < s.n && src[s.i] != '\n') {
          s.i++;
          s.col++;
        }
        if (s.i < s.n && src[s.i] === '\n') {
          //if (this.nextTokenLinefeed(s)) return;
          outputLinefeed = this.nextTokenLinefeed(s);
        }
        s.indent = 0;
      }
      // multi line comment (mlc)
      else if (
        this.multiLineCommentStart.length > 0 &&
        this.isNext(this.multiLineCommentStart)
      ) {
        if (this.parseIndentationEnabled && s.indent >= 0) break;
        let n = this.multiLineCommentStart.length;
        s.i += n;
        s.col += n;
        while (s.i < s.n && !this.isNext(this.multilineCommentEnd)) {
          if (src[s.i] === '\n') {
            // TODO: this.nextTokenLinefeed(s)!!
            s.row++;
            s.col = 1;
            s.indent = 0;
          } else s.col++;
          s.i++;
        }
        n = this.multilineCommentEnd.length;
        s.i += n;
        s.col += n;
      }
      // FILEPOS = PREFIX ":" STR ":" INT ":" "INT";
      else if (
        this.lexerFilePositionPrefix.length > 0 &&
        src.substring(s.i).startsWith(this.lexerFilePositionPrefix)
      ) {
        s.i += this.lexerFilePositionPrefix.length;
        // path
        let path = '';
        while (s.i < s.n && src[s.i] !== ':') {
          path += src[s.i];
          s.i++;
        }
        s.i++;
        this.fileStack.slice(-1)[0].id = path;
        this.token.fileID = path;
        // row
        let rowStr = '';
        while (s.i < s.n && src[s.i] !== ':') {
          rowStr += src[s.i];
          s.i++;
        }
        s.i++;
        this.token.row = parseInt(rowStr);
        // column
        let colStr = '';
        while (s.i < s.n && src[s.i] !== ':') {
          colStr += src[s.i];
          s.i++;
        }
        s.i++;
        this.token.col = parseInt(colStr);
      } else break;
    }
    // indentation
    if (this.parseIndentationEnabled && s.indent >= 0) {
      const diff = s.indent - s.lastIndent;
      s.lastIndent = s.indent;
      if (diff != 0) {
        if (diff % 4 == 0) {
          const is_plus = diff > 0;
          const n = Math.floor(Math.abs(diff) / 4);
          for (let k = 0; k < n; k++) {
            this.token = new LexerToken();
            this.token.fileID = file_id;
            this.token.row = s.row;
            if (is_plus) this.token.col = s.col - diff + 4 * k;
            else this.token.col = s.col;
            this.token.type = LexerTokenType.DEL;
            this.token.token = is_plus ? '\t+' : '\t-';
            s.stack.push(this.token);
          }
          this.token = s.stack[0];
          s.stack.shift(); // remove first
          return;
        } else {
          this.token.row = s.row;
          this.token.col = s.col - diff;
          this.token.type = LexerTokenType.TER;
          this.token.token = '\terr';
          return;
        }
      }
    }
    // in case that this.parseNewLineEnabled == true, we must stop here
    // if "\n" was actually read
    if (outputLinefeed) return;
    // backup current state
    const s_bak = s.copy();
    this.token.row = s.row;
    this.token.col = s.col;
    s.indent = 0;
    // end?
    if (s.i >= s.n) {
      this.token.token = '$end';
      this.token.type = LexerTokenType.END;
      return;
    }
    // ID = ( "A".."Z" | "a".."z" | "_" )
    //   { "A".."Z" | "a".."z" | "0".."9" | "_" };
    this.token.type = LexerTokenType.ID;
    this.token.token = '';
    if (
      s.i < s.n &&
      ((src[s.i] >= 'A' && src[s.i] <= 'Z') ||
        (src[s.i] >= 'a' && src[s.i] <= 'z') ||
        src[s.i] === '_')
    ) {
      this.token.token += src[s.i];
      s.i++;
      s.col++;
      while (
        s.i < s.n &&
        ((src[s.i] >= 'A' && src[s.i] <= 'Z') ||
          (src[s.i] >= 'a' && src[s.i] <= 'z') ||
          (src[s.i] >= '0' && src[s.i] <= '9') ||
          src[s.i] === '_')
      ) {
        this.token.token += src[s.i];
        s.i++;
        s.col++;
      }
    }
    if (this.token.token.length > 0) {
      if (this.terminals.has(this.token.token))
        this.token.type = LexerTokenType.TER;
      this.state = s;
      return;
    }
    // STR = '"' { any except '"' and '\n' } '"'
    s = s_bak.copy();
    if (this.parseDoubleQuotesEnabled) {
      this.token.type = LexerTokenType.STR;
      if (s.i < s.n && src[s.i] === '"') {
        this.token.token = '';
        s.i++;
        s.col++;
        while (s.i < s.n && src[s.i] != '"' && src[s.i] != '\n') {
          this.token.token += src[s.i];
          s.i++;
          s.col++;
        }
        if (s.i < s.n && src[s.i] === '"') {
          s.i++;
          s.col++;
          //if(this.tk.tk.length > 0) {
          this.state = s;
          return;
          //}
        }
      }
    }
    // HEX = "0" "x" { "0".."9" | "A".."F" | "a".."f" }+;
    s = s_bak.copy();
    if (this.parseHexEnabled) {
      this.token.type = LexerTokenType.HEX;
      this.token.token = '';
      if (s.i < s.n && src[s.i] === '0') {
        s.i++;
        s.col++;
        if (s.i < s.n && src[s.i] === 'x') {
          s.i++;
          s.col++;
          let k = 0;
          while (
            s.i < s.n &&
            ((src[s.i] >= '0' && src[s.i] <= '9') ||
              (src[s.i] >= 'A' && src[s.i] <= 'F') ||
              (src[s.i] >= 'a' && src[s.i] <= 'f'))
          ) {
            this.token.token += src[s.i];
            s.i++;
            s.col++;
            k++;
          }
          if (k > 0) {
            this.token.token = '0x' + this.token.token;
            this.token.value = parseInt(this.token.token, 16);
            this.token.valueBigint = BigInt(this.token.token);
            this.state = s;
            return;
          }
        }
      }
    }
    // INT|BIGINT|REAL = "0" | "1".."9" { "0".."9" } [ "." { "0".."9" } ];
    s = s_bak.copy();
    if (this.parseIntEnabled) {
      this.token.type = LexerTokenType.INT;
      this.token.token = '';
      if (s.i < s.n && src[s.i] === '0') {
        this.token.token = '0';
        s.i++;
        s.col++;
      } else if (s.i < s.n && src[s.i] >= '1' && src[s.i] <= '9') {
        this.token.token = src[s.i];
        s.i++;
        s.col++;
        while (s.i < s.n && src[s.i] >= '0' && src[s.i] <= '9') {
          this.token.token += src[s.i];
          s.i++;
          s.col++;
        }
      }
      if (
        this.token.token.length > 0 &&
        this.parseBigintEnabled &&
        s.i < s.n &&
        src[s.i] === 'n'
      ) {
        s.i++;
        s.col++;
        this.token.type = LexerTokenType.BIGINT;
      } else if (
        this.token.token.length > 0 &&
        this.parseRealEnabled &&
        s.i < s.n &&
        src[s.i] === '.'
      ) {
        this.token.type = LexerTokenType.REAL;
        this.token.token += '.';
        s.i++;
        s.col++;
        while (s.i < s.n && src[s.i] >= '0' && src[s.i] <= '9') {
          this.token.token += src[s.i];
          s.i++;
          s.col++;
        }
      }
      if (this.token.token.length > 0) {
        if (this.token.type === LexerTokenType.INT)
          this.token.value = parseInt(this.token.token);
        else if (this.token.type === LexerTokenType.BIGINT)
          this.token.valueBigint = BigInt(this.token.token);
        else this.token.value = parseFloat(this.token.token);
        this.state = s;
        return;
      }
    }
    // DEL = /* element of this.multichar_delimiters */;
    this.token.type = LexerTokenType.DEL;
    this.token.token = '';
    for (let k = 0; k < this.multicharDelimiters.length; k++) {
      const d = this.multicharDelimiters[k];
      let match = true;
      s = s_bak.copy();
      for (let l = 0; l < d.length; l++) {
        const ch = d[l];
        if (s.i < s.n && src[s.i] === ch) {
          s.i++;
          s.col++;
        } else {
          match = false;
          break;
        }
      }
      if (match) {
        this.state = s;
        this.token.token = d;
        return;
      }
    }
    // unexpected
    s = s_bak.copy();
    this.token.type = LexerTokenType.DEL;
    this.token.token = '';
    if (s.i < s.n) {
      this.token.token = src[s.i];
      s.i++;
      s.col++;
      this.state = s;
    }
  }

  private nextTokenLinefeed(s: LexerState): boolean {
    let insertedSemicolon = false;
    if (this.parseNewlineEnabled) {
      this.token.row = s.row;
      this.token.col = s.col;
      this.token.token = '\n';
      this.token.type = LexerTokenType.DEL;
    } else if (this.putTrailingSemicolon.length > 0) {
      let match = false;
      for (const pts of this.putTrailingSemicolon) {
        if (pts.type === this.lastToken.type) {
          if (pts.type === LexerTokenType.DEL)
            match = pts.token === this.lastToken.token;
          else match = true;
          if (match) break;
        }
      }
      if (match) {
        insertedSemicolon = true;
        this.token.row = s.row;
        this.token.col = s.col;
        this.token.token = ';';
        this.token.type = LexerTokenType.DEL;
      }
    }
    s.row++;
    s.col = 1;
    s.indent = 0;
    s.i++;
    return this.parseNewlineEnabled || insertedSemicolon;
  }

  pushSource(id: string, src: string): void {
    if (this.fileStack.length > 0) {
      this.fileStack.slice(-1)[0].stateBackup = this.state.copy();
      this.fileStack.slice(-1)[0].tokenBackup = this.token.copy();
    }
    const f = new LexerFile();
    f.id = id;
    f.sourceCode = src;
    this.fileStack.push(f);
    this.state = new LexerState();
    this.state.n = src.length;
    this.next();
  }

  popSource(): void {
    this.fileStack.pop();
    if (this.fileStack.length > 0) {
      this.state = this.fileStack.slice(-1)[0].stateBackup;
      this.token = this.fileStack.slice(-1)[0].tokenBackup;
    }
  }

  backupState(): LexerBackup {
    return {
      state: this.state.copy(),
      token: this.token.copy(),
    };
  }

  replayState(backup: LexerBackup): void {
    this.state = backup.state;
    this.token = backup.token;
  }
}
