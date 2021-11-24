# The Ictoan Programming Language

Work in progress (as of 23 November 2021).

A toy programming language for my magister thesis.

The language is not meant to be practically useful, thus does not even have
a compiler, IO, or a module system, just a type checker. The purpose of the language
 is to demonstrate the capabilities of its type system.

# Installation & use

Required software: [Node.js](https://nodejs.org/en/).

0. Clone this repository.
1. In the root folder of the repo, install the dependencies by running `npm install`.
   (The command comes with installing Node.)
2. Compile the code by running `./node_modules/typescript/bin/tsc`.
3. Run `node local/out/main.js > parser-table.json`, then
   `mv parser-table.json local`. Yes, it needs to be done in two steps.

Now you can use the type checker.  If `P` is a path to a `.ictoan` file, run
`node local/out/main.js P` to typecheck its contents.

(Ictoan stands for **I** **c**an't **t**hink **o**f **a** **n**ame.)
