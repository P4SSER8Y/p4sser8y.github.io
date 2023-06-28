#!/usr/bin/env bash
set -e
if [ -n "${DEBUG}" ]; then
    set -x
fi
node -v

root=$(dirname $0)/..
cd $root
root=$(pwd)
outdir=$root/dist
rm -rf $outdir
echo root=$root
echo output_directory=$outdir

export INFO_NOW=$(date -u '+%s')

echo "================ data ================"
export DATA_DIR=$(mktemp -d)
echo data_directory=$DATA_DIR
git clone $DATA_REPO $DATA_DIR --depth 1 --branch $DATA_REPO_BRANCH

echo "================ main ================"
cd $root/main
if [ -n "${CI}" ]; then
    yarn
fi
yarn build
mkdir -p $outdir/
cp -r $root/main/dist/* $outdir/

echo "================ stream ================"
cd $root/stream
if [ -n "${CI}" ]; then
    yarn global add @quasar/cli
    yarn
fi
echo "STREAM_MEDIA_BASE=${STREAM_MEDIA_BASE}"
echo "STREAM_PATH_PREFIX=${STREAM_PATH_PREFIX}"
yarn quasar build
yarn data
mkdir -p $outdir/stream
cp -r $root/stream/dist/* $outdir/stream

echo "================ media ================"
mkdir -p $outdir/media
cp -r $DATA_DIR/media/* $outdir/media

echo "================ statics ================"
cp -r $DATA_DIR/statics/* $outdir/

rm -rf $DATA_DIR
