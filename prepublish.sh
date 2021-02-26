#!/usr/bin/env bash

set -e

rm -rf ./es/ ./lib/ ./types/

rm -rf ./build
./node_modules/.bin/tsc
cp -R ./src/template ./build/src/template
mv ./build/src ./lib

rm -rf ./build
./node_modules/.bin/tsc --module ES6
cp -R ./src/template ./build/src/template
mv ./build/src ./es

cp -R ./src/types ./build/types/src/types
npx public-refactor --src ./src --dist ./build/types/src
mv ./build/types/src ./types
