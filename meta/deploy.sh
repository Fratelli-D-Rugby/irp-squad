git checkout --orphan gh-pages
yarn build
git --work-tree dist add --all
git --work-tree dist commit -m 'Deploy'
git push origin HEAD:gh-pages --force
rm -r dist
git checkout -f main
git branch -D gh-pages