class BaseException(Exception):
    status_code = 500
    message = ''

    def __init__(self, message, status_code=None) -> None:
        super().__init__()
        self.message = message
        if status_code:
            self.status_code = status_code

    def to_dict(self):
        return {
            'ok': False,
            'message': self.message,
        }


class InvalidUser(BaseException):

    def __init__(self, message='invalid user'):
        BaseException.__init__(self, message, 405)


class FileNotFound(BaseException):

    def __init__(self, filename) -> None:
        super().__init__(f"{filename} not found", 404)
