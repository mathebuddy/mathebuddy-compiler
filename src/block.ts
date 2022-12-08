/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

// TODO: use npm-package in future!
import * as SMPL from '@mathebuddy/mathebuddy-smpl/src';
import { BaseType } from '@mathebuddy/mathebuddy-smpl/src/symbol';

import { Compiler } from './compiler';
import {
  MBL_Definition,
  MBL_DefinitionType,
  MBL_Equation,
  MBL_EquationOption,
  MBL_Error,
  MBL_Example,
  MBL_Exercise,
  MBL_Exercise_Instance,
  MBL_Exercise_Variable,
  MBL_Exercise_VariableType,
  MBL_LevelItem,
  MBL_Text,
  MBL_Text_AlignCenter,
  MBL_Text_AlignLeft,
  MBL_Text_AlignRight,
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
        return this.processEquation(true);
      case 'EQUATION*':
        return this.processEquation(false);

      case 'EXAMPLE':
        return this.processExample();

      case 'EXERCISE':
        return this.processExercise();

      case 'TEXT':
        return this.processText();

      default: {
        const err = new MBL_Error();
        err.message = 'unknown block type "' + this.type + '"';
        return err;
      }
    }
  }

  private processText(): MBL_Text {
    // this block has no parts
    return this.parser.parseParagraph(
      (this.parts[0] as BlockPart).lines.join('\n'),
    );
  }

  private processEquation(numbering: boolean): MBL_Equation {
    const equation = new MBL_Equation();
    equation.numbering = numbering ? 888 : -1; // TODO: number
    equation.title = this.title;
    equation.label = this.label;
    for (const p of this.parts) {
      if (p instanceof BlockPart) {
        const part = <BlockPart>p;
        switch (part.name) {
          case 'options':
            for (let line of part.lines) {
              line = line.trim();
              if (line.length == 0) continue;
              switch (line) {
                case 'align-left':
                  equation.options.push(MBL_EquationOption.AlignLeft);
                  break;
                case 'align-center':
                  equation.options.push(MBL_EquationOption.AlignCenter);
                  break;
                case 'align-right':
                  equation.options.push(MBL_EquationOption.AlignRight);
                  break;
                case 'align-equals':
                  // TODO: do NOT store. create LaTeX-code instead!
                  equation.options.push(MBL_EquationOption.AlignEquals);
                  break;
                default:
                  equation.error += 'unknown option "' + line + '"';
              }
            }
            break;
          case 'global':
          case 'text':
            equation.value += part.lines.join('\\\\');
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

  private processExample(): MBL_Example {
    const example = new MBL_Example();
    example.title = this.title;
    example.label = this.label;
    for (const p of this.parts) {
      if (p instanceof BlockPart) {
        const part = <BlockPart>p;
        switch (part.name) {
          case 'global':
            example.items.push(
              this.parser.parseParagraph(part.lines.join('\n')),
            );
            break;
          default:
            example.error += 'unexpected part "' + part.name + '"';
            break;
        }
      } else {
        // TODO: check if allowed here!!
        example.items.push(p);
      }
    }
    return example;
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

  private processExercise(): MBL_Exercise {
    const exercise = new MBL_Exercise();
    exercise.title = this.title;
    for (const p of this.parts) {
      if (p instanceof BlockPart) {
        const part = <BlockPart>p;
        switch (part.name) {
          case 'global':
            if (part.lines.join('\n').trim().length > 0)
              exercise.error =
                'Some of your code is not inside a tag (e.g. "@code" or "@text")';
            break;
          case 'code':
            exercise.code = part.lines.join('\n');
            break;
          case 'text':
            exercise.text = this.parser.parseParagraph(
              part.lines.join('\n'),
              exercise,
            );
            break;
          default:
            exercise.error = 'unknown part "' + part.name + '"';
            break;
        }
      } else {
        // TODO: check if allowed here!!
        //TODO: exercise.items.push(p);
      }
    }
    try {
      for (let i = 0; i < 3; i++) {
        // TODO: configure number of instances!
        // TODO: repeat if same instance is already drawn
        // TODO: must check for endless loops, e.g. happens if search space is restricted!
        const instance = new MBL_Exercise_Instance();
        const variables = SMPL.interpret(exercise.code);
        for (const v of variables) {
          const ev = new MBL_Exercise_Variable();
          switch (v.type.base) {
            case BaseType.BOOL:
              ev.type = MBL_Exercise_VariableType.Bool;
              break;
            case BaseType.INT:
              ev.type = MBL_Exercise_VariableType.Int;
              break;
            case BaseType.REAL:
              ev.type = MBL_Exercise_VariableType.Real;
              break;
            case BaseType.COMPLEX:
              ev.type = MBL_Exercise_VariableType.Complex;
              break;
            case BaseType.TERM:
              ev.type = MBL_Exercise_VariableType.Term;
              break;
            case BaseType.VECTOR:
              ev.type = MBL_Exercise_VariableType.Vector;
              break;
            case BaseType.MATRIX:
              ev.type = MBL_Exercise_VariableType.Matrix;
              break;
            case BaseType.INT_SET:
              ev.type = MBL_Exercise_VariableType.IntSet;
              break;
            case BaseType.REAL_SET:
              ev.type = MBL_Exercise_VariableType.RealSet;
              break;
            case BaseType.COMPLEX_SET:
              ev.type = MBL_Exercise_VariableType.ComplexSet;
              break;
            default:
              throw Error(
                'unimplemented: processExercise(..) type ' + v.type.base,
              );
          }
          exercise.variables[v.id] = ev;
          instance.values[v.id] = v.value.toString();
        }
        exercise.instances.push(instance);
      }
    } catch (e) {
      exercise.error = e.toString();
    }
    return exercise;
  }

  private error(message: string): void {
    console.error('' + (this.srcLine + 1) + ': ' + message);
  }
}
