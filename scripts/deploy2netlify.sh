#!/usr/bin/env bash

export NETLIFY=1
$(dirname $0)/build.sh
netlify deploy --dir $(dirname $0)/../dist --prod
