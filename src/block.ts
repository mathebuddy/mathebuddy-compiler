/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

// TODO: use npm-package in future!
import * as SMPL from '@mathebuddy/mathebuddy-smpl/src';

import { Compiler } from './compiler';
import {
  MBL_Definition,
  MBL_DefinitionType,
  MBL_Equation,
  MBL_Error,
  MBL_LevelItem,
  MBL_Text,
  MBL_Text_AlignCenter,
  MBL_Text_AlignLeft,
  MBL_Text_AlignRight,
  MBL_Text_Paragraph,
} from './data';

export class BlockPart {
  name = '';
  lines: string[] = [];
}

export class Block {
  type = '';
  title = '';
  label = '';
  parts: (MBL_LevelItem | BlockPart)[] = [];
  srcLine = 0;

  private parser: Compiler = null;

  constructor(parser: Compiler) {
    this.parser = parser;
  }

  process(): MBL_LevelItem {
    switch (this.type) {
      case 'DEFINITION':
        return this.processDefinition(MBL_DefinitionType.Definition);
      case 'THEOREM':
        return this.processDefinition(MBL_DefinitionType.Theorem);
      case 'LEMMA':
        return this.processDefinition(MBL_DefinitionType.Lemma);
      case 'COROLLARY':
        return this.processDefinition(MBL_DefinitionType.Corollary);
      case 'PROPOSITION':
        return this.processDefinition(MBL_DefinitionType.Proposition);
      case 'CONJECTURE':
        return this.processDefinition(MBL_DefinitionType.Conjecture);
      case 'AXIOM':
        return this.processDefinition(MBL_DefinitionType.Axiom);
      case 'CLAIM':
        return this.processDefinition(MBL_DefinitionType.Claim);
      case 'IDENTITY':
        return this.processDefinition(MBL_DefinitionType.Identity);
      case 'PARADOX':
        return this.processDefinition(MBL_DefinitionType.Paradox);

      case 'LEFT':
      case 'CENTER':
      case 'RIGHT':
        return this.processTextAlign(this.type);

      case 'EQUATION':
        return this.processEquation();

      /*case 'EXERCISE':
        return this.processExercise();*/

      default: {
        const err = new MBL_Error();
        err.message = 'unknown block type "' + this.type + '"';
        return err;
      }
    }
  }

  private processEquation(): MBL_Equation {
    const equation = new MBL_Equation();
    equation.title = this.title;
    equation.label = this.label;
    for (const p of this.parts) {
      if (p instanceof BlockPart) {
        const part = <BlockPart>p;
        switch (part.name) {
          case 'global':
            equation.value = part.lines.join('\\\\');
            break;
          default:
            equation.error += 'unexpected part "' + part.name + '"';
            break;
        }
      } else {
        equation.error += 'unexpected sub-block';
      }
    }
    return equation;
  }

  private processTextAlign(type: string): MBL_Text {
    let align: MBL_Text_AlignLeft | MBL_Text_AlignCenter | MBL_Text_AlignRight;
    switch (type) {
      case 'LEFT':
        align = new MBL_Text_AlignLeft();
        break;
      case 'CENTER':
        align = new MBL_Text_AlignCenter();
        break;
      case 'RIGHT':
        align = new MBL_Text_AlignRight();
        break;
    }
    for (const p of this.parts) {
      if (p instanceof BlockPart) {
        const part = <BlockPart>p;
        switch (part.name) {
          case 'global':
            align.items.push(this.parser.parseParagraph(part.lines.join('\n')));
            break;
        }
      } else {
        // TODO: check if allowed here!!
        align.items.push(p);
      }
    }
    return align;
  }

  private processDefinition(type: MBL_DefinitionType): MBL_Definition {
    const def = new MBL_Definition(type);
    def.title = this.title;
    def.label = this.label;
    for (const p of this.parts) {
      if (p instanceof BlockPart) {
        const part = <BlockPart>p;
        switch (part.name) {
          case 'global':
            def.items.push(this.parser.parseParagraph(part.lines.join('\n')));
            break;
          default:
            def.error += 'unexpected part "' + part.name + '"';
            break;
        }
      } else {
        // TODO: check if allowed here!!
        def.items.push(p);
      }
    }
    return def;
  }

  /*private processExercise(): Exercise {
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
  }*/

  private error(message: string): void {
    console.error('' + (this.srcLine + 1) + ': ' + message);
  }
}
