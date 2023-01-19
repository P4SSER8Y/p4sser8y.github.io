from .app import app

__all__ = ["app"]

if __name__ == "__main__":
    app.run("0.0.0.0")
