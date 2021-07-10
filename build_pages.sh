#!/bin/bash -e

yarn build
cp -R build /tmp/smileinspector-build

git checkout gh-pages
rm -rf *
cp -R /tmp/smileinspector-build/* .
git add .
git commit -m "New build"
git push --all origin gh-pages
git checkout master