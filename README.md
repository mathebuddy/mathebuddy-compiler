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

<!-- start-for-website -->

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

  Five or more equal signs (`=`) are required. Labels are optional. We suggest to use prefix `sec:` for section labels, but this is optional.

- `Subsections`

  A section can be subdivided into one or multiple subsections. Example:

  ```
  My Subsection @subsec:myLabel
  -------------
  ```

  Five or more dashes (`-`) are required. Labels are optional. We suggest to use prefix `subsec:` for subsection labels, but this is optional.

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
  DEFINITION Positive @def:positive
  For any integer $n$, $n$ is **positive** if $n>0$.
  ---
  ```

  ```
  ---
  THEOREM The Aristotelian Syllogism @thm:socrates
  If every man is mortal and Socrates is a man, then Socrates is mortal.
  ---
  ```

- `Bold, Italic and Colored Text`

  Basic text formatting options are bold text, italic text and colored text. Examples:

  ```
  Some **bold** text. Some *italic* text.
  The word [sky]@color1 is written not in primary color.
  [Some text written in the secondary color.]@color2.
  You can also write [bold text]@bold and [italic text]@italic similar to color notation.
  ```

  Colors are only defined implicitly. The exact rendering depends on the runtime environment. We restricted the degree of freedom per design to force uniformly presented courses. `color0` defines black color in all cases.

- `Links and References`

  Each section, subsection, equation, exercise, ... can be labeled at declaration. A label has the form `@PREFIX:LABEL`, with identifiers for `PREFIX` and `LABEL`.
  Using prefixes is optional.

  A link to a labeled object can be placed in paragraph text. One has to write `@PREFIX:LABEL` again.

  The order of declaration and reference is arbitrary.

  <!-- TODO: references to other levels.. -->

  Example:

  ```
  An introduction is given in @sec:intro.

  Intro @sec:intro
  =====
  ```

  We suggest to use the following prefixes:

  | prefix    | used for    |
  | --------- | ----------- |
  | `sec:`    | sections    |
  | `subsec:` | subsections |
  | `ex:`     | exercises   |
  | `fig:`    | figures     |
  | `eq:`     | equation    |
  | `tab:`    | table       |

- `Comments`

  All characters after `%` are ignored by the compiler, until the current line ends.

  Comments can e.g. be used to make notes to other developers, or temporarily hide unfinished stuff. Example:

  ```
  This text is displayed in the output. % only a course developer can read this.
  ```

- `Page Breaks`

  A level can be scrolled vertically by the student. Doom-scrolling should be avoided (not only) for didactical reasons. Page breaks can be inserted by a `NEWPAGE`-_block_. Example:

  ```
  ---
  NEWPAGE
  ---
  ```

## Equations

We distinguish two kinds of equations:
_inline equations_ are embedded into a text of a paragraph.
_Full equations_ are rendered in one or more separate lines.
The latter are numbered by default.

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
  An asterisk `*` hides the numbering. Example:

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
  We introduce some abbreviations for a shorter notation.
  The following table lists all implemented abbreviations:

  | type         | plain tex                                                                                    | short notation                    |     |
  | ------------ | -------------------------------------------------------------------------------------------- | --------------------------------- | --- |
  | $\mathbb{R}$ | `\mathbb{R}`                                                                                 | `\R`                              |     |
  | $\mathbb{Z}$ | `\mathbb{Z}`                                                                                 | `\Z`                              |     |
  | $\mathbb{C}$ | `\mathbb{C}`                                                                                 | `\C`                              |     |
  | matrix       | `\begin{pmatrix}` <br> &nbsp;&nbsp;`A & B\\` <br> &nbsp;&nbsp;`C & D\\` <br> `\end{pmatrix}` | `\MAT(A, B; C, D)` <br> <br> <br> |     |

  Using abbreviations is optional.

<!-- (TODO: extend table) -->

## Figures

MBL provides syntax to plot function graphs.
All other figures must be generated with external tools.
We highly recommend to generate files in the `SVG` (Scalable Vector Graphics) format using [Inkscape](https://inkscape.org)).

- `Function Plots`

  Functions graphs are described in a _block_ with keyword `PLOT2D`. Example:

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

  Axis definition is done by &nbsp;&nbsp; `xaxis LABEL from MIN to MAX` &nbsp;&nbsp; for the x-axis and &nbsp;&nbsp; `yaxis LABEL from MIN to MAX` &nbsp;&nbsp; for the y-axis.

  `colorX` changes the current color. All subsequent plots are drawn in that color. `X` is an integer value for the color key.

  `plot F` renders a function curve `F` that is specified as term. An exact definition is essential. In particular, all multiplication operators (`*`) must be denoted explicitly. The exact syntax is described in the SMPL documentation.

  Keyword `coord X Y` renders a small circle at position $(X,Y)$.

- `Figures`

  A figure displays an image file. It is highly recommended to use `*.svg` as file format (scalable vector graphics). Example:

  ```
  ---
  FIGURE My figure title @fig:myFigure
  @options
  width-75
  @path
  images/myImage.svg
  ---
  ```

  Option `width-P` specifies the displayed width with a percentage value for `P`. E.g. `width-50` renders the figure with 75 % of the display width. Default is `width-100`.

## Itemizations and Enumerations

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

  A line that starts with a dash (`#`) is rendered with numbering (1, 2, ...).

