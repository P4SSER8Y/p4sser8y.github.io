from peewee import *

Models = []


def _wrapper(b):
    Models.append(b)
    return b


@_wrapper
class Info(Model):
    uuid = UUIDField(primary_key=True)
    name = TextField()
    info = TextField()


@_wrapper
class Link(Model):
    uuid = ForeignKeyField(Info, backref="links")
    link = CharField()


@_wrapper
class Record(Model):
    uuid = ForeignKeyField(Info, backref="records")
    timestamp = TimestampField(utc=True)
    withWhom = CharField()
    where = CharField()
    rate = IntegerField()
    comment = TextField()


@_wrapper
class Tag(Model):
    uuid = ForeignKeyField(Info, backref="tags")
    tag = CharField()


@_wrapper
class Asset(Model):
    uuid = ForeignKeyField(Info, backref="assets")
    type = CharField()
    url = CharField()
