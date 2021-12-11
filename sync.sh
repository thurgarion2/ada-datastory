#!/bin/bash
for value in assets _data _includes _layouts _sass _config.yml index.html thumbnail.png
do
    cp -r ../project/website/$value .
done

git commit -am "$1" 
git push
