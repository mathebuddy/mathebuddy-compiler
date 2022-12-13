/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as fs from 'fs';
import * as lz_string from 'lz-string';

import { Compiler } from '../src';

console.log('mathe:buddy Compiler (c) 2022 by TH Koeln');

// load function
function load(path: string): string {
  if (fs.existsSync(path) == false) return '';
  return fs.readFileSync(path, 'utf-8');
}

// demo course
console.log('=== TESTING DEMO COURSE ===');
const compiler = new Compiler();
compiler.compile('examples/demo-course/course.mbl', load);
const output = JSON.stringify(compiler.getCourse().toJSON(), null, 2);
fs.writeFileSync('examples/demo-course/course_COMPILED.json', output);

// demo files
const inputPath = 'examples/';
const files = fs.readdirSync(inputPath).sort();
for (const file of files) {
  const path = inputPath + file;
  if (path.endsWith('.mbl') == false) continue;
  console.log('=== TESTING FILE ' + path + ' ===');
  // compile file
  const compiler = new Compiler();
  compiler.compile(path, load);
  // write output as JSON
  const output = JSON.stringify(compiler.getCourse().toJSON(), null, 2);
  const outputPath =
    inputPath + file.substring(0, file.length - 4) + '_COMPILED.json';
  fs.writeFileSync(outputPath, output);
  // write output as compressed HEX file
  const outputCompressed = lz_string.compressToBase64(output);
  const outputPathCompressed =
    inputPath + file.substring(0, file.length - 4) + '_COMPILED.hex';
  fs.writeFileSync(outputPathCompressed, outputCompressed, 'base64');
}
