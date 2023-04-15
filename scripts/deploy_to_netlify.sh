#!/usr/bin/env bash

$(dirname $0)/deploy.sh
netlify deploy --dir $(dirname $0)/../dist --prod
