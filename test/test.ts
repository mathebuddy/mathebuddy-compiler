/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as fs from 'fs';
import { Compiler } from '../src';
//import * as lz_string from 'lz-string';

console.log('mathe:buddy Compiler (c) 2022 by TH Koeln');

// for all demo files
const inputPath = 'examples/';
const files = fs.readdirSync(inputPath);
for (const file of files) {
  const path = inputPath + file;
  if (path.endsWith('.mbl') == false) continue;
  // read MBL file
  const src = fs.readFileSync(path, 'utf-8');
  // compile file
  const compiler = new Compiler();
  compiler.run(src);
  // write output as JSON
  const output = JSON.stringify(compiler.getCourse().toJSON(), null, 2);
  const outputPath =
    inputPath + file.substring(0, file.length - 4) + '_COMPILED.json';
  fs.writeFileSync(outputPath, output);
  // write output as compressed HEX file
  /*const outputCompressed = lz_string.compressToBase64(output);
  const outputPathCompressed =
    inputPath + file.substring(0, file.length - 4) + '_COMPILED.hex';
  fs.writeFileSync(outputPathCompressed, outputCompressed, 'base64');*/
  break;
}

const bp = 1337;

/*const inputPath = 'testdata/testcourse/chapter1.txt'; // TODO: get from args
const src = fs.readFileSync(inputPath, 'utf-8');

const compiler = new Compiler();
compiler.run(src);

const output = JSON.stringify(compiler.getCourse().toJSON(), null, 2);
console.log(output);

const outputPath = inputPath + '_COMPILED.json';
fs.writeFileSync(outputPath, output);

const output_compressed = JSON.stringify(compiler.getCourse().toJSON());
const output_compressed_lz = lz_string.compressToBase64(output_compressed);

const outputPath_COMPRESSED = inputPath + '_COMPILED_COMPRESSED.hex';
fs.writeFileSync(outputPath_COMPRESSED, output_compressed_lz, 'base64');

const outputPath_COMPRESSED_2 =
  '../mathebuddy-simulator/testdata/chapter1.txt' + '_COMPILED_COMPRESSED.hex';
fs.writeFileSync(outputPath_COMPRESSED_2, output_compressed_lz, 'base64');
*/
