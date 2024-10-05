#!/bin/bash

docker run --name rocketseat --rm -it -w /app -v .:/app -p 3333:3333 node $1 $2 $3
