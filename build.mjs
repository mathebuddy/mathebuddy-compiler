/**
 * mathe:buddy - eine gamifizierte Lern-App für die Hoehere Mathematik
 * (c) 2022 by TH Koeln
 * Author: Andreas Schwenk contact@compiler-construction.com
 * Funded by: FREIRAUM 2022, Stiftung Innovation in der Hochschullehre
 * License: GPL-3.0-or-later
 */

import * as esbuild from 'esbuild';
import { execSync } from 'child_process';
import * as fs from 'fs';

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

// ---- update examples/ directory ----

execSync('python3 examples/_get.py');

// ---- convert Markdown files to HTML files ----

const date = new Date().toISOString().slice(0, 10);

const files = ['mbl', 'mbcl'];
const titles = [
  'Mathe:Buddy Language (MBL)',
  'Mathe:Buddy Compiled Language (MBCL)',
];

for (let i = 0; i < files.length; i++) {
  const file = files[i];
  const title = titles[i];
  execSync(
    "sed -e '1,/<!-- start-for-website -->/d' " + file + '.md > __tmp.md',
  );
  execSync(
    'pandoc -s __tmp.md --metadata title="' +
      title +
      '" --metadata author="" --metadata date="' +
      date +
      '"  --css README.css --embed-resources --standalone -o ' +
      file +
      '.html',
  );
  execSync('rm __tmp.md');

  // TODO: --mathjax may be needed, but results in large file, if --self-contained option is provided...

  const _title = `<h1 class="title">`;
  const links =
    `[<a href="https://app.f07-its.fh-koeln.de">Home</a>] ` +
    `[<a href="https://app.f07-its.fh-koeln.de/docs-mbl.html">MBL Reference</a>] ` +
    `[<a href="https://app.f07-its.fh-koeln.de/docs-smpl.html">SMPL Reference</a>] ` +
    `[<a href="https://app.f07-its.fh-koeln.de/docs-mbcl.html">MBCL Reference</a>] ` +
    `[<a href="https://app.f07-its.fh-koeln.de/docs-sim.html">Installation</a>] `;
  fs.writeFileSync(
    file + '.html',
    fs.readFileSync(file + '.html', 'utf-8').replace(_title, links + _title),
  );
}
