#!/usr/bin/env bash
set -e

root=$(dirname $0)/..
cd $root
root=$(pwd)
outdir=$root/dist
rm -rf $outdir
echo root=$root
echo output_directory=$outdir

cd $root/main
yarn build
mkdir -p $outdir/
cp -r $root/main/dist/* $outdir/

cd $root/stream
quasar build
yarn data
mkdir -p $outdir/stream
cp -r $root/stream/dist/* $outdir/stream
