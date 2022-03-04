#!/bin/bash

#Run this script in directory where it is located
cd "$(dirname "$0")"

/root/.nvm/versions/node/v16.14.0/bin/node ./build/index.js >> ./logs/log 2>&1
