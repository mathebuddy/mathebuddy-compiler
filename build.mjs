/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as esbuild from 'esbuild';
import { execSync } from 'child_process';

// ---- build ----
esbuild.buildSync({
  platform: 'browser',
  globalName: 'mathebuddyCOMPILER',
  minify: true,
  target: 'es2020',
  entryPoints: ['src/index.ts'],
  bundle: true,
  outfile: 'build/mathebuddy-compiler.min.js',
});

// ---- convert README.md to README.html ----
const date = new Date().toISOString().slice(0, 10);
execSync("sed -e '1,/# mathe:buddy/d' README.md > __tmp.md");
execSync(
  'pandoc -s __tmp.md --metadata title="MATHE:BUDDY LANGUAGE (MBL)" --metadata author="" --metadata date="' +
    date +
    '"  --css README.css --self-contained -o README.html',
);
execSync('rm __tmp.md');
// TODO: --mathjax may be needed, but results in large file, if --self-contained option is provided...
