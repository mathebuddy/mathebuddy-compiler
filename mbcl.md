# Mathe:Buddy Compiled Language (MBCL) Reference

<!-- start-for-website -->

---

**NOTE**
This reference is in work-in-progress state. We are planning to release version 1.0 by end of 2022.

---

This document describes the syntax of the _mathe:buddy compiled language (MBCL)_,
which can be used to express mathematical based online courses technically.

## Introduction

MBCL is a JSON-based format defined for the mathe:buddy App.
Each MBCL-JSON file stores a complete course, defined by the Mathe:Buddy Language (MBL).

The reference compiler to translate MBL to MBCL can be found on [GitHub](https://github.com/mathebuddy/mathebuddy-compiler.git).

## JSON Specification

TODO: "extends", ...

We use the following notation instead of JSON-schema (which is overkill!) to denote the structure of data.

- `A = { "x":IDENTIFIER, "y":B }; B = { "z": INTEGER };` denotes an object with name `A` and entries `x` and `y`. The value of `x` must be an identifier, while `y` is an object of type `B`.

  JSON-Example that is compatible to the grammar:

  `{"x": "leet", "y": {"z": 1337}}`

- `X = {"a":INTEGER|"xx"}` denotes alternative definitions for attribute `a`.

  JSON-Examples that are compatible to the grammar:

  `{"a":"xx"}` or `{"a":314}` or `{"a":42}`

- `Y = {"x":"txt"} | INTEGER;` denotes alternative definitions for object `Y`.

  JSON-Examples (fragments only) that are all compatible to the grammar:

  `{"x":"txt}` or `1337` or `271`

- `Z = {"k":INTEGER[]}` denotes that attribute `k` is an array of type integer.

  JSON-Examples that are compatible to the grammar:

  `{"k":[1,1,2,3,5,8,13]}` or `{"k":[]}`

### Intrinsic Data Types

- IDENTIFIER

  Example: `"hello"`

- STRING

  Example: `"hello, world!"`

- INTEGER

  Example: `1337`

- REAL

  Example: `3.14159`

- UNIX_TIMESTAMP

  Time in seconds from 1.1.1970 00:00

  Example: `1669712632`

- MATH_STRING:

  - EBNF Definition: `INT = INTEGER;`

    Example: `"3"`

  - EBNF Definition: `REAL = REAL;`

    Example: `"-3.14"`

  - EBNF Definition: `INT_SET = "{" [ INT , { "," INT } ] "}";`

    Example: `"{1,3,5}"`

  - EBNF Definition: `VECTOR = "[" [ REAL , { "," REAL } ] "]";`

    Example: `"[-1337,2.71,9.81]"`

  - TODO

### COURSE

A course represents the root of an MBCL file.
Its contains a set of documents.
Each document defines a page, consisting of text, exercises and games.

```
COURSE = {
  "id": STRING,
  "author": STRING,
  "mbclVersion": INTEGER
  "modifiedDate": UNIX_TIMESTAMP,
  "chapters": CHAPTER[]
};
```

Example:

```json
{
  "id": "higher math 1",
  "author": "TH Koeln",
  "mbclVersion": 1,
  "modifiedDate": 1669712632,
  "chapters": []
}
```

### CHAPTER

```
CHAPTER = {
  "title": STRING,
  "alias": STRING,
  "levels": LEVEL[];
};
```

### LEVEL

```
LEVEL = {
  "id": IDENTIFIER,
  "posX": INTEGER,
  "posY": INTEGER,
  "requires": LEVEL[],
  "items": LEVEL_ITEM[]
};
```

```
LEVEL_ITEM = SECTION | TEXT | EQUATION | DEFINITION | EXERCISE
           | FIGURE | TABLE | NEWPAGE;
```

### SECTION

```
SECTION = {
  "type": "title" | "section" | "subsection" | "subsubsection",
  "text": STRING,
  "label": IDENTIFIER
};
```

### PARAGRAPH

```
TEXT = {
  "type": "paragraph" | "inline-math" | "bold" | "italic" | "itemize"
          | "enumerate" | "enumerate-alpha" | "span"
          | "align-left" | "align-center" | "align-right",
  "items": TEXT[]
} | {
  "type": "text",
  "value": STRING
} | {
  "type": "linefeed"
} | {
  "type": "color",
  "value": INTEGER
} | {
  "type": "reference",
  "label": IDENTIFIER
};
```

The following example represents a paragraph containing a bold text &nbsp;&nbsp; **Hello, world $x^2 + y^2$!** &nbsp;&nbsp; that ends with a line feed.

```json
{
  "type": "paragraph",
  "items": [
    {
      "type": "bold",
      "items": [
        { "type": "text", "value": "Hello, world" },
        { "type": "inline-math", "items": [{"type":"text","value":"x^2+y^2"}]}
        { "type": "text", "value": "!" }
      ]
    },
    {
      "type": "linefeed"
    }
  ]
}
```

### BLOCK ITEM

```
BLOCK_ITEM = {
  "type": IDENTIFIER,
  "title": STRING,
  "label": IDENTIFIER
  "error": STRING
};
```

### EQUATION

```
EQUATION extends BLOCK_ITEM = {
  "type": "equation",
  "value": STRING,
  "options": EQUATION_OPTION[]
};
```

```
EQUATION_OPTION = "align_left" | "align_center" | "align_right" | "align_equals";
```

### DEFINITION

TODO: hierarchical blocks!!

```
DEFINITION extends BLOCK_ITEM = {
  "type": "definition" | "theorem" | "lemma" | "corollary" | "proposition"
          | "conjecture" | "axiom" | "claim" | "identity" | "paradox",
  "items": DEFINITION_ITEM[]
};
```

```
DEFINITION_ITEM = EQUATION | TEXT;
```

### EXERCISE

```
EXERCISE extends BLOCK_ITEM = {
  "variables": { IDENTIFIER: VARIABLE },
  "instances": INSTANCE[],
  "text": EXERCISE_TEXT
};
```

```
EXERCISE_TEXT extends TEXT = {
  "type": "variable",
  "variable": IDENTIFIER
} | {
  "type": "integer_input",
  "variable": IDENTIFIER,
  "width": INTEGER
}
```

```
VARIABLE = {
  "type": "int" | "int_set" | "real" | "real_set"
          | "complex" | "complex_set" | "vector" | "matrix"
};
```

```
INSTANCE = {
  IDENTIFIER: MATH_STRING
};
```

### FIGURE

```
FIGURE extends BLOCK_ITEM = {
  "path": STRING,
  "options": FIGURE_OPTION[]
};
```

```
FIGURE_OPTION = "width-X";
```

with `X` the width as percentage of screen width

### TABLE

```
TABLE extends BLOCK_ITEM = {
  "options": TABLE_OPTION[],
  "content": {
    "head": TEXT[],
    "rows": TABLE_ROW[]
  }
};
```

```
TABLE_ROW = TEXT[];
```

TODO: must restrict `TEXT`

```
TABLE_OPTION = "align-left" | "align-center" | "align-right";
```

### NEW PAGE

```
NEWPAGE = {
  "type": "new_page"
};
```

## Compressed Courses

TODO: compression format, hex, ...

_Author: Andreas Schwenk, TH Köln_
