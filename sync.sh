#!/bin/bash
for value in assets _data _includes _layouts _sass _config.yml index.html thumbnail.png
do
    cp -r ../project/website/"$value" .
done

if [ -z "$1" ]
then
  echo "Files copied, uncommited"
else
  git add .;
  git commit -m "$1";
  git push;
fi