- `Enumeration (letters)`

  Alphabetical enumerations list a sequence of items. Example:

  ```
  My enumeration:
  -) first item
  -) second item
  -) third item
  ```

  A line that starts with a dash following a closing parenthesis (`-)`) is rendered with preceding letters `a)`, ` b)`, ... .

_Note: Hierarchical itemizations are not supported for didactical reasons, as well as a mobile friendly presentation._

## Tables

A table is described by a _block_ with keyword `TABLE`.
Each row of the table is written without line break.
Columns are separated by `&`.
The first row is considered as headline.

Example:

```
---
TABLE title @tab:label
@options
align-left
@text
$x$ & $f(x)$
1 & 1
2 & 4
3 & 9
---
```

The alignment option `align-X` specifies the placing of the table. Parameter `X` is one of `left`, `center`, `right`.
Default is `align-center`.

## Exercises

Exercises provide interactive elements to the course.
For example, multiple choice questions display multiple answers, from which students have to select all correct ones to gather scores.

<!-- TODO: scoring -->

Most exercises contain a `@code` part to generate randomized variables and to calculate the sample solution.
It is denoted in the _Simple Math Programing Language (SMPL)_.
The documentation can be found [here](https://app.f07-its.fh-koeln.de/docs-smpl.html).

The following paragraphs describe all implemented exercise types.

- `Numeric Exercise`

  This type of exercise asks students to solve a question with one ore more numeric solutions.
  Solutions can be scalars, vectors, matrices or sets.

  ```
  ---
  EXERCISE My exercise @ex:myLabel
  @code
  let x/y = rand(1, 5);
  let z = x + y;
  let A/B = rand<2,3>();
  let C = A + B;
  @text
  Calculate $x+y=$ #z
  Calculate $xA+B=$ #C
  ---
  ```

  _Note: `let x/y = rand(1, 5);` is an abbreviation for `let x = rand(1, 5); let y = rand(1, 5);` with guarantee that $x \neq y$_

  Part `@code` draws random variables and generates the sample solution.

  Part `@texts` describes the question text. Typography, itemizations, equations, etc. can be included, as described above.
  Input fields are generated for patterns `#V`, where `V` is a valid variable from part `@code`.
  Take care, that input fields are _not_ inserted within equations.

  Variables in math mode (inline equations embedded into dollar signs) are substituted by values of code variables by default.
  In the example above, $x$ is e.g. shown as $3$ (depending on the present value for $x$). If the variable identifiers should be rendered instead, the concerned variable name must written in quotes, e.g. &nbsp;&nbsp;`$ "x" + "y" $`&nbsp;&nbsp; (spacing is optional).

  <!-- TODO: number of random instances; default 10 -->

  Input Types:

  - `integers and real numbers`

    Example:

    ```
    ---
    EXERCISE Multiplication
    @options
    choices-4
    @code
    let x/y = rand(10,20);
    let z = x * y;
    @text
    Calculate $x * y=$ #z
    ---
    ```

    Without any options, an input field is generated for each input `#V`.
    The student has to type in the answer on a numeric keyboard.

    If option `choices-X` is given, a set of `X` possible answers is shown.
    One of theses answers correct. All other answers are incorrect.
    The student has to select the correct solution to gather scoring.

  - `complex numbers`

    ```
    ---
    EXERCISE Complex addition
    @options
    polar-form
    @code
    let x/y = complex(rand(10,20), rand(10,20));
    let z = x + y;
    @text
    Calculate $x + y=$ #z
    ---
    ```

    Per default, two input fields of the form &nbsp;&nbsp; `[ ] + [ ]i` &nbsp;&nbsp; are shown to enter the solution in normal form.

    If the option `polar-form` is given, then the student as to enter the solution in polar form.

    Option `choices-X` renders `X` buttons, where one of them shows the correct solution (refer to exercise type `integers and real numbers`).

  - `sets`

    ```
    ---
    EXERCISE Linear Equations
    @options
    n-args
    @code
    let s = set(-2, 2);
    @text
    Solve $x^2 - 4 = 0$.
    $x=$ #s
    ---
    ```

    Per default, if the set has length $n$, then $n$ input fields are shown to enter the solution from a numeric keyboard.

    If option `n-args` is given, students must figure out the number of solution fields on their own.

    Option `choices-X` renders `X` buttons, where one of them shows the correct solution (refer to exercise type `integers and real numbers`).

  - `matrices`

    ```
    EXERCISE Matrix Operations
    @options
    n-rows
    n-cols
    @code
    let A/B/C = rand<3,3>(0, 5);
    let D = A*B + C;
    @text
    Calculate $A*B + C=$ #D
    ```

    Per default, an input matrix is shown with a text field for each element of the solution matrix.

    If option `n-rows` is given, students must figure out the number of solution rows on their own.

    If option `n-cols` is given, students must figure out the number of solution columns on their own.

    Option `choices-X` renders `X` buttons, where one of them shows the correct solution (refer to exercise type `integers and real numbers`).

  - `vectors`
  - `terms`

  TODO: set-exercise, matrix, fractions, complex, ...

  TODO: scores per field, ...

  TODO: matrix dimensions given or not, ...

- `Term Exercises`

  ```
  ---
  EXERCISE Title @ex:myLabel
  @options
  term-tokens-1.5
  @code
  f(x) = 1/3*x^3 + 7*x
  @text
  Solve $\int (x^2+7) \dx$ = #F
  ---
  ```

  TODO: equivalency, forbidden terms, ...

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
