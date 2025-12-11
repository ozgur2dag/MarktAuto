from typing import Generator

from app.db import get_session


def get_db() -> Generator:
    # Delegates to the Session generator so FastAPI can manage lifecycle
    yield from get_session()

