from .exceptions import *
from . import env
from typing import Dict, Mapping
import os
import yaml
from pathlib import Path
from loguru import logger

USER_MAP: Dict[str, str] = {
    "hello": "passerby",
}

RECORD_MAP: Dict[str, Mapping] = {}


def get_user(token: str):
    if token in USER_MAP.keys():
        return USER_MAP[token]
    raise InvalidUser()


def update_watch_records():
    for user in os.listdir(env.DATA_WATCH_PATH):
        record_file = Path(env.DATA_WATCH_PATH, user, 'records.yml')
        if record_file.is_file() and record_file.exists():
            with open(record_file, 'r') as f:
                RECORD_MAP[user] = yaml.safe_load(f)


def get_watch_records(user: str):
    update_watch_records()
    if not user in RECORD_MAP.keys():
        raise InvalidUser()
    return RECORD_MAP[user]
