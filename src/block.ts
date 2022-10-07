/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

// TODO: use npm-package in future!
import * as SMPL from '@mathebuddy/mathebuddy-smpl/src';

import {
  DocumentItem,
  Exercise,
  ExerciseInstance,
  ParagraphItem,
  ParagraphItemType,
  TextLike,
  TextLikeType,
} from './data';
import { Compiler } from './compiler';

export class BlockPart {
  name = '';
  lines: string[] = [];
}

export class Block {
  type = '';
  title = '';
  label = '';
  parts: BlockPart[] = [];
  srcLine = 0;

  private parser: Compiler = null;

  constructor(parser: Compiler) {
    this.parser = parser;
  }

  process(): DocumentItem {
    switch (this.type) {
      case 'HIDDEN':
        return this.processTextLike(TextLikeType.Hidden);
      case 'DEFINITION':
        return this.processTextLike(TextLikeType.Definition);
      case 'EQUATION':
        return this.processTextLike(TextLikeType.Equation);
      case 'EXERCISE':
        return this.processExercise();
      default: {
        const err = new ParagraphItem(ParagraphItemType.Error);
        err.value = 'ERROR: unknown block type "' + this.type + '"';
        const p = new ParagraphItem(ParagraphItemType.Paragraph);
        p.subItems.push(err);
        return p;
      }
    }
  }

  private processTextLike(type: TextLikeType): TextLike {
    const tl = new TextLike();
    tl.type = type;
    for (const part of this.parts) {
      switch (part.name) {
        case 'global':
          tl.value = part.lines.join('\n');
          break;
        default:
          tl.error = 'unknown part "' + part.name + '"';
          break;
      }
    }
    return tl;
  }

  private processExercise(): Exercise {
    const exercise = new Exercise();
    exercise.title = this.title;
    for (const part of this.parts) {
      switch (part.name) {
        case 'global':
          if (part.lines.join('\n').trim().length > 0)
            exercise.error =
              'Some of your code is not inside a tag (e.g. "@code" or "@text")';
          break;
        case 'code':
          exercise.code_raw = part.lines.join('\n');
          break;
        case 'text':
          exercise.text_raw = part.lines.join('\n');
          break;
        default:
          exercise.error = 'unknown part "' + part.name + '"';
          break;
      }
    }
    try {
      for (let i = 0; i < 3; i++) {
        // TODO: configure number of instances!
        // TODO: repeat if same instance is already drawn (must check for endless loops in case that search space is restricted!)
        const instance = new ExerciseInstance();
        instance.variables = SMPL.interpret(exercise.code_raw);
        exercise.instances.push(instance);
      }
    } catch (e) {
      exercise.error = e.toString();
    }
    exercise.text = this.parser.parseParagraph(exercise.text_raw, exercise);
    return exercise;
  }

  private error(message: string): void {
    console.error('ERROR:' + (this.srcLine + 1) + ': ' + message);
  }
}
