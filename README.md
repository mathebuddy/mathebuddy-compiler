# mathe:buddy Compiler

This repository is part of the `mathe:buddy` project:

- Website: [https://app.f07-its.fh-koeln.de](https://app.f07-its.fh-koeln.de)
- GitHub page: [https://github.com/mathebuddy](https://github.com/mathebuddy)

# Overview

TODO

```mermaid
graph TD;
    A-->B;
    A-->C;
    B-->D;
    C-->D;
```


Visit [https://github.com/mathebuddy/mathebuddy-public-courses](https://github.com/mathebuddy/mathebuddy-public-courses) for examples.

- We provide a simulator that translates and renders `*.mbl` files. Visit [https://github.com/mathebuddy/mathebuddy-simulator](https://github.com/mathebuddy/mathebuddy-simulator) an refer to the README file.

**Note: We will later on provide an interactive website including a playground. If you are not a developer, we suggest to wait for the release of that website.**

# mathe:buddy Language (MBL) Reference

The following sections describe the syntax of the *mathe:buddy langauge (MBL)*.

**Note: The exact rendering depends on the runtime environment. We restricted the degree of freedom per design to force uniformly presented courses. E.g. instead of defining concreate colors, we use keywords `color1`, `color2`, ...**

## Typography

- `Course Title`

  ```
  My Course Title @myLabel
  ###############
  ```

  - at least 5 hashtags (`#`) are required.
  - labels are optional

- `Sections`

  ```
  My Section
  ==========
  ```

  At least 5 equal signes (`=`) are required.

- `Subsections`

  ```
  My Subsection
  -------------
  ```

- `Paragraphs`

  ```
  This is text within a paragraph.
  Even this text stands in a new line, it is compiled to be written directly behind the last line.

  An empty line starts a new paragraph.
  ```

- `Definitions and Theorems`

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

  ```
  Some **bold** text. Some *italic* text.
  The word [sky]@color1 is written.
  [Some text written in the secondary color.]@color2.
  You can also write [bold text]@bold and [italic text]@italic similar to color notation.
  ```

  `color0` is black.

- `Links and References`

  ```
  Refer to section @sec:intro.
  ```

- `Comments`

  ```
  This text is displayed in the output. % only a course developer can read this.
  ```

- `Page Breaks`

  ```
  ---
  NEWPAGE
  ---
  ```

## Equations

- `Inline Equations`

  ```
  Einstein's famous formula is $E=mc^2$. It defines the energy $E$ of ...
  ```

  Equations are written in $\TeX$ notation. Inline equations are embedded into a pair of dollar signs.

- `Full Equations` (equations in display math mode)

  ```
  ---
  EQUATION @eq:myLabel
  a^2 + b^2 = c^2
  ---
  ```

  If you like to the the numbering on the right, write:

  ```
  ---
  EQUATION* @eq:myLabel
  a^2 + b^2 = c^2
  ---
  ```

  Equations can be references with `@`. For example, `@eq:myLabel` is displayed $Eq~(1)$.

- Abbreviations

  Equations may be written in plain TeX code. We introduce some (optional) abbreviations for simpler notation.

  | type     | plain tex | short notation |
  |----------|-----------|----------------|
  | matrix   | \begin{pmatrix} A & B \\\\ C & D \\\\ \end{pmatrix} | \MAT(A, B; C, D) |

  TODO: extend list

## Figures

We only support plotting functions in MBL. All other figures must be generated with external tools (for example [Inkscape](https://inkscape.org)).

- `Plots`

  ```
  ---
  PLOT2D My plot title @fig:myplot
  xaxis "x" from -3 to 3
  yaxis "y" from -3 to 3
  color1
  plot x^2
  color0
  coord -1 1 label left
  coord 2 4 label right
  ---
  ```

- `Images`

  ```
  ---
  FIGURE My figure title @fig:myfigure
  images/myimage.png
  ---
  ```

## Itemizatons and Enumerations

- `Itemize`

  ```
  My itemization:
  - first item
  - seoncd item
  - third item
  ```

  A line that starts with a dash (`-`) is rendered as bullet point.

- `Enumeration (numbers)`

  ```
  My enumeration:
  # first item
  # second item
  # third item
  ```

  A line that starts with a dash (`#`) is rendered with numbering, starting from 1, increased by step 1.

- `Enumeration (letters)`

  ```
  My enumeration:
  -) first item
  -) second item
  -) third item
  ```

  A line that starts with a dash (`-`) is rendered with preceding letters `a)`, ` b)`, ...


TODO: start with >1
TODO: nested lists (is that needed in an app???)

## Tables

## Exercises

TODO: Code part uses the **Simple Math Programing Language (SMPL)**. The documentation can be found [here](https://github.com/mathebuddy/mathebuddy-smpl) in the REAME file.

- `Numeric Exercise`

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
  You are allowed to mix static static and dynamix anwsers.

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

  Single choice exercises are defined in the same way as multiple choice exerices, but use round parentheses.

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

  Writing `#:order(v)` lists a shuffeled form of vector `v` and requires the student to reorder the vector to finally get vector `v`.

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

  A timed exerice repeatedly shows exercises. Quick and correct responses results in a large high score.

  Option `timed-X` enables timing. The student has `X` seconds to give an answer.

  Option `accelerate` decreases time per question.

  Option `multi-choice-X` lists `X` options per question.

  Option `stop-on-error-X` stops asking after `X` incorrect answers.



TODO: Tafel!

## Course Structure



- course overview: blocks, ...

### Dependencies

Each course page is



# TODO

- add preview images in this document
- add links to web-simulator
- chatbot code
- scoring, repetition, ...

