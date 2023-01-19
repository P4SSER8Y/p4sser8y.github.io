from flask import Flask, jsonify, request, send_file, abort
from werkzeug import utils
from .exceptions import *
from pathlib import Path
from . import crud
from loguru import logger
from . import env

app = Flask(__name__)


@app.post("/api/watch")
def post():
    data = request.get_json(True)
    user = crud.get_user(data['token'])
    data = crud.get_watch_records(user)
    return {
        'ok': True,
        'user': user,
        'data': data,
    }


@app.get("/assets/<string:filename>")
def get_asset_file(filename):
    filepath = Path(env.DATA_ASSETS_PATH, utils.secure_filename(filename))
    if not filepath.exists():
        raise FileNotFound(filename)
    return send_file(filepath)


@app.errorhandler(BaseException)
def error_handler_invalid_user(e: BaseException):
    return jsonify(e.to_dict()), e.status_code


@app.errorhandler(Exception)
def error_handler(e: Exception):
    return jsonify({"ok": False, "message": f"{e}"}), 500
