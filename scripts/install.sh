#!/usr/bin/env bash

cd $(dirname $0)/..
yarn install --no-lockfile

pushd ./scripts/stream_formatter_douban
yarn install --no-lockfile
popd
