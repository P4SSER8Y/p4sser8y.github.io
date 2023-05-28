#!/usr/bin/env bash
set -e
node -v

root=$(dirname $0)/..
cd $root
root=$(pwd)
outdir=$root/dist
rm -rf $outdir
echo root=$root
echo output_directory=$outdir

cd $root/main
if [ -n "${CI+1}" ]; then
    yarn
fi
yarn build
mkdir -p $outdir/
cp -r $root/main/dist/* $outdir/

cd $root/stream
if [ -n "${CI+1}" ]; then
    yarn global add @quasar/cli
    yarn
fi
yarn quasar build
yarn data
mkdir -p $outdir/stream
cp -r $root/stream/dist/* $outdir/stream
