import click
import logging
import tempfile
import cv2 as cv
import zLogging
import rich
import numpy as np
import os
import yaml
from pathlib import Path
import requests
import shutil
from datetime import datetime


SIZE = 512.0


def uploader_smms(ctx) -> str:
    BASE_URL = "https://smms.app/api/v2"
    key = os.environ.get('SMMS_API_KEY', None)
    if not key:
        raise ValueError("env SMMS_API_KEY not found")
    files = {'smfile': open(ctx['thumbnail'], 'rb')}
    ret = requests.post(f"{BASE_URL}/upload", files=files,
                        headers={'Content-Type': 'multipart/form-data', 'Authorization': key})
    if not ret.ok:
        raise RuntimeError(f"upload file failed with status_code={ret.status_code}: {ret.content}")
    data = ret.json()
    rich.print_json(data)
    return data["data"]["url"]


def uploader_bypass(ctx) -> str:
    return ctx['source']


def uploader_format_src(ctx) -> str:
    ts = ctx['timestamp'].strftime('%Y%m%d-%H%M%S')
    src = Path(ctx['source']).absolute()
    dst = src.parent.joinpath(f"{ts}{src.suffix}").absolute()
    shutil.copy(ctx['source'], dst)
    logging.info(f'copy {ctx["source"]} to {dst}')
    return str(dst.name)


def uploader_format_thumbnail(ctx) -> str:
    ts = ctx['timestamp'].strftime('%Y%m%d-%H%M%S')
    src = Path(ctx['thumbnail']).absolute()
    dst = Path(ctx["source"]).absolute().parent.joinpath(f"{ts}-thumbnail{src.suffix}").absolute()
    shutil.copy(ctx['thumbnail'], dst)
    logging.info(f'copy {ctx["thumbnail"]} to {dst}')
    return str(dst.name)


UPLOADERS = [uploader_format_thumbnail]


def generate_thumbnail(src: np.ndarray):
    h, w, _ = src.shape
    dst = None
    if (h <= SIZE) and (w <= SIZE):
        dst = src
    else:
        factor = 0
        if h > w:
            factor = SIZE / h
        else:
            factor = SIZE / w
        logging.info(f'shrink factor={factor}')
        th = round(h * factor)
        tw = round(w * factor)
        logging.info(f"resize {w}x{h} to {tw}x{th}")
        dst = cv.resize(src, (tw, th), interpolation=cv.INTER_AREA)
    _, f = tempfile.mkstemp(suffix='.webp')
    with open(f, 'wb') as fp:
        _, raw = cv.imencode('.webp', dst, [cv.IMWRITE_WEBP_QUALITY, 75])
        fp.write(raw)
    return f


def convert_to_image(file: str):
    img = cv.imread(file)
    if img is None:
        raise ValueError("unknown source file type")
    return img


def main(file: str):
    ctx = {}
    ctx['timestamp'] = datetime.now()
    ctx["source"] = file
    logging.info(f"select file {file}")
    img = convert_to_image(file)
    tb = generate_thumbnail(img)
    ctx["thumbnail"] = tb
    if not tb:
        raise Exception("failed to generate thumbnail")
    try:
        logging.info(f"save thumbnail to {ctx['thumbnail']}")
        paths = list(map(lambda f: f(ctx), UPLOADERS))
        output = yaml.dump(paths)
        rich.print(f"{output}")
    except Exception as e:
        raise e
    finally:
        os.remove(tb)


@click.command()
@click.argument('file', type=click.Path(exists=True))
def entry(file: str):
    try:
        main(file)
    except:
        from rich.console import Console
        console = Console()
        console.print_exception(show_locals=True)


if __name__ == "__main__":
    entry()
