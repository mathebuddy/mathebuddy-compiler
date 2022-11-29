# Mathe:Buddy Compiled Language (MBCL) Reference

<!-- start-for-website -->

---

**NOTE**
This reference is in work-in-progress state. We are planning to release version 1.0 by end of 2022.

---

This document describes the syntax of the _mathe:buddy compiled language (MBCL)_,
which can be used to express mathematical based online courses technically.

## Introduction

MBCL is a JSON format.

TODO: compressed

## JSON Specification

### Intrinsic Data Types

- STRING
- INTEGER
- UNIX_TIMESTAMP

### Course

```
COURSE = {
  id:           STRING,
  author:       STRING,
  modifiedDate: UNIX_TIMESTAMP,
  documents:    DOCUMENT[]
};
```

Example:

```json
{
  "id": "higher math 1",
  "author": "TH Koeln",
  "modifiedDate": 1669712632,
  "documents": []
}
```

### Documents

```
DOCUMENT
  title: STRING
  alias: STRING
  items: DOCUMENT_ITEM[]

DOCUMENT_ITEM
  type: "exercise" | TODO
  title: STRING
  data: EXERCISE | TODO;
```

### Exercises

```
EXERCISE:
  variables: VARIABLE{}
  instances: TODO
  text
```

_Author: Andreas Schwenk, TH Köln_
