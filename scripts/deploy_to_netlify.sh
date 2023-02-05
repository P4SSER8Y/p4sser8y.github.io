#!/usr/bin/env bash

netlify deploy --dir $(dirname $0)/../dist --prod
