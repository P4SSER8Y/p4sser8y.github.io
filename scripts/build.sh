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

yarn build

echo "================ data ================"
export DATA_DIR=$(mktemp -d)
if [ -n "${LOCAL_DATA_REPO}" ]; then
    cp -r ${LOCAL_DATA_REPO}/* ${DATA_DIR}
else
    echo data_directory=$DATA_DIR
    git clone $DATA_REPO $DATA_DIR --depth 1 --branch $DATA_REPO_BRANCH
fi
yarn data

echo "================ media ================"
mkdir -p $outdir/media
cp -r $DATA_DIR/media/* $outdir/media

rm -rf $DATA_DIR
