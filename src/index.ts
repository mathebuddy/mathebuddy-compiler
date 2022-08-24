/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as fs from 'fs';

import { Parser } from './parse';

console.log('mathe:buddy Compiler (c) 2022 by TH Koeln');

// just a test..
import { SellCode } from './code';
import { SellInterpreter } from './run';
const src = 'let x = 3 + 4*5;';
const sc = new SellCode();
sc.parse(src);
const int = new SellInterpreter();
int.interpret(src);

/*
const inputPath = 'test/testcourse/chapter1.txt'; // TODO: get from args
const src = fs.readFileSync(inputPath, 'utf-8');

const parser = new Parser();
parser.run(src);
*/
