from playhouse.sqlite_ext import SqliteExtDatabase
from models import Models
from loguru import logger
import os
import pathlib
from uuid import uuid4 as uuid

db_path = pathlib.Path(os.environ.get('HTF_DB_PATH', './data/database.db')).absolute()
os.makedirs(db_path.parent, exist_ok=True)
logger.info("database path: {}", db_path)

db: SqliteExtDatabase = None


def startup():
    global db
    db = SqliteExtDatabase(db_path, pragmas={'foreign_keys': 1})
    db.connect()
    db.bind(Models)
    db.create_tables(Models)


def shutdown():
    global db
    db.close()


if __name__ == "__main__":
    from models import *
    id = uuid()

    startup()
    with db.atomic() as ctx:
        Info.create(uuid=id, name="", info={"title": "shit"})
    shutdown()
