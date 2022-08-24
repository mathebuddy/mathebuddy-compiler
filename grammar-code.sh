#!/bin/bash
echo "# extracted from src/code.ts with ./grammar-code.sh" > grammar-code.txt
cat src/code.ts | grep //G | cut -c7- >> grammar-code.txt
