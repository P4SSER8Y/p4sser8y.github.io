#!/usr/bin/env bash

cd $(dirname $0)/..
yarn install

pushd ./scripts/stream_formatter_douban
yarn install
popd
