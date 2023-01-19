import os
from pathlib import Path
from loguru import logger

DATA_PATH = Path(os.environ.get('HTF_DATA_PATH', './data'))
DATA_ASSETS_PATH = Path(DATA_PATH, 'assets').absolute()
DATA_WATCH_PATH = Path(DATA_PATH, 'watch').absolute()
DATA_READ_PATH = Path(DATA_PATH, 'read').absolute()
DATA_PLAY_PATH = Path(DATA_PATH, 'play').absolute()

logger.info("assets path: {}", DATA_ASSETS_PATH.absolute())

os.makedirs(DATA_PATH, exist_ok=True)
os.makedirs(DATA_ASSETS_PATH, exist_ok=True)
os.makedirs(DATA_WATCH_PATH, exist_ok=True)
os.makedirs(DATA_READ_PATH, exist_ok=True)
os.makedirs(DATA_PLAY_PATH, exist_ok=True)
