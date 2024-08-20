#!/usr/bin/env bash


if [[ ! -d "lc-lightbox" ]]; then
  if mkdir lc-lightbox; then
    echo "Directory created successfully"
  else
    echo "Error creating directory"
    exit 1
  fi
fi

if cp -v \
    src/lc-lightbox.js \
    LICENSE \
    README.md \
    .npmignore \
    package.json \
    lc-lightbox/;
 then
  echo "Files copied successfully"
else
  echo "Error copying files"
  exit 1
fi
