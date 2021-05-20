#!/usr/bin/env bash

set -e

rm -rf ./es/ ./lib/

rm -rf ./build
./node_modules/.bin/tsc  --module commonjs
cp -R ./src/template ./build/src/template
cp -R ./src/types ./build/src/types
npx public-refactor --src ./src --dist ./build/src
mv ./build/src ./lib

rm -rf ./build
./node_modules/.bin/tsc
cp -R ./src/template ./build/src/template
cp -R ./src/types ./build/src/types
npx public-refactor --src ./src --dist ./build/src
mv ./build/src ./es

cat > ./es/package.json <<EOF
{
  "type": "module"
}
EOF
