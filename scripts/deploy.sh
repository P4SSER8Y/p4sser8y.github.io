#!/usr/bin/env bash
set -e
set -x
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
echo "STREAM_MEDIA_BASE=${STREAM_MEDIA_BASE}"
echo "STREAM_PATH_PREFIX=${STREAM_PATH_PREFIX}"
yarn quasar build
yarn data
mkdir -p $outdir/stream
cp -r $root/stream/dist/* $outdir/stream

mkdir -p $outdir/admin
cp -r $root/netlify-cms/* $outdir/admin

mkdir -p $outdir/media
cp -r $root/data/media/* $outdir/media

cp -r $root/data/statics/* $outdir/
