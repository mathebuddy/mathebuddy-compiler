# mathe:buddy Compiler

This repository is part of the `mathe:buddy` project:

- Website: [https://app.f07-its.fh-koeln.de](https://app.f07-its.fh-koeln.de)
- GitHub page: [https://github.com/mathebuddy](https://github.com/mathebuddy)

# Overview

This readme describes the _mathe:buddy Language (MBL)_ that is used to describes courses for the app.

# Usage

We provide a simulator that translates and renders `*.mbl` files. Visit [https://github.com/mathebuddy/mathebuddy-simulator](https://github.com/mathebuddy/mathebuddy-simulator) an refer to the README file.

**Note: We are currently implementing an interactive website including a playground. If you are not a developer, we suggest to wait for the release of the website.**

# mathe:buddy Language (MBL) Reference

The following sections describe the syntax of the _mathe:buddy language (MBL)_.

Visit [https://github.com/mathebuddy/mathebuddy-public-courses](https://github.com/mathebuddy/mathebuddy-public-courses) for more examples.

## Hello, world!

The following lines define a trivial level page:

```
My first level
###############

Welcome to mathe:buddy!
```

## Typography

This section describes the text structuring and text formatting features.

- `Level Title`

  A level title is the main heading of a level file. Example:

  ```
  My Course Title @myLabel
  ###############
  ```

  Five or more hashtags (`#`) are required. Labels are optional.

- `Sections`

  A level can be separated into sections (headlines). Example:

  ```
  My Section @sec:myLabel
  ==========
  ```

  Five or more equal signs (`=`) are required. Labels are optional. We suggest to user prefix `sec:` for section labels, but this is optional.

- `Subsections`

  A section can be subdivided into subsections. Example:

  ```
  My Subsection @subsec:myLabel
  -------------
  ```

  Five or more dashes (`-`) are required. Labels are optional. We suggest to user prefix `subsec:` for subsection labels, but this is optional.

- `Paragraphs`

  A paragraph consists of one or multiple lines of continuous text. Example:

  ```
  This is text within a paragraph.
  Even this text stands in a new line, it is compiled to be written directly behind the last line.

  An empty line starts a new paragraph.
  ```

- `Definitions and Theorems`

  Definitions and Theorems are embedded into a _block_ that syntactically starts and ends with each a line of three dashes (`---`). Examples:

  ```
  ---
  DEFINITION Positive @def:myLabel
  For any integer $n$, $n$ is **positive** if $n>0$.
  ---
  ```

  ```
  ---
  THEOREM The Aristotelian Syllogism @thm:myLabel
  If every man is mortal and Socrates is a man, then Socrates is mortal.
  ---
  ```

- `Bold, Italic and Colored Text`

  Basic text format options are bold text, italic text and colored text. Examples:

  ```
  Some **bold** text. Some *italic* text.
  The word [sky]@color1 is written.
  [Some text written in the secondary color.]@color2.
  You can also write [bold text]@bold and [italic text]@italic similar to color notation.
  ```

  Colors are only defined implicitly. The exact rendering depends on the runtime environment. We restricted the degree of freedom per design to force uniformly presented courses. `color0` is always black.

- `Links and References`

  Each section, subsection, equation, exercise, ... can be labeled at time of declaration. A label has the form `@myLabel`. Refer to the examples above.

  A link to such a label can be places in paragraph text by writing `@myLabel` again.

  Example:

  ```
  Refer to section @sec:intro.
  ```

  We suggest to use the following prefixes, but this is optional:

  | prefix    | used for     |
  | --------- | ------------ |
  | `sec:`    | sections     |
  | `subsec:` |  subsections |
  | `ex:`     | exercises    |
  | `fig:`    | figures      |
  | `eq:`     | equation     |
  | `tab:`    | table        |

- `Comments`

  Comments are notes, intended for course developers. Comments are ignored by the compiler. You can use comments to temporarily hide unfinished stuff. Example:

  ```
  This text is displayed in the output. % only a course developer can read this.
  ```

- `Page Breaks`

  A level can be scrolled vertically by the student. Doom-scrolling should be avoided (not only) for didactical reasons. Page breaks can be inserted by a block containing the keyword `NEWPAGE`. Example:

  ```
  ---
  NEWPAGE
  ---
  ```

## Equations

We distinguish two parts of equations: _inline equations_ are embedded into a text of a paragraph. _Full equations_ are rendered in a separate line. The latter are numbered by default.

Equations are encoded in `TeX` notation.

- `Inline Equations`

  An inline equation is embedded into a pair of dollar signs. Example:

  ```
  Einstein's famous formula is $E=mc^2$. It defines the energy $E$ of ...
  ```

- `Full Equations` (equations in display math mode)

  Full equations are embedded into a block with keyword `EQUATION`. Example:

  ```
  ---
  EQUATION @eq:myLabel
  a^2 + b^2 = c^2
  ---
  ```

  The label is optional.

  A numbering is displayed right to the equation per default.
  Keyword `EQUATION*` hides the numbering. Example:

  ```
  ---
  EQUATION* @eq:myLabel
  a^2 + b^2 = c^2
  ---
  ```

  Equations can be labeled with `@`.
  For example, `@eq:myLabel` is displayed $Eq~(1)$ (depends on the runtime environment).

- Abbreviations

  Equations are written in plain `TeX` code.
  In some cases, the notation is rather long.
  We introduce some (optional) abbreviations for a shorter notation.
  The following table lists implemented abbreviations:

  | type   | plain tex                                                                                    | short notation                    |
  | ------ | -------------------------------------------------------------------------------------------- | --------------------------------- |
  | matrix | `\begin{pmatrix}` <br> &nbsp;&nbsp;`A & B\\` <br> &nbsp;&nbsp;`C & D\\` <br> `\end{pmatrix}` | `\MAT(A, B; C, D)` <br> <br> <br> |

  (TODO: extend table)

## Figures

MBL only supports to plot functions. All other figures must be generated with external tools (for example [Inkscape](https://inkscape.org)).

- `Plots`

  Plots of functions are described in a _block_ with keyword `PLOT2D`. Example:

  ```
  ---
  PLOT2D My plot title @fig:myPlot
  xaxis "x" from -3 to 3
  yaxis "y" from -3 to 3
  color1
  plot f(x) = x^2
  color2
  plot g(x) = 2*x
  color0
  coord -1 1
  coord 2 4
  ---
  ```

  Keywords `xaxis`, `yaxis`, `colorX`, `plot` are self-explanatory.

  Keyword `coord X Y` renders a small circle at position $(X,Y)$.

- `Figures`

  A figure displays an image file. It is highly recommended to use `*.svg` as file format (scalable vector graphics). Example:

  ```
  ---
  FIGURE My figure title @fig:myFigure
  images/myImage.svg
  ---
  ```

## Itemizations and Enumerations

_Note: Hierarchical itemizations are not supported for didactical reasons._

- `Itemize`

  An itemization lists a set of bullet points. Example:

  ```
  My itemization:
  - first item
  - second item
  - third item
  ```

  A line that starts with a dash (`-`) is rendered as bullet point.

- `Enumeration (numbers)`

  Enumerations list a sequence of numbered items. Example:

  ```
  My enumeration:
  # first item
  # second item
  # third item
  ```

  A line that starts with a dash (`#`) is rendered with numbering (1, 2, ...)

- `Enumeration (letters)`

  Alphabetical enumerations list a sequence of items. Example:

  ```
  My enumeration:
  -) first item
  -) second item
  -) third item
  ```

  A line that starts with a dash and closing parenthesis (`-)`) is rendered with preceding letters `a)`, ` b)`, ...

## Tables

A table is described by a block with keyword `TABLE`.
It simply lists row by word.
The first row is considered as headline.
Columns are separated by `&`.

Example:

```
---
TABLE title @tab:label
$x$ & $f(x)$
1 & 1
2 & 4
3 & 9
... & ...
---
```

## Exercises

Exercises provide questions to students.

> Note: The part `code` in an exercise uses the **Simple Math Programing Language (SMPL)**. The documentation can be found [here](https://github.com/mathebuddy/mathebuddy-smpl) (scroll down in the link).

- `Numeric Exercise`

  A numeric exercise TODO

  ```
  ---
  EXERCISE My exercise @ex:myLabel
  @code
  let x/y = rand(1, 5);
  let z = x + y;
  @text
  Calculate $x+y=$ #z
  ---
  ```

- `Term Exercises`

  ```
  ---
  EXERCISE Title @ex:myLabel
  @options
  term-tokens-1.5
  @code
  F(x) = 1/3*x^3 + 7*x
  @text
  Solve $\int (x^2+7) \dx$ = #F
  ---
  ```

  Without any option, the student is required to enter `1/3*x^3 + 7*x` (or an algebraic equivalent solution).

  Option `term-tokens-X` lists a set of buttons, each representing a part of the solution term. In the example, buttons `[1/3]`, `[*]`, `[x^3]`, `[+]`, `[7]`, `[x]` are shown in random order. The student has to click on the buttons to construct the solution. Attribute `X` represents the overhead factor, i.e. the number of additional buttons with (most likely) useless options. The example sets `X` to `1,5`. In this case 9 instead of 6 buttons are shown (e.g. `[1/5]`, `[/]`, `[x^4]`).

- `Static Multiple Choice Exercise`

  ```
  ---
  EXERCISE My Multiple Choice Exercise @ex:myMultiChoice
  @text
  [x] This answer is correct.
  [ ] This answer is incorrect.
  [x] This answer is correct.
  ---
  ```

  Each correct answer is marked by `x`.

- `Dynamic Multiple Choice Exercise`

  ```
  ---
  EXERCISE My dynamic Multiple Choice Exercise @ex:myMultiChoice
  @code
  let x/y/z/w = rand(10,20);    % no pair of x, y, z, w is equal
  let b = z>w;
  @text
  [$x>w$] $x > w$
  [$y>w$] $y > w$
  [$b$]   $z > w$
  [ ]     $1 < 0$
  ---
  ```

  Correctness of an answer is determined by a boolean condition or variable.
  You are allowed to mix static static and dynamic answers.

- `Single Choice Exercise`

  ```
  ---
  EXERCISE My Multiple Choice Exercise @ex:myMultiChoice
  @text
  (x) This answer is correct.
  ( ) This answer is incorrect.
  ( ) This answer is incorrect.
  ---
  ```

  Single choice exercises are defined in the same way as multiple choice exercises, but use round parentheses.

- `Gap Exercise`

  ```
  ---
  EXERCISE My Gap Exercise @ex:myLabel
  @options
  show-length
  restricted-keyboard
  @text
  Garfield is a #"cat". Rain is #"wet".
  ---
  ```

  The option `show-length` hints the number of characters of the solution word.

  The option `restricted-keyboard` displays a context-sensitive keyboard. E.g. for the first answer `cat` from the example, the student only sees keys `[A]`, `[C]` and `[T]`.

TODO: numeric answers with given patterns

- `Arrangement Exercise`

  ```
  ---
  EXERCISE Title @ex:label
  @options
  accept-immediately
  @code
  let n = rand(5,10);         % length
  let f = zeros<1,n>();       % row vector for the sequence
  f[1] = 1;                   % f[0]=0, f[1]=1
  for (let i=2; i<n; i++) {   % calc sequence iteratively
    f[i] = f[i-2] + f[i-1];
  }
  @text
  Arrange the following numbers to get the first numbers of the Fibonacci sequence: #:order(s,f)
  ---
  ```

  The answer field `#f` would ask the student to type in the elements of the row vector: `[0, 1, 1, 2, 3, 5, ...]`.

  Writing `#:order(v)` lists a shuffled form of vector `v` and requires the student to reorder the vector to finally get vector `v`.

  The option `accept-immediately` accepts the answer immediately when it is correct. If the option is missing, then the student needs to submit the solution explicitly.

- `Timed Exercise`

  ```
  ---
  EXERCISE Title @ex:label
  @options
  timed-3
  accelerate
  multi-choice-4
  stop-on-error-1
  @code
  let x:y = rand(20,50);
  let z = x + y;
  @text
  Calculate $x+y=$ #z
  ---
  ```

  A timed exercise repeatedly shows exercises. Quick and correct responses results in a large high score.

  Option `timed-X` enables timing. The student has `X` seconds to give an answer.

  Option `accelerate` decreases time per question.

  Option `multi-choice-X` lists `X` options per question.

  Option `stop-on-error-X` stops asking after `X` incorrect answers.

## Course Structure

We use the following terms:

- `Course`: an entire course, e.g. "higher math 1"
- `Chapter`: a logical chapter of a course, e.g. "complex numbers"
- `Unit`: a learning unit of a chapter, e.g. "basics of complex numbers", "complex functions, sequences and series"
- `Level`: a basic part of a unit, e.g. "normal form", "polar form", "absolute value"

A course consists of multiple `*.mbl` files.
The file hierarchy is `/COURSE/CHAPTER/LEVEL_FILE.mbl`.
This, each file represents a level of the course.
Units are defined in index files (see below).

Example folder for course a course `hm1`:

```
hm1/cmplx/start.mbl
hm1/cmplx/intro.mbl
hm1/cmplx/normal.mbl
hm1/cmplx/conj.mbl
hm1/cmplx/conj-props.mbl
hm1/cmplx/abs.mbl
hm1/cmplx/polar.mbl
...
hm1/diff/index.mbl
hm1/diff/...
...
```

Each chapter directory is organized by an index file, named `index.mbl`.
The format of index files is described in the next section.

## Index Files

An index file defines meta data for a chapter. It also lists all files and its dependencies.

> hm1/cmplx/index.mbl

```
% a comment line

!TITLE
Complex Numbers

!AUTHOR
TH Koeln

!UNIT1
(0,2) start.mbl -> normal.mbl, gauss.mbl
(0,1) gauss.mbl
(1,3) normal.mbl -> conj.mbl
(2,3) conj.mbl -> conj-props.mbl, abs.mbl
(2,4) conj-props.mbl
(3,3) abs.mbl -> polar.mbl
(4,2) polar.mbl

!UNIT2
...
```

Each chapter consists of a set of units.

Each unit consists of a set of levels.
A unit can be represented by a (directed) graph $G=(V,E)$ with $V$ the levels and $E$ the dependencies between levels.

Each level is described by an `*.mbl` file.
A level is only playable, if all presuming levels have been passed successfully.
At least one level must have no presuming level.

Levels are listed below the `!UNITX` entry (`X` is the unit number).

Format line for a level: `(X,Y) FILE -> SUCCESSOR_FILE1, SUCCESSOR_FILE2, ...`.

Coordinates `(X,Y)` describe the position of node $v \in V(G)$, where `(0,0)` is interpreted as _top-left_.

# TODO

- add preview images in this document
- add links to web-simulator (not public)
- chatbot code
- scoring, repetition, ...

_Author: Andreas Schwenk, TH Köln_
