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
Each MBL file stores a complete course, defined by the Mathe:Buddy Language (MBL).

The reference compiler to translate MBL to MBCL can be found on [GitHub](https://github.com/mathebuddy/mathebuddy-compiler.git).

## JSON Specification

### Intrinsic Data Types

- IDENTIFIER
- STRING
- INTEGER
- REAL
- UNIX_TIMESTAMP
- MATH_STRING:
  - INT = INTEGER;
  - REAL = REAL;
  - INT_SET = "{" [ INT , { "," INT } ] "}";
  - VECTOR = "[" [ REAL , { "," REAL } ] "]";
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
}
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
}
```

### LEVEL

```
LEVEL = {
  "id": IDENTIFIER,
  "posX": INTEGER,
  "posY": INTEGER,
  "requires": LEVEL[],
  "items": LEVEL_ITEM[]
}
```

```
LEVEL_ITEM = {
  "type": "exercise" | TODO,
  "title": STRING,
  "data": EXERCISE | TODO
}
```

### EXERCISE

```
EXERCISE = {
  "variables": { IDENTIFIER: VARIABLE },
  "instances": INSTANCE[],
  "text": PARAGRAPH
}
```

```
VARIABLE = {
  "type": "INT" | "INT_SET" | "REAL" | "REAL_SET"
          | "COMPLEX" | "COMPLEX_SET" | "VECTOR" | "MATRIX",
}
```

```
INSTANCE = {
  IDENTIFIER: MATH_STRING
}
```

## Compressed Courses

TODO: compression format, hex, ...

_Author: Andreas Schwenk, TH Köln_
